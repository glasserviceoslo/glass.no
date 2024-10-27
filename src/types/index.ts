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

export type MenuItem = {
  item: { discriminant: 'page' | 'post' | 'glasstype' | 'custom'; value: string };
  navigationTitle: string;
  children?: MenuItem[];
  grandchildren?: MenuItem[];
};

export type MenuItems = MenuItem[];

export interface ParsedContent {
  title: string;
  image: string;
  imageAlt: string;
  text: string;
  href?: string;
  anchorText?: string;
}
