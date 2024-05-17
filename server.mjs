import express from 'express';
import cors from 'cors';
import { handler as ssrHandler } from './dist/server/entry.mjs';
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
import { TinaAuthJSOptions, AuthJsBackendAuthProvider } from 'tinacms-authjs';
// import databaseClient from './__generated__/databaseClient';

// const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';
//
// export const tinaBackend = TinaNodeBackend({
//   authProvider: isLocal
//     ? LocalBackendAuthProvider()
//     : AuthJsBackendAuthProvider({
//       authOptions: TinaAuthJSOptions({
//         databaseClient,
//         secret: process.env.NEXTAUTH_SECRET,
//       }),
//     }),
//   databaseClient,
// });

const PORT = process.env.PORT || 5001;
const URL = process.env.URL || `http://localhost:${PORT}`;

const app = express();
const base = '/';

// app.use(express.urlencoded({ extended: true }));
app.use(base, cors({ origin: '*' }));
app.use(base, express.static('dist/client/'));

// app.get('/api/content/*', tinaBackend);
// app.post('/api/content/*', tinaBackend);

app.use(ssrHandler);

app.listen(PORT, () => console.log(`Listening on ${URL}`));
