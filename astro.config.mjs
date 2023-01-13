import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import image from '@astrojs/image';

import netlify from '@astrojs/netlify/functions';
import solidJs from '@astrojs/solid-js';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://glass.no',
  integrations: [
    tailwind({ config: { applyBaseStyles: false } }),
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
