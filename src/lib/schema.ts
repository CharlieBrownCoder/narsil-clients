/**
 * JSON-LD builders. Every page composes a graph from these.
 *
 * Conventions
 * - Stable @id URIs so entities can reference each other across pages:
 *     <site>/#organization   the LocalBusiness
 *     <site>/#website        the WebSite
 *     <page>/#webpage        the WebPage for the current URL
 *     <page>/#breadcrumb     the BreadcrumbList
 *     <page>/#service        the Service on service pages
 * - Street address is omitted when business.address.showStreet is false
 *   (service-area businesses per Google guidelines).
 */
import { siteConfig } from '@config';
import { getBusinessType } from './business-types';
import { abs } from './utils';

const { business, trust, theme } = siteConfig;
const bt = getBusinessType(siteConfig.businessType);

export const ORG_ID = abs('/#organization');
const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const WEBSITE_ID = abs('/#website');

type Thing = Record<string, unknown>;

export function schemaTypes(): string | string[] {
  const primary = siteConfig.schemaTypeOverride ?? bt.schemaType;
  const extra = bt.additionalSchemaTypes ?? [];
  return extra.length ? [primary, ...extra] : primary;
}

export function postalAddress(): Thing {
  const a = business.address;
  return {
    '@type': 'PostalAddress',
    ...(a.showStreet && a.street ? { streetAddress: a.street } : {}),
    addressLocality: a.city,
    addressRegion: a.state,
    postalCode: a.zip,
    addressCountry: a.country,
  };
}

export function openingHours(): Thing[] {
  return business.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  }));
}

export function aggregateRating(): Thing | undefined {
  if (!trust.rating || trust.rating.count < 1) return undefined;
  return {
    '@type': 'AggregateRating',
    ratingValue: trust.rating.value,
    reviewCount: trust.rating.count,
    bestRating: 5,
    worstRating: 1,
  };
}

export interface AreaInput {
  city: string;
  state: string;
  cityUrl?: string;
}

export function areaServed(areas: AreaInput[]): Thing[] {
  const list: Thing[] = areas.map((a) => ({
    '@type': 'City',
    name: `${a.city}, ${a.state}`,
    ...(a.cityUrl ? { sameAs: a.cityUrl } : {}),
  }));
  if (business.geo && business.serviceRadiusMiles) {
    list.push({
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng },
      geoRadius: Math.round(business.serviceRadiusMiles * 1609.34),
    });
  }
  return list;
}

