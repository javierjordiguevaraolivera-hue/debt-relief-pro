import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title_es',
      title: 'Title (Spanish)',
      type: 'string',
    }),
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug_es',
      title: 'Slug (Spanish)',
      type: 'slug',
      options: {
        source: 'title_es',
      },
    }),
    defineField({
      name: 'slug_en',
      title: 'Slug (English)',
      type: 'slug',
      options: {
        source: 'title_en',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt_es',
      title: 'Excerpt (Spanish)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'excerpt_en',
      title: 'Excerpt (English)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'featured_image',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'body_es',
      title: 'Body (Spanish)',
      type: 'blockContent',
    }),
    defineField({
      name: 'body_en',
      title: 'Body (English)',
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
      titleEs: 'title_es',
      titleEn: 'title_en',
      author: 'author.name',
      media: 'featured_image',
    },
    prepare(selection) {
      const {author, titleEn, titleEs} = selection
      return {title: titleEn || titleEs, subtitle: author && `by ${author}`, media: selection.media}
    },
  },
})
