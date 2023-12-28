import express from 'express';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const PORT = process.env.PORT || 5001;
const URL = process.env.URL || `http://localhost:${PORT}`;

const app = express();

const base = '/';
app.use(base, express.static('dist/client/'));
app.use((req, res, next) => {
  if (req.headers?.origin?.includes('glass.no')) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  }
  next();
});
app.use(ssrHandler);

app.listen(PORT, () => console.log(`Listening on ${URL}`));
