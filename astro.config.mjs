import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
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
    react(),
    svelte(),
  ],
  server: {
    port: 5001,
  },
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});
