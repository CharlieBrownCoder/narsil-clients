import { siteConfig } from '@config';

export const abs = (path: string) => new URL(path, siteConfig.url).toString();

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export const isoDate = (d: Date) => d.toISOString().split('T')[0];

export const telHref = () => `tel:${siteConfig.business.phoneE164}`;

/** "06:30" -> "6:30 AM", "18:00" -> "6 PM" */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`;
}

export const pageEnabled = (key: keyof typeof siteConfig.pages) => siteConfig.pages[key];

export function titleCase(s: string) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function truncate(s: string, n = 155) {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
}

export const radiusClass = {
  sharp: 'rounded-none',
  rounded: 'rounded-xl',
  pill: 'rounded-full',
}[siteConfig.theme.radius];
