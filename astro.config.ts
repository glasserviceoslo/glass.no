import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import node from "@astrojs/node";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://www.glass.no",
  vite: {
    build: {
      rollupOptions: {
        external: ["path", "url"],
      },
    },
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    react(),
    svelte(),
    markdoc(),
    keystatic(),
  ],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
