import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import netlify from '@astrojs/netlify/functions';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';

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
  adapter: netlify(),
});
