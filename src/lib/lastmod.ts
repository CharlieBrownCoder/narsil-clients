/**
 * Last-modified dates for the XML sitemap, read from git at build time: the
 * date of the last commit that touched a page's source files. Never the
 * build time, which would stamp every page "changed today" on each deploy
 * and teach crawlers to ignore the field.
 *
 * On a shallow clone (Vercel's default) a file older than the clone boundary
 * reports the boundary commit, which is not its real date, so that page gets
 * no lastmod rather than a wrong one. Set VERCEL_DEEP_CLONE=true on the
 * project so the build sees full history (docs/NEW-CLIENT.md).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const cache = new Map<string, string | undefined>();
let shallowBoundary: Set<string> | undefined;

function git(args: string[]): string {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

/** Commits that end a shallow clone's history; a file last touched "at" one of them has an unknown real date. */
function boundary(): Set<string> {
  if (shallowBoundary) return shallowBoundary;
  const file = resolve(root, '.git/shallow');
  shallowBoundary = new Set(existsSync(file) ? readFileSync(file, 'utf8').split('\n').filter(Boolean) : []);
  return shallowBoundary;
}

export const isShallowClone = () => boundary().size > 0;

/** ISO date of the last commit touching any of the files, or undefined when unknown (uncommitted, or past a shallow boundary). */
export function lastmodFor(files: string[]): string | undefined {
  const key = [...files].sort().join('\n');
  if (cache.has(key)) return cache.get(key);
  const out = git(['log', '-1', '--format=%H %cI', '--', ...files]);
  const [hash, date] = out.split(' ');
  const value = hash && date && !boundary().has(hash) ? date : undefined;
  cache.set(key, value);
  return value;
}
