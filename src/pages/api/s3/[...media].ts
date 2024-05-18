import { deleteAsset, listMedia, uploadMedia } from '$lib/tina.mediaHandler';
import { S3Client } from '@aws-sdk/client-s3';
import type { APIRoute } from 'astro';

const bucket = process.env.S3_BUCKET || '';
const region = process.env.S3_REGION || 'het-fin-1';
let mediaRoot = '';
if (mediaRoot) {
  if (!mediaRoot.endsWith('/')) {
    mediaRoot = `${mediaRoot}/`;
  }
  if (mediaRoot.startsWith('/')) {
    mediaRoot = mediaRoot.substr(1);
  }
}

const endpoint = 'https://storage-api.glass.no';

const client = new S3Client({
  endpoint,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
  region,
  forcePathStyle: true,
});

export const GET: APIRoute = ({ request }) => {
  return listMedia(request, client, bucket, mediaRoot, endpoint);
};

export const POST: APIRoute = ({ request }) => {
  return uploadMedia(request, client, bucket, mediaRoot, endpoint);
};

export const DELETE: APIRoute = ({ request }) => {
  return deleteAsset(request, client, bucket);
};
