import { definePlugin } from "emdash";

const SKIPPED_KEYS = new Set(["_type", "_key", "id", "background", "style", "icon", "layout", "variant", "alignment", "mimeType", "provider", "listItem", "markDefs", "marks"]);
const LINK_OR_ID = /^(https?:|mailto:|tel:|\/|#)|^[0-9A-HJKMNP-TV-Z]{26}$/;

function collect(value: unknown, key: string, out: string[]) {
	if (SKIPPED_KEYS.has(key) || key.endsWith("_url") || key === "url" || key === "href" || key === "src") return;
	if (typeof value === "string") {
		const text = value.trim();
		if (text && !LINK_OR_ID.test(text)) out.push(text);
		return;
	}
	if (Array.isArray(value)) {
		for (const item of value) collect(item, key, out);
		return;
	}
	if (value && typeof value === "object") {
		for (const [childKey, child] of Object.entries(value)) collect(child, childKey, out);
	}
}

export function textOf(layout: unknown) {
	const parsed = typeof layout === "string" ? JSON.parse(layout) : layout;
	const out: string[] = [];
	collect(parsed, "", out);
	return [...new Set(out)].join(" ").replace(/\s+/g, " ").trim();
}

export function createPlugin() {
	return definePlugin({
		id: "search-text",
		version: "1.0.0",
		capabilities: ["content:write"],
		hooks: {
			"content:beforeSave": async (event) => {
				if (event.collection !== "pages" && event.collection !== "posts") return;
				if (!("layout" in event.content)) return;
				return { ...event.content, search_text: textOf(event.content.layout) };
			},
		},
	});
}
