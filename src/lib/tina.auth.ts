import { AstroAuth, getSession } from '$auth/server';
import type { CustomBackendAuthProvider } from '$types';

export const AstroAuthBackend = (authOptions: ANY) => {
  const authProvider: CustomBackendAuthProvider = {
    initialize: async () => {
      if (!authOptions.providers?.length) {
        throw new Error('No auth providers specified');
      }
    },
    isAuthorized: async (ctx) => {
      const session = ctx.locals.session || (await getSession(ctx));

      if (!session?.user) {
        return {
          errorCode: 401,
          errorMessage: 'Unauthorized',
          isAuthorized: false,
        };
      }
      if ((session.user as ANY).role !== 'user') {
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
          const { GET, POST } = AstroAuth();

          if (request.method === 'GET') {
            return GET(context);
          }

          if (request.method === 'POST') {
            return POST(context);
          }
        },
      },
    },
  };
  return authProvider;
};
