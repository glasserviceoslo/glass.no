import type databaseClient from '$tina/__generated__/client';
import type { APIContext } from 'astro';
import type { FileWithPath } from 'react-dropzone';

export interface ImgSources {
  default: string;
  large: string;
  small: string;
  altText: string;
}

export interface FileWithPreview extends FileWithPath {
  id: string;
  preview: string;
  base64: string;
}

export type DatabaseClient = typeof databaseClient;

export type Routes = { [key: string]: { handler: (context: APIContext, opts: ANY) => Promise<ANY>; secure: boolean } };

export interface CustomBackendAuthProvider {
  initialize?: () => Promise<void>;
  isAuthorized: (
    ctx: APIContext,
  ) => Promise<{ isAuthorized: true } | { isAuthorized: false; errorMessage: string; errorCode: number }>;
  extraRoutes?: Routes;
}

export interface CustomTinaBackendOptions {
  databaseClient: DatabaseClient;
  authProvider: CustomBackendAuthProvider;
  options?: {
    basePath?: string;
  };
}
