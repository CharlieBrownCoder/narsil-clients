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
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { parse as parseYaml } from 'yaml';

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
