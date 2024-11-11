import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
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
          case 'posts':
            return `${prefix}/${slug}`;
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
  redirects: {
    '/posts/[slug]': '/[slug]',
    '/10-mater-a-bruke-smijern-i-ditt-hjem': {
      status: 301,
      destination: '/hvordan-bruke-smijernsdører-10-tips',
    },
    '/posts/10-mater-a-bruke-smijern-i-ditt-hjem': {
      status: 301,
      destination: '/hvordan-bruke-smijernsdører-10-tips',
    },
    '/hvordan-bruke-smijernsdører': {
      status: 301,
      destination: '/hvordan-bruke-smijernsdører-10-tips',
    },
    '/posts/glassrekverk-renovasjon-av-hjemmet-med-riktig-glassdesing': {
      status: 301,
      destination: '/glassrekkverk',
    },
    '/glassrekverk-renovasjon-av-hjemmet-med-riktig-glassdesing': {
      status: 301,
      destination: '/glassrekkverk',
    },
    '/ødelagt-vindusglass': {
      status: 301,
      destination: '/vindusglass',
    },
    '/hva-er-glassmester-copy': {
      status: 301,
      destination: '/hva-er-glassmester-copy',
    },
    '/booking': {
      status: 301,
      destination: '/befaring',
    },
  },
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
    react({ experimentalReactChildren: true }),
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