/** The core LocalBusiness entity. Include on every page (referenced by @id). */
export function localBusiness(opts: { areas?: AreaInput[]; services?: { name: string; url: string }[]; full?: boolean } = {}): Thing {
  const base: Thing = {
    '@type': schemaTypes(),
    '@id': ORG_ID,
    name: business.name,
    ...(business.legalName ? { legalName: business.legalName } : {}),
    url: abs('/'),
    telephone: business.phoneE164,
    email: business.email,
    image: abs(theme.ogImage),
    logo: { '@type': 'ImageObject', url: abs(theme.logo.src) },
    address: postalAddress(),
  };
  if (!opts.full) return base;

  return {
    ...base,
    description: business.description,
    ...(business.priceRange ? { priceRange: business.priceRange } : {}),
    ...(business.foundingYear ? { foundingDate: String(business.foundingYear) } : {}),
    ...(business.geo
      ? { geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng } }
      : {}),
    openingHoursSpecification: openingHours(),
    contactPoint: contactPoints(opts.areas),
    ...(business.paymentAccepted ? { paymentAccepted: business.paymentAccepted.join(', ') } : {}),
    sameAs: business.sameAs,
    ...(opts.areas?.length ? { areaServed: areaServed(opts.areas) } : {}),
    ...(aggregateRating() ? { aggregateRating: aggregateRating() } : {}),
    ...(business.credentials.length ? { hasCredential: credentials() } : {}),
    ...(business.locations.length > 1
      ? { subOrganization: business.locations.map((b) => ({ '@id': branchId(b.slug) })) }
      : {}),
    ...(opts.services?.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${bt.label} Services`,
            itemListElement: opts.services.map((s) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: s.name, url: abs(s.url) },
            })),
          },
        }
      : {}),
  };
}

/** Customer service contact points. Adds an emergency point when business.emergency.available. */
export function contactPoints(areas?: AreaInput[]): Thing[] {
  const base = {
    '@type': 'ContactPoint',
    telephone: business.phoneE164,
    email: business.email,
    availableLanguage: 'English',
    ...(areas?.length ? { areaServed: areas.map((a) => `${a.city}, ${a.state}`) } : {}),
  };
  const points: Thing[] = [
    { ...base, contactType: 'customer service', hoursAvailable: openingHours() },
    { ...base, contactType: 'sales', hoursAvailable: openingHours() },
  ];
  if (business.emergency?.available) {
    points.push({
      ...base,
      telephone: business.emergency.phoneE164 ?? business.phoneE164,
      contactType: 'emergency',
      hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ALL_DAYS, opens: '00:00', closes: '23:59' },
    });
  }
  return points;
}

export function credentials(): Thing[] {
  return business.credentials
    .filter((c) => c.type === 'license' || c.type === 'certification')
    .map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.label,
      credentialCategory: c.type,
      ...(c.number ? { identifier: c.number } : {}),
      ...(c.issuer ? { recognizedBy: { '@type': 'Organization', name: c.issuer } } : {}),
      ...(c.url ? { url: c.url } : {}),
    }));
}

export const branchId = (slug: string) => abs(`/locations/${slug}/#branch`);

/** A physical branch as its own LocalBusiness, linked to the parent org. */
export function branch(b: (typeof business.locations)[number]): Thing {
  return {
    '@type': schemaTypes(),
    '@id': branchId(b.slug),
    name: b.name,
    url: abs(`/locations/${b.slug}/`),
    telephone: b.phoneE164 ?? business.phoneE164,
    ...(b.email ? { email: b.email } : {}),
    image: abs(theme.ogImage),
    address: { '@type': 'PostalAddress', streetAddress: b.street, addressLocality: b.city, addressRegion: b.state, postalCode: b.zip, addressCountry: business.address.country },
    ...(b.geo ? { geo: { '@type': 'GeoCoordinates', latitude: b.geo.lat, longitude: b.geo.lng } } : {}),
    ...(b.mapUrl ? { hasMap: b.mapUrl } : {}),
    openingHoursSpecification: (b.hours ?? business.hours).map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
    parentOrganization: { '@id': ORG_ID },
  };
}

export function person(m: { name: string; role: string; bio: string; photo?: string; sameAs?: string[]; certifications?: string[] }): Thing {
  return {
    '@type': 'Person',
    name: m.name,
    jobTitle: m.role,
    description: m.bio,
    worksFor: { '@id': ORG_ID },
    ...(m.photo ? { image: abs(m.photo) } : {}),
    ...(m.sameAs?.length ? { sameAs: m.sameAs } : {}),
    ...(m.certifications?.length
      ? { hasCredential: m.certifications.map((c) => ({ '@type': 'EducationalOccupationalCredential', name: c })) }
      : {}),
  };
}

export function webSite(): Thing {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: abs('/'),
    name: business.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
}

export function webPage(opts: {
  path: string;
  title: string;
  description: string;
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'FAQPage' | 'ItemPage';
  image?: string;
  datePublished?: Date;
  dateModified?: Date;
}): Thing {
  const url = abs(opts.path);
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: opts.title,
    description: opts.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    ...(opts.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: abs(opts.image) } } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished.toISOString() } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified.toISOString() } : {}),
    breadcrumb: { '@id': `${url}#breadcrumb` },
    inLanguage: 'en-US',
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbList(path: string, crumbs: Crumb[]): Thing {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(path)}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function service(opts: {
  path: string;
  name: string;
  description: string;
  serviceType?: string;
  image?: string;
  areas?: AreaInput[];
  startingPrice?: number;
  priceUnit?: string;
  emergency?: boolean;
}): Thing {
  const url = abs(opts.path);
  return {
    '@type': 'Service',
    ...(opts.emergency && business.emergency?.available
      ? { hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ALL_DAYS, opens: '00:00', closes: '23:59' } }
      : {}),
    '@id': `${url}#service`,
    name: opts.name,
    serviceType: opts.serviceType ?? opts.name,
    description: opts.description,
    url,
    provider: { '@id': ORG_ID },
    ...(opts.image ? { image: abs(opts.image) } : {}),
    ...(opts.areas?.length ? { areaServed: areaServed(opts.areas) } : {}),
    ...(opts.startingPrice
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: opts.startingPrice,
            ...(opts.priceUnit ? { description: `Starting at $${opts.startingPrice} ${opts.priceUnit}` } : {}),
            availability: 'https://schema.org/InStock',
            url,
          },
        }
      : {}),
  };
}

export function faqPage(path: string, faqs: { question: string; answer: string }[]): Thing | undefined {
  if (!faqs.length) return undefined;
  return {
    '@type': 'FAQPage',
    '@id': `${abs(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function review(r: { name: string; rating: number; text: string; date: Date; location?: string }): Thing {
  return {
    '@type': 'Review',
    author: { '@type': 'Person', name: r.name },
    datePublished: r.date.toISOString().split('T')[0],
    reviewBody: r.text,
    reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    itemReviewed: { '@id': ORG_ID },
  };
}

export function blogPosting(opts: {
  path: string;
  title: string;
  description: string;
  image?: string;
  datePublished: Date;
  dateModified?: Date;
  author?: string;
  tags?: string[];
}): Thing {
  const url = abs(opts.path);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: opts.title,
    description: opts.description,
    url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    ...(opts.image ? { image: abs(opts.image) } : {}),
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    author: opts.author
      ? { '@type': 'Person', name: opts.author, worksFor: { '@id': ORG_ID } }
      : { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    ...(opts.tags?.length ? { keywords: opts.tags.join(', ') } : {}),
    inLanguage: 'en-US',
  };
}

export function imageGallery(path: string, title: string, images: { url: string; caption: string }[]): Thing {
  return {
    '@type': 'ImageGallery',
    '@id': `${abs(path)}#gallery`,
    name: title,
    about: { '@id': ORG_ID },
    associatedMedia: images.map((i) => ({ '@type': 'ImageObject', contentUrl: abs(i.url), caption: i.caption })),
  };
}

/** Wrap a list of entities into a single @graph document. Drops undefined. */
export function graph(...things: Array<Thing | undefined>): Thing {
  return { '@context': 'https://schema.org', '@graph': things.filter(Boolean) };
}
