import type { CustomBackendAuthProvider } from '$types';
import type { APIContext } from 'astro';
import type { Lucia } from 'lucia';
import { lucia } from './auth';
// import authConfig from 'auth:config';
// import { getSession, AstroAuth } from 'auth-astro/server';

// export const AuthJsBackendAuthProvider = (authOptions = authConfig) => {
//   const authProvider: CustomBackendAuthProvider = {
//     initialize: async () => {
//       if (!authOptions.providers?.length) {
//         throw new Error('No auth providers specified');
//       }
//       const [provider, ...rest] = authOptions.providers;
//       if (rest.length > 0 || provider.name !== TINA_CREDENTIALS_PROVIDER_NAME) {
//         console.warn(
//           `WARNING: Catch-all API route ['/api/tina/*'] with specified Auth.js provider ['${provider.name}'] not supported. See https://tina.io/docs/self-hosted/overview/#customprovider for more information.`,
//         );
//       }
//     },
//     isAuthorized: async (req: Request) => {
//       const session = await getSession(req, authOptions);
//       console.log({ session });
//
//       if (!session?.user) {
//         return {
//           errorCode: 401,
//           errorMessage: 'Unauthorized',
//           isAuthorized: false,
//         };
//       }
//       if ((session.user as any).role !== 'user') {
//         return {
//           errorCode: 403,
//           errorMessage: 'Forbidden',
//           isAuthorized: false,
//         };
//       }
//       return { isAuthorized: true };
//     },
//     extraRoutes: {
//       auth: {
//         secure: false,
//         handler: async (context: APIContext) => {
//           const { request } = context;
//           const url = new URL(request.url);
//
//           // Extract next auth sub routes
//           const authSubRoutes = url.pathname
//             .replace(`${context.locals.basePath}auth/`, '') // basePath always has leading and trailing slash
//             .split('/');
//
//           // This is required for NextAuth to work properly
//           // @ts-ignore
//           request.query = { nextauth: authSubRoutes };
//
//           return AstroAuth(authOptions);
//         },
//       },
//     },
//   };
//   return authProvider;
// };
export const AuthJsBackendAuthProvider = ({
  authOptions,
}: {
  authOptions: ConstructorParameters<typeof Lucia>[1];
}) => {
  const authProvider: CustomBackendAuthProvider = {
    initialize: async () => { },
    isAuthorized: async (ctx: APIContext) => {
      const sessionId = ctx.cookies.get(lucia.sessionCookieName)?.value ?? null;

      if (!sessionId) {
        ctx.locals.user = null;
        ctx.locals.session = null;

        return {
          errorCode: 401,
          errorMessage: 'Unauthorized',
          isAuthorized: false,
        };
      }

      const { session, user } = await lucia.validateSession(sessionId);
      if (!session || !user) {
        return {
          errorCode: 401,
          errorMessage: 'Unauthorized',
          isAuthorized: false,
        };
      }

      // if (user.role !== 'user') {
      //   return {
      //     errorCode: 403,
      //     errorMessage: 'Forbidden',
      //     isAuthorized: false,
      //   };
      // }
      return { isAuthorized: true };
    },
    extraRoutes: {
      auth: {
        secure: false,
        handler: async (context: APIContext) => {
          const { request, cookies } = context;
          const url = new URL(request.url);
          const action = url.pathname.split('/').pop();

          let response;
          switch (action) {
            case 'callback':
              // response = await lucia.handleOAuthCallback(request);
              break;
            case 'signin':
              response = await lucia.handleSignIn(request);
              break;
            case 'signout':
              response = await lucia.handleSignOut(request);
              break;
            case 'session':
              response = await lucia.handleSession(request);
              break;
            default:
              return new Response(null, { status: 404 });
          }

          if (response.cookies) {
            response.cookies.forEach((cookie) => {
              const { name, value, ...options } = parseString(cookie);
              cookies.set(name, value, options as Parameters<(typeof cookies)['set']>[2]);
            });
          }

          return new Response(response.body, {
            headers: response.headers,
            status: response.status,
            statusText: response.statusText,
          });
        },
      },
    },
  };
  return authProvider;
};
