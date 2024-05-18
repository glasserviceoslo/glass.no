import { LocalBackendAuthProvider } from '@tinacms/datalayer';
import databaseClient from '$tina/__generated__/databaseClient';
import type { APIContext, APIRoute } from 'astro';

type DatabaseClient = typeof databaseClient;

type Routes = { [key: string]: { handler: (req: Request, opts: ANY) => Promise<ANY>; secure: boolean } };

interface CustomBackendAuthProvider {
  initialize?: () => Promise<void>;
  isAuthorized: (
    req: Request,
  ) => Promise<{ isAuthorized: true } | { isAuthorized: false; errorMessage: string; errorCode: number }>;
  extraRoutes?: Routes;
}

export interface CustomTinaBackendOptions {
  databaseClient: DatabaseClient;
  authProvider: CustomBackendAuthProvider;
  options?: {
    basePath?: string;
  };
}

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

function CustomTinaNodeBackend({ authProvider, databaseClient, options }: CustomTinaBackendOptions) {
  const { initialize, isAuthorized, extraRoutes } = authProvider;
  initialize?.().catch((e) => {
    console.error(e);
  });

  const basePath = options?.basePath ? `/${options.basePath.replace(/^\/?/, '').replace(/\/?$/, '')}/` : '/api/tina/';

  const opts = { basePath };

  const handler = MakeNodeApiHandler({
    isAuthorized,
    extraRoutes,
    databaseClient,
    opts,
  });

  return handler;
}

function MakeNodeApiHandler({
  isAuthorized,
  extraRoutes,
  databaseClient,
  opts,
}: {
  isAuthorized: (req: Request) => Promise<{ isAuthorized: boolean; errorCode?: number; errorMessage?: string }>;
  extraRoutes?: Routes;
  databaseClient: DatabaseClient;
  opts: { basePath: string };
}) {
  const tinaBackendHandler: APIRoute = async ({ request, url }: APIContext) => {
    const path = url.pathname.replace(opts.basePath, '');
    const routes = path.split('/').filter(Boolean);

    if (!routes.length) {
      return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });
    }

    const allRoutes: Routes = {
      gql: {
        handler: async (req, opts) => {
          if (req.method !== 'POST') {
            return new Response(
              JSON.stringify({ error: 'Method not allowed. Only POST requests are supported by /gql' }),
              { status: 405 },
            );
          }

          const body = await req.json();
          const { query, variables } = body;

          if (!query || !variables) {
            return new Response(JSON.stringify({ error: 'no query or variables' }), { status: 400 });
          }

          const result = await databaseClient.request({ query, variables, user: null });

          return new Response(JSON.stringify(result), { status: 200 });
        },
        secure: true,
      },
      ...(extraRoutes || {}),
    };

    const [action] = routes;
    const currentRoute = allRoutes[action];

    if (!currentRoute) {
      return new Response(JSON.stringify({ error: `${action} not found in routes` }), { status: 404 });
    }

    const { handler, secure } = currentRoute;
    if (secure) {
      const isAuth = await isAuthorized(request);
      if (!isAuth.isAuthorized) {
        return new Response(JSON.stringify({ error: isAuth.errorMessage || 'not authorized' }), {
          status: isAuth.errorCode || 401,
        });
      }
    }

    return handler(request, opts);
  };

  return tinaBackendHandler;
}

export const customHandler = CustomTinaNodeBackend({
  authProvider: LocalBackendAuthProvider() as unknown as CustomBackendAuthProvider,
  // authProvider: isLocal
  //   ? LocalBackendAuthProvider()
  //   : AuthJsBackendAuthProvider({
  //     authOptions: TinaAuthJSOptions({
  //       databaseClient,
  //       secret: process.env.NEXTAUTH_SECRET as string,
  //     }),
  //   }),
  databaseClient,
});

const handleRequest: APIRoute = async (context) => customHandler(context);

export const GET = handleRequest;
export const POST = handleRequest;
export const ALL = handleRequest;
