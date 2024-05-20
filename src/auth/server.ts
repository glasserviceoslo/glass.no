import { Auth, type AuthConfig, isAuthAction, setEnvDefaults, createActionURL } from '@auth/core';
import type { Session } from '@auth/core/types';
import type { APIContext } from 'astro';
import { parseString } from 'set-cookie-parser';
import { config as authConfig } from './config';

function AstroAuthHandler(config = authConfig) {
  return async (ctx: APIContext) => {
    setEnvDefaults(import.meta.env, config);
    const { basePath } = config;

    const { request, cookies } = ctx;
    const url = new URL(request.url);
    const action = url.pathname.slice((basePath as string).length + 1).split('/')[0];

    if (!isAuthAction(action) || !url.pathname.startsWith(`${basePath}/`)) {
      return;
    }

    const res = (await Auth(request, config)) as Response;
    if (['callback', 'signin', 'signout'].includes(action)) {
      // Properly handle multiple Set-Cookie headers (they can't be concatenated in one)
      for (const cookie of res.headers.getSetCookie()) {
        const { name, value, ...options } = parseString(cookie);
        // Astro's typings are more explicit than @types/set-cookie-parser for sameSite
        cookies.set(name, value, options as Parameters<(typeof cookies)['set']>[2]);
      }
      res.headers.delete('Set-Cookie');
    }
    return res;
  };
}

/**
 * Creates a set of Astro endpoints for authentication.
 *
 * @example
 * ```ts
 * export const { GET, POST } = AstroAuth({
 *   providers: [
 *     GitHub({
 *       clientId: process.env.GITHUB_ID!,
 *       clientSecret: process.env.GITHUB_SECRET!,
 *     }),
 *   ],
 *   debug: false,
 * })
 * ```
 *
 * @param config The configuration for authentication providers and other options. Providing this will override your auth config file.
 * @returns An object with `GET` and `POST` methods that can be exported in an Astro endpoint.
 */
export function AstroAuth(config?: AuthConfig) {
  const handler = AstroAuthHandler(config);
  return {
    GET: handler,
    POST: handler,
  };
}

/**
 * Fetches the current session.
 * @param req The request object.
 * @returns The current session, or `null` if there is no session.
 */
export async function getSession(ctx: APIContext, config = authConfig): Promise<Session | null> {
  setEnvDefaults(import.meta.env, config);

  const protocol = ctx.request.headers.get('x-forwarded-proto') === 'http' || import.meta.env.DEV ? 'http' : 'https';
  const url = createActionURL('session', protocol, ctx.request.headers, import.meta.env, config.basePath);
  const response = (await Auth(new Request(url, { headers: ctx.request.headers }), config)) as Response;
  const { status = 200 } = response;

  const data = await response.json();

  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data;
  throw new Error(data.message);
}
