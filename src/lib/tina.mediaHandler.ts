import {
  type _Object,
  type PutObjectCommandInput,
  type ListObjectsCommandInput,
  type DeleteObjectCommandInput,
  type S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import type { Media, MediaListOptions } from 'tinacms';
import path from 'node:path';

export async function uploadMedia(
  request: Request,
  client: S3Client,
  bucket: string,
  mediaRoot: string,
  cdnUrl: string,
): Promise<Response> {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const directory = formData.get('directory') as string;

  if (!file || !directory) {
    return new Response(JSON.stringify({ error: 'File or directory not provided' }), { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const blob = Buffer.from(buffer);
  const filename = file.name;

  let prefix = directory.replace(/^\//, '').replace(/\/$/, '');
  if (prefix) prefix = `${prefix}/`;

  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: mediaRoot ? path.join(mediaRoot, prefix + filename) : prefix + filename,
    Body: blob,
    ACL: 'public-read',
  };
  const command = new PutObjectCommand(params);

  try {
    await client.send(command);
    const src = cdnUrl + prefix + filename;
    return new Response(
      JSON.stringify({
        type: 'file',
        id: prefix + filename,
        filename,
        directory: prefix,
        thumbnails: {
          '75x75': src,
          '400x400': src,
          '1000x1000': src,
        },
        src,
      }),
      { status: 200 },
    );
  } catch (e) {
    console.error('Error uploading media to S3:', e);
    return new Response(JSON.stringify({ error: findErrorMessage(e) }), { status: 500 });
  }
}

function stripMediaRoot(mediaRoot: string, key: string) {
  if (!mediaRoot) {
    return key;
  }
  const mediaRootParts = mediaRoot.split('/').filter((part) => part);
  if (!mediaRootParts || !mediaRootParts[0]) {
    return key;
  }
  const keyParts = key.split('/').filter((part) => part);
  for (let i = 0; i < mediaRootParts.length; i++) {
    if (keyParts[0] === mediaRootParts[i]) {
      keyParts.shift();
    }
  }
  return keyParts.join('/');
}

export async function listMedia(
  request: Request,
  client: S3Client,
  bucket: string,
  mediaRoot: string,
  cdnUrl: string,
): Promise<Response> {
  const url = new URL(request.url);
  const { directory = '', limit = '500', offset } = Object.fromEntries(url.searchParams) as unknown as MediaListOptions;

  let prefix = directory.replace(/^\//, '').replace(/\/$/, '');
  if (prefix) prefix = `${prefix}/`;

  const params: ListObjectsCommandInput = {
    Bucket: bucket,
    Delimiter: '/',
    Prefix: mediaRoot ? path.join(mediaRoot, prefix) : prefix,
    Marker: offset?.toString(),
    MaxKeys: +limit,
  };

  const command = new ListObjectsCommand(params);

  try {
    const response = await client.send(command);
    const items = [];

    for (const item of response.CommonPrefixes || []) {
      if (!item?.Prefix) {
        continue;
      }
      const strippedPrefix = stripMediaRoot(mediaRoot, item.Prefix);
      if (!strippedPrefix) {
        continue;
      }
      items.push({
        id: item.Prefix,
        type: 'dir',
        filename: path.basename(item.Prefix),
        directory: path.dirname(item.Prefix),
      });
    }

    items.push(
      ...(response.Contents || [])
        .filter((file) => {
          const strippedKey = stripMediaRoot(mediaRoot, file.Key as string);
          return strippedKey !== prefix;
        })
        .map(getS3ToTinaFunc(cdnUrl, mediaRoot)),
    );

    return new Response(JSON.stringify({ items, offset: response.NextMarker }), { status: 200 });
  } catch (e) {
    console.error('Error listing media:', e);
    return new Response(JSON.stringify({ error: findErrorMessage(e) }), { status: 500 });
  }
}

export async function deleteAsset(request: Request, client: S3Client, bucket: string): Promise<Response> {
  const url = new URL(request.url);
  const media = url.searchParams.get('media');
  if (!media) {
    return new Response(JSON.stringify({ error: 'No media provided' }), { status: 400 });
  }
  const [, objectKey] = media.split('/');

  const params: DeleteObjectCommandInput = {
    Bucket: bucket,
    Key: objectKey,
  };
  const command = new DeleteObjectCommand(params);

  try {
    const data = await client.send(command);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (e) {
    console.error('Error deleting media:', e);
    return new Response(JSON.stringify({ error: findErrorMessage(e) }), { status: 500 });
  }
}

function getS3ToTinaFunc(cdnUrl: string, mediaRoot?: string) {
  return function s3ToTina(file: _Object): Media {
    const strippedKey = stripMediaRoot(mediaRoot || '', file?.Key || '');
    const filename = path.basename(strippedKey);
    const directory = `${path.dirname(strippedKey)}/`;

    const src = cdnUrl + file.Key;
    return {
      id: file?.Key || '',
      filename,
      directory,
      src: src,
      thumbnails: {
        '75x75': src,
        '400x400': src,
        '1000x1000': src,
      },
      type: 'file',
    };
  };
}

const findErrorMessage = (e: ANY) => {
  if (typeof e === 'string') return e;
  if (e.message) return e.message;
  if (e.error?.message) return e.error.message;
  return 'an error occurred';
};
