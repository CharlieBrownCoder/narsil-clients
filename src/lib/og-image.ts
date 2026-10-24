/**
 * Renders a 1200×630 PNG share image with satori + sharp using static TTF
 * instances from public/fonts/og/ and the theme colors. satori cannot read
 * variable fonts, so these are separate from the woff2 files the site serves.
 * If the TTFs are missing, ogFontsAvailable() is false and no images are built.
 *
 * One template for every page (src/lib/og-pages.ts supplies the variables):
 * brand mark, the page's headline, a context line, social.valueLine when set,
 * then the domain and phone. 1200×630 is the 1.91:1 size every platform
 * renders at full width; PNG keeps the type crisp and lands far under 5 MB.
 */
import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { siteConfig } from '@config';

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const dir = () => resolve(process.cwd(), 'public/fonts/og');
const pathFor = (family: string, weight: number) => resolve(dir(), `${slug(family)}-${weight}.ttf`);

/** Pick the heaviest available weight from a preference list. */
function firstExisting(family: string, weights: number[]) {
  for (const w of weights) if (existsSync(pathFor(family, w))) return { path: pathFor(family, w), weight: w };
  return undefined;
}

export function ogFontsAvailable(): boolean {
  const t = siteConfig.theme;
  return Boolean(firstExisting(t.fontHeading, [800, 700, 600, 500, 400]) && firstExisting(t.fontBody, [400, 500, 600]));
}

export async function renderOg(title: string, subtitle?: string): Promise<Buffer> {
  const t = siteConfig.theme;
  const { business } = siteConfig;
  const heading = firstExisting(t.fontHeading, [800, 700, 600, 500, 400])!;
  const body = firstExisting(t.fontBody, [400, 500, 600])!;
  const bodyBold = firstExisting(t.fontBody, [600, 700, 500]) ?? body;
  const [hData, bData, bbData] = await Promise.all([readFile(heading.path), readFile(body.path), readFile(bodyBold.path)]);
  const buf = (b: Buffer) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
  const big = title.length > 48;
  const valueLine = siteConfig.social?.valueLine?.trim();
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: t.secondary, color: '#fff', fontFamily: t.fontBody },
        children: [
          { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, fontWeight: bodyBold.weight, color: t.accent }, children: [{ type: 'div', props: { style: { width: 14, height: 14, borderRadius: 7, background: t.accent } } }, business.name] } },
          { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: 20 }, children: [
            { type: 'div', props: { style: { fontFamily: t.fontHeading, fontSize: big ? 56 : 72, fontWeight: heading.weight, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 1000 }, children: title } },
            subtitle ? { type: 'div', props: { style: { fontSize: 32, color: '#CBD5E1' }, children: subtitle } } : null,
            valueLine ? { type: 'div', props: { style: { fontSize: 28, fontWeight: bodyBold.weight, color: t.accent, marginTop: 8 }, children: valueLine } } : null,
          ] } },
          { type: 'div', props: { style: { display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#94A3B8' }, children: [
            { type: 'div', props: { children: siteConfig.url.replace(/^https?:\/\//, '') } },
            { type: 'div', props: { style: { color: t.accent, fontWeight: bodyBold.weight }, children: business.phone } },
          ] } },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: t.fontHeading, data: buf(hData), weight: heading.weight as 800, style: 'normal' },
        { name: t.fontBody, data: buf(bData), weight: body.weight as 400, style: 'normal' },
        { name: t.fontBody, data: buf(bbData), weight: bodyBold.weight as 600, style: 'normal' },
      ],
    },
  );
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
