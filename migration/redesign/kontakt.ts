import { api, listAll } from "../convert/api.ts";
import { syncSchema } from "../convert/sync-schema.ts";

type Block = { _type: string; column_1?: { children?: { text?: string }[] }[]; [key: string]: unknown };

const pages = await listAll<{ id: string; slug: string }>("/content/pages");
const page = pages.find((entry) => entry.slug === "kontakt-oss");
if (!page) throw new Error("no kontakt-oss page");
const { item } = await api<{ item: { data: { layout: Block[] } } }>(`/content/pages/${page.id}`);

const isCallBand = (block: Block) =>
	block._type === "section" && (block.column_1 ?? []).some((node) => (node.children ?? []).some((child) => child.text?.includes("Trenger du glass service?")));
const map = { _type: "map", address: "Pilestredet 41A, 0166 Oslo", hours: "Man - Fre 08:00-17:00", latitude: 59.920236, longitude: 10.734451 };

const layout = item.data.layout.filter((block) => !isCallBand(block) && block._type !== "map").map(({ _key, _version, ...block }) => block);
layout.push(map);

await syncSchema();
await api(`/content/pages/${page.id}`, { method: "PUT", body: { data: { layout }, skipRevision: true, replaceBlocks: true } });
await api(`/content/pages/${page.id}/publish`, { method: "POST", body: {} });
console.log("kontakt-oss:", layout.map((block) => block._type).join(", "));
