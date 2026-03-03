import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

export const sanityClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'x97w0suy',
    dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
    useCdn: true,
    apiVersion: '2024-03-01',
})

const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: any) {
    return builder.image(source)
}
