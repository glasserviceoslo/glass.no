import { api, listAll } from "../convert/api.ts";

type Block = { _type: string; [key: string]: unknown };

const pages = await listAll<{ id: string; slug: string }>("/content/pages");
const page = pages.find((entry) => entry.slug === "hjem");
if (!page) throw new Error("no hjem page");
const { item } = await api<{ item: { data: { layout: Block[] } } }>(`/content/pages/${page.id}`);

const layout = item.data.layout.filter((block) => block._type !== "reviews").map(({ _key, _version, ...block }) => block);
const after = layout.findIndex((block) => block._type === "features");
layout.splice(after + 1, 0, { _type: "reviews", heading: "Dette sier kundene om oss", background: "tint" });

await api(`/content/pages/${page.id}`, { method: "PUT", body: { data: { layout }, skipRevision: true, replaceBlocks: true } });
await api(`/content/pages/${page.id}/publish`, { method: "POST", body: {} });
console.log("hjem:", layout.map((block) => block._type).join(", "));
