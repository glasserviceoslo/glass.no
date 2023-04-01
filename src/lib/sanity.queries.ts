const postFields = `
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

export const settingsQuery = `*[_type == "settings"][0]`;

export const indexQuery = `
*[_type == "post" && isPage != true] | order(date desc, _updatedAt desc) 
{
  ${postFields}
}`;

export const pagesQuery = `
*[_type == "post" && isPage == true] | order(date desc, _updatedAt desc) 
{
  ${postFields}
}`;

export const latestPostsQuery = `*[_type == "post"] | order(_createdAt desc) [$from...$to] {${postFields}}`;

export const postAndMoreStoriesQuery = `
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

export const categoriesQuery = `*[_type == 'category'] 
{
  _id,
  description,
  title,
  "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
    ${postFields}
  }
}`;

export const docSlugsQuery = `
*[_type == $type && defined(slug.current)][].slug.current
`;

export const docBySlugQuery = `
*[_type == $type && slug.current == $slug][0] {
  ${postFields}
}
`;

export interface Author {
  name?: string;
  picture?: any;
}

export interface Category {
  _id: string;
  title?: string;
  description?: string;
  posts: Post[];
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
