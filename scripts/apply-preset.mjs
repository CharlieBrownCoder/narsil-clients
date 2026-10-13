#!/usr/bin/env node
/**
 * Apply a theme preset from src/theme-presets.ts to src/site.config.ts.
 *   node scripts/apply-preset.mjs            → list presets
 *   node scripts/apply-preset.mjs navy-orange
 * Fonts: after applying, put the matching woff2 files in public/fonts/ (and
 * TTFs in public/fonts/og/) or the build will fall back to system fonts.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const src = readFileSync(resolve(root, 'src/theme-presets.ts'), 'utf8');
const presets = [...src.matchAll(/\{ id: '([^']+)', label: '([^']+)', fits: \[([^\]]*)\], primary: '([^']+)', primaryDark: '([^']+)', secondary: '([^']+)', accent: '([^']+)', neutral: '([^']+)', fontHeading: '([^']+)', fontBody: '([^']+)', radius: '([^']+)', heroStyle: '([^']+)', headingCase: '([^']+)', dividers: '([^']+)' \}/g)]
  .map((m) => ({ id: m[1], label: m[2], fits: m[3], primary: m[4], primaryDark: m[5], secondary: m[6], accent: m[7], neutral: m[8], fontHeading: m[9], fontBody: m[10], radius: m[11], heroStyle: m[12], headingCase: m[13], dividers: m[14] }));

const id = process.argv[2];
if (!id) {
  for (const p of presets) console.log(`${p.id.padEnd(14)} ${p.label.padEnd(28)} ${p.primary} ${p.accent}  ${p.fontHeading}/${p.fontBody}  fits: ${p.fits.replace(/'/g, '')}`);
  process.exit(0);
}
const p = presets.find((x) => x.id === id);
if (!p) { console.error(`unknown preset "${id}"`); process.exit(1); }

const cfgPath = resolve(root, 'src/site.config.ts');
let cfg = readFileSync(cfgPath, 'utf8');
const marker = cfg.indexOf('export const siteConfig');
const head = cfg.slice(0, marker); let body = cfg.slice(marker);
for (const k of ['primary', 'primaryDark', 'secondary', 'accent', 'neutral', 'fontHeading', 'fontBody', 'radius', 'heroStyle', 'headingCase', 'dividers']) {
  const re = new RegExp(`(\\n\\s*${k}:\\s*)'[^']*'`);
  if (!re.test(body)) { console.warn(`theme key not found: ${k}`); continue; }
  body = body.replace(re, `$1'${p[k]}'`);
}
writeFileSync(cfgPath, head + body);
console.log(`Applied "${p.label}". Now add fonts: ${p.fontHeading} and ${p.fontBody} → public/fonts/<slug>.woff2 and public/fonts/og/<slug>-<weight>.ttf`);
