/**
 * =====================================================================
 *  CLIENT SITE CONFIG
 *  This is the ONE file you edit to stand up a new client site.
 *  Everything else (pages, schema, nav, theme, tracking) derives from it.
 * =====================================================================
 */
import type { BusinessType } from './lib/business-types';

export type PageKey =
  | 'services'
  | 'serviceAreas'
  | 'serviceAreaCombos'
  | 'about'
  | 'contact'
  | 'reviews'
  | 'gallery'
  | 'faq'
  | 'blog'
  | 'financing'
  | 'careers'
  | 'privacyPolicy';

export interface OpeningHours {
  /** schema.org day names */
  days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>;
  opens: string; // "08:00"
  closes: string; // "18:00"
}

export interface SiteConfig {
  /** Vertical. Drives default schema type and copy. See src/lib/business-types.ts */
  businessType: BusinessType;
  /** Override the schema.org @type if the registry default isn't right. */
  schemaTypeOverride?: string;

  /** Canonical production URL, no trailing slash. */
  url: string;

  business: {
    name: string;
    legalName?: string;
    /** Short descriptor used in <title> suffixes and copy. */
    tagline: string;
    description: string;
    phone: string; // display, e.g. "(972) 555-0123"
    phoneE164: string; // tel: link, e.g. "+19725550123"
    email: string;
    foundingYear?: number;
    licenseNumber?: string;
    insured?: boolean;
    address: {
      street?: string;
      city: string;
      state: string; // 2-letter
      zip: string;
      country: string; // 2-letter
      /** Set false for service-area businesses that hide their address. Schema will omit street. */
      showStreet: boolean;
    };
    geo?: { lat: number; lng: number };
    hours: OpeningHours[];
    /** Price range string for schema, e.g. "$$" */
    priceRange?: string;
    /** Payment methods accepted */
    paymentAccepted?: string[];
    /** Social and citation profile URLs (schema sameAs). */
    sameAs: string[];
    /** Google Business Profile review URL (used in CTAs). */
    googleReviewUrl?: string;
    /** Google Maps embed URL for the contact page. */
    mapEmbedUrl?: string;
    /** Service radius in miles, used in copy and schema areaServed GeoCircle. */
    serviceRadiusMiles?: number;
  };

  /** Which page types are enabled for this client. */
  pages: Record<PageKey, boolean>;

  /** Primary nav. Items whose page is disabled are auto-removed. */
  nav: Array<{ label: string; href: string; page?: PageKey }>;

  /** Theme tokens. All colors are hex. */
  theme: {
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    neutral: string;
    fontHeading: string; // Google Fonts family name
    fontBody: string;
    /** "sharp" | "rounded" | "pill" */
    radius: 'sharp' | 'rounded' | 'pill';
    /** Hero layout variant */
    heroStyle: 'split' | 'centered' | 'image-bg';
    logo: { src: string; alt: string; width: number; height: number };
    /** Default social share image (1200x630) */
    ogImage: string;
  };

  /** Lead capture */
  forms: {
    provider: 'netlify' | 'formspree' | 'custom';
    /** Formspree endpoint or custom POST URL */
    action?: string;
    /** Where to send users after submit */
    thankYouPath: string;
  };

  /** Tracking IDs. Leave blank to disable. */
  tracking: {
    ga4?: string;
    gtm?: string;
    metaPixel?: string;
    /** CallRail swap script URL */
    callRail?: string;
  };

  /** Trust signals shown across the site */
  trust: {
    badges: Array<{ label: string; icon?: string }>;
    guarantees: string[];
    /** Aggregate rating used in schema and UI. Keep in sync with real reviews. */
    rating?: { value: number; count: number; source: string };
  };

  /** Offer / promo banner. Set enabled:false to hide. */
  promo?: { enabled: boolean; text: string; href?: string };
}

export const siteConfig: SiteConfig = {
  businessType: 'pressure-washing',
  url: 'https://example-pressure-washing.com',

  business: {
    name: 'ClearShine Pressure Washing',
    legalName: 'ClearShine Exterior Services LLC',
    tagline: 'Plano’s Top-Rated Pressure Washing Company',
    description:
      'ClearShine is a locally owned pressure washing company serving Plano, Frisco, McKinney, and the greater North Dallas area. We specialize in soft washing homes, cleaning driveways and patios, and restoring commercial properties, all with eco-friendly detergents and a 100% satisfaction guarantee.',
    phone: '(972) 555-0123',
    phoneE164: '+19725550123',
    email: 'hello@example-pressure-washing.com',
    foundingYear: 2016,
    insured: true,
    address: {
      street: '1234 Legacy Dr Suite 100',
      city: 'Plano',
      state: 'TX',
      zip: '75024',
      country: 'US',
      showStreet: true,
    },
    geo: { lat: 33.0754, lng: -96.8245 },
    hours: [
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '19:00' },
      { days: ['Saturday'], opens: '08:00', closes: '16:00' },
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Check', 'Zelle'],
    sameAs: [
      'https://www.facebook.com/example',
      'https://www.instagram.com/example',
      'https://www.yelp.com/biz/example',
      'https://g.page/example',
    ],
    googleReviewUrl: 'https://g.page/r/example/review',
    mapEmbedUrl: '',
    serviceRadiusMiles: 30,
  },

  pages: {
    services: true,
    serviceAreas: true,
    serviceAreaCombos: true,
    about: true,
    contact: true,
    reviews: true,
    gallery: true,
    faq: true,
    blog: true,
    financing: false,
    careers: false,
    privacyPolicy: true,
  },

  nav: [
    { label: 'Services', href: '/services/', page: 'services' },
    { label: 'Service Areas', href: '/service-areas/', page: 'serviceAreas' },
    { label: 'Gallery', href: '/gallery/', page: 'gallery' },
    { label: 'Reviews', href: '/reviews/', page: 'reviews' },
    { label: 'About', href: '/about/', page: 'about' },
    { label: 'Blog', href: '/blog/', page: 'blog' },
    { label: 'Contact', href: '/contact/', page: 'contact' },
  ],

  theme: {
    primary: '#0E7490',
    primaryDark: '#155E75',
    secondary: '#0F172A',
    accent: '#F59E0B',
    neutral: '#F8FAFC',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Inter',
    radius: 'rounded',
    heroStyle: 'split',
    logo: { src: '/images/logo.svg', alt: 'ClearShine Pressure Washing', width: 180, height: 40 },
    ogImage: '/images/og-default.jpg',
  },

  forms: {
    provider: 'netlify',
    thankYouPath: '/thank-you/',
  },

  tracking: {
    ga4: '',
    gtm: '',
    metaPixel: '',
    callRail: '',
  },

  trust: {
    badges: [
      { label: 'Licensed & Insured', icon: 'shield' },
      { label: 'Locally Owned', icon: 'home' },
      { label: 'Eco-Friendly Detergents', icon: 'leaf' },
      { label: 'Same-Week Scheduling', icon: 'calendar' },
    ],
    guarantees: ['100% satisfaction guarantee', 'Free, no-pressure quotes', 'Fully insured crews'],
    rating: { value: 4.9, count: 212, source: 'Google' },
  },

  promo: { enabled: true, text: '$50 off house + driveway bundle this month', href: '/contact/' },
};

export default siteConfig;
