import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import image from '@astrojs/image';
import node from '@astrojs/node';
import solidJs from '@astrojs/solid-js';
import react from '@astrojs/react';

// https://astro.build/config
import svelte from '@astrojs/svelte';

// https://astro.build/config

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
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
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
  adapter: node({
    mode: 'standalone',
  }),
});
