import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import sanity from 'astro-sanity';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sanity({
      projectId: 'csbn9wp4',
      dataset: 'glassno',
      apiVersion: '2021-10-21',
      useCdn: false,
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  output: 'server',
  server: {
    port: 3001,
  },
  adapter: node({
    mode: 'middleware',
  }),
});
