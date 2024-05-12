import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { productionUrl } from '$plugins/productionUrl';
import { apiVersion, dataset, previewSecretId, projectId } from '$lib/sanity.api';
import schemas from '$schemas';
import { Logo } from '$components/React/StudioLogo';
import { media } from 'sanity-plugin-media';
import Navbar from '$components/React/StudioNavbar';

export default defineConfig({
  basePath: '/studio',
  title: 'glass.no',
  projectId,
  dataset,
  studio: {
    components: {
      logo: Logo,
      navbar: Navbar,
    },
  },
  plugins: [
    deskTool({
      // defaultDocumentNode: previewDocumentNode({ apiVersion, previewSecretId }),
    }),
    productionUrl({
      apiVersion,
      previewSecretId,
      types: [schemas[0].name],
    }),
    media(),
    visionTool(),
  ],
  schema: {
    types: schemas,
  },
  tools: (prev) => {
    if (import.meta.url.includes('localhost')) {
      return prev;
    }
    return prev.filter((tool) => tool.name !== 'vision');
  },
});
