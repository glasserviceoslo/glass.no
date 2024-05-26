import { z, defineCollection } from 'astro:content';

const featuredMediaSchema = z
  .discriminatedUnion('discriminant', [
    z.object({
      discriminant: z.literal('image'),
      value: z.object({
        asset: z.string().min(1, 'Image is required'),
        alt: z.string().optional(),
      }),
    }),
    z.object({
      discriminant: z.literal('video'),
      value: z.object({
        url: z.string().min(1, 'Video URL is required').url('Must be a valid URL'),
        image: z.object({
          asset: z.string().min(1),
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
  schema: z.object({
    title: z.string().min(1, 'Title is required'),
    featuredMedia: featuredMediaSchema,
    description: z.string().optional(),
    seoKeyphrase: z.string().optional().nullable(),
    seoKeywords: z.string().optional().nullable(),
    navigation: navigationSchema,
    publishedAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    content: z.string().optional(),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1, 'Title is required'),
    featuredMedia: featuredMediaSchema,
    description: z.string().optional(),
    seoKeyphrase: z.string().optional().nullable(),
    seoKeywords: z.string().optional().nullable(),
    publishedAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    content: z.string().optional(),
  }),
});

const glasstypes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1, 'Title is required'),
    featuredMedia: featuredMediaSchema,
    description: z.string().optional(),
    seoKeyphrase: z.string().optional().nullable(),
    seoKeywords: z.string().optional().nullable(),
    publishedAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    content: z.string().optional(),
  }),
});

export const collections = { pages, posts, glasstypes };
