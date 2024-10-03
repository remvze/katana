import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react(), sitemap()],
  output: 'server',
  site: 'https://katana.mvze.net',
});
