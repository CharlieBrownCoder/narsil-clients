// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { siteConfig } from './src/site.config.ts';

export default defineConfig({
  site: siteConfig.url,
  output: 'static',
  trailingSlash: 'always',
  // The XML sitemaps are src/pages/sitemap-*.xml.ts over src/lib/site-pages.ts
  // (per-section files, git lastmod, image entries), not @astrojs/sitemap.
  integrations: [],
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
