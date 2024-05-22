import { AbstractAuthProvider, LocalAuthProvider, defineConfig, type TinaField } from 'tinacms';
import * as pkg from 'tinacms-authjs/dist/tinacms';
import React from 'react';
import { signIn, signOut } from '../src/auth/client';

class CustomAuthJSProvider extends AbstractAuthProvider {
  readonly callbackUrl: string;
  readonly name: string;
  readonly redirect: boolean;
  constructor(props?: {
    name?: string;
    callbackUrl?: string;
    redirect?: boolean;
  }) {
    super();
    this.name = props?.name || 'Github';
    this.callbackUrl = props?.callbackUrl || '/admin/index.html';
    this.redirect = props?.redirect ?? false;
  }
  async authenticate() {
    return signIn(this.name, { callbackUrl: this.callbackUrl });
  }

  async getToken() {
    return Promise.resolve({ id_token: '' });
  }

  async getUser() {
    try {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      return session.user || false;
    } catch (e) {
      console.error('Error fetching user info from GitHub', e);
      return false;
    }
  }

  async logout() {
    if (this.redirect) {
      return signOut({ redirect: true, callbackUrl: this.callbackUrl });
    }
    return signOut({ callbackUrl: this.callbackUrl });
  }
}

const { TinaUserCollection } = pkg;
const branch = process.env.GITHUB_BRANCH || process.env.HEAD || 'main';
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

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
  token: '6a19b59a9d44fb4784a07b3a7de285689172554c',
  clientId: '4b87665d-5407-4f9f-ae3c-bcd62089e101',
  branch: 'cms',
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
            label: 'Nav title',
            name: 'navTitle',
            type: 'string',
            ui: {
              component: (props: ANY) => {
                const isNav = props.form?.getFieldState('isNavElement')?.value;
                if (isNav) {
                  const { input, field } = props;
                  return (
                    <div className="my-4">
                      <label htmlFor={input.name} className="block text-sm font-medium">
                        {field.label}
                      </label>
                      <div className="mt-1">
                        <input id={input.name} className="py-2 px-4 block" type="text" {...input} />
                      </div>
                    </div>
                  );
                }
                return <React.Fragment />;
              },
            },
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
  // contentApiUrlOverride: '/api/tina/gql',
  // search: {
  //   tina: {
  //     indexerToken: '<Your Search Token>',
  //     stopwordLanguages: ['no'],
  //   },
  //   indexBatchSize: 100,
  //   maxSearchIndexFieldLength: 100,
  // },
});
