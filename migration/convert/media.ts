import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import type { WxrItem } from "./wxr.ts";

export type Media = {
	id: string;
	filename: string;
	mimeType: string;
	width?: number;
	height?: number;
	alt?: string | null;
	blurhash?: string;
	dominantColor?: string;
	storageKey: string;
	contentHash: string;
	url: string;
};

export type MediaMap = {
	byId: (wpId: unknown) => Media | undefined;
	byUrl: (url: string) => Media | undefined;
	wpUrls: Map<number, string>;
	missing: Set<string>;
};

const stripSize = (path: string) => path.replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i, "").replace(/-scaled(?=\.[a-z0-9]+$)/i, "");
const stripCopy = (name: string) => name.replace(/-\d+(?=\.[a-z0-9]+$)/i, "");
const pathOf = (url: string) => stripSize(url.replace(/^https?:\/\/[^/]+/, "").split("?")[0]);

async function sha1Of(url: string, cache: Record<string, string>) {
	if (cache[url]) return cache[url];
	const response = await fetch(url);
	if (!response.ok) return undefined;
	const hash = createHash("sha1").update(Buffer.from(await response.arrayBuffer())).digest("hex");
	cache[url] = hash;
	return hash;
}

export async function buildMediaMap(attachments: WxrItem[], media: Media[], cachePath: string): Promise<MediaMap> {
	const byName = new Map<string, Media[]>();
	for (const item of media) byName.set(item.filename, [...(byName.get(item.filename) ?? []), item]);
	const byHash = new Map(media.map((item) => [item.contentHash.replace(/^sha1:/, ""), item]));
	const cache: Record<string, string> = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf8")) : {};

	const byWpId = new Map<number, Media>();
	const byPath = new Map<string, Media>();
	const wpUrls = new Map<number, string>();
	for (const attachment of attachments) {
		if (!attachment.attachmentUrl) continue;
		const name = basename(attachment.attachmentUrl);
		const candidates = byName.get(name) ?? byName.get(stripCopy(name)) ?? [];
		let found = candidates.length === 1 ? candidates[0] : undefined;
		if (!found) {
			const hash = await sha1Of(attachment.attachmentUrl, cache);
			found = hash ? byHash.get(hash) : undefined;
		}
		if (!found) continue;
		byWpId.set(attachment.id, found);
		byPath.set(pathOf(attachment.attachmentUrl), found);
		wpUrls.set(attachment.id, found.url);
	}
	writeFileSync(cachePath, JSON.stringify(cache));

	const missing = new Set<string>();
	return {
		missing,
		wpUrls,
		byId: (wpId) => {
			const found = byWpId.get(Number(wpId));
			if (!found && wpId) missing.add(`id:${wpId}`);
			return found;
		},
		byUrl: (url) => {
			if (/^\d+$/.test(url)) return byWpId.get(Number(url)) ?? (missing.add(`id:${url}`), undefined);
			const found = byPath.get(pathOf(url));
			if (!found && url) missing.add(url);
			return found;
		},
	};
}

const defined = <T extends Record<string, unknown>>(value: T) =>
	Object.fromEntries(Object.entries(value).filter(([, field]) => field !== null && field !== undefined && field !== "")) as Partial<T>;

export const imageField = (media: Media, alt?: string) =>
	defined({
		id: media.id,
		src: media.url,
		alt: alt || media.alt,
		width: media.width,
		height: media.height,
		filename: media.filename,
		mimeType: media.mimeType,
		blurhash: media.blurhash,
		dominantColor: media.dominantColor,
		provider: "local",
		meta: { storageKey: media.storageKey },
	});

export const imageNode = (key: string, media: Media, alt?: string, link?: string) => ({
	_type: "image" as const,
	_key: key,
	asset: { _type: "reference" as const, _ref: media.url, url: media.url },
	alt: alt || media.alt || undefined,
	width: media.width,
	height: media.height,
	...(link ? { link } : {}),
});
