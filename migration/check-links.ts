import { readFileSync } from "node:fs";

const arg = (name: string, fallback: string) => {
	const at = process.argv.indexOf(`--${name}`);
	return at > 0 ? process.argv[at + 1] : fallback;
};
const base = arg("base", "http://localhost:4330").replace(/\/$/, "");
const live = arg("live", "https://www.glass.no").replace(/\/$/, "");

const pathOf = (url: string) => {
	const { pathname } = new URL(url, base);
	return pathname.endsWith("/") || /\.[a-z0-9]+$/i.test(pathname) ? pathname : `${pathname}/`;
};

const sitemapUrls = async (url: string, seen = new Set<string>()): Promise<string[]> => {
	if (seen.has(url)) return [];
	seen.add(url);
	const xml = await fetch(url).then((response) => (response.ok ? response.text() : ""));
	const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
	const nested = await Promise.all(locs.filter((loc) => loc.endsWith(".xml")).map((loc) => sitemapUrls(loc, seen)));
	return [...locs.filter((loc) => !loc.endsWith(".xml")), ...nested.flat()];
};

type Result = { path: string; status: number; final: string; hops: number };
const resolve = async (path: string): Promise<Result> => {
	let current = path;
	for (let hops = 0; hops < 6; hops++) {
		const response = await fetch(`${base}${current}`, { redirect: "manual" });
		const location = response.headers.get("location");
		if (response.status >= 300 && response.status < 400 && location) {
			current = pathOf(location);
			continue;
		}
		return { path, status: response.status, final: current, hops };
	}
	return { path, status: 508, final: current, hops: 6 };
};

const sources = new Map<string, Set<string>>();
const add = (path: string, source: string) => {
	if (path.startsWith("/_emdash") || path.startsWith("/_image") || path.startsWith("/api/") || path.startsWith("/wp-")) return;
	sources.set(path, (sources.get(path) ?? new Set()).add(source));
};

for (const url of await sitemapUrls(`${live}/sitemap_index.xml`)) add(pathOf(url), "live sitemap");
try {
	for (const line of readFileSync(new URL("./live-urls.txt", import.meta.url), "utf8").split("\n")) if (line.trim().startsWith("http")) add(pathOf(line.trim()), "earlier crawl");
} catch {}

const localPages = await sitemapUrls(`${base}/sitemap.xml`);
for (const url of localPages) add(pathOf(url), "local sitemap");
for (const url of [`${base}/`, ...localPages]) {
	const html = await fetch(url).then((response) => response.text());
	for (const [, href] of html.matchAll(/href="(\/[^"#?]*)"/g)) add(pathOf(href), `link on ${pathOf(url)}`);
}

const results = await Promise.all([...sources.keys()].map(resolve));
const ok = results.filter((result) => result.status === 200 && result.hops === 0);
const moved = results.filter((result) => result.status === 200 && result.hops > 0);
const gone = results.filter((result) => result.status === 410);
const broken = results.filter((result) => result.status !== 200 && result.status !== 410);

console.log(`checked ${results.length} addresses against ${base}`);
console.log(`  ok: ${ok.length}   redirected to a working page: ${moved.length}   gone on purpose (410): ${gone.length}   broken: ${broken.length}`);
if (moved.length) {
	console.log("\nredirected:");
	for (const result of moved) console.log(`  ${result.path} -> ${result.final}`);
}
if (broken.length) {
	console.log("\nbroken:");
	for (const result of broken) console.log(`  ${result.status} ${result.path}  (from: ${[...(sources.get(result.path) ?? [])].slice(0, 3).join("; ")})`);
}
process.exitCode = broken.length ? 1 : 0;
