import { siteConfig, type PageKey } from '@config';

/** slug → config key. null = always built. */
export const OPTIONAL_PAGES: Record<string, PageKey | null> = {
  about: 'about',
  contact: 'contact',
  reviews: 'reviews',
  faq: 'faq',
  'privacy-policy': 'privacyPolicy',
  terms: 'terms',
  team: 'team',
  emergency: 'emergency',
  'licenses-insurance': 'licensesInsurance',
  pricing: 'pricingGuide',
  book: 'booking',
  'quote-calculator': 'quoteCalculator',
  'thank-you': null,
};

export const enabledOptionalPages = () =>
  Object.entries(OPTIONAL_PAGES).filter(([, key]) => key === null || siteConfig.pages[key]).map(([slug]) => slug);
