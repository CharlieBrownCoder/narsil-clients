import type { APIRoute } from 'astro';
import { siteConfig } from '@config';

/**
 * Search agents, AI search agents included, are always allowed: a local
 * business gains from being cited by ChatGPT search, Perplexity or Copilot.
 * The training-only agents are allowed by default and refused when
 * crawlers.allowAiTraining is false. Blocking Google-Extended does not remove
 * a site from AI Overviews, which use Googlebot; it only opts out of Gemini
 * training. docs/PAGES.md, "Crawlers and AI".
 */
export const SEARCH_AGENTS = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Claude-SearchBot', 'Claude-User', 'DuckAssistBot'];
export const TRAINING_AGENTS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'meta-externalagent', 'Bytespider'];

export const GET: APIRoute = () => {
  const allowTraining = siteConfig.crawlers?.allowAiTraining ?? true;
  const groups = [
    `User-agent: *\nAllow: /\nDisallow: /thank-you/`,
    ...SEARCH_AGENTS.map((a) => `User-agent: ${a}\nAllow: /\nDisallow: /thank-you/`),
    ...(allowTraining ? [] : TRAINING_AGENTS.map((a) => `User-agent: ${a}\nDisallow: /`)),
  ];
  return new Response(`${groups.join('\n\n')}\n\nSitemap: ${siteConfig.url}/sitemap-index.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
};
