// import { portableTextToHtml } from 'astro-sanity';
import { type PortableTextComponents, toHTML } from '@portabletext/to-html';
import { getSanityImageURL, removeExt } from './sanity.image';

const customComponents: PortableTextComponents = {
  types: {
    mainImage: ({ value }) => {
      return `
        <picture>
          <source
            srcset="${getSanityImageURL(value.asset).format('webp').url()}"
            type="image/webp"
          />
          <img
            src="${getSanityImageURL(value.asset).url()}"
            alt="${value.asset.altText || removeExt(value.asset.originalFilename)}"
          />
        </picture>
      `;
    },
    image: ({ value }) => {
      return `
        <picture>
          <source
            srcset="${getSanityImageURL(value.asset).format('webp').url()}"
            type="image/webp"
          />
          <img
            src="${getSanityImageURL(value.asset).url()}"
            alt="${value.asset.altText || removeExt(value.asset.originalFilename)}"
          />
        </picture>
      `;
    },
  },
  marks: {
    internalLink: ({ children, value }) => {
      return `<a href="/posts/${value.slug.current}">${children}</a>`;
    },
  },
};

export function sanityPortableText(portabletext: any) {
  return toHTML(portabletext, { components: customComponents });
}
