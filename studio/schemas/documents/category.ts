import { FiTag } from 'react-icons/fi';

export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: FiTag,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'parent',
      type: 'reference',
      to: [{ type: 'category' }],
      // This ensures we cannot select other "children"
      options: {
        filter: '!defined(parent)',
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'parent.title',
    },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? `- ${subtitle}` : ``,
    }),
  },
};
