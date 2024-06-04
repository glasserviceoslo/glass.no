# Welcome to [Glass-Service Svendsen og Sønn AS](https://glass.no)


## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command        | Action                                                             |
| :------------- | :----------------------------------------------------------------- |
| `yarn install` | Installs dependencies                                              |
| `yarn dev`     | Starts local dev server at `localhost:5001` or `glassno.localhost` |
| `yarn build`   | Build your production site to `./dist/`                            |
| `yarn preview` | Preview your build locally, before deploying                       |

---

## Extra utilities

### Sanity export to md:

To export your Sanity content as markdown, copy and add this script to a new `.ts` file,
and then run with `bun ${filename}.ts`.

```ts
import "dotenv/config";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { getAllPages, getAllPosts } from "$lib/sanity.client";
// @ts-expect-error Type
import PortableText from "@sanity/block-content-to-markdown";

const { getImageUrl } = PortableText;

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || "v2021-10-21";
const useCdn = import.meta.env.PUBLIC_SANITY_REVALIDATE_SECRET
  ? false
  : import.meta.env.NODE_ENV === "production";

const builder = createImageUrlBuilder({ projectId, dataset });

const getSanityImageURL = (source: SanityImageSource) =>
  builder.image(source).auto("format").fit("max");

const removeExt = (filename: string) =>
  filename.split(".").slice(0, -1).join("");

const serializers = {
  types: {
    mainImage: ({ node, value }) => {
      return `[${
        node?.asset?.altText ||
        node?.asset?.originalFilename.split(".")[0] ||
        ""
      }](${getImageUrl({
        options: { apiVersion, dataset, useCdn, projectId },
        node,
      })})`;
    },
    image: ({ node }) => {
      return `[${
        node?.asset?.altText ||
        node?.asset?.originalFilename.split(".")[0] ||
        ""
      }](${getImageUrl({
        options: { apiVersion, dataset, useCdn, projectId },
        node,
      })})`;
    },
  },
  marks: {
    internalLink: ({ mark, children }) => {
      const { slug = {} } = mark;
      const href = `/${slug.current}`;
      return `[${children}](${href})`;
    },
    link: ({ mark, children }) => {
      // Read https://css-tricks.com/use-target_blank/
      const { blank, href } = mark;
      return blank
        ? `<a href=${href} target="_blank" rel="noopener">${children}</a>`
        : `[${children}](${href})`;
    },
  },
};

async function main() {
  const options = { serializers, apiVersion, dataset, projectId, useCdn };
  const posts = await getAllPosts();
  const glassTypes = await getAllPosts("glassTypes");
  const navPages = await getAllPages(true);
  const pages = await getAllPages(false);

  const glassTypesContent = glassTypes.map((post) => {
    const [date, time] = new Date(post?.date || new Date())
      .toISOString()
      .split("T");
    const content = `---
title: "${post.title}"
slug: ${post.slug}
mainImage: ${
      post.mainImage
        ? JSON.stringify(
            {
              url: getSanityImageURL(post?.mainImage).url(),
              alt:
                post?.mainImage?.altText ||
                removeExt(post?.mainImage?.asset.originalFilename),
            },
            null,
            2
          )
        : '{ url: "", alt: "" }'
    }
seoKeywords: ${post.seoKeywords?.join(", ") ?? ""}
seoKeyphrase: ${post?.seoKeyphrase ?? ""}
  ${post?.categories ?? ""}
publishedAt: ${date} ${time} 
description: "${post?.description ?? ""}"
---

${PortableText(post.body, options)}
`;
    const filename = join(
      import.meta.dirname,
      `content/glass-types/${post.slug}.md`
    );

    writeFileSync(filename, content);
    console.log("The file was saved!", filename);
  });

  const postsContent = posts.map((post) => {
    const [date, time] = new Date(post?.date || new Date())
      .toISOString()
      .split("T");
    const content = `---
title: "${post.title}"
slug: ${post.slug}
mainImage: ${
      post.mainImage
        ? JSON.stringify(
            {
              url: getSanityImageURL(post?.mainImage).url(),
              alt:
                post?.mainImage?.altText ||
                removeExt(post?.mainImage?.asset.originalFilename),
            },
            null,
            2
          )
        : '{ url: "", alt: "" }'
    }
seoKeywords: ${post.seoKeywords?.join(", ") ?? ""}
seoKeyphrase: ${post?.seoKeyphrase ?? ""}
  ${post?.categories ?? ""}
publishedAt: ${date} ${time} 
description: "${post?.description ?? ""}"
---

${PortableText(post.body, options)}
`;
    const filename = join(import.meta.dirname, `content/posts/${post.slug}.md`);

    writeFileSync(filename, content);
    console.log("The file was saved!", filename);
  });

  const pagesContent = pages.map((page) => {
    const [date, time] = new Date(page?.date || new Date())
      .toISOString()
      .split("T");
    const content = `---
title: "${page.title}"
slug: ${page.slug}
mainImage: ${
      page.mainImage
        ? JSON.stringify(
            {
              url: getSanityImageURL(page?.mainImage).url(),
              alt:
                page?.mainImage?.altText ||
                removeExt(page?.mainImage?.asset.originalFilename),
            },
            null,
            2
          )
        : '{ url: "", alt: "" }'
    }
isNavElement: false
seoKeywords: ${page.seoKeywords?.join(", ") ?? ""}
seoKeyphrase: ${page?.seoKeyphrase ?? ""}
  ${page?.categories ?? ""}
publishedAt: ${date} ${time}
description: "${page?.description ?? ""}"
---

${PortableText(page.body, options)}
`;
    const filename = join(import.meta.dirname, `content/pages/${page.slug}.md`);

    writeFileSync(filename, content);
    console.log("The file was saved!", filename);
  });

  const navPagesContent = navPages.map((page) => {
    const [date, time] = new Date(page?.date || new Date())
      .toISOString()
      .split("T");
    const content = `---
title: "${page.title}"
slug: ${page.slug}
mainImage: ${
      page.mainImage
        ? JSON.stringify(
            {
              url: getSanityImageURL(page?.mainImage).url(),
              alt:
                page?.mainImage?.altText ||
                removeExt(page?.mainImage?.asset.originalFilename),
            },
            null,
            2
          )
        : '{ url: "", alt: "" }'
    }
isNavElement: true
seoKeywords: ${page.seoKeywords?.join(", ") ?? ""}
seoKeyphrase: ${page?.seoKeyphrase ?? ""}
  ${page?.categories ?? ""}
publishedAt: ${date} ${time}
description: "${page?.description ?? ""}"
---

${PortableText(page.body, options)}
`;
    const filename = join(import.meta.dirname, `content/pages/${page.slug}.md`);

    writeFileSync(filename, content);
    console.log("The file was saved!", filename);
  });

  await Promise.all([
    ...glassTypesContent,
    ...postsContent,
    ...pagesContent,
    ...navPagesContent,
  ]);
}

main().catch(console.error);
```
