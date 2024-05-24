import { config, fields, collection } from "@keystatic/core";

const featuredMedia = fields.conditional(
  fields.select({
    label: "Featured media",
    description: "Optional image/video options for an optional hero media.",
    options: [
      { label: "No media", value: "none" },
      { label: "Image", value: "image" },
      { label: "Video", value: "video" },
    ],
    defaultValue: "none",
  }),
  {
    none: fields.empty(),
    image: fields.object({
      asset: fields.image({
        label: "Image",
        directory: "public/uploads/images",
        publicPath: "/uploads/images/",
        validation: { isRequired: true },
      }),
      alt: fields.text({
        label: "Alt",
        description: "Image alt text.",
      }),
    }),
    // "video" condition
    video: fields.object({
      url: fields.url({
        label: "A YouTube video URL.",
      }),
      image: fields.object({
        asset: fields.image({
          label: "Image",
          description: "Thumbnail image override for the video.",
          directory: "public/uploads/images",
          publicPath: "/uploads/images/",
        }),
        alt: fields.text({
          label: "Alt",
          description: "Image alt text.",
        }),
      }),
    }),
  }
);

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: {
      name: "glass.no",
      mark: () => <img src="/favicon.svg" height={30} alt="Logo" />,
    },
  },
  collections: {
    pages: collection({
      columns: ["title", "date"],
      previewUrl: "/preview/start?branch={branch}&to=/pages/{slug}",
      label: "Pages",
      slugField: "title",
      path: "src/content/pages/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            description: "The title of the post",
            validation: { isRequired: true },
          },
          slug: {
            label: "SEO-friendly slug",
            description: "This will define the file/folder name for this entry",
          },
        }),
        featuredMedia,
        description: fields.text({
          label: "Description",
          description: "Description for search engine optimization",
        }),
        seoKeyphrase: fields.text({
          label: "Keyphrase",
          description: "Keyphrase for search engine optimization",
        }),
        seoKeywords: fields.text({
          label: "Keywords",
          description: "Comma separated list of keywords",
        }),
        navigation: fields.conditional(
          fields.checkbox({
            label: "Show in navigation menu",
            defaultValue: false,
          }),
          {
            true: fields.object({
              title: fields.text({ label: "Navigation title" }),
            }),
            false: fields.empty(),
          }
        ),
        date: fields.date({
          label: "Date",
          defaultValue: { kind: "today" },
        }),
        content: fields.markdoc({
          label: "Rich Text",
          extension: "md",
        }),
      },
    }),
    posts: collection({
      columns: ["title", "date"],
      entryLayout: "content",
      previewUrl: "/preview/start?branch={branch}&to=/posts/{slug}",
      label: "Posts",
      slugField: "title",
      path: "src/content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            description: "The title of the post",
            validation: { isRequired: true },
          },
          slug: {
            label: "SEO-friendly slug",
            description: "This will define the file/folder name for this entry",
          },
        }),
        featuredMedia,
        description: fields.text({
          label: "Description",
          description: "Description for search engine optimization",
        }),
        seoKeyphrase: fields.text({
          label: "Keyphrase",
          description: "Keyphrase for search engine optimization",
        }),
        seoKeywords: fields.text({
          label: "Keywords",
          description: "Comma separated list of keywords",
        }),
        date: fields.date({
          label: "Date",
          defaultValue: { kind: "today" },
        }),
        content: fields.markdoc({
          label: "Rich Text",
          extension: "md",
        }),
      },
    }),
    glassTypes: collection({
      columns: ["title", "date"],
      entryLayout: "content",
      previewUrl: "/preview/start?branch={branch}&to=/glass-types/{slug}",
      label: "Glass types",
      slugField: "title",
      path: "src/content/glass-types/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            description: "The title of the post",
            validation: { isRequired: true },
          },
          slug: {
            label: "SEO-friendly slug",
            description: "This will define the file/folder name for this entry",
          },
        }),
        featuredMedia,
        description: fields.text({
          label: "Description",
          description: "Description for search engine optimization",
        }),
        seoKeyphrase: fields.text({
          label: "Keyphrase",
          description: "Keyphrase for search engine optimization",
        }),
        seoKeywords: fields.text({
          label: "Keywords",
          description: "Comma separated list of keywords",
        }),
        date: fields.date({
          label: "Date",
          defaultValue: { kind: "today" },
        }),
        content: fields.markdoc({
          label: "Rich Text",
          extension: "md",
        }),
      },
    }),
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
  // singletons: {
  //   settings: singleton({
  //     label: "Settings",
  //     schema: {},
  //   }),
  // },
});
