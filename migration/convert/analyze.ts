import { parseGutenbergBlocks, type GutenbergBlock } from "@emdash-cms/gutenberg-to-portable-text";
import { readWxr } from "./wxr.ts";

const items = readWxr(process.argv[2]).filter((item) => ["page", "post", "wp_block"].includes(item.type));
const count = (map: Map<string, number>, key: string) => map.set(key, (map.get(key) ?? 0) + 1);

const rowAttrs = new Map<string, number>();
const rowColumns = new Map<string, number>();
const rowDepth = new Map<string, number>();
const columnChildren = new Map<string, number>();
const topLevel = new Map<string, number>();
const palettes = new Map<string, number>();

const walk = (blocks: GutenbergBlock[], rowLevel: number) => {
	for (const block of blocks) {
		if (!block.blockName) continue;
		if (block.blockName === "kadence/rowlayout") {
			count(rowDepth, String(rowLevel));
			count(rowColumns, `${block.attrs.columns ?? "?"} ${block.attrs.colLayout ?? ""}`);
			for (const [key, value] of Object.entries(block.attrs)) {
				count(rowAttrs, key);
				if (typeof value === "string" && value.startsWith("palette")) count(palettes, `${key}=${value}`);
			}
			for (const column of block.innerBlocks) {
				count(columnChildren, column.innerBlocks.map((child) => child.blockName?.replace("kadence/", "")).join(","));
			}
			walk(block.innerBlocks, rowLevel + 1);
		} else {
			walk(block.innerBlocks, rowLevel);
		}
	}
};

for (const item of items) {
	const blocks = parseGutenbergBlocks(item.content);
	for (const block of blocks) if (block.blockName) count(topLevel, `${item.type} ${block.blockName}`);
	walk(blocks, 0);
}

const top = (map: Map<string, number>, n = 25) =>
	[...map].sort((a, b) => b[1] - a[1]).slice(0, n).map(([key, value]) => `${String(value).padStart(5)} ${key}`).join("\n");

console.log("TOP LEVEL\n" + top(topLevel));
console.log("\nROW DEPTH\n" + top(rowDepth));
console.log("\nROW COLUMNS\n" + top(rowColumns));
console.log("\nROW ATTRS\n" + top(rowAttrs, 40));
console.log("\nPALETTE USE\n" + top(palettes));
console.log("\nCOLUMN CHILDREN\n" + top(columnChildren, 40));
