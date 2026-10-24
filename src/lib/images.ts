/**
 * Resolve a file name from src/site.config.ts to an optimized image.
 * Config can't import images (astro.config.mjs loads it under plain Node),
 * so config holds file names and this helper maps them through Vite's glob.
 */
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

const all = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{jpg,jpeg,png,webp,avif,gif,svg}', { eager: true });

export function asset(name?: string): ImageMetadata | undefined {
  if (!name) return undefined;
  const clean = name.replace(/^\/?src\/assets\/images\//, '').replace(/^\//, '');
  const hit = Object.entries(all).find(([p]) => p.endsWith(`/assets/images/${clean}`));
  return hit?.[1].default;
}

/** Fail loudly at build when a configured image is missing. */
export function requireAsset(name: string): ImageMetadata {
  const img = asset(name);
  if (!img) throw new Error(`Image "${name}" not found in src/assets/images/. Check site.config.ts.`);
  return img;
}

/**
 * A page photo as its share image: a 1200×630 JPG crop (cover) when the source
 * is at least that size. A smaller photo returns undefined so the page falls
 * back to its generated image, because Astro never enlarges and an 800×600
 * share image renders blurry or letterboxed in the preview card.
 */
export async function shareImage(img?: ImageMetadata): Promise<string | undefined> {
  if (!img || img.width < 1200 || img.height < 630) return undefined;
  return (await getImage({ src: img, width: 1200, height: 630, format: 'jpg' })).src;
}
