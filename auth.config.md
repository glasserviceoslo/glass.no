// import clientPromise from '$lib/db';
import type { Adapter } from '@auth/core/adapters';
// import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
// import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { defineConfig } from 'auth-astro';

export default defineConfig({
  // adapter: MongoDBAdapter(clientPromise) as Adapter,
  providers: [
    Google({
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
    }),
    // GitHub({
    //   clientId: import.meta.env.GITHUB_CLIENT_ID,
    //   clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    // }),
  ],
});
