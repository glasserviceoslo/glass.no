import { writeFileSync } from "node:fs";
import { parseGutenbergBlocks } from "@emdash-cms/gutenberg-to-portable-text";
import { api, listAll } from "./api.ts";
import { createConverter, type Report } from "./kadence.ts";
import { buildMediaMap, imageField, type Media } from "./media.ts";
import { syncSchema } from "./sync-schema.ts";
import { readWxr } from "./wxr.ts";

const [wxrPath, outPath] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const write = process.argv.includes("--write");

const wxr = readWxr(wxrPath);
const media = await listAll<Media>("/media");
const mediaMap = await buildMediaMap(
	wxr.filter((item) => item.type === "attachment"),
	media,
	process.env.HASH_CACHE ?? "migration/convert/.hash-cache.json",
);
const mediaByUrl = new Map(media.map((item) => [item.url, item]));
const reusable = new Map(wxr.filter((item) => item.type === "wp_block").map((item) => [item.id, parseGutenbergBlocks(item.content)]));
const report: Report = { dropped: new Map(), unknown: new Map(), shortcodes: new Map() };
const { pageLayout, postContent } = createConverter(mediaMap, mediaByUrl, reusable, report);

const documents = wxr.filter((item) => item.type === "page" || item.type === "post");
const source = new Map(documents.map((item) => [`${item.type}s:${item.slug}`, item]));
const byTitle = new Map(documents.map((item) => [`${item.type}s:${item.title.trim()}`, item]));
const TEMPLATE_DEMO = new Set(["contact", "pricing", "home"]);
const demoPages: Entry[] = [];

type Entry = { id: string; slug: string; status: string; data: Record<string, unknown> };
const results: { collection: string; entry: Entry; data: Record<string, unknown>; seo?: Record<string, unknown> }[] = [];
const unmatched: string[] = [];

for (const collection of ["pages", "posts"]) {
	for (const entry of await listAll<Entry>(`/content/${collection}`)) {
		const item =
			source.get(`${collection}:${entry.slug}`) ??
			source.get(`${collection}:${decodeURIComponent(entry.slug)}`) ??
			byTitle.get(`${collection}:${String(entry.data.title ?? "").trim()}`);
		if (!item && collection === "pages" && TEMPLATE_DEMO.has(entry.slug) && JSON.stringify(entry.data).includes("marketing_")) {
			demoPages.push(entry);
			continue;
		}
		if (!item) {
			unmatched.push(`${collection}/${entry.slug}`);
			continue;
		}
		const blocks = parseGutenbergBlocks(item.content);
		const seoTitle = entry.data.seo_title as string | undefined;
		const seoDescription = entry.data.seo_description as string | undefined;
		const seo = seoTitle || seoDescription ? { title: seoTitle || null, description: seoDescription || null } : undefined;
		const thumbnail = item.thumbnailId ? mediaMap.byId(item.thumbnailId) : undefined;
		const featured = thumbnail ? { featured_image: imageField(thumbnail) } : {};
		const rows = blocks.some((block) => block.blockName === "kadence/rowlayout");
		const data =
			collection === "pages"
				? { layout: pageLayout(blocks), ...featured }
				: { content: postContent(blocks), ...(rows ? { layout: pageLayout(blocks) } : {}), ...featured };
		const [first] = (data as { layout?: Record<string, unknown>[] }).layout ?? [];
		if (first?._type === "booking" && !first.heading) first.heading = item.title;
		results.push({ collection, entry, data, seo });
	}
}

const tally = (map: Map<string, number>) => Object.fromEntries([...map].sort((a, b) => b[1] - a[1]));
const layoutCounts = new Map<string, number>();
for (const result of results) for (const block of (result.data.layout as any[]) ?? []) layoutCounts.set(block._type, (layoutCounts.get(block._type) ?? 0) + 1);
const htmlLeft = results.reduce((sum, result) => sum + JSON.stringify(result.data).split('"htmlBlock"').length - 1, 0);

const summary = {
	entries: results.length,
	unmatched,
	templateDemoPages: demoPages.map((entry) => entry.slug),
	layoutBlocks: tally(layoutCounts),
	htmlBlocksLeft: htmlLeft,
	unknownBlocks: tally(report.unknown),
	dropped: tally(report.dropped),
	shortcodes: tally(report.shortcodes),
	missingMedia: [...mediaMap.missing].slice(0, 40),
	missingMediaCount: mediaMap.missing.size,
};
console.log(JSON.stringify(summary, null, 1));
if (outPath) writeFileSync(outPath, JSON.stringify(results.map(({ collection, entry, data, seo }) => ({ collection, slug: entry.slug, data, seo })), null, 1));

if (write) {
	await syncSchema();

	for (const entry of demoPages) await api(`/content/pages/${entry.id}`, { method: "DELETE" });

	let done = 0;
	const keyless = (layout: any[]) =>
		layout.map(({ _key, ...block }) => (Array.isArray(block.items) ? { ...block, items: block.items.map(({ _key, ...item }: any) => item) } : block));
	for (const { collection, entry, data, seo } of results) {
		const body = data.layout ? { ...data, layout: keyless(data.layout as any[]) } : data;
		await api(`/content/${collection}/${entry.id}`, {
			method: "PUT",
			body: { data: body, ...(seo ? { seo } : {}), skipRevision: true, ...(data.layout ? { replaceBlocks: true } : {}) },
		});
		if (entry.status === "published") await api(`/content/${collection}/${entry.id}/publish`, { method: "POST", body: {} });
		done++;
	}
	console.log(`wrote ${done} entries`);
}
