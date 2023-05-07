import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId, useCdn } from '$lib/sanity.api';
import {
  type Page,
  type Post,
  type Settings,
  indexQuery,
  postAndMoreStoriesQuery,
  docBySlugQuery,
  docSlugsQuery,
  settingsQuery,
  categoriesQuery,
  Category,
  pagesQuery,
  latestPostsQuery,
  DocType,
  pageBySlugQuery,
} from '$lib/sanity.queries';

const client = projectId ? createClient({ projectId, dataset, apiVersion, useCdn }) : null;

export async function getSettings(): Promise<Settings> {
  if (client) {
    return (await client.fetch(settingsQuery)) || {};
  }
  return {};
}

export async function getAllPosts(): Promise<Post[]> {
  if (client) {
    return (await client.fetch(indexQuery)) || [];
  }
  return [];
}

export async function getAllPages(isNavElement: boolean): Promise<Page[]> {
  if (client) {
    return (await client.fetch(pagesQuery, { isNavElement })) || [];
  }
  return [];
}

export async function getLatestPosts(from: number, to: number): Promise<Post[]> {
  if (client) {
    return (await client.fetch(latestPostsQuery, { from, to })) || [];
  }
  return [];
}

export async function getAllDocsSlugs(type: DocType = 'posts'): Promise<Pick<Post, 'slug'>[]> {
  if (client) {
    const slugs = (await client.fetch<string[]>(docSlugsQuery, { type })) || [];
    return slugs.map((slug) => ({ slug }));
  }
  return [];
}

export async function getAllCategoriesWithPosts(): Promise<Category[]> {
  if (client) {
    return (await client.fetch(categoriesQuery)) || [];
  }
  return [];
}

export async function getDocBySlug(slug: string, type: DocType = 'posts', isNavElement = false): Promise<Post> {
  if (client) {
    if (type === 'pages') {
      return (await client.fetch(pageBySlugQuery, { slug, type, isNavElement })) || {};
    }
    return (await client.fetch(docBySlugQuery, { slug, type })) || {};
  }
  return {} as any;
}

export async function getPostAndMoreStories(
  slug: string,
  token?: string | null,
): Promise<{ post: Post | null; morePosts: Post[] }> {
  if (projectId) {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token: token || undefined,
    });
    return await client.fetch(postAndMoreStoriesQuery, { slug });
  }
  return { post: null, morePosts: [] };
}
