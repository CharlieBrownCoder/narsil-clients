import type { APIRoute, GetStaticPaths } from 'astro';
import { abs } from '@/lib/utils';
import { SITEMAP_SECTIONS, renderUrlset, sitePages } from '@/lib/site-pages';

/** One sitemap per section so Search Console reports index coverage per section (services, service areas, blog, the rest). */
export const getStaticPaths: GetStaticPaths = async () => {
  const all = await sitePages();
  return SITEMAP_SECTIONS.filter((s) => all.some((p) => p.section === s && !p.noindex)).map((section) => ({ params: { section } }));
};

export const GET: APIRoute = async ({ params }) => {
  const rows = (await sitePages()).filter((p) => p.section === params.section && !p.noindex);
  return new Response(renderUrlset(rows, abs), { headers: { 'Content-Type': 'application/xml' } });
};
