import express from 'express';
import cors from 'cors';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const PORT = process.env.PORT || 5001;
const URL = process.env.URL || `http://localhost:${PORT}`;

const app = express();

const corsOptions = { origin: 'https://*.glass.no' };

const base = '/';
app.use(cors(corsOptions));
app.use(base, express.static('dist/client/'));
app.use(ssrHandler);

app.listen(PORT, () => console.log(`Listening on ${URL}`));
