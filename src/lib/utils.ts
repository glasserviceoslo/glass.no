import type { MenuItems, ParsedContent } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import parse from 'node-html-parser';
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

export function getExcerpt(content: string, length = 100) {
  const postContent = content
    .replace(/^\s*$(?:\r\n?|\n)/gm, '')
    .split('\n')
    .filter((line) => !line.startsWith('#') && !line.startsWith('['))
    .join(' ');

  return `${postContent.substring(0, length).trim()}...`;
}

export function parseContainerContent(htmlContent: string): ParsedContent {
  const root = parse(htmlContent);
  const title = root.querySelector('h3')?.textContent?.trim() || '';
  const img = root.querySelector('img');
  const image = img?.getAttribute('src') || '/assets/placeholder.jpg';
  const imageAlt = img?.getAttribute('alt') || title;
  const paragraphs = root.querySelectorAll('p');

  let href: string | undefined;
  let anchorText: string | undefined;
  const link = root.querySelector('p a');
  href = link?.attributes?.href;
  anchorText = link?.textContent;

  const text = paragraphs
    .map((node) => {
      if (anchorText) {
        return node.textContent.replace(anchorText, '');
      }
      return node.textContent;
    })
    .join(' ')
    .trim();

  return { title, image, imageAlt, text, href, anchorText };
}
