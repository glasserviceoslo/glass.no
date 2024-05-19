import { AbstractAuthProvider, LocalAuthProvider, defineConfig, type TinaField } from 'tinacms';
import * as pkg from 'tinacms-authjs/dist/tinacms';
import React from 'react';
import { signIn, signOut } from 'auth-astro/client';
import { Auth } from '@auth/core';
import type { Session } from '@auth/core/types';
import clientPromise from '../src/lib/db';
import type { Adapter } from '@auth/core/adapters';
import GitHub from '@auth/core/providers/github';
// import Google from '@auth/core/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';

const authConfig = {
  // adapter: MongoDBAdapter(clientPromise) as Adapter,
  providers: [
    // Google({
    //   clientId: import.meta.env.GOOGLE_CLIENT_ID,
    //   clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
    // }),
    GitHub({
      clientId: import.meta.env?.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env?.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: 'J7SLsE0B1EdUFz7FJW0NAxMUh6P4yA1b5zKcg1NTGI0=',
};

export async function getSession(req: Request, options = authConfig): Promise<Session | null> {
  options.secret ??= 'J7SLsE0B1EdUFz7FJW0NAxMUh6P4yA1b5zKcg1NTGI0=';
  options.trustHost ??= true;

  const url = new URL(`${options.prefix}/session`, req.url);
  const response = (await Auth(new Request(url, { headers: req.headers }), options)) as Response;
  const { status = 200 } = response;

  const data = await response.json();

  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data;
  throw new Error(data.message);
}

class DefaultAuthJSProvider extends AbstractAuthProvider {
  readonly callbackUrl: string;
  readonly name: string;
  readonly redirect: boolean;
  constructor(props?: {
    name?: string;
    callbackUrl?: string;
    redirect?: boolean;
  }) {
    super();
    this.name = props?.name || 'tina';
    this.callbackUrl = props?.callbackUrl || '/admin/index.html';
    this.redirect = props?.redirect ?? false;
  }
  async authenticate(ctx: ANY): Promise<any> {
    console.log(ctx);
    return signIn(this.name, { callbackUrl: this.callbackUrl });
  }
  getToken() {
    return Promise.resolve({ id_token: '' });
  }
  async getUser() {
    // const request = new Request('http://localhost:5001');
    // const session = await getSession(request);
    // return session?.user || false;
  }
  async logout() {
    if (this.redirect) {
      await signOut({ redirect: true, callbackUrl: this.callbackUrl });
    }
    await signOut({ callbackUrl: this.callbackUrl });
  }

  async authorize(context?: any): Promise<any> {
    const user: any = (await getSession(context))?.user || {};
    return user.role === 'user';
  }
}

const { TinaUserCollection } = pkg;
const branch = process.env.GITHUB_BRANCH || process.env.HEAD || 'main';
// const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

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
  authProvider: new DefaultAuthJSProvider(),
  // authProvider: new LocalAuthProvider(),
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
