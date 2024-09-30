import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  adapter: vercel(),
  integrations: [react(), sitemap()],
  output: 'server',
  site: 'https://katana.mvze.net',
});
