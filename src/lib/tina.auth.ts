import { getSession, AstroAuth } from 'auth-astro/server';
import type { CustomBackendAuthProvider } from '$types';

export const AstroAuthBackend = (authOptions: ANY) => {
  const authProvider: CustomBackendAuthProvider = {
    initialize: async () => {
      if (!authOptions.providers?.length) {
        throw new Error('No auth providers specified');
      }
      // const [provider, ...rest] = authOptions.providers;
      // if (rest.length > 0 || provider.name !== TINA_CREDENTIALS_PROVIDER_NAME) {
      //   console.warn(
      //     `WARNING: Catch-all API route ['/api/tina/*'] with specified Auth.js provider ['${provider.name}'] not supported. See https://tina.io/docs/self-hosted/overview/#customprovider for more information.`,
      //   );
      // }
    },
    isAuthorized: async (ctx) => {
      const session = await getSession(ctx.request);

      if (!session?.user) {
        return {
          errorCode: 401,
          errorMessage: 'Unauthorized',
          isAuthorized: false,
        };
      }
      if ((session.user as any).role !== 'user') {
        return {
          errorCode: 403,
          errorMessage: 'Forbidden',
          isAuthorized: false,
        };
      }
      return { isAuthorized: true };
    },
    extraRoutes: {
      auth: {
        secure: false,
        handler: async (context) => {
          const { request } = context;
          const url = new URL(request.url);

          // Extract next auth sub routes
          // const authSubRoutes = url.pathname
          //   .replace(`${context.locals.basePath}auth/`, '') // basePath always has leading and trailing slash
          //   .split('/');

          // This is required for NextAuth to work properly
          // @ts-ignore
          // request.query = { nextauth: authSubRoutes };

          const { GET, POST } = AstroAuth(authOptions);

          if (request.method === 'GET') {
            return GET(context);
          } else if (request.method === 'POST') {
            return POST(context);
          }
        },
      },
    },
  };
  return authProvider;
};
