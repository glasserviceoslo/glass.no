import { groq } from '@sanity/groq-store';

const postFields = groq`
  _id,
  title,
  description,
  date,
  mainImage {
    asset->{
      _id,
      originalFilename,
      altText,
      description,
      title
    }
  },
  body[] {
    ...,
    markDefs[] {
      ...,
      _type == "internalLink" => {
        ...,
        "slug": @.reference-> slug
      }
    },
    _type == "image" => {
      ...,
        asset->{
          _id,
          _type,
          originalFilename,
          altText,
          description,
        }
    }  
  },
  "slug": slug.current,
  "author": author->{name, picture},
`;

export const settingsQuery = groq`*[_type == "settings"][0]`;

export const indexQuery = groq`
*[_type == "post" && isPage != true] | order(date desc, _updatedAt desc) 
{
  ${postFields}
}`;

export const postAndMoreStoriesQuery = groq`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    category->,
    body[] {
      ...,
      markDefs[] {
        ...,
        _type == "internalLink" => {
          ...,
          "slug": @.reference-> slug
        }
      }
    },
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
    body,
    ${postFields}
  }
}`;

export const docSlugsQuery = groq`
*[_type == $type && defined(slug.current)][].slug.current
`;

export const docBySlugQuery = groq`
*[_type == $type && slug.current == $slug][0] {
  ${postFields}
}
`;

export interface Author {
  name?: string;
  picture?: any;
}

export interface Post {
  _id: string;
  title?: string;
  mainImage?: any;
  date?: string;
  author?: Author;
  slug?: string;
  body?: any;
  categories?: any;
  description?: string;
  seoKeywords?: string[];
  seoKeyphrase?: string;
}

export interface Settings {
  title?: string;
  description?: any[];
  ogImage?: {
    title?: string;
  };
}

export interface Image {
  _key: string;
  _type: 'image';
  asset: {
    _id: string;
    _type: string;
    altText: string;
    originalFilename: string;
    description?: string;
  };
  markDefs?: any;
}
