import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import image from '@astrojs/image';

// https://astro.build/config
import netlify from '@astrojs/netlify/functions';
// import node from '@astrojs/node';

// https://astro.build/config
import solidJs from '@astrojs/solid-js';

// https://astro.build/config
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://glassno.netlify.app',
  integrations: [
    tailwind(),
    // sanity({
    //   projectId: 'csbn9wp4',
    //   dataset: 'glassno',
    //   apiVersion: '2021-10-21',
    //   useCdn: false,
    // }),
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
  ],
  server: {
    port: 3001,
  },
  output: 'server',
  adapter: netlify(),
});
