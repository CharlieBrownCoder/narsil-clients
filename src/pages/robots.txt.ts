import type { APIRoute } from 'astro';
import { siteConfig } from '@config';

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\nDisallow: /thank-you/\n\nSitemap: ${siteConfig.url}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
