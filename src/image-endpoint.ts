import { GET as transform } from "@emdash-cms/cloudflare/image-endpoint";
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { matchInternalMediaKey, MUTABLE_MEDIA_CACHE_CONTROL, parseTransformParams } from "emdash/media/image-endpoint";

export const prerender = false;

type Buckets = { MEDIA?: R2Bucket; IMAGE_CACHE?: R2Bucket };

const TRANSFORMED_TYPES = new Set(["image/webp", "image/avif", "image/jpeg", "image/png"]);

export const GET: APIRoute = async (ctx) => {
	const { MEDIA: media, IMAGE_CACHE: cache } = env as Buckets;
	const params = new URL(ctx.request.url).searchParams;
	const mediaKey = matchInternalMediaKey(params.get("href"));
	const parsed = parseTransformParams(params);
	if (!media || !cache || !mediaKey || !parsed.ok || parsed.options.quality !== undefined || ctx.request.method !== "GET") return transform(ctx);

	const original = await media.head(mediaKey);
	if (!original || !original.httpMetadata?.contentType?.startsWith("image/") || original.httpMetadata.contentType === "image/svg+xml") return transform(ctx);
	const { width, height, format } = parsed.options;
	const cacheKey = `v2/${mediaKey}/${original.size}-${original.uploaded.getTime()}/${width}x${height ?? "auto"}.${format}`;

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
	const transformed =
		response.status === 200 &&
		TRANSFORMED_TYPES.has(contentType) &&
		!response.headers.has("Content-Disposition") &&
		!response.headers.has("Content-Security-Policy");
	if (!transformed) return response;
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
