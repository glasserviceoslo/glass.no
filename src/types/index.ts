import type { FileWithPath } from 'react-dropzone';
import type { ImageFunction } from 'astro:content';
import type { TypeOf } from 'zod';

export type ImageObject = TypeOf<ReturnType<ImageFunction>>;

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
