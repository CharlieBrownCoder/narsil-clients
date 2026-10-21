#!/usr/bin/env node
/**
 * Make the phone crop of the hero photo: 800x1000 (4:5) WebP-friendly JPEG,
 * cropped from the source with the focus point you choose.
 *
 *   node scripts/hero-mobile-crop.mjs                 # hero.jpg -> hero-mobile.jpg, centered
 *   node scripts/hero-mobile-crop.mjs --focus right   # left | center | right | top | bottom
 *   node scripts/hero-mobile-crop.mjs --src hero.jpg --out hero-mobile.jpg --focus "60% 40%"
 *   node scripts/hero-mobile-crop.mjs --size 800x800     # square, when the subject is wide
 *
 * Then set hero.imageMobile: 'hero-mobile.jpg' in src/site.config.ts.
 */
import sharp from 'sharp';
import { resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((a, i, all) => (a.startsWith('--') ? [a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true] : [])).filter((x) => x.length));
const src = resolve('src/assets/images', String(args.src ?? 'hero.jpg'));
const out = resolve('src/assets/images', String(args.out ?? 'hero-mobile.jpg'));
const focus = String(args.focus ?? 'center');
const [W, H] = String(args.size ?? '800x1000').split('x').map(Number);

const img = sharp(src);
const meta = await img.metadata();
const scale = Math.max(W / meta.width, H / meta.height);
const sw = Math.round(meta.width * scale), sh = Math.round(meta.height * scale);
const pct = (v, axis) => { const m = focus.match(/(\d+)%\s+(\d+)%/); if (m) return Number(axis === 'x' ? m[1] : m[2]) / 100; return { left: 0, right: 1, top: 0, bottom: 1 }[focus] ?? 0.5; };
const left = Math.round((sw - W) * (['top', 'bottom'].includes(focus) ? 0.5 : pct(focus, 'x')));
const top = Math.round((sh - H) * (['left', 'right'].includes(focus) ? 0.5 : pct(focus, 'y')));
await img.resize(sw, sh).extract({ left, top, width: W, height: H }).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
console.log(`wrote ${out} (${W}x${H}, focus ${focus}) from ${meta.width}x${meta.height}`);
