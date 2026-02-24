import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { s3Storage } from '@payloadcms/plugin-cloud-storage/s3'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [],
    },
    {
      slug: 'products',
      access: { read: () => true }, // Público para que Astro lo lea
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'price', type: 'number', required: false }, // Cotización
        { name: 'description', type: 'textarea' },
      ],
      upload: true, // Habilita subida de imágenes
    },
    {
      slug: 'pages', // Para SEO y contenido dinámico
      fields: [
        { name: 'title', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'metaDescription', type: 'textarea' }, // SEO básico
      ]
    }
  ],
  editor: {
    // Aquí puedes configurar Lexical editor si lo deseas
  },
  secret: process.env.PAYLOAD_SECRET || 'SUPER_SECRET_KEY_CAMBIAR_EN_PROD',
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./local.db',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  plugins: [
    cloudStorage({
      collections: {
        'products': {
          adapter: s3Storage({
            config: {
              endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
              },
              region: 'auto',
            },
            bucket: 'takera-media',
          }),
        },
      },
    }),
  ],
  sharp,
})