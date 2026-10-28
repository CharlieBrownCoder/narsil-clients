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
  | 'pricingGuide'
  | 'booking'
  | 'resources'
  | 'quoteCalculator'
  | 'financing'
  | 'careers'
  | 'privacyPolicy'
  | 'sitemap';

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
    /**
     * Hero layout.
     *  photo    full-bleed photo with a dark scrim, copy left. The look most trade sites use.
     *  cutout   solid brand background, copy left, transparent-PNG person/truck right.
     *  split    light background, copy left, framed photo right.
     *  centered copy centered; over the photo with a scrim when hero.image is set.
     */
    heroStyle: 'photo' | 'cutout' | 'split' | 'centered';
    /** Quote form card inside the hero (desktop right column; stacked on mobile). */
    heroForm: boolean;
    /** Photo treatment for photo/centered heroes: dark scrim, brand-color scrim, or a duotone tint in the primary color. */
    heroScrim: 'dark' | 'brand' | 'duotone';
    /** flat = normal buttons; sticker = hard offset shadow in the dark color (playful brands). */
    buttonStyle: 'flat' | 'sticker';
    /** Display headings (h1, h2) in uppercase with tight tracking. Body and h3 unaffected. */
    headingCase: 'normal' | 'uppercase';
    /** Shaped edge between the hero and the next section, and above the CTA band. cloud suits playful brands; mountain suits outdoor and regional brands. */
    dividers: 'none' | 'angle' | 'curve' | 'wave' | 'cloud' | 'mountain';
    /** Service cards show the service photo (needs `image` on each service) or an icon tile. */
    serviceCards: 'photo' | 'icon';
    /** Row of service icon tiles overlapping the bottom edge of the home hero. */
    serviceStrip: boolean;
    /** Desktop-only sticky "Get a Quote" tab on the right edge. Off by default; one CTA per screen is the rule. */
    stickyQuoteTab: boolean;
    logo: { src: string; alt: string; width: number; height: number };
    /** Default social share image: 1200x630, PNG or JPG, under 5 MB. Used where no generated or page image applies. */
    ogImage: string;
  };

  /**
   * Share previews (Open Graph, X, LinkedIn, iMessage). Lead with the result
   * the customer gets, not the service name. Blank = not used.
   */
  social?: {
    /** Home page og:title, 60 characters or fewer, e.g. "Your home looking new again, in one visit". Blank = the tagline. */
    lead?: string;
    /**
     * One short value line, under 50 characters, e.g. "Written quote first. Insured crews."
     * Appended to share descriptions that run under 80 characters and printed on
     * every generated share image. Only promise what the business keeps.
     */
    valueLine?: string;
  };

  /**
   * Home page hero. Headline supports *accent* markup: the words between
   * asterisks render in the accent color. Images are file names inside
   * src/assets/images/ and are optimized at build.
   */
  hero: {
    /** Small line above the headline. Blank = "[Vertical] in [City], [ST]". */
    eyebrow?: string;
    /** e.g. "Plano's Top-Rated *Pressure Washing* Company" */
    headline: string;
    subheadline: string;
    /** Background / side photo, e.g. "hero.jpg" */
    image: string;
    imageAlt: string;
    /**
     * Portrait crop of the hero photo for phones, e.g. "hero-mobile.jpg" (800x1000).
     * Phones then download a 4:5 image sized for their screen instead of the
     * wide desktop photo. Generate it with `node scripts/hero-mobile-crop.mjs`.
     * Blank = phones use `image`.
     */
    imageMobile?: string;
    /** Transparent PNG of a person or truck for the cutout style, e.g. "hero-cutout.png" */
    cutout?: string;
    /** 2×2 checkmark bullets. [] = use trust.badges labels. */
    bullets: string[];
    /** checks = 2×2 checkmark list; pills = icon pill row (shorter labels work best) */
    bulletStyle: 'checks' | 'pills';
    /** Microcopy under the CTA pair, e.g. "No obligation. Quotes in writing." Blank = hidden. */
    ctaNote?: string;
  };

  /** Home page "How it works" band. 3 steps. [] = hidden. */
  process: Array<{ title: string; description: string }>;

  /**
   * Current specials. Rendered as coupon cards on the home page and /pricing/.
   * [] = hidden. Put the expiry on the card; stale offers cost trust.
   */
  offers: Array<{ title: string; detail: string; code?: string; expires?: string; service?: string }>;

  /**
   * Recurring maintenance plans (window cleaning, lawn, pest, HVAC tune-ups,
   * annual house wash). Rendered as tier cards on /pricing/ and the home page.
   * [] = hidden.
   */
  plans: Array<{ name: string; price: string; period: string; description: string; features: string[]; highlight?: boolean }>;

  /** Lead capture via Formspree (https://formspree.io). Create one form per client. */
  forms: {
    /** Formspree form ID, e.g. "xabcdefg". The form POSTs to https://formspree.io/f/<id>. */
    formspreeId: string;
    /** Where Formspree redirects after submit (set as _next). */
    thankYouPath: string;
    /**
     * 1 = all fields at once. 2 = step one asks about the job (service, city,
     * details), step two asks for contact details, with a progress bar.
     * Two steps convert better on mobile; without JS both steps just show.
     */
    steps: 1 | 2;
  };

  /**
   * Online booking. 'link' sends the Schedule button to an external scheduler
   * (Housecall Pro, Jobber, Calendly, ServiceTitan...). 'embed' renders the
   * provider's iframe on /book/. 'none' hides every Schedule button.
   */
  booking: {
    provider: 'none' | 'link' | 'embed';
    url?: string;
    /** iframe src for provider 'embed' */
    embedUrl?: string;
    label: string; // "Schedule Service"
  };

  /** Pricing guide page copy. Prices themselves come from services' startingPrice / priceRange. */
  pricing: {
    intro: string;
    disclaimer: string;
  };

  /** Tracking IDs. Leave blank to disable. */
  tracking: {
    ga4?: string;
    gtm?: string;
    metaPixel?: string;
    /** Content of the google-site-verification meta tag */
    searchConsoleVerification?: string;
    /**
     * IndexNow key (Bing, Yandex): 32 hex characters, any value you generate.
     * Builds /<key>.txt and lets scripts/indexnow.mjs submit changed URLs after
     * a production deploy. Blank = off.
     */
    indexNowKey?: string;
  };

  /** Trust signals shown across the site */
  trust: {
    badges: Array<{ label: string; icon?: string }>;
    guarantees: string[];
    /** Guarantee band on the home page. Blank title = hidden. Only promise what the contract says. */
    guarantee?: { title: string; text: string };
    /** Aggregate rating used in schema and UI. Keep in sync with real reviews. */
    rating?: { value: number; count: number; source: string };
    /** Big-number strip under the hero, e.g. { value: "5,000+", label: "Homes cleaned" }. [] = hidden. Real numbers only. */
    stats: Array<{ value: string; label: string }>;
    /** Third-party badge images (BBB, Google Guaranteed, awards). Files in public/images/badges/. [] = hidden. */
    logos: Array<{ src: string; alt: string; href?: string }>;
    /** "Trusted by" commercial client logos. Files in public/images/clients/. [] = hidden. Real clients only, with permission. */
    clients: Array<{ src: string; alt: string }>;
    /**
     * "Us vs. typical competitor" table. true/false render as check/cross,
     * strings render as text. rows: [] hides the section. Only claim what is true.
     */
    comparison: { competitorLabel: string; rows: Array<{ label: string; us: boolean | string; them: boolean | string }> };
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
    pricingGuide: true,
    booking: false,
    resources: true,
    quoteCalculator: true,
    financing: false,
    careers: false,
    privacyPolicy: true,
    /** Visitor-facing HTML sitemap at /sitemap/. The XML sitemap is always generated. */
    sitemap: true,
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
    heroStyle: 'photo',
    heroForm: true,
    heroScrim: 'dark',
    buttonStyle: 'flat',
    headingCase: 'uppercase',
    dividers: 'angle',
    serviceCards: 'photo',
    serviceStrip: true,
    stickyQuoteTab: false,
    logo: { src: '/images/logo.svg', alt: 'ClearShine Pressure Washing', width: 180, height: 40 },
    ogImage: '/images/og-default.jpg',
  },

  social: {
    lead: 'Your home looking new again, in one visit',
    valueLine: 'Written quote first. Insured crews.',
  },

  hero: {
    headline: 'Plano’s Top-Rated *Pressure Washing* Company',
    subheadline: 'Soft washing, driveways, roofs, and decks. Insured crews and a written quote before we start.',
    image: 'hero.jpg',
    imageMobile: 'hero-mobile.jpg',
    imageAlt: 'ClearShine technician soft washing a two-story brick home in Plano',
    cutout: 'hero-cutout.png',
    bullets: [],
    bulletStyle: 'checks',
    ctaNote: 'No obligation. Every quote in writing.',
  },

  process: [
    { title: 'Get a quote in minutes', description: 'Call or send a photo. Most quotes go out the same day, in writing, with no site visit needed.' },
    { title: 'Pick a day', description: 'We confirm by text and show up in the window we gave you. You don’t need to be home.' },
    { title: 'See the difference', description: 'Walk the property with the crew lead, or get before-and-after photos by text if you’re out.' },
  ],

  offers: [
    { title: '$50 off house + driveway', detail: 'Book both on one visit and take $50 off the total.', code: 'BUNDLE50', expires: 'Ends Oct 31', service: 'house-washing' },
    { title: 'Free gutter flush with any roof clean', detail: 'We flush the gutters after treating the roof, on us.', service: 'roof-cleaning' },
  ],

  plans: [
    { name: 'Annual', price: '$299', period: 'per year', description: 'One full house wash each spring, scheduled for you.', features: ['House soft wash', 'Priority spring scheduling', '10% off add-ons'] },
    { name: 'Twice a year', price: '$499', period: 'per year', description: 'Spring and fall visits keep algae from ever taking hold.', features: ['Two house washes', 'Driveway and walkway each visit', 'Priority scheduling', '15% off add-ons'], highlight: true },
    { name: 'Quarterly', price: '$899', period: 'per year', description: 'For shaded lots and HOA-strict neighborhoods.', features: ['Four visits', 'House, driveway, and patio each visit', 'Gutter exterior each visit', '20% off add-ons'] },
  ],

  forms: {
    formspreeId: '',
    thankYouPath: '/thank-you/',
    steps: 2,
  },

  booking: {
    provider: 'none',
    url: '',
    label: 'Schedule Service',
  },

  pricing: {
    intro: 'Every property is different, so these are typical ranges from recent jobs, not a quote. We confirm an exact price in writing before any work starts.',
    disclaimer: 'Ranges reflect typical single-family homes in our service area. Final pricing depends on size, condition, access, and add-ons. Estimates are not binding until confirmed in a written quote.',
  },

  tracking: {
    ga4: '',
    gtm: '',
    metaPixel: '',
    searchConsoleVerification: '',
    indexNowKey: '',
  },

  trust: {
    badges: [
      { label: 'Licensed & Insured', icon: 'shield' },
      { label: 'Locally Owned', icon: 'home' },
      { label: 'Eco-Friendly Detergents', icon: 'leaf' },
      { label: 'Same-Week Scheduling', icon: 'calendar' },
    ],
    guarantees: ['100% satisfaction guarantee', 'Free, no-pressure quotes', 'Fully insured crews'],
    guarantee: { title: 'The ClearShine Clean Guarantee', text: 'If any surface we cleaned isn’t what we promised, we come back and re-clean it free within 7 days. Written into every quote.' },
    rating: { value: 4.9, count: 212, source: 'Google' },
    stats: [
      { value: '212', label: '5-star Google reviews' },
      { value: '10+', label: 'Years in Plano' },
      { value: '3,400+', label: 'Homes washed' },
      { value: '100%', label: 'Satisfaction guarantee' },
    ],
    logos: [
      { src: '/images/badges/google-rating.svg', alt: '4.9 stars on Google' },
      { src: '/images/badges/licensed-insured.svg', alt: 'Licensed and insured' },
      { src: '/images/badges/bbb.svg', alt: 'BBB accredited business (placeholder)' },
      { src: '/images/badges/best-of.svg', alt: 'Best of Plano 2026 (placeholder)' },
    ],
    clients: [],
    comparison: {
      competitorLabel: 'Typical pressure washer',
      rows: [
        { label: 'Written quote before any work starts', us: true, them: 'Sometimes' },
        { label: 'Soft wash on siding, roofs, and painted surfaces', us: true, them: false },
        { label: 'Certificate of insurance on request', us: true, them: 'Ask' },
        { label: 'Scheduling', us: 'Same week', them: '2 to 3 weeks' },
        { label: 'Before and after photos sent after every job', us: true, them: false },
        { label: 'Satisfaction guarantee', us: '100%, in writing', them: false },
      ],
    },
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
