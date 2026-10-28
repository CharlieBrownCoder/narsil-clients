import type { APIRoute } from 'astro';
import { abs } from '@/lib/utils';
import { SITEMAP_SECTIONS, renderIndex, sitePages } from '@/lib/site-pages';

export const GET: APIRoute = async () => {
  const all = await sitePages();
  const sections = SITEMAP_SECTIONS.filter((s) => all.some((p) => p.section === s && !p.noindex)).map((s) => {
    const dates = all.filter((p) => p.section === s && p.lastmod).map((p) => p.lastmod!).sort();
    return { loc: abs(`/sitemap-${s}.xml`), lastmod: dates.at(-1) };
  });
  return new Response(renderIndex(sections), { headers: { 'Content-Type': 'application/xml' } });
};
