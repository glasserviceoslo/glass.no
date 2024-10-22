import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.glass.no',
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
  ],
  output: 'hybrid',
  adapter: node({
    mode: 'standalone',
  }),
});
