// import { portableTextToHtml } from 'astro-sanity';
import { toHTML } from '@portabletext/to-html';
import { getSanityImageURL } from './sanity';

const customComponents = {
  types: {
    mainImage: ({ value }: any) => {
      return `
        <picture>
          <source
            srcset="${getSanityImageURL(value.asset).format('webp').url()}"
            type="image/webp"
          />
          <img
            class="responsive__img"
            src="${getSanityImageURL(value.asset).url()}"
            alt="${value.alt}"
          />
        </picture>
      `;
    },
    image: ({ value }: any) => {
      return `
        <picture>
          <source
            srcset="${getSanityImageURL(value.asset).format('webp').url()}"
            type="image/webp"
          />
          <img
            class="responsive__img"
            src="${getSanityImageURL(value.asset).url()}"
            alt="${value.alt}"
          />
        </picture>
      `;
    },
  },
};

export function sanityPortableText(portabletext: any) {
  return toHTML(portabletext, { components: customComponents });
}
