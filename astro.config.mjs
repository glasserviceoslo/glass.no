import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import netlify from '@astrojs/netlify/functions';
import image from '@astrojs/image';
import solidJs from '@astrojs/solid-js';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';

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
  adapter: netlify(),
});
