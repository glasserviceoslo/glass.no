import express from 'express';
import cors from 'cors';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const PORT = process.env.PORT || 5001;
const URL = process.env.URL || `http://localhost:${PORT}`;

const app = express();
const base = '/';

app.use(base, cors());
app.use(base, (_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(base, express.static('dist/client/'));
app.use(ssrHandler);

app.listen(PORT, () => console.log(`Listening on ${URL}`));
