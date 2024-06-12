import type { APIContext } from 'astro';

export async function GET(ctx: APIContext) {
  const url = new URL(ctx.request.url);
  console.log('🚀 ~ GET ~ url:', url);
  const params = url.searchParams;
  const branch = params.get('branch');
  const to = params.get('to');
  if (!branch || !to) {
    return new Response('Missing branch or to params', { status: 400 });
  }
  ctx.cookies.set('ks-branch', branch);
  const toUrl = new URL(to, url.origin);
  toUrl.protocol = url.protocol;
  toUrl.host = url.host;
  return ctx.redirect(toUrl.toString());
}
