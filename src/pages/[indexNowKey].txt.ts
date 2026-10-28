import type { APIRoute, GetStaticPaths } from 'astro';
import { siteConfig } from '@config';

/** The IndexNow key file at /<key>.txt, built only when tracking.indexNowKey is set. scripts/indexnow.mjs submits against it after a production deploy. */
export const getStaticPaths: GetStaticPaths = () => {
  const key = siteConfig.tracking.indexNowKey?.trim();
  return key ? [{ params: { indexNowKey: key } }] : [];
};

export const GET: APIRoute = ({ params }) => new Response(params.indexNowKey, { headers: { 'Content-Type': 'text/plain' } });
