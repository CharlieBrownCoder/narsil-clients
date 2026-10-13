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
    ...(business.paymentAccepted ? { paymentAccepted: business.paymentAccepted.join(', ') } : {}),
    sameAs: business.sameAs,
    ...(opts.areas?.length ? { areaServed: areaServed(opts.areas) } : {}),
    ...(aggregateRating() ? { aggregateRating: aggregateRating() } : {}),
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
}): Thing {
  const url = abs(opts.path);
  return {
    '@type': 'Service',
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
