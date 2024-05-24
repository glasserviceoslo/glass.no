import { z, defineCollection } from "astro:content";

const featuredMediaSchema = z
  .union([
    z.object({
      type: z.literal("none"),
    }),
    z.object({
      type: z.literal("image"),
      asset: z.object({
        src: z.string().min(1, "Image is required").url("Invalid URL format"),
      }),
      alt: z.string().optional(),
    }),
    z.object({
      type: z.literal("video"),
      url: z.string().url("Invalid URL format"),
      image: z
        .object({
          asset: z.string().url("Invalid URL format").optional(),
          alt: z.string().optional(),
        })
        .optional(),
    }),
  ])
  .refine(
    (data) => {
      if (data.type === "image" && !data.asset.src) {
        return false;
      }
      if (data.type === "video" && !data.url) {
        return false;
      }
      return true;
    },
    {
      message: "Featured media is not valid",
    }
  );

const navigationSchema = z.union([
  z.object({ showInNavigation: z.literal(false) }),
  z.object({
    showInNavigation: z.literal(true),
    navigationTitle: z.string().min(1, "Navigation title is required"),
  }),
]);

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    featuredMedia: featuredMediaSchema,
    description: z.string().optional(),
    seoKeyphrase: z.string().optional(),
    seoKeywords: z.string().optional(),
    navigation: navigationSchema,
    publishedAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    content: z.string().optional(),
  }),
});

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    featuredMedia: featuredMediaSchema,
    description: z.string().optional(),
    seoKeyphrase: z.string().optional(),
    seoKeywords: z.string().optional(),
    publishedAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    content: z.string().optional(),
  }),
});

const glassTypes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    featuredMedia: featuredMediaSchema,
    description: z.string().optional(),
    seoKeyphrase: z.string().optional(),
    seoKeywords: z.string().optional(),
    publishedAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    content: z.string().optional(),
  }),
});

export const collections = { pages, posts, glassTypes };
