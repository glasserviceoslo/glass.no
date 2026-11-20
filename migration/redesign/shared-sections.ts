import { api, listAll } from "../convert/api.ts";
import { sharedSections, sharedSectionsCollection } from "../convert/schema.ts";
import { syncSchema } from "../convert/sync-schema.ts";

type Node = { _type?: string; children?: { text?: string }[]; [key: string]: unknown };
type Block = { _type: string; _key?: string; _version?: number; background?: string; heading?: string; aside?: Node[]; [key: string]: unknown };

const INSTAGRAM = "https://www.instagram.com/glass_siden_1889";

const strip = (value: unknown): unknown =>
	Array.isArray(value)
		? value.map(strip)
		: value && typeof value === "object"
			? Object.fromEntries(Object.entries(value).filter(([key]) => !["_key", "_version"].includes(key)).map(([key, inner]) => [key, strip(inner)]))
			: value;

const fingerprint = (block: Block) =>
	JSON.stringify(strip({ ...block, background: undefined })).replaceAll("https://www.instagram.com/_www.glass.no_/", INSTAGRAM);

const firstText = (nodes?: Node[]) => (nodes?.[0]?.children ?? []).map((child) => child.text ?? "").join("");

const sectionOf = (block: Block): string | undefined => {
	if (block._type === "logos") return "merkevarer";
	if (block._type === "reviews" && !block.heading) return "omtaler";
	if (block._type === "cards" && block.heading === "Hvorfor velge glass.no") return "hvorfor-velge-oss";
	if (block._type === "contact_form" && block.heading === "Få svar på dine spørsmål" && firstText(block.aside) === "Vår prosess") return "kontakt-og-prosess";
	return undefined;
};

await syncSchema();

const pages = await listAll<{ id: string; slug: string; status: string }>("/content/pages");
const layouts = new Map<string, Block[]>();
const counts = new Map<string, Map<string, { count: number; block: Block }>>();
for (const page of pages.filter((entry) => entry.status === "published")) {
	const { item } = await api<{ item: { data: { layout?: Block[] } } }>(`/content/pages/${page.id}`);
	const layout = item.data.layout ?? [];
	layouts.set(page.id, layout);
	for (const block of layout) {
		const section = sectionOf(block);
		if (!section) continue;
		const variants = counts.get(section) ?? new Map();
		const key = fingerprint(block);
		variants.set(key, { count: (variants.get(key)?.count ?? 0) + 1, block });
		counts.set(section, variants);
	}
}

const canonical = new Map<string, string>();
const existing = await listAll<{ id: string; slug: string }>(`/content/${sharedSectionsCollection.slug}`);
for (const { slug, title } of sharedSections) {
	const variants = [...(counts.get(slug)?.values() ?? [])].sort((a, b) => b.count - a.count);
	if (!variants.length) continue;
	const { _key, _version, ...raw } = variants[0].block;
	const block = JSON.parse(JSON.stringify(raw).replaceAll("https://www.instagram.com/_www.glass.no_/", INSTAGRAM)) as Block;
	canonical.set(slug, fingerprint(variants[0].block));
	const found = existing.find((entry) => entry.slug === slug);
	const id = found?.id ?? (await api<{ item: { id: string } }>(`/content/${sharedSectionsCollection.slug}`, { method: "POST", body: { slug, data: { title } } })).item.id;
	if (!found) {
		await api(`/content/${sharedSectionsCollection.slug}/${id}`, { method: "PUT", body: { data: { title, layout: [block] }, skipRevision: true, replaceBlocks: true } });
		await api(`/content/${sharedSectionsCollection.slug}/${id}/publish`, { method: "POST", body: {} });
	}
	console.log(`${slug}: ${variants.reduce((sum, variant) => sum + variant.count, 0)} copies, ${variants.length} versions${found ? " (section kept)" : " (section created)"}`);
}

let changed = 0;
for (const [id, layout] of layouts) {
	let replaced = false;
	const next = layout.map((block) => {
		const section = sectionOf(block);
		if (!section || canonical.get(section) !== fingerprint(block)) return block;
		replaced = true;
		return { _type: "shared_section", section, ...(block.background ? { background: block.background } : {}) } as Block;
	});
	if (!replaced) continue;
	const keyless = next.map(({ _key, _version, ...block }) => block);
	await api(`/content/pages/${id}`, { method: "PUT", body: { data: { layout: keyless }, skipRevision: true, replaceBlocks: true } });
	await api(`/content/pages/${id}/publish`, { method: "POST", body: {} });
	changed++;
}
console.log(`pages now using shared sections: ${changed}`);
