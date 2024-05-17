import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.glass.no',
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
  output: 'server',
  adapter: node({ mode: 'middleware' }),
});
