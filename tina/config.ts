import { LocalAuthProvider, defineConfig, type TinaField } from 'tinacms';
import * as pkg from 'tinacms-authjs/dist/tinacms';
const { TinaUserCollection } = pkg;

const branch = process.env.GITHUB_BRANCH || process.env.HEAD || 'main';

const mainImageField: TinaField = {
  label: 'Main Image',
  name: 'mainImage',
  type: 'object',
  fields: [
    {
      label: 'URL',
      name: 'url',
      type: 'string',
    },
    {
      label: 'Alt',
      name: 'alt',
      type: 'string',
    },
  ],
};

export default defineConfig({
  authProvider: new LocalAuthProvider(),
  branch,

  // // Get this from tina.io
  // clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // // Get this from tina.io
  // token: process.env.TINA_TOKEN,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    loadCustomStore: async () => {
      const pack = await import('next-tinacms-s3');
      return pack.TinaCloudS3MediaStore;
    },
  },
  schema: {
    collections: [
      TinaUserCollection,
      // Pages
      {
        name: 'page',
        label: 'Pages',
        path: 'content/pages',
        fields: [
          mainImageField,
          // {
          //   name: 'hero',
          //   type: 'image',
          //   label: 'Hero Image',
          // },
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'slug',
            label: 'Slug',
            required: true,
          },
          {
            type: 'boolean',
            name: 'isNavElement',
            label: 'Navigation',
            description: 'Show in navigation menu',
            required: true,
          },
          {
            type: 'string',
            name: 'seoKeywords',
            label: 'Keywords',
            description: 'Comma separated list of keywords',
          },
          {
            type: 'string',
            name: 'seoKeyphrase',
            label: 'Keyphrase',
            description: 'Keyphrase for search engines',
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Date',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
      // Posts
      {
        name: 'post',
        label: 'Posts',
        path: 'content/posts',
        fields: [
          mainImageField,
          // {
          //   name: 'mainImage',
          //   type: 'image',
          //   label: 'Main Image',
          // },
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'slug',
            label: 'Slug',
            required: true,
          },
          {
            type: 'string',
            name: 'seoKeywords',
            label: 'Keywords',
            description: 'Comma separated list of keywords',
          },
          {
            type: 'string',
            name: 'seoKeyphrase',
            label: 'Keyphrase',
            description: 'Keyphrase for search engines',
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Date',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
      // Glass types
      {
        name: 'glassType',
        label: 'Glass Types',
        path: 'content/glass-types',
        fields: [
          mainImageField,
          // {
          //   name: 'mainImage',
          //   type: 'image',
          //   label: 'Main Image',
          // },
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'slug',
            label: 'Slug',
            required: true,
          },
          {
            type: 'string',
            name: 'seoKeywords',
            label: 'Keywords',
            description: 'Comma separated list of keywords',
          },
          {
            type: 'string',
            name: 'seoKeyphrase',
            label: 'Keyphrase',
            description: 'Keyphrase for search engines',
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Date',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
    ],
  },
  contentApiUrlOverride: '/api/tina/gql',
  // search: {
  //   tina: {
  //     indexerToken: '<Your Search Token>',
  //     stopwordLanguages: ['no'],
  //   },
  //   indexBatchSize: 100,
  //   maxSearchIndexFieldLength: 100,
  // },
});
