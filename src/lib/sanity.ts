import { parseISO, format } from 'date-fns';
import { useSanityClient, createImageBuilder } from 'astro-sanity';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const builder = createImageBuilder(useSanityClient());

export function formatBlogPostDate(date: string) {
  const dateString = parseISO(date);
  const formattedDateString = format(dateString, 'MMMM do, yyyy');
  return formattedDateString;
}

export function getSanityImageURL(source: SanityImageSource) {
  return builder.image(source);
}
