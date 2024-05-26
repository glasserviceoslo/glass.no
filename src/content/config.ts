import { z, defineCollection } from 'astro:content';

const featuredMediaSchema = z
  .union([
    z.object({
      type: z.literal('none'),
    }),
    z.object({
      type: z.literal('image'),
      asset: z.object({
        src: z.string().min(1, 'Image is required').url('Invalid URL format'),
      }),
      alt: z.string().optional(),
    }),
    z.object({
      type: z.literal('video'),
      url: z.string().url('Invalid URL format'),
      image: z
        .object({
          asset: z.string().url('Invalid URL format').optional(),
          alt: z.string().optional(),
        })
        .optional(),
    }),
  ])
  .refine(
    (data) => {
      if (data.type === 'image' && !data.asset.src) {
        return false;
      }
      if (data.type === 'video' && !data.url) {
        return false;
      }
      return true;
    },
    {
      message: 'Featured media is not valid',
    },
  )
  .optional();

const navigationSchema = z
  .object({
    discriminant: z.boolean(),
    navigation: z
      .object({
        title: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.discriminant && !data.navigation?.title) {
        return false;
      }
      return true;
    },
    {
      message: 'Navigation title is required when showing in navigation menu',
      path: ['navigation', 'title'],
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
