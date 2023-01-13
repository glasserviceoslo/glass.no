import createImageUrlBuilder from '@sanity/image-url';
import { dataset, projectId } from './sanity.api';
import { getPostBySlug } from './sanity.client';
import type { Image } from './sanity.queries';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { ImgSources } from '$types';

const builder = createImageUrlBuilder({ projectId, dataset });

export const getSanityImageURL = (source: SanityImageSource) => builder.image(source).auto('format').fit('max');

export const removeExt = (filename: string) => filename.split('.').slice(0, -1).join('');

export const parseImages = async (slug: string): Promise<ImgSources[]> =>
  (await getPostBySlug(slug)).body
    .filter((b: any) => b._type === 'image')
    .map((image: Image) => ({
      default: getSanityImageURL(image.asset).quality(100).url(),
      large: getSanityImageURL(image.asset).format('webp').width(2000).url(),
      small: getSanityImageURL(image.asset).format('webp').width(450).url(),
      altText: image.asset.altText || removeExt(image.asset.originalFilename),
    }));
