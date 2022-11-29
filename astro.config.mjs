import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sanity from 'astro-sanity';
import partytown from '@astrojs/partytown';
import image from '@astrojs/image';

// https://astro.build/config
import netlify from '@astrojs/netlify/functions';

// https://astro.build/config
export default defineConfig({
  site: 'https://glassno.netlify.app',
  integrations: [
    tailwind(),
    sanity({
      projectId: 'csbn9wp4',
      dataset: 'glassno',
      apiVersion: '2021-10-21',
      useCdn: false,
    }),
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  server: {
    port: 3001,
  },
  output: 'server',
  adapter: netlify(),
});
