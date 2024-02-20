import express from 'express';
import cors from 'cors';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const PORT = process.env.PORT || 5001;
const URL = process.env.URL || `http://localhost:${PORT}`;

const app = express();
const base = '/';

app.use(base, express.static('dist/client/'));
app.use(cors(), ssrHandler);

app.listen(PORT, () => console.log(`Listening on ${URL}`));
