import { type PortableTextComponents, toHTML } from '@portabletext/to-html';
import { getSanityImageURL, removeExt } from './sanity.image';
import type { PortableTextBlock, PortableTextChild } from 'sanity';

// Default Portable Text to HTML
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

export const sanityPortableText = (portabletext: any) => {
  return toHTML(portabletext, { components: customComponents });
};

// For Features Section
const featuresComp: PortableTextComponents = {
  block: {
    normal: ({ children, value }) => {
      if (children?.length === 0) {
        return '';
      }
      return `<p>${children}</p>`;
    },
    h2: ({ children, value }) => {
      if (children?.length === 0) {
        return '';
      }
      return `<h2>${children}</h2>`;
    },
  },
  types: {
    image: ({ value }) => {
      if (!value.asset._id.endsWith('svg')) {
        return '';
      }
      return `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <image xlink:href="${getSanityImageURL(value.asset).url()}" />
        </svg>
      `;
    },
  },
  marks: {
    internalLink: ({ children, value }) => {
      // console.log('🚀 ~ file: sanity.portableText.ts:83 ~ children', children);
      return `<a href="/posts/${value.slug.current}">${children}</a>`;
    },
  },
};

export const featuresToHtml = (portabletext: any) => {
  return toHTML(portabletext, { components: featuresComp });
};

const defaults = { nonTextBehavior: 'remove' };

export const blocksToText = (blocks: PortableTextBlock[], opts = {}) => {
  const options = Object.assign({}, defaults, opts);
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return options.nonTextBehavior === 'remove' ? '' : `[${block._type} block]`;
      }

      return (block.children as PortableTextChild[]).map((child) => child.text).join('');
    })
    .join('\n\n');
};
