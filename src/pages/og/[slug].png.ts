import type { APIRoute, GetStaticPaths } from 'astro';
import { ogPages } from '@/lib/og-pages';
import { renderOg } from '@/lib/og-image';

export const getStaticPaths: GetStaticPaths = async () => (await ogPages()).map((p) => ({ params: { slug: p.slug }, props: { ...p } }));

export const GET: APIRoute = async ({ props }) => {
  const { title, subtitle } = props as { title: string; subtitle?: string };
  const png = await renderOg(title, subtitle);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' } });
};
