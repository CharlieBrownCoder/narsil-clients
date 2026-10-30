/**
 * Every page the build produces, for the XML sitemaps (src/pages/sitemap-*.xml.ts)
 * and the IndexNow ping. One row per page: its path, the sitemap section it
 * files under, the source files whose last commit is its lastmod, the images
 * worth an image-sitemap entry, and whether it is noindex (listed here so
 * the HTML sitemap and internal links can still reach it, but never in XML).
 *
 * scripts/validate.mjs holds this list to the built site both ways: every
 * indexable page in dist is in exactly one sitemap, and every sitemap URL is
 * an indexable page. Add a row when you add a page type, and the validator
 * tells you if you missed one.
 */
import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { siteConfig } from '@config';
import { OPTIONAL_PAGES } from './optional-pages';
import { getBusinessType } from './business-types';
import { lastmodFor } from './lastmod';

const PAGE_TITLES: Record<string, string> = {
  about: 'About', contact: 'Contact and free quote', reviews: 'Reviews', faq: 'Frequently asked questions', team: 'Meet the team',
  emergency: '24/7 emergency service', 'licenses-insurance': 'Licenses and insurance', pricing: 'Pricing guide', book: 'Book online',
  'quote-calculator': 'Quote calculator', sitemap: 'Sitemap',
};

export type SitemapSection = 'pages' | 'services' | 'service-areas' | 'blog';
export const SITEMAP_SECTIONS: SitemapSection[] = ['pages', 'services', 'service-areas', 'blog'];

export interface SitePage {
  path: string;
  section: SitemapSection;
  /** Short name and one-line summary for /llms.txt. */
  title: string;
  summary?: string;
  lastmod?: string;
  images: Array<{ src: string; caption: string }>;
  /** Built but kept out of the XML sitemap and marked noindex on the page. */
  noindex?: boolean;
}

const CONFIG = 'src/site.config.ts';
const content = (dir: string, id: string) => `src/content/${dir}/${id}.md`;
const img = (image: ImageMetadata | undefined, caption: string) => (image ? [{ src: image.src, caption }] : []);

/** Service-by-city pages without a city note read as templated; they build, but noindex and out of the sitemap until the note exists. */
export const comboIndexable = (note: string | undefined) => Boolean(note && note.trim());

let cache: Promise<SitePage[]> | undefined;
export function sitePages(): Promise<SitePage[]> {
  return (cache ??= buildSitePages());
}

