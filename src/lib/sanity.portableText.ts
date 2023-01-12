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
        <figure class="w-full overflow-hidden shadow rounded">
          <picture>
            <source
              srcset="${getSanityImageURL(value.asset).format('webp').url()}"
              type="image/webp"
            />
            <img
            class="w-full relative hover:scale-105 transition-all ease-in-out duration-300"
              src="${getSanityImageURL(value.asset).url()}"
              alt="${value.asset.altText || removeExt(value.asset.originalFilename)}"
            />
          </picture>
        </figure>
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
