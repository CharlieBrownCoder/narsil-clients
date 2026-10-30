import type { APIRoute } from 'astro';
import { abs } from '@/lib/utils';
import { renderLlmsTxt, sitePages } from '@/lib/site-pages';

export const GET: APIRoute = async () => new Response(renderLlmsTxt(await sitePages(), abs), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
