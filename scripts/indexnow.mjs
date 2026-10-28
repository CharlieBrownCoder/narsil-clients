#!/usr/bin/env node
/**
 * Post-build IndexNow ping (Bing, Yandex, and the engines that share the
 * protocol; Google does not read it). Runs as npm's postbuild and does
 * nothing unless all three hold: VERCEL_ENV is "production" (or --force),
 * tracking.indexNowKey is set in src/site.config.ts, and the built sitemaps
 * list a URL whose lastmod is within the last RECENT_DAYS. It submits only
 * those URLs, so a deploy that changed nothing submits nothing.
 *
 * The key file the engines verify is /<key>.txt (src/pages/[indexNowKey].txt.ts).
 * Never fails the build: a refused or unreachable endpoint is printed and exit 0.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const RECENT_DAYS = 7;
const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const force = process.argv.includes('--force');
const log = (m) => console.log(`indexnow: ${m}`);

const config = readFileSync(join(root, 'src/site.config.ts'), 'utf8');
const key = config.match(/\n\s*indexNowKey:\s*'([^']*)'/)?.[1]?.trim();
const site = config.match(/\n\s*url:\s*'(https?:\/\/[^']+)'/)?.[1];

if (!force && process.env.VERCEL_ENV !== 'production') { log('not a production deploy, nothing sent'); process.exit(0); }
if (!key) { log('tracking.indexNowKey is blank, nothing sent'); process.exit(0); }
if (!site || !existsSync(dist)) { log('no site url or no dist/, nothing sent'); process.exit(0); }

const since = Date.now() - RECENT_DAYS * 86400e3;
const urls = [];
for (const f of readdirSync(dist).filter((f) => /^sitemap-(?!index).*\.xml$/.test(f))) {
  const xml = readFileSync(join(dist, f), 'utf8');
  for (const m of xml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g)) {
    if (m[2] && Date.parse(m[2]) >= since) urls.push(m[1]);
  }
}
if (!urls.length) { log(`no URL changed in the last ${RECENT_DAYS} days, nothing sent`); process.exit(0); }

const host = new URL(site).host;
try {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation: `${site}/${key}.txt`, urlList: urls }),
  });
  log(`submitted ${urls.length} URL(s) for ${host}: HTTP ${res.status}${res.ok ? '' : ' (not accepted; check the key file at /' + key + '.txt)'}`);
} catch (e) {
  log(`endpoint unreachable, nothing sent: ${e.message}`);
}
