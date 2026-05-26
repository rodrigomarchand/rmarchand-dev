import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rmarchand.dev.br',
  integrations: [sitemap()],
});
