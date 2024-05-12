# Welcome to [Glass-Service Svendsen og Sønn AS](https://glass.no)

[![Netlify Status](https://api.netlify.com/api/v1/badges/84694e8f-be52-4b56-ad4d-da2725251fa1/deploy-status)](https://app.netlify.com/sites/glassno/deploys)

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

```js
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';
import { apiVersion, dataset, projectId, useCdn } from '$lib/sanity.api';
import { client, getAllPages, getAllPosts } from '$lib/sanity.client';
// @ts-expect-error Type
import PortableText from '@sanity/block-content-to-markdown';

const { getImageUrl } = PortableText;

const serializers = {
  types: {
    mainImage: ({ node, value }) => {
      return `![${node.alt || ''}](${getImageUrl({ options: { apiVersion, dataset, useCdn, projectId }, node })})`;
    },
    image: ({ node }) =>
      `![${node.alt || ''}](${getImageUrl({ options: { apiVersion, dataset, useCdn, projectId }, node })})`,
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
      return blank ? `<a href=${href} target="_blank" rel="noopener">${children}</a>` : `[${children}](${href})`;
    },
  },
};

async function main() {
  const options = { serializers, apiVersion, dataset, projectId, useCdn }
  const posts = await getAllPosts();
  const glassTypes = await getAllPosts('glassTypes');
  const navPages = await getAllPages(true);
  const pages = await getAllPages(false);

  const glassTypesContent = glassTypes.map((post) => {
    const [date, time] = new Date(post?.date || new Date()).toISOString().split('T');
    const content = `
---
layout: glassType
title: "${post.title}"
seoKeywords: ${post.seoKeywords}
seoKeyphrase: ${post.seoKeyphrase}
categories: ${post.categories}
date: ${date} ${time}
description: "${post.description}"
---

${PortableText(post.body, options)}
`;
    const filename = join(import.meta.dirname, `md/glass-types/${post.slug}.md`);

    writeFileSync(filename, content);
    console.log('The file was saved!', filename);
  });

  const postsContent = posts.map((post) => {
    const [date, time] = new Date(post?.date || new Date()).toISOString().split('T');
    const content = `
---
layout: post
title: "${post.title}"
seoKeywords: ${post.seoKeywords}
seoKeyphrase: ${post.seoKeyphrase}
categories: ${post.categories}
date: ${date} ${time}
description: "${post.description}"
---

${PortableText(post.body, options)}
`;
    const filename = join(import.meta.dirname, `md/posts/${post.slug}.md`);

    writeFileSync(filename, content);
    console.log('The file was saved!', filename);
  });

  const pagesContent = pages.map((page) => {
    const [date, time] = new Date(page?.date || new Date()).toISOString().split('T');
    const content = `
---
layout: page
title: "${page.title}"
isNavElement: false
seoKeywords: ${page.seoKeywords}
seoKeyphrase: ${page.seoKeyphrase}
categories: ${page.categories}
date: ${date} ${time}
description: "${page.description}"
---

${PortableText(page.body, options)}
`;
    const filename = join(import.meta.dirname, `md/pages/${page.slug}.md`);

    writeFileSync(filename, content);
    console.log('The file was saved!', filename);
  });

  const navPagesContent = navPages.map((page) => {
    const [date, time] = new Date(page?.date || new Date()).toISOString().split('T');
    const content = `
---
layout: page
title: "${page.title}"
isNavElement: true
seoKeywords: ${page.seoKeywords}
seoKeyphrase: ${page.seoKeyphrase}
categories: ${page.categories}
date: ${date} ${time}
description: "${page.description}"
---

${PortableText(page.body, options)}
`;
    const filename = join(import.meta.dirname, `md/pages/${page.slug}.md`);

    writeFileSync(filename, content);
    console.log('The file was saved!', filename);
  });

  await Promise.all([...glassTypesContent, ...postsContent, ...pagesContent, ...navPagesContent]);
}

main().catch(console.error);

```

