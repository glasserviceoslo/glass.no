import express from 'express';
import cors from 'cors';
import { handler as ssrHandler } from './dist/server/entry.mjs';
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
import { TinaAuthJSOptions, AuthJsBackendAuthProvider } from 'tinacms-authjs';
import cookieParser from 'cookie-parser';
import databaseClient from './__generated__/client';

if (!process.env.AUTH_SECRET) {
  throw new Error('AUTH_SECRET must be defined');
}

if (!process.env.GITHUB_OWNER) {
  throw new Error('GITHUB_OWNER must be defined');
}

if (!process.env.GITHUB_REPO) {
  throw new Error('GITHUB_REPO must be defined');
}

if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
  throw new Error('GITHUB_PERSONAL_ACCESS_TOKEN must be defined');
}
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

export const tinaBackend = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({
          databaseClient,
          secret: process.env.AUTH_SECRET,
        }),
      }),
  databaseClient,
});

const PORT = process.env.PORT || 5001;
const URL = process.env.URL || `http://localhost:${PORT}`;

const app = express();
const base = '/';

app.use(base, express.static('build/client/'));
app.use(express.urlencoded({ extended: true }));
app.use(base, cors());
app.use(cookieParser());

const handleTina = async (req, res) => {
  req.query = {
    ...(req.query || {}),
    routes: req.params[0].split('/'),
  };

  await handler(req, res);
};

app.all('/api/tina/*', async (req, res, next) => {
  handleTina(req, res, next);
});

app.use(ssrHandler);
app.listen(PORT, () => console.log(`Listening on ${URL}`));
