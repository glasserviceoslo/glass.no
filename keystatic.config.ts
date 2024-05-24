import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    pages: collection({
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
        // mainImage: fields.cloudImage({
        //   url: fields.image({
        //     label: "Main image",
        //   }),
        //   alt: fields.text({
        //     label: "Alt text",
        //   }),
        // }),
        mainImage: fields.image({
          label: "Main image",
          directory: "public/assets/uploads",
          publicPath: "/assets/uploads/",
        }),
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
        // mainImage: fields.cloudImage({
        //   url: fields.image({
        //     label: "Main image",
        //   }),
        //   alt: fields.text({
        //     label: "Alt text",
        //   }),
        // }),
        mainImage: fields.image({
          label: "Main image",
          directory: "public/assets/uploads",
          publicPath: "/assets/uploads/",
        }),
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
        // mainImage: fields.cloudImage({
        //   url: fields.image({
        //     label: "Main image",
        //   }),
        //   alt: fields.text({
        //     label: "Alt text",
        //   }),
        // }),
        mainImage: fields.image({
          label: "Main image",
          directory: "public/assets/uploads",
          publicPath: "/assets/uploads/",
        }),
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
  },
});
