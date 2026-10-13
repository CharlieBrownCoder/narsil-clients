/**
 * Resolve a file name from src/site.config.ts to an optimized image.
 * Config can't import images (astro.config.mjs loads it under plain Node),
 * so config holds file names and this helper maps them through Vite's glob.
 */
import type { ImageMetadata } from 'astro';

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
