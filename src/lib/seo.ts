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
}

/** Build a <title> with brand suffix, capped around 60 chars where possible. */
export function buildTitle(title: string, { suffix = true } = {}) {
  if (!suffix) return title;
  const full = `${title} | ${business.name}`;
  return full.length <= 65 ? full : title;
}

export function buildDescription(desc: string) {
  return truncate(desc, 158);
}

export const homeMeta = (): PageMeta => ({
  title: `${business.name} | ${business.tagline}`,
  description: buildDescription(business.description),
  canonical: '/',
});

export const serviceMeta = (title: string, excerpt: string, slug: string): PageMeta => ({
  title: buildTitle(`${title} in ${business.address.city}, ${business.address.state}`),
  description: buildDescription(excerpt),
  canonical: `/services/${slug}/`,
});

export const locationMeta = (city: string, state: string, slug: string, vertical: string): PageMeta => ({
  title: buildTitle(`${vertical} in ${city}, ${state}`),
  description: buildDescription(
    `Looking for ${vertical.toLowerCase()} in ${city}, ${state}? ${business.name} serves ${city} homeowners and businesses with fast scheduling and guaranteed results. Call ${business.phone} for a free quote.`,
  ),
  canonical: `/service-areas/${slug}/`,
});

export const comboMeta = (service: string, city: string, state: string, citySlug: string, serviceSlug: string): PageMeta => ({
  title: buildTitle(`${service} in ${city}, ${state}`),
  description: buildDescription(
    `Professional ${service.toLowerCase()} in ${city}, ${state} from ${business.name}. Licensed, insured, and locally trusted. Free quotes, call ${business.phone}.`,
  ),
  canonical: `/service-areas/${citySlug}/${serviceSlug}/`,
});
