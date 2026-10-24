#!/usr/bin/env node
/**
 * Post-build validation. Run after `astro build`:  npm run validate
 * Fails (exit 1) on anything that would hurt SEO or ship a broken page.
 *
 * Checks
 *  1. Every internal link in dist/ resolves to a built page or asset.
 *  2. Every page has exactly one <title> (15–70 chars), one meta description (50–170),
 *     one canonical, one H1, and JSON-LD that parses with no duplicate @id per page.
 *  3. Every <img> has alt text (empty alt allowed only with aria-hidden).
 *  4. Content: service×city combo pages without a serviceNotes entry (thin) are
 *     reported, and fail when THIN_COMBOS=fail. Category ids never collide with service slugs.
 *  5. Config: trust.rating requires a non-zero count; emergency.available requires phone or main phone.
 *  6. Share preview: one og:title of 60 chars or fewer, one og:description of 50 to 125
 *     (under 80 warns), twitter:title matching og:title, and one og:image that exists
 *     in dist/, measures 1200×630, is PNG or JPEG, and is under 5 MB.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { parse as parseYaml } from 'yaml';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

if (!existsSync(dist)) { console.error('dist/ not found. Run `npm run build` first.'); process.exit(1); }

// ---------- walk dist ----------
const pages = [];
const files = new Set();
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else { files.add(p.slice(dist.length).replace(/\\/g, '/')); if (e === 'index.html' || e === '404.html') pages.push(p); }
  }
})(dist);

// Share preview limits (the same numbers as OG_* in src/lib/seo.ts).
const OG_TITLE_MAX = 60;
const OG_DESCRIPTION_MIN = 80;
const OG_DESCRIPTION_MAX = 125;
const OG_DESCRIPTION_FLOOR = 50;
const OG_IMAGE = { width: 1200, height: 630, maxBytes: 5 * 1024 * 1024, formats: ['png', 'jpeg'] };
const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const metaContent = (html, attr, name) => [...html.matchAll(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`, 'g'))].map((m) => unescape(m[1]));
const imageChecks = new Map();
/** Measure a share image once per path; returns a list of problems. */
async function checkShareImage(src) {
  if (imageChecks.has(src)) return imageChecks.get(src);
  const run = (async () => {
    let path;
    try { path = decodeURIComponent(new URL(src).pathname); } catch { return [`og:image is not an absolute URL: ${src}`]; }
    const file = join(dist, path);
    if (!files.has(path) || !existsSync(file)) return [`og:image ${path} is not in dist/`];
    const bytes = statSync(file).size;
    const problems = [];
    if (bytes > OG_IMAGE.maxBytes) problems.push(`og:image ${path} is ${(bytes / 1024 / 1024).toFixed(1)} MB (limit 5 MB)`);
    try {
      const m = await sharp(file).metadata();
      if (!OG_IMAGE.formats.includes(m.format)) problems.push(`og:image ${path} is ${m.format}; use PNG or JPG`);
      if (m.width !== OG_IMAGE.width || m.height !== OG_IMAGE.height) problems.push(`og:image ${path} is ${m.width}×${m.height}; share images are 1200×630`);
    } catch (e) { problems.push(`og:image ${path} could not be read: ${e.message}`); }
    return problems;
  })();
  imageChecks.set(src, run);
  return run;
}

const resolvesTo = (href) => {
  let path = href.split('#')[0].split('?')[0];
  if (!path) return true;
  if (path.endsWith('/')) path += 'index.html';
  if (files.has(path)) return true;
  if (files.has(path + '/index.html')) return true;
  if (files.has(path + '.html')) return true;
  return false;
};

