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
