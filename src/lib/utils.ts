import type { MenuItems } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export function extractImageUrls(body: string): { src: string; alt: string }[] {
  const imageRegex = /\[(.*?)\]\((.*?\.(?:jpg|png))\)/g;
  const matches = body.match(imageRegex) || [];
  return matches.map((match) => {
    const [_, alt, src] = match.match(/\[(.*?)\]\((.*?\.(?:jpg|png))\)/) || [];
    return { alt, src };
  });
}

export function getItemHref(item: MenuItems[number]['item']) {
  switch (item.discriminant) {
    case 'page':
      return `/${item.value}`;
    case 'post':
      return `/posts/${item.value}`;
    case 'glasstype':
      return `/glasstyper/${item.value}`;
    case 'custom':
      return `/${item.value.toLowerCase().replace(/\s+/g, '-')}`;
  }
}

export async function getExcerpt(content: string) {
  const postContent = content
    .replace(/^\s*$(?:\r\n?|\n)/gm, '')
    .split('\n')
    .filter((line) => !line.startsWith('#') && !line.startsWith('['))
    .join(' ');

  return `${postContent.substring(0, 100).trim()}...`;
}
