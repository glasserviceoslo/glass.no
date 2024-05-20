import type { AuthConfig } from '@auth/core';
import GitHub from '@auth/core/providers/github';

export const config: AuthConfig = {
  basePath: '/api/auth',
  providers: [
    // Google({
    //   clientId: import.meta.env.GOOGLE_CLIENT_ID,
    //   clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
    // }),
    GitHub({
      clientId: import.meta.env?.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env?.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: import.meta.env?.AUTH_SECRET,
};
