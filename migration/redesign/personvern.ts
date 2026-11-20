import { api, listAll } from "../convert/api.ts";

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type Node = { _type: string; _key?: string; style?: string; listItem?: string; level?: number; children?: Span[]; markDefs?: unknown[] };
type Block = { _type: string; column_1?: Node[]; [key: string]: unknown };

const HEADING = "Informasjonskapsler";
let counter = 0;
const key = () => `cookies${++counter}`;
const block = (text: string, style = "normal", listItem?: string): Node => ({
	_type: "block",
	_key: key(),
	style,
	...(listItem ? { listItem, level: 1 } : {}),
	markDefs: [],
	children: [{ _type: "span", _key: key(), text, marks: [] }],
});

const cookies = [
	block(HEADING, "h3"),
	block("Vi deler informasjonskapslene inn i disse gruppene. Bare de nødvendige brukes uten samtykke."),
	block("Nødvendig: husker blant annet valget ditt om informasjonskapsler. Kan ikke slås av.", "normal", "bullet"),
	block("Kart: viser kart fra Google Maps på kontaktsiden. Google Ireland Limited setter da egne informasjonskapsler og mottar IP-adressen din.", "normal", "bullet"),
	block("Statistikk: Google Analytics måler hvordan nettstedet brukes, slik at vi kan gjøre det bedre. Google Ireland Limited setter da egne informasjonskapsler og mottar IP-adressen din.", "normal", "bullet"),
	block("Du kan når som helst endre eller trekke tilbake samtykket under «Cookie-innstillinger» nederst på siden."),
];

const textOf = (node: Node) => (node.children ?? []).map((child) => child.text).join("");
const pages = await listAll<{ id: string; slug: string }>("/content/pages");
const page = pages.find((entry) => entry.slug === "privacy-policy");
if (!page) throw new Error("no privacy-policy page");
const { item } = await api<{ item: { data: { layout: Block[] } } }>(`/content/pages/${page.id}`);

const layout = item.data.layout.map((section) => {
	const body = (section.column_1 ?? []).filter((node) => !(node.style === "h3" && textOf(node) === HEADING) && !cookies.some((added) => textOf(added) === textOf(node)));
	const at = body.findIndex((node) => node.style === "h2" && textOf(node).startsWith("5."));
	if (at < 0) return section;
	body.splice(at + 2, 0, ...cookies);
	return { ...section, column_1: body };
});

const keyless = layout.map(({ _key, _version, ...section }) => section);
await api(`/content/pages/${page.id}`, { method: "PUT", body: { data: { layout: keyless }, skipRevision: true, replaceBlocks: true } });
await api(`/content/pages/${page.id}/publish`, { method: "POST", body: {} });
console.log("privacy-policy: cookie section", layout.some((section) => section.column_1?.some((node) => textOf(node) === HEADING)) ? "in place" : "missing");
