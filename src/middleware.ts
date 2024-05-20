import { getSession } from '$auth/server';
import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware(async (ctx, next) => {
  ctx.locals.session = await getSession(ctx);
  return next();
});
