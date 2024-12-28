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

const redirectStatusCode = z.union([
  z.literal(300),
  z.literal(301),
  z.literal(302),
  z.literal(303),
  z.literal(304),
  z.literal(305),
  z.literal(306),
  z.literal(307),
  z.literal(308),
]);

const redirectDestinationSchema = z.discriminatedUnion('discriminant', [
  z.object({
    discriminant: z.literal('page'),
    value: z.object({
      page: z.string(),
      statusCode: redirectStatusCode,
    }),
  }),
  z.object({
    discriminant: z.literal('post'),
    value: z.object({
      post: z.string(),
      statusCode: redirectStatusCode,
    }),
  }),
  z.object({
    discriminant: z.literal('custom'),
    value: z.object({
      url: z.string().min(1),
      statusCode: redirectStatusCode,
    }),
  }),
]);

const redirectItemSchema = z.object({
  from: z.string().min(1),
  to: redirectDestinationSchema,
});

export const redirects = z.object({
  redirects: z.array(redirectItemSchema),
});

const baseContentSchema = ({ image }: { image: ImageFunction }) =>
  z.object({
    title: z.string().min(1, 'Title is required'),
    heading: z.string().min(1, 'Heading is required'),
    featuredMedia: getFeaturedMediaSchema(image),
    metaDescription: z.string().optional(),
    seoKeyphrase: z.string().optional().nullable(),
    seoKeywords: z.string().optional().nullable(),
    publishedAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    content: z.string().optional(),
  });

const pages = defineCollection({
  type: 'content',
  schema: baseContentSchema,
});

const posts = defineCollection({
  type: 'content',
  schema: baseContentSchema,
});

const glasstypes = defineCollection({
  type: 'content',
  schema: baseContentSchema,
});

const grandchildItemSchema = z.object({
  item: z.discriminatedUnion('discriminant', [
    z.object({ discriminant: z.literal('page'), value: z.string() }),
    z.object({ discriminant: z.literal('post'), value: z.string() }),
    z.object({ discriminant: z.literal('glasstype'), value: z.string() }),
    z.object({ discriminant: z.literal('custom'), value: z.string() }),
  ]),
  navigationTitle: z.string().min(1, 'Menu title is required'),
});

const childItemSchema = z.object({
  item: z.discriminatedUnion('discriminant', [
    z.object({ discriminant: z.literal('page'), value: z.string() }),
    z.object({ discriminant: z.literal('post'), value: z.string() }),
    z.object({ discriminant: z.literal('glasstype'), value: z.string() }),
    z.object({ discriminant: z.literal('custom'), value: z.string() }),
  ]),
  navigationTitle: z.string().min(1, 'Menu title is required'),
  grandchildren: z.array(grandchildItemSchema).optional(),
});

const menuItemSchema = z.object({
  item: z.discriminatedUnion('discriminant', [
    z.object({ discriminant: z.literal('page'), value: z.string() }),
    z.object({ discriminant: z.literal('post'), value: z.string() }),
    z.object({ discriminant: z.literal('glasstype'), value: z.string() }),
    z.object({ discriminant: z.literal('custom'), value: z.string() }),
  ]),
  navigationTitle: z.string().min(1, 'Menu title is required'),
  children: z.array(childItemSchema).optional(),
});

const navigation = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string().min(1, 'Name is required'),
    menuItems: z.array(menuItemSchema),
  }),
});

export const collections = { pages, posts, glasstypes, navigation, redirects };
