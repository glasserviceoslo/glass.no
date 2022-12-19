import { parseISO, format } from 'date-fns';
import createImageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const builder = createImageUrlBuilder({ projectId: 'csbn9wp4', dataset: 'glassno' });

export function formatBlogPostDate(date: string) {
  const dateString = parseISO(date);
  const formattedDateString = format(dateString, 'MMMM do, yyyy');
  return formattedDateString;
}

export const getSanityImageURL = (source: SanityImageSource) => builder.image(source).auto('format').fit('max');
