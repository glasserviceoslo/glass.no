import type { APIContext } from "astro";

export function POST(ctx: APIContext) {
  if (ctx.request.headers.get("origin") !== new URL(ctx.request.url).origin) {
    return new Response("Invalid origin", { status: 400 });
  }
  const referrer = ctx.request.headers.get("Referer");
  if (!referrer) {
    return new Response("Missing Referer", { status: 400 });
  }
  ctx.cookies.delete("ks-branch");
  return Response.redirect(referrer, 303);
}
