import { siteConfig } from '@config';
import { truncate } from './utils';

const { business } = siteConfig;

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
  /** Share headline (og:title). Blank = derived from title by buildOgTitle. */
  ogTitle?: string;
  /** Share description (og:description). Blank = derived from description by buildOgDescription. */
  ogDescription?: string;
}

/**
 * Share preview limits. X and LinkedIn cut og:title past 60 characters, and
 * mobile previews cut og:description past about 125. Under 80 a description
 * reads empty. Under 50 it is a title repeated. scripts/validate.mjs holds the
 * built pages to these numbers.
 */
export const OG_TITLE_MAX = 60;
export const OG_DESCRIPTION_MIN = 80;
export const OG_DESCRIPTION_MAX = 125;

/** Build a <title> with brand suffix, capped around 60 chars where possible. */
export function buildTitle(title: string, { suffix = true } = {}) {
  if (!suffix) return title;
  const full = `${title} | ${business.name}`;
  return full.length <= 65 ? full : title;
}

export function buildDescription(desc: string) {
  return truncate(desc, 158);
}

/**
 * og:title: the page title without the brand suffix (og:site_name carries the
 * brand), then without its last " | " segment while it is still over 60, then
 * cut at a word boundary. Pass an explicit ogTitle to lead with the result.
 */
export function buildOgTitle(title: string) {
  let t = title.endsWith(` | ${business.name}`) ? title.slice(0, -(business.name.length + 3)) : title;
  while (t.length > OG_TITLE_MAX && t.includes(' | ')) t = t.slice(0, t.lastIndexOf(' | '));
  return truncate(t, OG_TITLE_MAX);
}

/**
 * og:description: 80 to 125 characters. A long description is cut at the last
 * sentence end inside 125 characters (never at a sentence shorter than 40),
 * else at a word boundary. A short one gets social.valueLine appended when it
 * fits, so the preview ends on the value line instead of trailing off. Only
 * the configured line is ever added; nothing is invented.
 */
export function buildOgDescription(desc: string) {
  let d = desc.trim();
  if (d.length > OG_DESCRIPTION_MAX) {
    const head = d.slice(0, OG_DESCRIPTION_MAX);
    const ends = [...head.matchAll(/[.!?](?=\s|$)/g)].map((m) => m.index + 1).filter((i) => i >= 40);
    d = ends.length ? head.slice(0, ends[ends.length - 1]) : truncate(d, OG_DESCRIPTION_MAX);
  }
  const line = siteConfig.social?.valueLine?.trim();
  if (line && d.length < OG_DESCRIPTION_MIN) {
    const sep = /[.!?…]$/.test(d) ? ' ' : '. ';
    if (d.length + sep.length + line.length <= OG_DESCRIPTION_MAX) d = `${d}${sep}${line}`;
  }
  return d;
}

/** The og:title and og:description a page ships, from its overrides or its title and description. */
export const socialMeta = (meta: PageMeta) => ({
  ogTitle: meta.ogTitle ?? buildOgTitle(meta.title),
  ogDescription: meta.ogDescription ?? buildOgDescription(meta.description),
});

/** Frontmatter `seo` overrides as a spread for a view's meta object. Blank fields are left out. */
export function seoOverrides(seo?: { title?: string; description?: string; ogTitle?: string; ogDescription?: string }): Partial<PageMeta> {
  const out: Partial<PageMeta> = {};
  if (seo?.title) out.title = seo.title;
  if (seo?.description) out.description = seo.description;
  if (seo?.ogTitle) out.ogTitle = seo.ogTitle;
  if (seo?.ogDescription) out.ogDescription = seo.ogDescription;
  return out;
}

export const homeMeta = (): PageMeta => ({
  title: buildTitle(business.tagline),
  description: buildDescription(business.description),
  canonical: '/',
  // The share leads with the result (social.lead) and the hero's value line, not the company description.
  ...(siteConfig.social?.lead ? { ogTitle: buildOgTitle(siteConfig.social.lead) } : {}),
  ogDescription: buildOgDescription(siteConfig.hero.subheadline),
});

/** Proof points from config values that are set; blank when none is. Never a claim the config does not make. */
function proofClause() {
  const facts = [business.licenseNumber ? 'licensed' : '', business.insured ? 'insured' : ''].filter(Boolean);
  const promise = business.responseTimePromise?.trim().replace(/\.$/, '');
  const parts = [facts.length ? `${facts.join(' and ')}` : '', promise ?? ''].filter(Boolean);
  return parts.map((x) => `${x[0].toUpperCase()}${x.slice(1)}.`).join(' ');
}

const valueLine = () => siteConfig.social?.valueLine?.trim() ?? '';

export const serviceMeta = (title: string, excerpt: string, slug: string): PageMeta => ({
  title: buildTitle(`${title} in ${business.address.city}, ${business.address.state}`),
  description: buildDescription(excerpt),
  canonical: `/services/${slug}/`,
});

export const locationMeta = (city: string, state: string, slug: string, vertical: string): PageMeta => ({
  title: buildTitle(`${vertical} in ${city}, ${state}`),
  description: buildDescription(`${vertical} in ${city}, ${state} by ${business.name}. ${proofClause()} Call ${business.phone} for a free quote.`.replace(/\s{2,}/g, ' ')),
  canonical: `/service-areas/${slug}/`,
  // Share copy: what the customer gets and the value line, then the call to action if it fits.
  ogDescription: buildOgDescription(`${vertical} for ${city}, ${state} homes and businesses. ${valueLine()} Call ${business.phone} for a free quote.`.replace(/\s{2,}/g, ' ')),
});

export const comboMeta = (service: string, city: string, state: string, citySlug: string, serviceSlug: string, excerpt?: string): PageMeta => ({
  title: buildTitle(`${service} in ${city}, ${state}`),
  description: buildDescription(`${service} in ${city}, ${state} from ${business.name}. ${proofClause()} Free quotes, call ${business.phone}.`.replace(/\s{2,}/g, ' ')),
  canonical: `/service-areas/${citySlug}/${serviceSlug}/`,
  // Share copy: the service's outcome line (its excerpt), the city, then the value line if it fits.
  ...(excerpt ? { ogDescription: buildOgDescription(`${excerpt.trim().replace(/[.!?]?$/, '.')} Serving ${city}, ${state}. ${valueLine()}`.trim()) } : {}),
});
