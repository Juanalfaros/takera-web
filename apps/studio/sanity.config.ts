import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemaTypes'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { takeraTheme } from './sanity/theme'
import { StudioLayout } from './sanity/components/StudioLayout'

export default defineConfig({
    name: 'default',
    title: 'Takera Admin',

    theme: takeraTheme,

    studio: {
        components: {
            layout: StudioLayout,
        },
    },

    // Valores hardcodeados para el cliente (browser-safe)
    projectId: 'x97w0suy',
    dataset: 'production',

    plugins: [
        structureTool(),
        internationalizedArray({
            languages: [
                { id: 'es', title: 'Español' },
                { id: 'en', title: 'English' },
            ],
            defaultLanguages: ['es'],
            fieldTypes: ['string', 'text', 'blockContent'],
            buttonLocations: ['unstable__fieldAction'],
        }),
    ],

    schema: {
        types: schemaTypes,
    },
})