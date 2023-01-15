import GlassType from '$components/React/GlassType';
import { TagIcon } from '@sanity/icons';
import { format, parseISO } from 'date-fns';
import { defineField, defineType } from 'sanity';

import authorType from './author';

export default defineType({
  name: 'glassType',
  icon: GlassType,
  title: 'Glass Type',
  type: 'document',
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      title: 'Is this a Page?',
      name: 'isPage',
      type: 'boolean',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: authorType.name }],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                  },
                ],
              },
              {
                name: 'internalLink',
                type: 'object',
                icon: TagIcon,
                title: 'Internal link',
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Reference',
                    to: [{ type: 'post' }],
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),

    // HTML Group
    // defineField({
    //   name: 'htmlToArticleBody',
    //   title: 'HTML to Article Body',
    //   type: 'htmlToPortableText',
    //   group: 'htmlContent',
    // }),
    // defineField({
    //   name: 'articleBody',
    //   title: 'Article Body',
    //   type: 'array',
    //   of: [{ type: 'block' }],
    //   group: 'htmlContent',
    // }),
    // End HTML Group
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoKeyphrase',
      title: 'Focus Keyphrase',
      type: 'string',
      group: 'seo',
    }),
    defineField({
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
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      date: 'date',
      media: 'mainImage',
    },
    prepare({ title, media, slug, date }) {
      const subtitles = [slug && `/${slug.current}`, date && `on ${format(parseISO(date), 'LLL d, yyyy')}`].filter(
        Boolean,
      );

      return { title, media, subtitle: subtitles.join(' ') };
    },
  },
});
