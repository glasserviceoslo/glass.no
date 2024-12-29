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
import { redirects } from './src/assets/redirects.json' with { type: 'json' };

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

const astroRedirects = redirects.reduce(
  (acc, redirect) => {
    const { from, to } = redirect;

    if (acc[from]) {
      console.warn(
        `Warning: Duplicate redirect found for path "${from}". ` +
          `Original: "${acc[from].destination}", New: "${to.value.redirectTo}". ` +
          `Using the latest definition.`,
      );
    }

    let destination = to.value.redirectTo;
    switch (to.discriminant) {
      case 'pages':
      case 'posts':
        destination = `/${to.value.redirectTo}`;
        break;
      case 'glasstypes':
        destination = `/glasstyper/${to.value.redirectTo}`;
        break;
      case 'custom':
        destination = to.value.redirectTo;
        break;
    }

    if (from !== destination) {
      acc[from] = {
        status: to.value.status,
        destination,
      };
    } else {
      console.warn(`Warning: Skipping redirect from "${from}" to "${destination}" ` + `to prevent redirect loop.`);
    }

    return acc;
  },
  {} as Record<string, { status: number; destination: string }>,
);

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  server: {
    headers: {
      // CORS headers
      // 'Access-Control-Allow-Origin': 'https://*.glass.no',
      // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      // 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      // 'Access-Control-Allow-Credentials': 'true',
      // // Security headers
      // 'Cross-Origin-Opener-Policy': 'same-origin-allow-popups', // Less restrictive than 'same-origin' to allow third-party auth
      // 'Cross-Origin-Embedder-Policy': 'require-corp',
      // 'Cross-Origin-Resource-Policy': 'cross-origin', // Allow resources from subdomains
      // Standard security headers
      // 'X-Content-Type-Options': 'nosniff',
      // 'X-Frame-Options': 'SAMEORIGIN',
      // 'X-XSS-Protection': '1; mode=block',
      // 'Referrer-Policy': 'strict-origin-when-cross-origin',
      // // HSTS (Strict Transport Security)
      // 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      // Content Security Policy - more permissive for subdomains
      //   'Content-Security-Policy': `
      //     default-src 'self' https://*.glass.no;
      //     script-src 'self' https://*.glass.no 'unsafe-inline';
      //     style-src 'self' https://*.glass.no 'unsafe-inline';
      //     img-src 'self' https://*.glass.no data: blob:;
      //     font-src 'self' https://*.glass.no;
      //     connect-src 'self' https://*.glass.no;
      //     media-src 'self' https://*.glass.no;
      //     object-src 'none';
      //     frame-src 'self' https://*.glass.no;
      //     base-uri 'self';
      //     form-action 'self' https://*.glass.no;
      //     frame-ancestors 'self';
      //     upgrade-insecure-requests;
      //   `
      //     .replace(/\s+/g, ' ')
      //     .trim(),
    },
  },
  redirects: {
    ...astroRedirects,
    '/posts/[slug]': '/[slug]',
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
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  output: 'hybrid',
  adapter: node({
    mode: 'standalone',
  }),
});