for (const file of pages) {
  const rel = file.slice(dist.length).replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');
  const is404 = rel.endsWith('404.html');
  const noindex = /<meta name="robots" content="noindex/.test(html);

  const titles = [...html.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => m[1]);
  if (titles.length !== 1) err(`${rel}: expected 1 <title>, found ${titles.length}`);
  else if (titles[0].length < 15 || titles[0].length > 70) warn(`${rel}: title length ${titles[0].length} ("${titles[0]}")`);

  const descs = [...html.matchAll(/<meta name="description" content="([^"]*)"/g)].map((m) => m[1]);
  if (descs.length !== 1) err(`${rel}: expected 1 meta description, found ${descs.length}`);
  else if (!noindex && (descs[0].length < 50 || descs[0].length > 170)) warn(`${rel}: description length ${descs[0].length}`);

  const canon = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)];
  if (canon.length !== 1) err(`${rel}: expected 1 canonical, found ${canon.length}`);

  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  if (h1s !== 1) err(`${rel}: expected 1 <h1>, found ${h1s}`);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const d = JSON.parse(m[1]);
      const ids = (d['@graph'] ?? [d]).map((n) => n['@id']).filter(Boolean);
      const dup = ids.find((id, i) => ids.indexOf(id) !== i);
      if (dup) err(`${rel}: duplicate @id in JSON-LD: ${dup}`);
      const types = (d['@graph'] ?? [d]).map((n) => n['@type']);
      if (!is404 && !types.some((t) => String(t).includes('Business') || t === 'LocalBusiness')) warn(`${rel}: no LocalBusiness entity in JSON-LD`);
    } catch (e) { err(`${rel}: JSON-LD does not parse: ${e.message}`); }
  }

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\balt=/.test(tag)) err(`${rel}: <img> without alt: ${tag.slice(0, 80)}`);
    else if (/\balt=""/.test(tag) && !/aria-hidden/.test(tag)) warn(`${rel}: decorative <img alt=""> without aria-hidden`);
  }

  for (const m of html.matchAll(/\bhref="(\/[^"]*)"/g)) {
    const href = m[1];
    if (href.startsWith('//') || href.startsWith('/fonts/')) continue;
    if (!resolvesTo(href)) err(`${rel}: broken internal link ${href}`);
  }

  // ---------- share preview ----------
  const ogTitles = metaContent(html, 'property', 'og:title');
  if (ogTitles.length !== 1) err(`${rel}: expected 1 og:title, found ${ogTitles.length}`);
  else {
    if (ogTitles[0].length > OG_TITLE_MAX) err(`${rel}: og:title is ${ogTitles[0].length} chars, over ${OG_TITLE_MAX} ("${ogTitles[0]}")`);
    const tw = metaContent(html, 'name', 'twitter:title');
    if (tw[0] !== ogTitles[0]) err(`${rel}: twitter:title differs from og:title`);
  }
  const ogDescs = metaContent(html, 'property', 'og:description');
  if (ogDescs.length !== 1) err(`${rel}: expected 1 og:description, found ${ogDescs.length}`);
  else {
    const n = ogDescs[0].length;
    if (n > OG_DESCRIPTION_MAX) err(`${rel}: og:description is ${n} chars, over ${OG_DESCRIPTION_MAX}`);
    else if (n < OG_DESCRIPTION_FLOOR) err(`${rel}: og:description is ${n} chars, under ${OG_DESCRIPTION_FLOOR} ("${ogDescs[0]}")`);
    else if (n < OG_DESCRIPTION_MIN && !noindex) warn(`${rel}: og:description is ${n} chars, under ${OG_DESCRIPTION_MIN}; add social.valueLine or a longer description`);
  }
  const ogImages = metaContent(html, 'property', 'og:image');
  if (ogImages.length !== 1) err(`${rel}: expected 1 og:image, found ${ogImages.length}`);
  else for (const problem of await checkShareImage(ogImages[0])) err(`${rel}: ${problem}`);
}

// ---------- content checks ----------
const fm = (src) => { const m = src.match(/^---\n([\s\S]*?)\n---/); return m ? parseYaml(m[1]) : {}; };
const readDir = (d) => existsSync(d) ? readdirSync(d).filter((f) => f.endsWith('.md')).map((f) => ({ id: f.replace(/\.md$/, ''), data: fm(readFileSync(join(d, f), 'utf8')) })) : [];
const services = readDir(join(root, 'src/content/services'));
const locations = readDir(join(root, 'src/content/locations'));
const categories = existsSync(join(root, 'src/content/categories.json')) ? JSON.parse(readFileSync(join(root, 'src/content/categories.json'), 'utf8')) : [];
const config = readFileSync(join(root, 'src/site.config.ts'), 'utf8');
const combosOn = /serviceAreaCombos:\s*true/.test(config);

