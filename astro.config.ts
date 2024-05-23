import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import node from '@astrojs/node';

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
