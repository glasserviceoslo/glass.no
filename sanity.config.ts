import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import schemas from './src/schemas';

export default defineConfig({
  basePath: '/studio',
  title: 'blog',
  projectId: 'csbn9wp4',
  dataset: 'glassno',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemas,
  },
  tools: (prev) => {
    if (import.meta.env.DEV) {
      return prev;
    }
    return prev.filter((tool) => tool.name !== 'vision');
  },
});
