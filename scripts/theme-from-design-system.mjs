#!/usr/bin/env node
/**
 * Generate a theme block for src/site.config.ts from the ui-ux-pro-max
 * design-system generator.
 *
 *   node scripts/theme-from-design-system.mjs "pressure washing, family owned, eco-friendly" --name "ClearShine"
 *   node scripts/theme-from-design-system.mjs "..." --name "X" --write      # patch site.config.ts in place
 *   node scripts/theme-from-design-system.mjs "..." --name "X" --variance 7 # push away from the default blue/orange
 *
 * Include the trade AND "home services" or "contractor" in the description so the
 * generator lands on the Home Services profile instead of the generic one.
 * Requires python3 (stdlib only). Prints the mapped theme and the generator's
 * full recommendation. Treat it as a starting point: similar trades converge
 * on the same palette, so vary the description or --variance per client.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const argv = process.argv.slice(2);
const description = argv.find((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1] !== '--name' && argv[argv.indexOf(a) - 1] !== '--variance');
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const name = opt('--name', 'Client');
const variance = opt('--variance');
const write = argv.includes('--write');
if (!description) { console.error('usage: theme-from-design-system.mjs "<business description>" --name "<Client>" [--variance 1-10] [--write]'); process.exit(1); }

const root = resolve(import.meta.dirname, '..');
const script = resolve(root, '.claude/skills/ui-ux-pro-max/scripts/search.py');
const args = [script, description, '--design-system', '-p', name, '--json'];
if (variance) args.push('--variance', String(variance));
const out = JSON.parse(execFileSync('python3', args, { encoding: 'utf8' }));
const ds = out.design_system;

const hex = (h) => h.replace('#', '');
const darken = (h, pct) => {
  const n = parseInt(hex(h), 16);
  const f = (c) => Math.max(0, Math.round(c * (1 - pct)));
  return '#' + [f((n >> 16) & 255), f((n >> 8) & 255), f(n & 255)].map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase();
};

const styleId = ds.style?.id ?? '';
const radius = /brutal|flat|swiss|editorial|industrial/.test(styleId) ? 'sharp' : /soft|clay|neumorph|glass|playful|bubbly/.test(styleId) ? 'pill' : 'rounded';
const pattern = (ds.pattern?.name ?? '').toLowerCase();
const heroStyle = /hero-centric|hero \+|visual|immersive/.test(pattern) ? 'image-bg' : /trust|conversion|lead|proof|form/.test(pattern) ? 'split' : 'centered';

const theme = {
  primary: ds.colors.primary,
  primaryDark: darken(ds.colors.primary, 0.18),
  secondary: ds.colors.foreground,
  accent: ds.colors.cta ?? ds.colors.accent,
  neutral: ds.colors.background,
  fontHeading: ds.typography.heading,
  fontBody: ds.typography.body,
  radius,
  heroStyle,
};

const block = `  theme: {
    primary: '${theme.primary}',
    primaryDark: '${theme.primaryDark}',
    secondary: '${theme.secondary}',
    accent: '${theme.accent}',
    neutral: '${theme.neutral}',
    fontHeading: '${theme.fontHeading}',
    fontBody: '${theme.fontBody}',
    radius: '${theme.radius}',
    heroStyle: '${theme.heroStyle}',`;

console.log(`\n# ${name}: ${ds.category} → ${ds.pattern?.name} / ${ds.style?.name}\n`);
console.log(block + '\n    logo: { ... keep ... },\n    ogImage: ... keep ...,\n  },\n');
console.log('Sections:', ds.pattern?.sections);
console.log('CTA:', ds.pattern?.cta_placement);
console.log('Avoid:', ds.anti_patterns);
console.log('Fonts: self-host both families (see docs/NEW-CLIENT.md). Generator URL:', ds.typography.google_fonts_url);

if (write) {
  const p = resolve(root, 'src/site.config.ts');
  const src = readFileSync(p, 'utf8');
  const re = /(  theme: \{\n)([\s\S]*?)(\n    logo:)/;
  if (!re.test(src)) { console.error('could not find theme block in site.config.ts'); process.exit(1); }
  writeFileSync(p, src.replace(re, `$1${block.split('\n').slice(1).join('\n')}$3`));
  console.log('\nWrote theme into src/site.config.ts (logo and ogImage untouched).');
}
