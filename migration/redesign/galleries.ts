import { api, listAll } from "../convert/api.ts";
import { imageField, type Media } from "../convert/media.ts";

type Node = { _type: string; style?: string; children?: { text?: string }[]; images?: { asset?: { url?: string } }[] };
type Block = { _type: string; column_1?: Node[]; [key: string]: unknown };

const library = await listAll<Media>("/media");
const byFile = new Map(library.map((item) => [item.storageKey, item] as const));
const textOf = (node?: Node) => (node?.children ?? []).map((child) => child.text ?? "").join("").trim();

const toGallery = (block: Block) => {
	if (block._type !== "section") return block;
	const body = (block.column_1 ?? []).filter((node) => !(node._type === "block" && !textOf(node)));
	const [label, gallery] = body;
	if (body.length !== 2 || label._type !== "block" || gallery._type !== "gallery" || textOf(label).length > 40 || (gallery.images?.length ?? 0) < 4) return block;
	return {
		_type: "project_gallery",
		heading: textOf(label),
		images: (gallery.images ?? []).map((image) => {
			const file = image.asset?.url?.split("/").pop() ?? "";
			const found = byFile.get(file);
			if (!found) throw new Error(`no media ${file}`);
			return { image: imageField(found, "") };
		}),
	};
};

for (const page of await listAll<{ id: string; slug: string; status: string }>("/content/pages")) {
	const { item } = await api<{ item: { data: { layout?: Block[] } } }>(`/content/pages/${page.id}`);
	const layout = (item.data.layout ?? []).map(toGallery);
	if (layout.every((block, index) => block === item.data.layout![index])) continue;
	const keyless = layout.map(({ _key, _version, ...block }) => block);
	await api(`/content/pages/${page.id}`, { method: "PUT", body: { data: { layout: keyless }, skipRevision: true, replaceBlocks: true } });
	if (page.status === "published") await api(`/content/pages/${page.id}/publish`, { method: "POST", body: {} });
	console.log("gallery:", page.slug);
}
