import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import netlify from '@astrojs/netlify/functions';
import solidJs from '@astrojs/solid-js';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';

export default defineConfig({
  experimental: {
    assets: true,
  },
  site: 'https://glass.no',
  sitemap: true,
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    solidJs(),
    react(),
    svelte(),
  ],
  server: {
    port: 5001,
  },
  output: 'server',
  adapter: netlify(),
});
