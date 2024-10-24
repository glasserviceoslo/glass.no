import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';
import { join } from 'node:path';
import { readdirSync, readFileSync } from 'node:fs';
import matter from 'gray-matter';

import sitemap from '@astrojs/sitemap';

const contentDir = join(import.meta.dirname, 'src', 'content');
const siteUrl = 'https://www.glass.no';

function getRoutes(directory: string, prefix: string = '') {
  return readdirSync(join(contentDir, directory))
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const content = readFileSync(join(contentDir, directory, file), 'utf-8');
      const { data } = matter(content);
      const slug = file.replace('.mdx', '');

      if (data.navigationTitle) {
        switch (directory) {
          case 'pages':
            return `${prefix}/${slug}`;
          case 'posts':
            return `${prefix}/posts/${slug}`;
          case 'glasstypes':
            return `${prefix}/glasstyper/${slug}`;
          default:
            return `${prefix}/${slug.toLowerCase().replace(/\s+/g, '-')}`;
        }
      }
      return null;
    })
    .filter(Boolean);
}

const pageRoutes = getRoutes('pages', siteUrl);
const postRoutes = getRoutes('posts', siteUrl);
const glasstypeRoutes = getRoutes('glasstypes', siteUrl);

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  vite: {
    build: {
      rollupOptions: {
        external: ['path', 'url'],
      },
    },
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    react({ experimentalReactChildren: true }),
    svelte(),
    mdx(),
    keystatic(),
    sitemap({
      customPages: [...pageRoutes, ...postRoutes, ...glasstypeRoutes].filter(Boolean) as string[],
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date('2024-10-22'),
    }),
  ],
  output: 'hybrid',
  adapter: node({
    mode: 'standalone',
  }),
});
