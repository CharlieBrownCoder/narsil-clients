#!/usr/bin/env node
/**
 * Reset the demo content so a fresh client can be filled in.
 *
 *   npm run new-client -- --name "Acme Roofing" --type roofing --city Austin --state TX
 *
 * What it does:
 *  - Deletes demo services, locations, posts, projects, resources, faqs, categories, team
 *  - Disables the demo calculator rules (src/calculator.config.ts → enabled: false, rules: [])
 *  - Writes empty collections and one starter service + location
 *  - Rewrites the business basics in src/site.config.ts
 * It does NOT touch images, theme colors, or hosting config. Edit those by hand.
 */
import { rmSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const argv = process.argv.slice(2);
const args = {};
for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[i + 1] ?? '';
const name = args.name ?? 'New Client';
const type = args.type ?? 'pressure-washing';
const city = args.city ?? 'Your City';
const state = args.state ?? 'TX';
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const q = (s) => `'${s.replace(/'/g, "\\'")}'`;

const root = resolve(import.meta.dirname, '..');
const content = resolve(root, 'src/content');

for (const dir of ['services', 'locations', 'posts', 'projects', 'resources']) {
  rmSync(resolve(content, dir), { recursive: true, force: true });
  mkdirSync(resolve(content, dir), { recursive: true });
}
for (const f of ['faqs.json', 'categories.json', 'team.json']) writeFileSync(resolve(content, f), '[]\n');

writeFileSync(
  resolve(content, 'services/example-service.md'),
  `---
title: Example Service
shortTitle: Example
excerpt: One sentence that says what this service is and who it is for.
icon: spark
# image: ../../assets/images/service-example.jpg   (uncomment once the file exists)
# imageAlt: Describe the image
order: 1
benefits:
  - Benefit one
  - Benefit two
process:
  - title: Step one
    description: What happens first.
faqs:
  - question: A common question?
    answer: A clear answer.
related: []
---

Write 300 to 600 words about this service. Explain what it is, what is included, and why ${name} does it better. Use H2 headings.
`,
);

writeFileSync(
  resolve(content, `locations/${slug(city)}.md`),
  `---
city: ${city}
state: ${state}
primary: true
order: 1
zips: []
neighborhoods: []
landmarks: []
serviceNotes: {}
---

${name} is based in ${city}. Write 150 to 300 words specific to this city: neighborhoods, common home types, local conditions, and how long it takes you to get there.
`,
);

const cfgPath = resolve(root, 'src/site.config.ts');
const full = readFileSync(cfgPath, 'utf8');
const marker = 'export const siteConfig';
const cut = full.indexOf(marker);
if (cut < 0) throw new Error('could not find siteConfig in site.config.ts');
const head = full.slice(0, cut);
let cfg = full.slice(cut);
const set = (key, value) => {
  const re = new RegExp(`(\\n\\s*${key}:\\s*)([^,\\n]+)(,?)`);
  if (!re.test(cfg)) return console.warn(`config key not found: ${key}`);
  cfg = cfg.replace(re, `$1${value}$3`);
};
set('businessType', q(type));
set('name', q(name));
set('legalName', q(name));
set('tagline', q(name));
cfg = cfg.replace(/(\n\s*description:\s*)'(?:[^'\\]|\\.)*'/, `$1${q(`Describe ${name} in two or three sentences. Mention ${city}, the main services, and what sets you apart.`)}`);
cfg = cfg.replace(/city: '[^']*'/, `city: '${city}'`).replace(/state: '[^']*'/, `state: '${state}'`);
cfg = cfg.replace(/foundingYear: \d+/, 'foundingYear: undefined');
cfg = cfg.replace(/(\n\s*headline:\s*)'[^']*'/, `$1${q(`${city}’s Top-Rated *${type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}* Company`)}`);
cfg = cfg.replace(/(\n\s*subheadline:\s*)'[^']*'/, `$1'One sentence on what you do, for whom, and the guarantee behind it.'`);
cfg = cfg.replace(/(\n\s*imageAlt:\s*)'[^']*'/, `$1'Describe the hero photo'`);
// Share copy is the client's own result and value line; blank until kickoff supplies them (blank = tagline, no value line).
cfg = cfg.replace(/(\n\s*lead:\s*)'[^']*'/, `$1''`).replace(/(\n\s*valueLine:\s*)'[^']*'/, `$1''`);
cfg = cfg.replace(/stats: \[[\s\S]*?\n    \],/, 'stats: [],');
cfg = cfg.replace(/logos: \[[\s\S]*?\n    \],/, 'logos: [],');
cfg = cfg.replace(/clients: \[[\s\S]*?\],/, 'clients: [],');
cfg = cfg.replace(/rows: \[[\s\S]*?\n      \],/, 'rows: [],');
cfg = cfg.replace(/\n  process: \[[\s\S]*?\n  \],/, '\n  process: [],');
cfg = cfg.replace(/\n  offers: \[[\s\S]*?\n  \],/, '\n  offers: [],');
cfg = cfg.replace(/\n  plans: \[[\s\S]*?\n  \],/, '\n  plans: [],');
cfg = cfg.replace(/(\n\s*ctaNote:\s*)'[^']*'/, "$1''");
cfg = cfg.replace(/guarantee: \{[^}]*\},\n/, "guarantee: { title: '', text: '' },\n");
cfg = cfg.replace(/rating: \{[^}]*\}/, 'rating: undefined');
cfg = cfg.replace(/promo: \{ enabled: true/, 'promo: { enabled: false');
cfg = cfg.replace(/locations: \[[\s\S]*?\n    \],/, 'locations: [],');
cfg = cfg.replace(/credentials: \[[\s\S]*?\n    \],/, 'credentials: [],');
cfg = cfg.replace(/responseTimePromise: '[^']*'/, "responseTimePromise: ''");
writeFileSync(cfgPath, head + cfg);

const calcPath = resolve(root, 'src/calculator.config.ts');
let calc = readFileSync(calcPath, 'utf8');
calc = calc.replace(/enabled: true/, 'enabled: false').replace(/rules: \[[\s\S]*\n  \],\n\};/, 'rules: [],\n};');
writeFileSync(calcPath, calc);

console.log(`\nReset for ${name} (${type}) in ${city}, ${state}.\nNext:\n  1. Edit src/site.config.ts (url, phone, email, address, hours, sameAs, theme)\n  2. Replace public/images/*\n  3. Fill src/content/\n  4. npm run build\n`);
