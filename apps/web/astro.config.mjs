import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://takera.us',
  output: 'server',
  adapter: cloudflare(),

  // Habilitar i18n nativo en Astro
  // 'es' es el idioma principal (rutas /)
  // 'en' es el idioma secundario (rutas /en/)
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    }
  },

  integrations: [
    sitemap(),
    react(),
    sanity({
      projectId: 'x97w0suy',
      dataset: 'production',
      useCdn: true,
    }),
  ],

  vite: {
    resolve: {
      alias: {
        // Usar la versión edge de React DOM server (compatible con Cloudflare Workers)
        'react-dom/server': 'react-dom/server.edge',
      },
    },
  },
});