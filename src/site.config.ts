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
  | 'locations'
  | 'team'
  | 'emergency'
  | 'licensesInsurance'
  | 'terms'
  | 'financing'
  | 'careers'
  | 'privacyPolicy';

/** A real, staffed office or branch. Never a service-area city. */
export interface Branch {
  /** URL slug, e.g. "plano" → /locations/plano/ */
  slug: string;
  name: string; // "ClearShine Plano"
  street: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  phoneE164?: string;
  email?: string;
  hours?: OpeningHours[];
  geo?: { lat: number; lng: number };
  mapEmbedUrl?: string;
  /** Google Maps "directions" link or Business Profile URL */
  mapUrl?: string;
  directions?: string;
  parking?: string;
  /** Service-area location slugs this branch covers (empty = all) */
  serves?: string[];
}

export interface Credential {
  type: 'license' | 'insurance' | 'certification' | 'affiliation' | 'award';
  label: string; // "Texas Residential Contractor License"
  number?: string;
  issuer?: string;
  url?: string;
  /** ISO date; shown as "valid through" when set */
  expires?: string;
}

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
    /**
     * Physical branches. Leave empty for a single service-area business that
     * hides its address. Each entry gets /locations/<slug>/ when pages.locations is on.
     */
    locations: Branch[];
    /**
     * Emergency / after-hours service. Only set available:true if someone really
     * answers the phone. Adds a 24/7 CTA and marks `emergency: true` services.
     */
    emergency?: { available: boolean; phone?: string; phoneE164?: string; text: string };
    /** Shown next to CTAs when set, e.g. "We reply within 1 business hour". Blank = hidden. */
    responseTimePromise?: string;
    /** Licenses, insurance, certifications. Rendered on /licenses-insurance/ and About. */
    credentials: Credential[];
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

  /** Lead capture via Formspree (https://formspree.io). Create one form per client. */
  forms: {
    /** Formspree form ID, e.g. "xabcdefg". The form POSTs to https://formspree.io/f/<id>. */
    formspreeId: string;
    /** Where Formspree redirects after submit (set as _next). */
    thankYouPath: string;
  };

  /** Tracking IDs. Leave blank to disable. */
  tracking: {
    ga4?: string;
    gtm?: string;
    metaPixel?: string;
    /** Content of the google-site-verification meta tag */
    searchConsoleVerification?: string;
  };

  /** Trust signals shown across the site */
  trust: {
    badges: Array<{ label: string; icon?: string }>;
    guarantees: string[];
    /** Aggregate rating used in schema and UI. Keep in sync with real reviews. */
    rating?: { value: number; count: number; source: string };
  };

  /**
   * Reviews via Trustindex (https://www.trustindex.io). Create one widget per
   * placement and paste its ID. Blank = that placement is hidden.
   * The widget script is loaded once per page and only when an ID is set.
   */
  reviews: {
    trustindex: {
      /** Full-width carousel or grid on the home page */
      home?: string;
      /** Large layout on /reviews/ */
      page?: string;
      /** Compact strip on service, city, and combo pages */
      compact?: string;
      /** Small rating badge in the footer */
      badge?: string;
    };
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
    locations: [
      {
        slug: 'plano',
        name: 'ClearShine Plano (Main Office)',
        street: '1234 Legacy Dr Suite 100',
        city: 'Plano',
        state: 'TX',
        zip: '75024',
        phone: '(972) 555-0123',
        phoneE164: '+19725550123',
        geo: { lat: 33.0754, lng: -96.8245 },
        mapUrl: 'https://maps.google.com/?q=1234+Legacy+Dr+Plano+TX+75024',
        directions: 'On Legacy Dr just east of the Dallas North Tollway, in the office park behind the Legacy West garage.',
        parking: 'Free surface parking in front of Suite 100.',
      },
    ],
    emergency: {
      available: false,
      text: '24/7 emergency service available',
    },
    responseTimePromise: 'Quotes back within one business hour, 7am to 7pm',
    credentials: [
      { type: 'insurance', label: 'General liability insurance', issuer: 'Demo Mutual', number: 'GL-000000 (placeholder)' },
      { type: 'certification', label: 'Soft Wash Systems certified technician', issuer: 'SoftWash Systems' },
      { type: 'affiliation', label: 'Plano Chamber of Commerce member' },
    ],
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
    blog: false,
    locations: true,
    team: true,
    emergency: false,
    licensesInsurance: true,
    terms: true,
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
    formspreeId: '',
    thankYouPath: '/thank-you/',
  },

  tracking: {
    ga4: '',
    gtm: '',
    metaPixel: '',
    searchConsoleVerification: '',
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

  reviews: {
    trustindex: {
      home: '',
      page: '',
      compact: '',
      badge: '',
    },
  },

  promo: { enabled: true, text: '$50 off house + driveway bundle this month', href: '/contact/' },
};

export default siteConfig;
