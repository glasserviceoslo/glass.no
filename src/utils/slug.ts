type TextNode = { text?: string; children?: TextNode[] };

export const textOf = (node: TextNode): string => node.text ?? (node.children ?? []).map(textOf).join("");

export const slugOf = (text: string) =>
	text
		.toLowerCase()
		.replace(/æ/g, "ae")
		.replace(/ø/g, "o")
		.replace(/å/g, "a")
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
