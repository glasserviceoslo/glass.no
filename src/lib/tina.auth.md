import type { CustomBackendAuthProvider } from '$types';
import type { APIContext } from 'astro';
import type { Lucia } from 'lucia';
import { lucia } from './auth';
import { AbstractAuthProvider } from 'tinacms';
import { UserModel } from './db';
import dbConnect from './mongoose';

export class CustomAuthProvider extends AbstractAuthProvider {
  // constructor() {
  //   super();
  //   // Do any setup here
  // }

  async authenticate({ username, password }: { username: string; password: string }): Promise<any> {
    try {
      // Retrieve user from your database (replace with your own user retrieval logic)
      await dbConnect();
      const user = await UserModel.findOne({ username: username });
      if (!user) {
        throw new Error('Invalid username or password');
      }

      // Verify the password
      // const passwordMatch = await .verify(password, user.password);
      // if (!passwordMatch) {
      //   throw new Error('Invalid username or password');
      // }

      // Create a new session for the authenticated user
      const session = await lucia.createSession(user.id, {});

      // Create a session cookie
      const sessionCookie = lucia.createSessionCookie(session.id);

      // Return the session, user, and session cookie
      return { session, user, sessionCookie };
    } catch (error) {
      console.error('Authentication error:', error);
      throw new Error('Invalid username or password');
    }
  }

  async getToken() {
    // Return the token from the session cookie
    const sessionId = this.getSessionIdFromCookies();
    if (sessionId) {
      const { session } = await lucia.validateSession(sessionId);
      return session?.id || null;
    }
    return null;
  }

  async getUser() {
    // Check if the user is logged in by validating the session
    const sessionId = this.getSessionIdFromCookies();
    if (sessionId) {
      const { user } = await lucia.validateSession(sessionId);
      return user || null;
    }
    return null;
  }

  async logout() {
    // Invalidate the session
    const sessionId = this.getSessionIdFromCookies();
    if (sessionId) {
      await lucia.invalidateSession(sessionId);
      this.clearSessionCookies();
    }
  }

  async authorize(context?: any): Promise<any> {
    // Implement any authorization logic here
    const user = await this.getUser();
    if (user) {
      // Perform authorization checks
      return true; // or return specific user roles/permissions
    }
    return false;
  }

  private getSessionIdFromCookies() {
    // Implement logic to get session ID from cookies
    // Example:
    const cookies = document.cookie.split('; ');
    const sessionCookie = cookies.find((cookie) => cookie.startsWith(lucia.sessionCookieName));
    return sessionCookie ? sessionCookie.split('=')[1] : null;
  }

  private clearSessionCookies() {
    // Implement logic to clear session cookies
    // Example:
    document.cookie = `${lucia.sessionCookieName}=; Max-Age=0; path=/;`;
  }
}

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
export const LuciaBackendAuth = ({
  authOptions,
}: {
  authOptions: ConstructorParameters<typeof Lucia>[1];
}) => {
  const authProvider: CustomBackendAuthProvider = {
    initialize: async () => {},
    isAuthorized: async (ctx: APIContext) => {
      const sessionId = ctx.cookies.get(lucia.sessionCookieName)?.value ?? null;
      console.log({ sessionId });

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
              console.log('callback');
              // response = await lucia.handleOAuthCallback(request);
              break;
            case 'signin':
              console.log('signin');
              // response = await lucia.handleSignIn(request);
              break;
            case 'signout':
              console.log('signout');
              // response = await lucia.handleSignOut(request);
              break;
            case 'session':
              console.log('session');
              // response = await lucia.handleSession(request);
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
