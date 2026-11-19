import { readFileSync } from "node:fs";

export type WxrItem = {
	id: number;
	type: string;
	slug: string;
	status: string;
	title: string;
	content: string;
	attachmentUrl?: string;
	thumbnailId?: number;
};

const field = (item: string, tag: string) => {
	const match = item.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
	return match ? match[1] : "";
};

export function readWxr(path: string): WxrItem[] {
	const xml = readFileSync(path, "utf8");
	return xml
		.split("<item>")
		.slice(1)
		.map((item) => ({
			id: Number(field(item, "wp:post_id")),
			type: field(item, "wp:post_type"),
			slug: decodeURIComponent(field(item, "wp:post_name")),
			status: field(item, "wp:status"),
			title: field(item, "title"),
			content: field(item, "content:encoded").replaceAll("]]]]><![CDATA[>", "]]>"),
			attachmentUrl: field(item, "wp:attachment_url") || undefined,
			thumbnailId: Number(item.match(/<wp:meta_key><!\[CDATA\[_thumbnail_id\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(\d+)\]\]>/)?.[1]) || undefined,
		}));
}
