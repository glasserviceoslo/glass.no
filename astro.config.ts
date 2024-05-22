import { join } from 'node:path';
import { mkdir, readdir } from 'node:fs/promises';
import type { AstroIntegration } from 'astro';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import node from '@astrojs/node';
import esbuild from 'esbuild';

export default defineConfig({
  site: 'https://www.glass.no',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    partytown({ config: { forward: ['dataLayer.push'] } }),
    react(),
    svelte(),
    // tinaIntegration(),
  ],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});

function tinaIntegration(): AstroIntegration {
  return {
    name: 'tina',
    hooks: {
      'astro:build:done': async ({ logger }) => {
        const srcDir = join(import.meta.dirname, 'tina');
        const distDir = join(import.meta.dirname, 'dist/tina');
        try {
          const files = await readdir(srcDir, { recursive: true });
          const tsFiles = files.filter((file) => file.endsWith('.ts')).map((file) => join(srcDir, file));

          // Check if there are any TypeScript files to transpile
          if (tsFiles.length === 0) {
            logger.warn('No TypeScript files found to transpile.');
            return;
          }

          // Using esbuild to transpile TypeScript files
          await esbuild.build({
            entryPoints: tsFiles,
            outdir: distDir,
            bundle: true, // Bundle all dependencies into one file (optional)
            // minify: true, // Minify the output (optional)
            sourcemap: false, // Generate source maps (optional)
            platform: 'node', // Specify the platform (node or browser)
            target: 'esnext', // Specify ECMAScript target version
            format: 'esm', // Output format (cjs, esm, iife, etc.)
            logLevel: 'info', // Log level (info, warning, error, silent)
          });

          logger.info('Tina backend built successfully.');
        } catch (error) {
          console.error('Building tina failed: ', error);
        }
      },
    },
  };
}
