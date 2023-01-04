import { parseISO, format } from 'date-fns';
import createImageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { dataset, projectId } from './sanity.api';

const builder = createImageUrlBuilder({ projectId, dataset });

export function formatBlogPostDate(date: string) {
  const dateString = parseISO(date);
  // const formattedDateString = format(dateString, 'MMMM, yyyy');
  // return formattedDateString;
}

export const getSanityImageURL = (source: SanityImageSource) => builder.image(source).auto('format').fit('max');

export const removeExt = (filename: string) => filename.split('.').slice(0, -1).join('');
