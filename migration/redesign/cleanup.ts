import { api, listAll } from "../convert/api.ts";

type Entry = { id: string; slug: string; status: string };
type Span = { _type: string; text?: string; marks?: string[] };
type Node = { _type?: string; children?: Span[]; markDefs?: { _key: string; href?: string }[]; [key: string]: unknown };
type Block = { _type: string; _key?: string; _version?: number; [key: string]: unknown };

const GROUP = "WordPress-opprydding";
const GONE = [
	"/handlekurv",
	"/kassen",
	"/min-konto",
	"/customer-cabinet",
	"/login",
	"/logout",
	"/register",
	"/members",
	"/user",
	"/account",
	"/password-reset",
	"/eksempel-side",
	"/salgs-og-leveringsbetingelser",
	"/author/admin",
	"/produktkategori/ukategorisert",
];
const MOVED: Record<string, string> = {
	"/butikk": "/",
	"/produkter": "/",
	"/projects": "/prosjekter/",
	"/infokapsel-erklaering-eu": "/privacy-policy/",
	"/smijern-hub": "/smijernsdor/",
	"/dusjlosninger": "/dusjdor/",
	"/category/uncategorized": "/blogg/",
	"/produkt/speil": "/speil/",
};
const DEAD_LINK = "/artikkel-om-tradlos-stovsuger";

const pages = await listAll<Entry>("/content/pages");
const retired = new Set([...GONE, ...Object.keys(MOVED)].map((path) => path.slice(1)));
for (const page of pages.filter((entry) => retired.has(entry.slug) && entry.status === "published")) {
	await api(`/content/pages/${page.id}/unpublish`, { method: "POST", body: {} });
	console.log("unpublished", page.slug);
}
for (const product of (await listAll<Entry>("/content/products")).filter((entry) => entry.status === "published")) {
	await api(`/content/products/${product.id}/unpublish`, { method: "POST", body: {} });
	console.log("unpublished product", product.slug);
}

const existing = new Set((await listAll<{ source: string }>("/redirects")).map((redirect) => redirect.source));
const wanted = [
	...GONE.map((source) => ({ source, type: 410 })),
	...Object.entries(MOVED).map(([source, destination]) => ({ source, destination, type: 301 })),
];
for (const redirect of wanted.filter((entry) => !existing.has(entry.source))) {
	await api("/redirects", { method: "POST", body: { ...redirect, groupName: GROUP } });
}
console.log("redirects in place:", wanted.length);

const pageId = (slug: string) => pages.find((entry) => entry.slug === slug)?.id;
type MenuItem = { id: string; label: string; parentId: string | null; sortOrder: number; referenceId?: string | null };
const menu = await api<{ items: MenuItem[] }>("/menus/primary");
const [emptyHub, showerDoors] = [pageId("dusjlosninger"), pageId("dusjdor")];
for (const item of menu.items.filter((entry) => emptyHub && showerDoors && entry.referenceId === emptyHub)) {
	const { id } = await api<{ id: string }>("/menus/primary/items", {
		method: "POST",
		body: { type: "page", label: item.label, referenceCollection: "pages", referenceId: showerDoors, sortOrder: item.sortOrder, ...(item.parentId ? { parentId: item.parentId } : {}) },
	});
	for (const child of menu.items.filter((entry) => entry.parentId === item.id)) {
		await api(`/menus/primary/items/${child.id}`, { method: "PUT", body: { parentId: id } });
	}
	await api(`/menus/primary/items/${item.id}`, { method: "DELETE" });
	console.log(`menu: "${item.label}" now links to /dusjdor/`);
}

const save = async (id: string, layout: Block[]) => {
	const keyless = layout.map(({ _key, _version, ...block }) => block);
	await api(`/content/pages/${id}`, { method: "PUT", body: { data: { layout: keyless }, skipRevision: true, replaceBlocks: true } });
	await api(`/content/pages/${id}/publish`, { method: "POST", body: {} });
};

const privacy = pages.find((entry) => entry.slug === "privacy-policy");
if (privacy) {
	const { item } = await api<{ item: { data: { title: string; layout: Block[] } } }>(`/content/pages/${privacy.id}`);
	if (!item.data.layout.some((block) => block._type === "page_hero")) {
		await save(privacy.id, [{ _type: "page_hero", title: item.data.title }, ...item.data.layout]);
		console.log("privacy-policy: title block added");
	}
}

const unlink = (value: unknown): unknown => {
	if (Array.isArray(value)) return value.map(unlink);
	if (!value || typeof value !== "object") return value;
	const node = value as Node;
	const dead = (node.markDefs ?? []).filter((mark) => mark.href?.replace(/\/$/, "").endsWith(DEAD_LINK)).map((mark) => mark._key);
	const cleaned = Object.fromEntries(Object.entries(node).map(([key, inner]) => [key, unlink(inner)])) as Node;
	if (!dead.length) return cleaned;
	return {
		...cleaned,
		markDefs: (node.markDefs ?? []).filter((mark) => !dead.includes(mark._key)),
		children: (cleaned.children ?? []).map((span) => ({ ...span, marks: (span.marks ?? []).filter((mark) => !dead.includes(mark)) })),
	};
};
const mirror = pages.find((entry) => entry.slug === "stort-speil");
if (mirror) {
	const { item } = await api<{ item: { data: { layout: Block[] } } }>(`/content/pages/${mirror.id}`);
	if (JSON.stringify(item.data.layout).includes(DEAD_LINK)) {
		await save(mirror.id, unlink(item.data.layout) as Block[]);
		console.log("stort-speil: dead link removed");
	}
}

const thanks = pages.find((entry) => entry.slug === "takk");
if (thanks) {
	const { item } = await api<{ item: { data: { layout: Block[] }; seo?: { noIndex?: boolean } } }>(`/content/pages/${thanks.id}`);
	const section = item.data.layout.find((block) => block._type === "section");
	const nodes = (section?.column_1 ?? []) as Node[];
	const opening = nodes[0];
	const openingText = (opening?.children ?? []).map((span) => span.text ?? "").join("").trim();
	if (section && opening?.style === "normal" && openingText.length > 0 && openingText.length <= 60) {
		section.column_1 = [{ ...opening, style: "h1" }, ...nodes.slice(1)];
		const keyless = item.data.layout.map(({ _key, _version, ...block }) => block);
		await api(`/content/pages/${thanks.id}`, { method: "PUT", body: { data: { layout: keyless }, seo: { noIndex: true }, skipRevision: true, replaceBlocks: true } });
		await api(`/content/pages/${thanks.id}/publish`, { method: "POST", body: {} });
		console.log(`takk: "${openingText}" is the heading, page is noindex`);
	} else if (!item.seo?.noIndex) {
		await api(`/content/pages/${thanks.id}`, { method: "PUT", body: { seo: { noIndex: true } } });
		await api(`/content/pages/${thanks.id}/publish`, { method: "POST", body: {} });
		console.log("takk: page is noindex");
	}
}
