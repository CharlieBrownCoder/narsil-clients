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
import { lastmodFor } from './lastmod';

export type SitemapSection = 'pages' | 'services' | 'service-areas' | 'blog';
export const SITEMAP_SECTIONS: SitemapSection[] = ['pages', 'services', 'service-areas', 'blog'];

export interface SitePage {
  path: string;
  section: SitemapSection;
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
  const add = (section: SitemapSection, path: string, sources: string[], images: SitePage['images'] = [], noindex = false) =>
    list.push({ path, section, lastmod: lastmodFor(sources), images, noindex });

  add('pages', '/', [CONFIG]);
  for (const [slug, key] of Object.entries(OPTIONAL_PAGES)) {
    if (slug === 'thank-you' || slug === 'privacy-policy' || slug === 'terms') continue; // noindex pages
    if (key && !pages[key]) continue;
    add('pages', `/${slug}/`, [CONFIG]);
  }
  if (pages.locations && business.locations.length) {
    add('pages', '/locations/', [CONFIG]);
    for (const b of business.locations) add('pages', `/locations/${b.slug}/`, [CONFIG]);
  }
  if (pages.gallery) {
    const projects = (await getCollection('projects')).filter((p) => (p.body ?? '').trim());
    add('pages', '/gallery/', projects.map((p) => content('projects', p.id)));
    for (const p of projects) add('pages', `/gallery/${p.id}/`, [content('projects', p.id)], [...img(p.data.before, `${p.data.title}: before`), ...img(p.data.after, `${p.data.title}: after`)]);
  }
  if (pages.resources) {
    const resources = await getCollection('resources');
    if (resources.length) {
      add('pages', '/resources/', resources.map((r) => content('resources', r.id)));
      for (const r of resources) add('pages', `/resources/${r.id}/`, [content('resources', r.id)], img(r.data.cover, r.data.title));
    }
  }

  if (pages.services) {
    const services = await getCollection('services');
    const categories = (await getCollection('categories')).filter((c) => services.some((s) => s.data.category === c.id));
    add('services', '/services/', services.map((s) => content('services', s.id)));
    for (const c of categories) add('services', `/services/${c.id}/`, ['src/content/categories.json', ...services.filter((s) => s.data.category === c.id).map((s) => content('services', s.id))]);
    for (const s of services) add('services', `/services/${s.id}/`, [content('services', s.id)], img(s.data.image, s.data.imageAlt ?? s.data.title));
  }

  if (pages.serviceAreas) {
    const locations = await getCollection('locations');
    const services = await getCollection('services');
    add('service-areas', '/service-areas/', locations.map((l) => content('locations', l.id)));
    for (const l of locations) {
      add('service-areas', `/service-areas/${l.id}/`, [content('locations', l.id)], img(l.data.image, `${l.data.city}, ${l.data.state}`));
      if (!pages.serviceAreaCombos) continue;
      for (const s of services) {
        if (l.data.services.length && !l.data.services.includes(s.id)) continue;
        add('service-areas', `/service-areas/${l.id}/${s.id}/`, [content('locations', l.id), content('services', s.id)], img(s.data.image, `${s.data.shortTitle ?? s.data.title} in ${l.data.city}, ${l.data.state}`), !comboIndexable(l.data.serviceNotes[s.id]));
      }
    }
  }

  if (pages.blog) {
    const posts = await getCollection('posts', ({ data }) => !data.draft);
    add('blog', '/blog/', posts.map((p) => content('posts', p.id)));
    for (const p of posts) add('blog', `/blog/${p.id}/`, [content('posts', p.id)], img(p.data.image, p.data.imageAlt ?? p.data.title));
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
