import { defineMiddleware } from "astro:middleware";

const SKIP = /^\/(_emdash|_image|_astro|_server-islands)\b|\.[a-z0-9]+$/i;
const CONTENT_SITEMAP = /^\/sitemap-[a-z0-9_-]+\.xml$/;

const withSlash = (xml: string) =>
	xml.replace(/<loc>([^<]+)<\/loc>/g, (match, url: string) => {
		const { origin, pathname } = new URL(url);
		if (/\.[a-z0-9]+$/i.test(pathname)) return match;
		const path = pathname === "/hjem" ? "/" : pathname.endsWith("/") ? pathname : `${pathname}/`;
		return `<loc>${origin}${path}</loc>`;
	});

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname, search } = context.url;
	const readOnly = context.request.method === "GET" || context.request.method === "HEAD";
	if (readOnly && pathname !== "/" && !pathname.endsWith("/") && !SKIP.test(pathname)) {
		return context.redirect(`${pathname}/${search}`, 301);
	}
	const response = await next();
	if (!CONTENT_SITEMAP.test(pathname) || !response.ok) return response;
	const headers = new Headers(response.headers);
	headers.delete("content-length");
	return new Response(withSlash(await response.text()), { status: response.status, headers });
});
