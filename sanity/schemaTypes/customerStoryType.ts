import {HeartIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const customerStoryType = defineType({
  name: 'customerStory',
  title: 'Customer Story',
  type: 'document',
  icon: HeartIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Customer name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      description: 'U.S. state. You can enter an abbreviation like FL or the full name like Florida.',
    }),
    defineField({
      name: 'rating',
      title: 'Star rating',
      type: 'number',
      initialValue: 5,
      validation: (rule) => rule.min(1).max(5).integer(),
    }),
    defineField({
      name: 'quote_es',
      title: 'Quote (Spanish)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'quote_en',
      title: 'Quote (English)',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'body_es',
      title: 'Full story (Spanish)',
      type: 'blockContent',
    }),
    defineField({
      name: 'body_en',
      title: 'Full story (English)',
      type: 'blockContent',
    }),
    defineField({
      name: 'seo_title_es',
      title: 'SEO Title (Spanish)',
      type: 'string',
    }),
    defineField({
      name: 'seo_title_en',
      title: 'SEO Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'seo_description_es',
      title: 'SEO Description (Spanish)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'seo_description_en',
      title: 'SEO Description (English)',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      state: 'state',
      rating: 'rating',
      media: 'photo',
    },
    prepare(selection) {
      const {rating, state, title} = selection
      return {
        title,
        subtitle: [state, rating ? `${rating} stars` : undefined].filter(Boolean).join(' • '),
        media: selection.media,
      }
    },
  },
})
