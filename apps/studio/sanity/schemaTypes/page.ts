import { defineType, defineField } from 'sanity'
import { getI18nType } from './i18nHelpers'

export const pageType = defineType({
    name: 'page',
    title: 'Páginas',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: getI18nType('string'),
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: (doc: any) => {
                    const esTitle = doc?.title?.find((t: any) => t._key === 'es')?.value
                    return esTitle || 'pagina'
                },
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Descripción',
            type: getI18nType('text'),
        }),
    ],
})


