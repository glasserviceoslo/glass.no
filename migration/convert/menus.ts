import { readFileSync } from "node:fs";
import { api, listAll } from "./api.ts";

type Item = { label: string; href: string; children: Item[] };

const decode = (text: string) =>
	text
		.replace(/<[^>]+>/g, "")
		.replace(/&oslash;/g, "ø")
		.replace(/&aring;/g, "å")
		.replace(/&aelig;/g, "æ")
		.replace(/&amp;/g, "&")
		.trim();

function parseMenu(html: string): Item[] {
	const nav = html.match(/<nav[^>]*id="site-navigation"[\s\S]*?<\/nav>/)?.[0] ?? html.match(/<header[\s\S]*?<\/header>/)![0];
	const root: Item = { label: "", href: "", children: [] };
	const stack: Item[] = [root];
	for (const token of nav.matchAll(/<li[^>]*>\s*<a(?:[^>]*href="([^"]*)")?[^>]*>([\s\S]*?)<\/a>|<\/ul>|<ul[^>]*class="[^"]*sub-menu[^"]*"[^>]*>/g)) {
		if (token[0].startsWith("</ul")) {
			if (stack.length > 1) stack.pop();
		} else if (token[0].startsWith("<ul")) {
			const parent = stack[stack.length - 1].children.at(-1);
			if (parent) stack.push(parent);
		} else {
			stack[stack.length - 1].children.push({ label: decode(token[2].replace(/<svg[\s\S]*?<\/svg>/g, "")), href: token[1] ?? "", children: [] });
		}
	}
	return root.children;
}

const items = parseMenu(readFileSync(process.argv[2], "utf8"));
const pages = new Map((await listAll<{ id: string; slug: string }>("/content/pages")).map((page) => [page.slug, page.id]));
const home = pages.get("hjem");

const menus = await api<{ name: string }[]>("/menus");
for (const menu of menus) await api(`/menus/${menu.name}`, { method: "DELETE" });
await api("/menus", { method: "POST", body: { name: "primary", label: "Hovedmeny" } });

async function create(item: Item, parentId?: string, sortOrder = 0) {
	const path = item.href.replace(/^https?:\/\/(www\.)?glass\.no/, "") || "/";
	const slug = path.replace(/^\/|\/$/g, "");
	const pageId = slug ? pages.get(slug) : home;
	const body = pageId
		? { type: "page", label: item.label, referenceCollection: "pages", referenceId: pageId }
		: { type: "custom", label: item.label, customUrl: path || "#" };
	const created = await api<{ id: string }>("/menus/primary/items", { method: "POST", body: { ...body, ...(parentId ? { parentId } : {}), sortOrder } });
	for (const [index, child] of item.children.entries()) await create(child, created.id, index);
}

for (const [index, item] of items.entries()) await create(item, undefined, index);
console.log(JSON.stringify(items.map((item) => [item.label, item.children.map((child) => [child.label, child.children.map((grand) => grand.label)])]), null, 0));
