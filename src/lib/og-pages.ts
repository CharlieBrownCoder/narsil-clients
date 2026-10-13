/**
 * Pages that get a generated social share image at /og/<slug>.png.
 * Seo.astro looks up the current canonical path here; anything not listed
 * falls back to theme.ogImage. Add a row to cover a new page type.
 */
import { getCollection } from 'astro:content';
import { siteConfig } from '@config';
import { getBusinessType } from './business-types';
import { ogFontsAvailable } from './og-image';

export interface OgPage {
  slug: string; // file name without .png
  path: string; // canonical path it belongs to
  title: string;
  subtitle?: string;
}

export const ogSlug = (path: string) => (path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '--'));

let cache: Promise<OgPage[]> | undefined;
export function ogPages(): Promise<OgPage[]> {
  if (!ogFontsAvailable()) return Promise.resolve([]);
  return (cache ??= buildOgPages());
}

async function buildOgPages(): Promise<OgPage[]> {
  const { business, pages } = siteConfig;
  const bt = getBusinessType(siteConfig.businessType);
  const city = `${business.address.city}, ${business.address.state}`;
  const list: OgPage[] = [{ slug: 'home', path: '/', title: business.tagline, subtitle: `${bt.label} · ${city}` }];
  const add = (path: string, title: string, subtitle?: string) => list.push({ slug: ogSlug(path), path, title, subtitle });

  if (pages.services) {
    add('/services/', `${bt.label} services`, city);
    for (const s of await getCollection('services')) add(`/services/${s.id}/`, s.data.title, city);
    for (const c of await getCollection('categories')) add(`/services/${c.id}/`, c.data.title, city);
  }
  if (pages.serviceAreas) {
    add('/service-areas/', 'Areas we serve', `${bt.label} within ${business.serviceRadiusMiles ?? 25} miles of ${business.address.city}`);
    const services = await getCollection('services');
    for (const l of await getCollection('locations')) {
      add(`/service-areas/${l.id}/`, `${bt.label} in ${l.data.city}, ${l.data.state}`, business.name);
      if (pages.serviceAreaCombos)
        for (const s of services) if (!l.data.services.length || l.data.services.includes(s.id)) add(`/service-areas/${l.id}/${s.id}/`, `${s.data.shortTitle ?? s.data.title} in ${l.data.city}, ${l.data.state}`, business.name);
    }
  }
  if (pages.locations) for (const b of business.locations) add(`/locations/${b.slug}/`, b.name, `${b.street}, ${b.city}`);
  if (pages.blog) for (const p of await getCollection('posts', ({ data }) => !data.draft)) add(`/blog/${p.id}/`, p.data.title, `${business.name} blog`);
  if (pages.gallery) for (const p of await getCollection('projects')) if ((p.body ?? '').trim()) add(`/gallery/${p.id}/`, p.data.title, p.data.location ?? 'Case study');
  if (pages.resources) for (const r of await getCollection('resources')) add(`/resources/${r.id}/`, r.data.title, `Free ${r.data.fileType} download`);
  const simple: Array<[keyof typeof pages, string, string, string?]> = [
    ['about', '/about/', `About ${business.name}`, city],
    ['contact', '/contact/', 'Get a free quote', business.phone],
    ['reviews', '/reviews/', `${business.name} reviews`, siteConfig.trust.rating ? `${siteConfig.trust.rating.value} stars · ${siteConfig.trust.rating.count} reviews` : undefined],
    ['gallery', '/gallery/', 'Before & after', city],
    ['faq', '/faq/', 'Frequently asked questions', bt.label],
    ['team', '/team/', 'Meet the team', business.name],
    ['pricingGuide', '/pricing/', `${bt.label} prices`, city],
    ['quoteCalculator', '/quote-calculator/', 'Instant estimate', bt.label],
    ['licensesInsurance', '/licenses-insurance/', 'Licensed & insured', business.name],
    ['emergency', '/emergency/', `24/7 emergency ${bt.label.toLowerCase()}`, city],
    ['resources', '/resources/', 'Free guides & checklists', business.name],
  ];
  for (const [key, path, title, subtitle] of simple) if (pages[key]) add(path, title, subtitle);
  return list;
}
