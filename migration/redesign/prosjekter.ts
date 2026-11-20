import { api, listAll } from "../convert/api.ts";
import { imageField, type Media } from "../convert/media.ts";
import { syncSchema } from "../convert/sync-schema.ts";

type Node = { _type: string; style?: string; children?: { text?: string }[]; images?: { asset?: { url?: string } }[] };

const library = await listAll<Media>("/media");
const byFile = new Map(library.map((item) => [item.storageKey, item] as const));
const pages = await listAll<{ id: string; slug: string }>("/content/pages");
const page = pages.find((entry) => entry.slug === "prosjekter");
if (!page) throw new Error("no prosjekter page");
const { item } = await api<{ item: { data: { title: string; layout: { _type: string; column_1?: Node[] }[] } } }>(`/content/pages/${page.id}`);

const textOf = (node?: Node) => (node?.children ?? []).map((child) => child.text ?? "").join("").trim();
const galleries = item.data.layout
	.filter((block) => block._type === "section" || block._type === "project_gallery")
	.map((block) => {
		if (block._type === "project_gallery") return block;
		const body = block.column_1 ?? [];
		const gallery = body.find((node) => node._type === "gallery");
		return {
			_type: "project_gallery",
			heading: textOf(body.find((node) => node.style === "h2")),
			text: textOf(body.find((node) => node._type === "block" && (node.style ?? "normal") === "normal")),
			images: (gallery?.images ?? []).map((image) => {
				const file = image.asset?.url?.split("/").pop() ?? "";
				const found = byFile.get(file);
				if (!found) throw new Error(`no media ${file}`);
				return { image: imageField(found, "") };
			}),
		};
	});

const layout = [{ _type: "page_hero", title: item.data.title }, ...galleries];
await syncSchema();
await api(`/content/pages/${page.id}`, { method: "PUT", body: { data: { layout }, skipRevision: true, replaceBlocks: true } });
await api(`/content/pages/${page.id}/publish`, { method: "POST", body: {} });
console.log("prosjekter:", galleries.map((block) => ("heading" in block ? `${block.heading} (${block.images.length})` : block._type)).join(", "));
