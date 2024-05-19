import { Lucia } from 'lucia';
import type { Session, User } from 'lucia';
import { adapter, UserModel } from './db';
import type { APIContext } from 'astro';
import dbConnect from './mongoose';

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes: any) => {
    return {
      username: attributes.username,
    };
  },
});

export const validateRequest = async (
  ctx: APIContext,
): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
  const sessionId = ctx.cookies.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      ctx.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      ctx.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch { }
  return result;
};

// export async function signup(ctx: APIContext, formData: FormData) {
//   const username = formData.get('username');
//   const password = formData.get('password');
//
//   if (!username || !password) {
//     return {
//       error: 'Username and password are required',
//     };
//   }
//
//   const hashedPassword = await new Argon2id().hash(password.toString());
//
//   try {
//     await dbConnect();
//     const user = await UserModel.create({
//       username: username,
//       password: hashedPassword,
//     });
//
//     const session = await lucia.createSession(user._id, {});
//     const sessionCookie = lucia.createSessionCookie(session.id);
//     ctx.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
//   } catch (e) {
//     console.log('error', e);
//     return {
//       error: 'An unknown error occurred',
//     };
//   }
//   return ctx.redirect('/');
// }
//
// export async function login(ctx: APIContext, formData: FormData) {
//   const username = formData.get('username');
//   const password = formData.get('password');
//
//   if (!username || !password) {
//     return {
//       error: 'Username and password are required',
//     };
//   }
//
//   await dbConnect();
//   const existingUser = await UserModel.findOne({ username: username });
//
//   const validPassword = await new Argon2id().verify(existingUser.password, password.toString());
//
//   if (!validPassword) {
//     return {
//       error: 'Invalid credentials',
//     };
//   }
//
//   const session = await lucia.createSession(existingUser._id, {});
//   const sessionCookie = lucia.createSessionCookie(session.id);
//   ctx.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
//   return ctx.redirect('/');
// }

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
  }
}
