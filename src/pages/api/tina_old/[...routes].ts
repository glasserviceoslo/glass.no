import { IncomingMessage, ServerResponse } from 'node:http';
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
// import { TinaAuthJSOptions, AuthJsBackendAuthProvider } from 'tinacms-authjs/dist';
import databaseClient from '$tina/__generated__/databaseClient';
import type { APIRoute } from 'astro';
import { Socket } from 'node:net';
import pkg from 'tinacms-authjs/dist/tinacms';
const { DefaultAuthJSProvider } = pkg;

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

export const tinaBackend = TinaNodeBackend({
  authProvider: LocalBackendAuthProvider(),
  // authProvider: isLocal
  //   ? LocalBackendAuthProvider()
  //   : AuthJsBackendAuthProvider({
  //     authOptions: TinaAuthJSOptions({
  //       databaseClient,
  //       secret: process.env.NEXTAUTH_SECRET as string,
  //     }),
  //   }),
  databaseClient,
});

class MockSocket extends Socket {
  constructor() {
    super({});
  }
}

async function readRequestBody(request: Request): Promise<Buffer> {
  const reader = request.body?.getReader();
  const chunks = [];
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
      }
    }
  }
  return Buffer.concat(chunks);
}

async function createIncomingMessage(request: Request): Promise<IncomingMessage> {
  const { method, headers } = request;

  const url = new URL(request.url);
  const socket = new MockSocket();
  const req = new IncomingMessage(socket);

  req.method = method;
  req.url = url.pathname + url.search;
  req.headers = Object.fromEntries(headers.entries());

  const bodyBuffer = await readRequestBody(request);
  if (bodyBuffer.length > 0) {
    req.push(bodyBuffer);
  }
  req.push(null);

  return req;
}

function createServerResponse(): { res: ServerResponse; promise: Promise<Response> } {
  const chunks: Buffer[] = [];
  const socket = new MockSocket();
  const res = new ServerResponse(new IncomingMessage(socket));

  const responsePromise = new Promise<Response>((resolve) => {
    res.on('finish', () => {
      const body = Buffer.concat(chunks).toString();
      const headers = res.getHeaders();
      resolve(new Response(body, { status: res.statusCode || 200, headers: headers as Record<string, string> }));
    });
  });

  res.write = (chunk: Buffer) => {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    return true;
  };

  return { res, promise: responsePromise };
}

async function astroToNodeHandler(request: Request): Promise<Response> {
  const req = await createIncomingMessage(request);
  const { res, promise } = createServerResponse();

  await tinaBackend(req, res);

  res.end();
  return promise;
}

export const GET: APIRoute = async ({ request }) => {
  return astroToNodeHandler(request);
};

export const POST: APIRoute = async ({ request }) => {
  return astroToNodeHandler(request);
};
