import {defineField, defineType} from 'sanity'

const formats = [
  {title: '300 x 250 - Medium Rectangle', value: 'mediumRectangle'},
  {title: '300 x 600 - Half Page', value: 'halfPage'},
  {title: '336 x 280 - Large Rectangle', value: 'largeRectangle'},
  {title: '728 x 90 - Leaderboard', value: 'leaderboard'},
  {title: '320 x 50 - Mobile Leaderboard', value: 'mobileLeaderboard'},
  {title: '320 x 100 - Large Mobile Banner', value: 'largeMobileBanner'},
  {title: '970 x 250 - Billboard', value: 'billboard'},
]

export const adBannerType = defineType({
  name: 'adBanner',
  title: 'Ad Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'category',
      title: 'Banner category',
      type: 'string',
      initialValue: 'cta',
      options: {
        layout: 'radio',
        list: [
          {title: 'CTA - Always links to Apply', value: 'cta'},
          {title: 'Blog - Links to an internal blog article', value: 'blog'},
          {title: 'Historia - Links to an internal customer story', value: 'historia'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'format',
      title: 'Ad size',
      description: 'Placement is automatic: horizontal banners go top, rectangles go inside the article, and 300 x 600 goes in the desktop sidebar.',
      type: 'string',
      initialValue: 'mediumRectangle',
      options: {
        list: formats,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'showOn',
      title: 'Show on',
      type: 'array',
      of: [{type: 'string'}],
      initialValue: ['blog', 'clientStory'],
      options: {
        layout: 'grid',
        list: [
          {title: 'Home', value: 'home'},
          {title: 'Blog articles', value: 'blog'},
          {title: 'Customer stories', value: 'clientStory'},
        ],
      },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'image',
      title: 'Banner image',
      type: 'image',
      options: {
        hotspot: false,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'internalPath',
      title: 'Internal destination path',
      description: 'Use paths like /blog/article-slug or /client-stories/story-slug. CTA banners ignore this and always go to Apply.',
      type: 'string',
      hidden: ({parent}) => parent?.category === 'cta',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {category?: string} | undefined

          if (parent?.category === 'cta') {
            return true
          }

          if (!value) {
            return 'Internal destination path is required for blog and historia banners.'
          }

          return value.startsWith('/') ? true : 'Use an internal path that starts with /.'
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      format: 'format',
      media: 'image',
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: [selection.category, selection.format].filter(Boolean).join(' / '),
        media: selection.media,
      }
    },
  },
})
