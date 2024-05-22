import { AstroAuth, getSession } from '$auth/server';
import type { CustomBackendAuthProvider } from '$types';
import type { AuthConfig } from '@auth/core';

export const AstroAuthBackend = (authOptions: AuthConfig) => {
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

      return { isAuthorized: true };
    },
    extraRoutes: {
      auth: {
        secure: false,
        handler: async (ctx) => {
          const { GET, POST } = AstroAuth();

          if (ctx.request.method === 'GET') {
            return GET(ctx);
          }

          if (ctx.request.method === 'POST') {
            return POST(ctx);
          }
        },
      },
    },
  };
  return authProvider;
};
