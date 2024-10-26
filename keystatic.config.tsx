import { FAQ } from '@/components/React/FAQ';
import { config, fields, collection } from '@keystatic/core';
import { wrapper, mark, type ContentComponent } from '@keystatic/core/content-components';
import { Highlighter, CircleHelp, Box } from 'lucide-react';

const components: Record<string, ContentComponent> = {
  Container: wrapper({
    label: 'Container',
    icon: <Box size={24} />,
    schema: {
      crop: fields.select({
        label: 'Crop',
        description: 'Max width container and options',
        options: [
          { label: 'wide', value: 'wide' },
          { label: 'normal', value: 'normal' },
          { label: 'narrow', value: 'narrow' },
          { label: 'narrower', value: 'narrower' },
          { label: 'boxed', value: 'boxed' },
        ],
        defaultValue: 'normal',
      }),
    },
  }),
  Highlight: mark({
    label: 'Highlight',
    icon: <Highlighter size={24} />,
    schema: {
      variant: fields.select({
        label: 'Variant',
        options: [
          { label: 'Fluro', value: 'fluro' },
          { label: 'Minimal', value: 'minimal' },
          { label: 'Brutalist', value: 'brutalist' },
        ],
        defaultValue: 'fluro',
      }),
    },
  }),

  FAQ: wrapper({
    label: 'FAQ',
    icon: <CircleHelp size={24} />,
    schema: {
      items: fields.array(
        fields.object({
          question: fields.text({
            label: 'Question',
            validation: { length: { min: 1 } },
          }),
          answer: fields.text({
            label: 'Answer',
            multiline: true,
          }),
        }),
        {
          itemLabel: (props) => props.fields.question.value || 'FAQ Item',
        },
      ),
    },
    ContentView(props) {
      return <FAQ items={[...props.value.items]} />;
    },
  }),
};

const featuredMedia = fields.conditional(
  fields.select({
    label: 'Featured media',
    description: 'Optional image/video options for an optional hero media.',
    options: [
      { label: 'No media', value: 'none' },
      { label: 'Image', value: 'image' },
      { label: 'Video', value: 'video' },
    ],
    defaultValue: 'none',
  }),
  {
    none: fields.empty(),
    image: fields.object({
      asset: fields.image({
        label: 'Image',
        directory: 'src/assets/images/',
        publicPath: '@/assets/images/',
        validation: { isRequired: true },
      }),
      alt: fields.text({
        label: 'Alt',
        description: 'Image alt text.',
      }),
    }),
    video: fields.object({
      url: fields.url({
        label: 'A YouTube video URL.',
      }),
      image: fields.object({
        asset: fields.image({
          label: 'Image',
          description: 'Thumbnail image override for the video.',
          directory: 'src/assets/images/',
          publicPath: '@/assets/images/',
        }),
        alt: fields.text({
          label: 'Alt',
          description: 'Image alt text.',
        }),
      }),
    }),
  },
);

const redirectStatusCode = fields.integer({
  label: 'Code',
  description: 'A status code for redirect (301, 302, 303 etc)',
  defaultValue: 301,
  validation: { isRequired: true, min: 300, max: 308 },
});

const redirect = fields.conditional(
  fields.select({
    label: 'Redirect',
    description: 'Option to redirect to another page/post',
    options: [
      { label: 'Do not redirect', value: 'none' },
      { label: 'Page', value: 'pages' },
      { label: 'Post', value: 'posts' },
      { label: 'Glass Type', value: 'glasstyper' },
    ],
    defaultValue: 'none',
  }),
  {
    none: fields.empty(),
    pages: fields.object({
      redirectTo: fields.relationship({ label: 'Select a page from the list:', collection: 'pages' }),
      statusCode: redirectStatusCode,
    }),
    posts: fields.object({
      redirectTo: fields.relationship({ label: 'Select a post from the list:', collection: 'posts' }),
      statusCode: redirectStatusCode,
    }),
    glasstyper: fields.object({
      redirectTo: fields.relationship({ label: 'Select a glasstype from the list:', collection: 'glasstypes' }),
      statusCode: redirectStatusCode,
    }),
  },
);

const menuItemField = fields.conditional(
  fields.select({
    label: 'Item Type',
    options: [
      { label: 'Page', value: 'page' },
      { label: 'Post', value: 'post' },
      { label: 'Glass Type', value: 'glasstype' },
      { label: 'Custom', value: 'custom' },
    ],
    defaultValue: 'page',
  }),
  {
    page: fields.relationship({ label: 'Page', collection: 'pages' }),
    post: fields.relationship({ label: 'Post', collection: 'posts' }),
    glasstype: fields.relationship({ label: 'Glass Type', collection: 'glasstypes' }),
    custom: fields.text({ label: 'Slug' }),
  },
);

