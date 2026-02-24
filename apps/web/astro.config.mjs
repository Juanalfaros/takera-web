import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://takera.us', // Tu dominio final
  output: 'server', // Necesario para formularios dinámicos o SSR si lo usas
  adapter: cloudflare(),
  integrations: [sitemap()],
});