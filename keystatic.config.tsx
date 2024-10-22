import '@/styles/globals.css';
import { FAQ } from '@/components/React/FAQ';
import { config, fields, collection, singleton } from '@keystatic/core';
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
          { label: 'normal', value: 'normal' },
          { label: 'narrow', value: 'narrow' },
          { label: 'narrower', value: 'narrower' },
          { label: 'bleed', value: 'bleed' },
          { label: 'boxed', value: 'boxed' },
          { label: 'narrow-boxed', value: 'narrow-boxed' },
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
    pages: collection({
      columns: ['title', 'updatedAt'],
      entryLayout: 'content',
      previewUrl: '/preview/start?branch={branch}&to=/produkter/{slug}',
      label: 'Pages',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            description: 'The title of the post',
            validation: { isRequired: true },
          },
          slug: {
            label: 'SEO-friendly slug',
            description: 'This will define the file/folder name for this entry',
          },
        }),
        featuredMedia,
        description: fields.text({
          label: 'Description',
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
        navigationTitle: fields.text({
          label: 'Navigation title',
          description: 'Title to use in navigation menu (optional)',
        }),
        publishedAt: fields.date({
          label: 'Published at',
          defaultValue: { kind: 'today' },
        }),
        updatedAt: fields.date({
          label: 'Last updated',
          defaultValue: { kind: 'today' },
        }),
        content: fields.mdx({
          label: 'Rich Text',
          components,
          options: {
            image: {
              directory: 'src/assets/images/pages',
              publicPath: '@/assets/images/pages/',
            },
          },
        }),
      },
    }),

    posts: collection({
      columns: ['title', 'updatedAt'],
      entryLayout: 'content',
      previewUrl: '/preview/start?branch={branch}&to=/posts/{slug}',
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            description: 'The title of the post',
            validation: { isRequired: true },
          },
          slug: {
            label: 'SEO-friendly slug',
            description: 'This will define the file/folder name for this entry',
          },
        }),
        featuredMedia,
        description: fields.text({
          label: 'Description',
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
        navigationTitle: fields.text({
          label: 'Navigation title',
          description: 'Title to use in navigation menu (optional)',
        }),
        publishedAt: fields.date({
          label: 'Published at',
          defaultValue: { kind: 'today' },
        }),
        updatedAt: fields.date({
          label: 'Last updated',
          defaultValue: { kind: 'today' },
        }),
        content: fields.mdx({
          label: 'Rich Text',
          components,
          options: {
            image: {
              directory: 'src/assets/images/posts',
              publicPath: '@/assets/images/posts/',
            },
          },
        }),
      },
    }),

    glasstypes: collection({
      columns: ['title', 'updatedAt'],
      entryLayout: 'content',
      previewUrl: '/preview/start?branch={branch}&to=/glasstypes/{slug}',
      label: 'Glass types',
      slugField: 'title',
      path: 'src/content/glasstypes/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            description: 'The title of the post',
            validation: { isRequired: true },
          },
          slug: {
            label: 'SEO-friendly slug',
            description: 'This will define the file/folder name for this entry',
          },
        }),
        featuredMedia,
        description: fields.text({
          label: 'Description',
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
        navigationTitle: fields.text({
          label: 'Navigation title',
          description: 'Title to use in navigation menu (optional)',
        }),
        publishedAt: fields.date({
          label: 'Published at',
          defaultValue: { kind: 'today' },
        }),
        updatedAt: fields.date({
          label: 'Last updated',
          defaultValue: { kind: 'today' },
        }),
        content: fields.mdx({
          label: 'Rich Text',
          components,
          options: {
            image: {
              directory: 'src/assets/images/glasstypes',
              publicPath: '@/assets/images/glasstypes/',
            },
          },
        }),
      },
    }),
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