async function buildSitePages(): Promise<SitePage[]> {
  const { business, pages } = siteConfig;
  const list: SitePage[] = [];
  const bt = getBusinessType(siteConfig.businessType);
  const add = (section: SitemapSection, path: string, title: string, sources: string[], opts: { summary?: string; images?: SitePage['images']; noindex?: boolean } = {}) =>
    list.push({ path, section, title, summary: opts.summary, lastmod: lastmodFor(sources), images: opts.images ?? [], noindex: opts.noindex ?? false });

  add('pages', '/', business.name, [CONFIG], { summary: business.tagline });
  for (const [slug, key] of Object.entries(OPTIONAL_PAGES)) {
    if (slug === 'thank-you' || slug === 'privacy-policy' || slug === 'terms') continue; // noindex pages
    if (key && !pages[key]) continue;
    add('pages', `/${slug}/`, PAGE_TITLES[slug] ?? slug, [CONFIG]);
  }
  if (pages.locations && business.locations.length) {
    add('pages', '/locations/', 'Locations', [CONFIG], { summary: business.locations.map((b) => b.city).join(', ') });
    for (const b of business.locations) add('pages', `/locations/${b.slug}/`, b.name, [CONFIG], { summary: `${b.street}, ${b.city}, ${b.state}` });
  }
  if (pages.gallery) {
    const projects = (await getCollection('projects')).filter((p) => (p.body ?? '').trim());
    add('pages', '/gallery/', 'Before and after gallery', projects.map((p) => content('projects', p.id)));
    for (const p of projects) add('pages', `/gallery/${p.id}/`, p.data.title, [content('projects', p.id)], { summary: p.data.description, images: [...img(p.data.before, `${p.data.title}: before`), ...img(p.data.after, `${p.data.title}: after`)] });
  }
  if (pages.resources) {
    const resources = await getCollection('resources');
    if (resources.length) {
      add('pages', '/resources/', 'Free guides and checklists', resources.map((r) => content('resources', r.id)));
      for (const r of resources) add('pages', `/resources/${r.id}/`, r.data.title, [content('resources', r.id)], { summary: r.data.description, images: img(r.data.cover, r.data.title) });
    }
  }

  if (pages.services) {
    const services = await getCollection('services');
    const categories = (await getCollection('categories')).filter((c) => services.some((s) => s.data.category === c.id));
    add('services', '/services/', `${bt.label} services`, services.map((s) => content('services', s.id)), { summary: services.map((s) => s.data.shortTitle ?? s.data.title).join(', ') });
    for (const c of categories) add('services', `/services/${c.id}/`, c.data.title, ['src/content/categories.json', ...services.filter((s) => s.data.category === c.id).map((s) => content('services', s.id))]);
    for (const s of services) add('services', `/services/${s.id}/`, s.data.title, [content('services', s.id)], { summary: s.data.excerpt, images: img(s.data.image, s.data.imageAlt ?? s.data.title) });
  }

  if (pages.serviceAreas) {
    const locations = await getCollection('locations');
    const services = await getCollection('services');
    add('service-areas', '/service-areas/', 'Service areas', locations.map((l) => content('locations', l.id)), { summary: locations.map((l) => l.data.city).join(', ') });
    for (const l of locations) {
      add('service-areas', `/service-areas/${l.id}/`, `${bt.label} in ${l.data.city}, ${l.data.state}`, [content('locations', l.id)], { images: img(l.data.image, `${l.data.city}, ${l.data.state}`) });
      if (!pages.serviceAreaCombos) continue;
      for (const s of services) {
        if (l.data.services.length && !l.data.services.includes(s.id)) continue;
        const note = l.data.serviceNotes[s.id];
        add('service-areas', `/service-areas/${l.id}/${s.id}/`, `${s.data.shortTitle ?? s.data.title} in ${l.data.city}, ${l.data.state}`, [content('locations', l.id), content('services', s.id)], { summary: note, images: img(s.data.image, `${s.data.shortTitle ?? s.data.title} in ${l.data.city}, ${l.data.state}`), noindex: !comboIndexable(note) });
      }
    }
  }

  if (pages.blog) {
    const posts = await getCollection('posts', ({ data }) => !data.draft);
    add('blog', '/blog/', 'Blog', posts.map((p) => content('posts', p.id)));
    for (const p of posts) add('blog', `/blog/${p.id}/`, p.data.title, [content('posts', p.id)], { summary: p.data.description, images: img(p.data.image, p.data.imageAlt ?? p.data.title) });
  }
  return list;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** One section's urlset. lastmod only, never changefreq or priority: crawlers ignore those and a uniform value is noise. */
export function renderUrlset(rows: SitePage[], abs: (path: string) => string) {
  const urls = rows.map((p) => {
    const images = p.images.map((i) => `<image:image><image:loc>${esc(abs(i.src))}</image:loc><image:caption>${esc(i.caption)}</image:caption></image:image>`).join('');
    return `<url><loc>${esc(abs(p.path))}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}${images}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.join('')}</urlset>\n`;
}

export function renderIndex(sections: Array<{ loc: string; lastmod?: string }>) {
  const items = sections.map((s) => `<sitemap><loc>${esc(s.loc)}</loc>${s.lastmod ? `<lastmod>${s.lastmod}</lastmod>` : ''}</sitemap>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items.join('')}</sitemapindex>\n`;
}

/** The sitemap's lastmod for one canonical path, so the page's WebPage schema says the same date. */
export async function lastmodForPath(path: string): Promise<string | undefined> {
  return (await sitePages()).find((p) => p.path === path)?.lastmod;
}

/**
 * /llms.txt: the business, then one line per indexable page, from the same
 * registry as the sitemaps. An emerging convention for AI agents; costs
 * nothing and cannot drift from the site because it renders from config and
 * content. Thin combo pages stay out of it as they stay out of the sitemap.
 */
export function renderLlmsTxt(rows: SitePage[], abs: (path: string) => string) {
  const { business } = siteConfig;
  const bt = getBusinessType(siteConfig.businessType);
  const hours = business.hours.map((h) => `${h.days.length > 2 ? `${h.days[0]} to ${h.days[h.days.length - 1]}` : h.days.join(' and ')} ${h.opens} to ${h.closes}`).join('; ');
  const lines = [
    `# ${business.name}`,
    '',
    `> ${business.description.trim()}`,
    '',
    `- Type: ${bt.label}`,
    `- Location: ${business.address.city}, ${business.address.state}${business.serviceRadiusMiles ? ` (serving about ${business.serviceRadiusMiles} miles around)` : ''}`,
    `- Phone: ${business.phone}`,
    `- Email: ${business.email}`,
    ...(hours ? [`- Hours: ${hours}`] : []),
    `- Website: ${siteConfig.url}`,
    `- Sitemap: ${abs('/sitemap-index.xml')}`,
    '',
  ];
  const sectionNames: Record<SitemapSection, string> = { pages: 'Pages', services: 'Services', 'service-areas': 'Service areas', blog: 'Blog' };
  for (const section of SITEMAP_SECTIONS) {
    const inSection = rows.filter((p) => p.section === section && !p.noindex);
    if (!inSection.length) continue;
    lines.push(`## ${sectionNames[section]}`, '');
    for (const p of inSection) lines.push(`- [${p.title}](${abs(p.path)})${p.summary ? `: ${p.summary.trim().replace(/\s+/g, ' ')}` : ''}`);
    lines.push('');
  }
  return lines.join('\n');
}