const grandchildItemSchema = fields.object({
  item: menuItemField,
  navigationTitle: fields.text({
    label: 'Navigation Title',
    validation: { length: { min: 1 } },
    description: 'Title to show on the menu',
  }),
});

const childItemSchema = fields.object({
  item: menuItemField,
  navigationTitle: fields.text({
    label: 'Navigation Title',
    validation: { length: { min: 1 } },
    description: 'Title to show on the menu',
  }),
  grandchildren: fields.array(grandchildItemSchema, {
    label: 'Grandchild items',
    itemLabel: (props) => props.fields.navigationTitle.value ?? '',
  }),
});

const menuItemSchema = fields.object({
  item: menuItemField,
  navigationTitle: fields.text({
    label: 'Navigation Title',
    validation: { length: { min: 1 } },
    description: 'Title to show on the menu',
  }),
  children: fields.array(childItemSchema, {
    label: 'Child items',
    itemLabel: (props) => props.fields.navigationTitle.value ?? '',
  }),
});

export const navigation = collection({
  label: 'Navigation',
  slugField: 'name',
  path: 'src/content/navigation/*',
  schema: {
    name: fields.slug({
      name: {
        label: 'Name',
        validation: { length: { min: 1 } },
      },
    }),
    menuItems: fields.array(menuItemSchema, {
      label: 'Menu items',
      itemLabel: (props) => props.fields.navigationTitle.value ?? '',
    }),
  },
});

const storage = import.meta.env.DEV
  ? { kind: 'local' as const }
  : {
      kind: 'github' as const,
      repo: {
        owner: import.meta.env.PUBLIC_GITHUB_OWNER,
        name: import.meta.env.PUBLIC_GITHUB_REPO,
      },
    };

const sharedSchema = {
  title: fields.slug({
    name: {
      label: 'Title',
      description: 'The title of the post',
      validation: { isRequired: true, length: { min: 20 } },
    },
    slug: {
      label: 'SEO-friendly slug',
      description: 'This will define the url/link for the post',
    },
  }),
  heading: fields.text({
    label: 'Title',
    description: 'The title of the post',
    validation: { isRequired: true },
  }),
  featuredMedia,
  metaDescription: fields.text({
    label: 'Meta Description',
    description: 'Description for search engine optimization',
  }),
  seoKeyphrase: fields.text({
    label: 'Keyphrase',
    description: 'Keyphrase for search engine optimization',
  }),
  seoKeywords: fields.text({
    label: 'Keywords',
    description: 'Comma separated list of keywords',
  }),
  redirect,
  publishedAt: fields.date({
    label: 'Published at',
    defaultValue: { kind: 'today' },
  }),
  updatedAt: fields.date({
    label: 'Last updated',
    defaultValue: { kind: 'today' },
  }),
} satisfies ContentComponent['schema'];

// Function to create a collection with shared properties
const createCollection = (name: string, label: string, schemaItems?: ContentComponent['schema']) =>
  collection({
    columns: ['title', 'updatedAt'],
    entryLayout: 'content',
    previewUrl: `/preview/start?branch={branch}&to/${name}/{slug}`,
    label,
    slugField: 'title',
    path: `src/content/${name}/*`,
    format: { contentField: 'content' },
    schema: {
      ...sharedSchema,
      ...schemaItems,
      content: fields.mdx({
        label: 'Rich Text',
        components,
        options: {
          image: {
            directory: `src/assets/images/${name}`,
            publicPath: `@/assets/images/${name}/`,
          },
        },
      }),
    },
  });

export default config({
  storage,
  ui: {
    navigation: {
      Settings: ['navigation'],
      Content: ['pages', 'posts', 'glasstypes'],
    },
    brand: {
      name: 'glass.no',
      mark: () => (
        <a href="/">
          <img src="/favicon.svg" height={30} alt="Logo" />
        </a>
      ),
    },
  },
  collections: {
    pages: createCollection('pages', 'Pages'),
    posts: createCollection('posts', 'Posts'),
    glasstypes: createCollection('glasstypes', 'Glass types'),
    navigation,
    // media: collection({
    //   label: "Media",
    //   slugField: "filename",
    //   schema: {
    //     filename: fields.text({
    //       label: "Filename",
    //       validation: { isRequired: true },
    //     }),
    //     image: fields.image({
    //       label: "Image",
    //       validation: { isRequired: true },
    //       directory: "public/uploads",
    //       publicPath: "/uploads",
    //     }),
    //   },
    // }),
  },
  // singletons: { navigation },
});
