import { render } from "@react-email/components";
import { definePlugin } from "emdash";
import { createElement } from "react";
import { System } from "../emails/System";

const decode = (html: string) =>
	html
		.replace(/<[^>]+>/g, "")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, "&")
		.trim();

export function readSystemEmail(html: string) {
	const heading = decode(/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? "");
	const anchor = /<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/.exec(html);
	const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
		.map((match) => match[1] ?? "")
		.filter((inner) => !inner.includes("<a"))
		.map(decode)
		.filter(Boolean);
	return { heading, paragraphs, action: anchor ? { href: decode(anchor[1] ?? ""), label: decode(anchor[2] ?? "") } : undefined };
}

export function createPlugin() {
	return definePlugin({
		id: "email-design",
		version: "1.0.0",
		capabilities: ["hooks.email-events:register"],
		hooks: {
			"email:beforeSend": async (event) => {
				const { message } = event;
				if (event.source !== "system" || !message.html) return message;
				const parts = readSystemEmail(message.html);
				if (!parts.heading) return message;
				return { ...message, html: await render(createElement(System, parts)) };
			},
		},
	});
}
