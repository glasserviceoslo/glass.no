import { GET as transform } from "@emdash-cms/cloudflare/image-endpoint";
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getTransformFingerprint, matchInternalMediaKey, MUTABLE_MEDIA_CACHE_CONTROL } from "emdash/media/image-endpoint";

export const prerender = false;

type Buckets = { MEDIA?: R2Bucket; IMAGE_CACHE?: R2Bucket };

export const GET: APIRoute = async (ctx) => {
	const { MEDIA: media, IMAGE_CACHE: cache } = env as Buckets;
	const params = new URL(ctx.request.url).searchParams;
	const mediaKey = matchInternalMediaKey(params.get("href"));
	if (!media || !cache || !mediaKey || !params.get("w") || ctx.request.method !== "GET") return transform(ctx);

	const original = await media.head(mediaKey);
	if (!original) return transform(ctx);
	const cacheKey = `v1/${mediaKey}/${original.size}-${original.uploaded.getTime()}/${getTransformFingerprint(params)}`;

	const cached = await cache.get(cacheKey);
	if (cached) {
		const etag = cached.customMetadata?.etag;
		if (etag && ctx.request.headers.get("If-None-Match") === etag) return new Response(null, { status: 304, headers: { ETag: etag } });
		return new Response(cached.body, {
			headers: {
				"Content-Type": cached.httpMetadata?.contentType ?? "image/webp",
				"Cache-Control": MUTABLE_MEDIA_CACHE_CONTROL,
				"X-Content-Type-Options": "nosniff",
				"X-Image-Cache": "hit",
				...(etag ? { ETag: etag } : {}),
			},
		});
	}

	const response = await transform(ctx);
	const contentType = response.headers.get("Content-Type") ?? "";
	if (response.status !== 200 || !contentType.startsWith("image/")) return response;
	const bytes = await response.arrayBuffer();
	const etag = response.headers.get("ETag") ?? "";
	const save = cache.put(cacheKey, bytes, { httpMetadata: { contentType }, customMetadata: { etag } });
	const worker = (ctx.locals as { cfContext?: { waitUntil(promise: Promise<unknown>): void } }).cfContext;
	if (worker) worker.waitUntil(save);
	else await save;
	const headers = new Headers(response.headers);
	headers.set("X-Image-Cache", "miss");
	return new Response(bytes, { status: 200, headers });
};
