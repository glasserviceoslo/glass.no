const queryFields = `
  _id,
  title,
  description,
  date,
  mainImage {
    asset->{
      _id,
      "_ref":_id,
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
        "slug": @.reference-> slug,
        "type": @.reference->_type
      }
    },
    _type == "image" => {
      ...,
        asset->{
          _id,
          "_ref":_id,
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
*[_type == $type] | order(date desc, _updatedAt desc) 
{
  ${queryFields}
}`;

export const pagesQuery = `
*[_type == "pages" && ($isNavElement && navbar.isNavElement == true || !$isNavElement && navbar.isNavElement != true)] | order(date desc, _updatedAt desc) 
{
  navbar,
  ${queryFields}
}`;

export const latestPostsQuery = `*[_type == "posts"] | order(_createdAt desc) [$from...$to] {${queryFields}}`;

export const postAndMoreStoriesQuery = `
{
  "post": *[_type == "posts" && slug.current == $slug] | order(_updatedAt desc) [0] {
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
    ${queryFields}
  },
  "morePosts": *[_type == "posts" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
    body,
    ${queryFields}
  }
}`;

export const categoriesQuery = `*[_type == 'categories'] 
{
  _id,
  description,
  title,
  "posts": *[_type == "posts" && references(^._id)] | order(publishedAt desc) {
    ${queryFields}
  }
}`;

export const docSlugsQuery = `
*[_type == $type && defined(slug.current)][].slug.current
`;

export const docBySlugQuery = `
*[_type == $type && slug.current == $slug][0] {
  ${queryFields}
}
`;

export const pageBySlugQuery = `
*[_type == "pages" 
  && slug.current == $slug 
  && ($isNavElement && navbar.isNavElement == true || !$isNavElement && navbar.isNavElement != true)][0]
{
  navbar,
  ${queryFields}
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

export interface Page extends Post {
  navbar: {
    isNavElement: boolean;
    navTitle: string;
  };
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

export type DocType = 'posts' | 'pages' | 'categories' | 'settings' | 'glassTypes' | 'projects';
