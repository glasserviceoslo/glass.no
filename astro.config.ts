import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import node from '@astrojs/node';
import { resolve } from 'node:path';

export default defineConfig({
  vite: {
    resolve: {
      alias: [
        { find: '$', replacement: resolve(import.meta.dirname, './src') },
        { find: '$tina', replacement: resolve(import.meta.dirname, './tina') },
      ],
    },
  },
  site: 'https://www.glass.no',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    partytown({ config: { forward: ['dataLayer.push'] } }),
    react(),
    svelte(),
  ],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});
