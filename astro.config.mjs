// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig } from './src/site.config.ts';

export default defineConfig({
  site: siteConfig.url,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/privacy-policy/') && !page.includes('/thank-you/'),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // The main stylesheet is about 10 KB compressed; inlining it removes the one
    // render-blocking request on every page, which is the remaining lever for
    // first paint and LCP on text-first pages (audit 2026-10-21).
    inlineStylesheets: 'always',
  },
});