for (const c of categories) if (services.some((s) => s.id === c.id)) err(`category id "${c.id}" collides with a service slug`);
for (const s of services) if (s.data.category && !categories.some((c) => c.id === s.data.category)) err(`service ${s.id}: unknown category "${s.data.category}"`);

if (combosOn) {
  const thin = [];
  for (const l of locations) {
    const offered = services.filter((s) => !l.data.services?.length || l.data.services.includes(s.id));
    for (const s of offered) if (!l.data.serviceNotes?.[s.id]) thin.push(`${l.id}/${s.id}`);
  }
  if (thin.length) {
    const msg = `${thin.length} combo page(s) have no serviceNotes and read as templated: ${thin.slice(0, 8).join(', ')}${thin.length > 8 ? ', …' : ''}`;
    (process.env.THIN_COMBOS === 'fail' ? err : warn)(msg);
  }
}

// calculator rules must point at real services
if (existsSync(join(root, 'src/calculator.config.ts'))) {
  const calc = readFileSync(join(root, 'src/calculator.config.ts'), 'utf8');
  for (const m of calc.matchAll(/service:\s*'([^']+)'/g)) if (!services.some((s) => s.id === m[1])) err(`calculator rule references unknown service "${m[1]}"`);
}
// offers must reference real services
for (const m of config.matchAll(/service:\s*'([^']+)'\s*\}/g)) if (!services.some((s) => s.id === m[1])) err(`offer references unknown service "${m[1]}"`);
// booking: provider set but no url
if (/provider:\s*'link'/.test(config) && !/url:\s*'https?:/.test(config)) err("booking.provider is 'link' but booking.url is empty");
if (/provider:\s*'embed'/.test(config) && !/embedUrl:\s*'https?:/.test(config)) err("booking.provider is 'embed' but booking.embedUrl is empty");
// resources: file must exist in public/
const resDir = join(root, 'src/content/resources');
for (const r of readDir(resDir)) if (r.data.file && !existsSync(join(root, 'public', r.data.file))) err(`resource ${r.id}: file ${r.data.file} not found in public/`);

// self-hosted font files must exist for the configured families
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
for (const key of ['fontHeading', 'fontBody']) {
  const m = config.match(new RegExp(`\\n\\s*${key}:\\s*'([^']+)'`));
  if (m && !existsSync(join(root, 'public/fonts', `${slug(m[1])}.woff2`))) err(`${key} "${m[1]}" has no file at public/fonts/${slug(m[1])}.woff2 (see public/fonts/README.md)`);
}
// hero assets and badge logos must exist
const heroImg = config.match(/\n\s*image:\s*'([^']+)'/); if (heroImg && !existsSync(join(root, 'src/assets/images', heroImg[1]))) err(`hero.image "${heroImg[1]}" not found in src/assets/images/`);
const heroMob = config.match(/\n\s*imageMobile:\s*'([^']+)'/); if (heroMob && !existsSync(join(root, 'src/assets/images', heroMob[1]))) err(`hero.imageMobile "${heroMob[1]}" not found in src/assets/images/`);
const cut = config.match(/\n\s*cutout:\s*'([^']+)'/); if (cut && !existsSync(join(root, 'src/assets/images', cut[1]))) err(`hero.cutout "${cut[1]}" not found in src/assets/images/`);
for (const m of config.matchAll(/src:\s*'(\/images\/badges\/[^']+)'/g)) if (!existsSync(join(root, 'public', m[1]))) err(`trust.logos file ${m[1]} not found in public/`);
const headline = config.match(/\n\s*headline:\s*'([^']*)'/); if (headline && (headline[1].split('*').length - 1) % 2) err('hero.headline has an unmatched * accent marker');

const rating = config.match(/rating:\s*\{[^}]*count:\s*(\d+)/);
if (rating && Number(rating[1]) === 0) err('trust.rating.count is 0; remove rating or set the real count');
if (/available:\s*true/.test(config) && !/phoneE164:\s*'\+/.test(config)) err('emergency.available is true but no phoneE164 is set');

// ---------- report ----------
for (const w of warnings) console.log('warn  ' + w);
for (const e of errors) console.log('ERROR ' + e);
console.log(`\n${pages.length} pages checked: ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
