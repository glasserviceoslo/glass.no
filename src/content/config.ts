import { z, defineCollection, type ImageFunction } from 'astro:content';

const getFeaturedMediaSchema = (image: ImageFunction) =>
  z
    .discriminatedUnion('discriminant', [
      z.object({
        discriminant: z.literal('image'),
        value: z.object({
          asset: image(),
          alt: z.string().optional(),
        }),
      }),
      z.object({
        discriminant: z.literal('video'),
        value: z.object({
          url: z.string().min(1, 'Video URL is required').url('Must be a valid URL'),
          image: z.object({
            asset: image(),
            alt: z.string().optional(),
          }),
        }),
      }),
      z.object({
        discriminant: z.literal('none'),
        value: z.null().optional(),
      }),
    ])
    .default({ discriminant: 'none', value: null });

const navigationSchema = z
  .object({
    discriminant: z.boolean(),
    value: z
      .object({
        title: z.string(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.discriminant && !data.value) {
        return false;
      }
      return true;
    },
    {
      message: 'Navigation title is required when showing in navigation menu',
      path: ['value', 'title'],
    },
  );

const pages = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1, 'Title is required'),
      featuredMedia: getFeaturedMediaSchema(image),
      description: z.string().optional(),
      seoKeyphrase: z.string().optional().nullable(),
      seoKeywords: z.string().optional().nullable(),
      navigationTitle: z.string().optional(),
      publishedAt: z.date().default(() => new Date()),
      updatedAt: z.date().default(() => new Date()),
      content: z.string().optional(),
    }),
});

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1, 'Title is required'),
      featuredMedia: getFeaturedMediaSchema(image),
      description: z.string().optional(),
      seoKeyphrase: z.string().optional().nullable(),
      seoKeywords: z.string().optional().nullable(),
      navigationTitle: z.string().optional(),
      publishedAt: z.date().default(() => new Date()),
      updatedAt: z.date().default(() => new Date()),
      content: z.string().optional(),
    }),
});

const glasstypes = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1, 'Title is required'),
      featuredMedia: getFeaturedMediaSchema(image),
      description: z.string().optional(),
      seoKeyphrase: z.string().optional().nullable(),
      seoKeywords: z.string().optional().nullable(),
      navigationTitle: z.string().optional(),
      publishedAt: z.date().default(() => new Date()),
      updatedAt: z.date().default(() => new Date()),
      content: z.string().optional(),
    }),
});

const menuItemSchema = z.object({
  item: z.discriminatedUnion('discriminant', [
    z.object({ discriminant: z.literal('page'), value: z.string() }),
    z.object({ discriminant: z.literal('post'), value: z.string() }),
    z.object({ discriminant: z.literal('glasstype'), value: z.string() }),
    z.object({ discriminant: z.literal('custom'), value: z.string() }),
  ]),
  navigationTitle: z.string().min(1, 'Menu title is required'),
  children: z
    .array(
      z.object({
        item: z.discriminatedUnion('discriminant', [
          z.object({ discriminant: z.literal('page'), value: z.string() }),
          z.object({ discriminant: z.literal('post'), value: z.string() }),
          z.object({ discriminant: z.literal('glasstype'), value: z.string() }),
          z.object({ discriminant: z.literal('custom'), value: z.string() }),
        ]),
        navigationTitle: z.string().min(1, 'Menu title is required'),
      }),
    )
    .optional(),
});

const navigation = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string().min(1, 'Name is required'),
    menuItems: z.array(menuItemSchema),
  }),
});

export const collections = { pages, posts, glasstypes, navigation };
