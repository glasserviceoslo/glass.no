import { TfiWrite } from 'react-icons/tfi';

export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: TfiWrite,
  groups: [
    {
      name: 'htmlContent',
      title: 'HTML Content',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    },
    // HTML Group
    {
      name: 'htmlToArticleBody',
      title: 'HTML to Article Body',
      type: 'htmlToPortableText',
      group: 'htmlContent',
    },
    {
      name: 'articleBody',
      title: 'Article Body',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'htmlContent',
    },
    // SEO Group
    { name: 'seoTitle', title: 'SEO title', type: 'string', group: 'seo' },

    {
      name: 'description',
      title: 'Meta Description',
      type: 'string',
      group: 'seo',
    },
    { name: 'seoKeyphrase', title: 'Focus Keyphrase', type: 'string', group: 'seo' },
    {
      name: 'seoKeywords',
      title: 'Keywords',
      type: 'array',
      group: 'seo',
      of: [
        {
          type: 'string',
        },
      ],
      options: {
        layout: 'tags',
      },
    },
    { name: 'seoImage', title: 'Image', type: 'image', group: 'seo' },
  ],

  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { slug } = selection;

      return Object.assign({}, selection, {
        subtitle: `/${slug.current}`,
      });
    },
  },
};
