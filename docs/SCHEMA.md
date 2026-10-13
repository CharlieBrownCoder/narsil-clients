# Structured data

All JSON-LD is built in `src/lib/schema.ts` and emitted by `BaseLayout` as one `<script type="application/ld+json">` per page containing a single `@graph`.

## Entity IDs

Entities reference each other by stable `@id` so Google can stitch them across pages:

| @id | Entity |
| --- | --- |
| `https://site/#organization` | the LocalBusiness subtype |
| `https://site/#website` | WebSite |
| `https://site/<path>/#webpage` | the page |
| `https://site/<path>/#breadcrumb` | BreadcrumbList |
| `https://site/<path>/#service` | Service (service and combo pages) |
| `https://site/<path>/#faq` | FAQPage |
| `https://site/<path>/#article` | BlogPosting |

## Business type → schema.org type

Set `businessType` in the config. The registry in `src/lib/business-types.ts` maps it:

| businessType | @type |
| --- | --- |
| roofing | RoofingContractor |
| plumbing | Plumber |
| electrical | Electrician |
| painting | HousePainter |
| hvac | HVACBusiness |
| moving | MovingCompany |
| locksmith | Locksmith |
| handyman, general-contractor | GeneralContractor |
| junk-removal | LocalBusiness + HomeAndConstructionBusiness |
| pressure-washing, landscaping, cleaning, pest-control, garage-door, gutter, fencing, concrete, tree-service, window-cleaning | HomeAndConstructionBusiness |

Override per client with `schemaTypeOverride` if a more specific type exists.

## Builders

| Function | Emits | Notes |
| --- | --- | --- |
| `localBusiness({ full, areas, services })` | LocalBusiness subtype | `full: true` adds hours, geo, priceRange, sameAs, areaServed, OfferCatalog, AggregateRating. Street omitted when `address.showStreet` is false. |
| `contactPoints(areas)` | ContactPoint[] | customer service and sales with business hours; an `emergency` point with 24/7 hours when `business.emergency.available`. On the full org entity. |
| `webSite()` | WebSite | |
| `webPage({ path, title, description, type })` | WebPage / AboutPage / ContactPage / CollectionPage / ItemPage / FAQPage | |
| `breadcrumbList(path, crumbs)` | BreadcrumbList | |
| `service({...})` | Service | `provider` → org, optional `Offer` from `startingPrice`, `areaServed` from locations, `hoursAvailable` 24/7 when `emergency` and `business.emergency.available` |
| `faqPage(path, faqs)` | FAQPage | returns undefined when empty |
| `review(r)` | Review | available but unused; reviews are shown via the Trustindex widget. Don't mark up third-party reviews. |
| `blogPosting({...})` | BlogPosting | author Person or org |
| `imageGallery(path, title, images)` | ImageGallery | |
| `branch(b)` | LocalBusiness subtype | one per `business.locations[]` entry, `parentOrganization` → org; the org lists them as `subOrganization` when there is more than one |
| `person(m)` | Person | team members, `worksFor` → org |
| `credentials()` | EducationalOccupationalCredential[] | from `business.credentials` (license and certification types) as `hasCredential` on the full org |
| (inline in views) | Article (case studies), ItemList of Offer + PriceSpecification (pricing), DigitalDocument (resources) | small enough to live in the view; move into schema.ts if a second page needs them |
| `graph(...things)` | wraps into `@context` + `@graph`, drops undefined | |

## areaServed

Built from location files: each becomes a `City` with optional `sameAs` (Wikipedia URL), plus a `GeoCircle` from `business.geo` and `serviceRadiusMiles`.

## Validation

After `npm run build`, paste any `dist/**/index.html` into https://validator.schema.org or https://search.google.com/test/rich-results. A quick local sanity check:

```bash
node -e "const h=require('fs').readFileSync('dist/index.html','utf8');const m=h.match(/<script type=\"application\/ld\+json\">(.*?)<\/script>/s);console.log(JSON.stringify(JSON.parse(m[1]),null,2))"
```

## Rules of thumb

- Only claim `AggregateRating` with real, verifiable review counts. Keep `trust.rating` in sync with Google Business Profile.
- `FAQPage` rich results are limited by Google to authoritative sites, but the markup still helps AI answer surfaces.
- Don't add `Review` schema for reviews pulled from Google or Trustindex; it's against Google's guidelines. `AggregateRating` on the business is fine as long as the numbers match the source.
- Keep `sameAs` complete: GBP, Facebook, Yelp, BBB, Nextdoor, Angi, HomeAdvisor. It's the strongest entity signal you control.

## Coverage matrix

Which schema appears on which page. "Full" LocalBusiness means hours, geo, contactPoint, sameAs, areaServed, credentials, aggregateRating, offer catalog; "ref" means the entity is present by `@id` only so other nodes can point at it.

| Page | LocalBusiness | WebSite | WebPage | Breadcrumb | Service | Offer | OfferCatalog | ItemList | FAQPage | AggregateRating | ContactPoint | Article / BlogPosting | Person | Other |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home | full | ✓ | WebPage | ✓ | | | ✓ | | ✓ | ✓ | ✓ | | | |
| Services index | ref | ✓ | CollectionPage | ✓ | | | | ✓ | | | | | | |
| Category hub | ref | ✓ | CollectionPage | ✓ | | | | ✓ | | | | | | |
| Service | ref | ✓ | ItemPage | ✓ | ✓ | from `startingPrice` | | | ✓ | | | | | `hoursAvailable` when emergency |
| Service areas index | full | ✓ | CollectionPage | ✓ | | | | | | ✓ | ✓ | | | GeoCircle in areaServed |
| City | full (areaServed = city) | ✓ | WebPage | ✓ | | | ✓ | | ✓ | ✓ | ✓ | | | |
| Service × city | ref | ✓ | ItemPage | ✓ | ✓ (areaServed = city) | from `startingPrice` | | | ✓ | | | | | |
| Branches index | full | ✓ | CollectionPage | ✓ | | | | | | ✓ | ✓ | | | one LocalBusiness per branch |
| Branch | ref | ✓ | WebPage | ✓ | | | | | | | | | | branch LocalBusiness with address, geo, hasMap, hours |
| Pricing | full | ✓ | WebPage | ✓ | | ✓ (min/max PriceSpecification) | | ✓ | ✓ | ✓ | ✓ | | | |
| Quote calculator | full | ✓ | WebPage | ✓ | | | | | | ✓ | ✓ | | | |
| About | full | ✓ | AboutPage | ✓ | | | | | | ✓ | ✓ | | | |
| Team | ref | ✓ | AboutPage | ✓ | | | | | | | | | ✓ | |
| Licenses & insurance | full | ✓ | WebPage | ✓ | | | | | | ✓ | ✓ | | | EducationalOccupationalCredential |
| Emergency | full | ✓ | WebPage | ✓ | | | | | | ✓ | ✓ (24/7 point) | | | |
| Contact | full | ✓ | ContactPage | ✓ | | | | | | ✓ | ✓ | | | |
| Reviews | full | ✓ | CollectionPage | ✓ | | | | | | ✓ | ✓ | | | Review only for first-party reviews |
| Gallery | ref | ✓ | CollectionPage | ✓ | | | | | | | | | | ImageGallery |
| Case study | ref | ✓ | WebPage | ✓ | | | | | | | | Article | | |
| FAQ | ref | ✓ | FAQPage | ✓ | | | | | ✓ | | | | | |
| Blog index | ref | ✓ | CollectionPage | ✓ | | | | | | | | | | Blog |
| Post | ref | ✓ | WebPage | ✓ | | | | | | | | BlogPosting | | |
| Resources | ref | ✓ | CollectionPage / WebPage | ✓ | | | | | | | | | | DigitalDocument |
| Booking | full | ✓ | WebPage | ✓ | | | | | | ✓ | ✓ | | | |
| Privacy, Terms, Thank-you, 404 | ref | ✓ | | | | | | | | | | | | noindex |

## By business type

The page matrix is the same for every vertical. These are the config knobs that change the output:

| Vertical | `@type` | Emergency ContactPoint + 24/7 hours | Publish Offer prices | Notes |
| --- | --- | --- | --- | --- |
| Plumbing, electrical, HVAC, locksmith, garage door | Plumber, Electrician, HVACBusiness, Locksmith, HomeAndConstructionBusiness | Usually yes | Service-call fee yes, job prices rarely | Mark emergency services `emergency: true` |
| Roofing, general contractor, concrete, fencing | RoofingContractor, GeneralContractor, HomeAndConstructionBusiness | Storm work only | No. Leave `startingPrice` blank; use the calculator for ranges | Credentials and insurance page matter most |
| Pressure washing, window cleaning, gutter, cleaning, landscaping, tree, pest | HomeAndConstructionBusiness | Rarely | Yes, ranges work well | Before/after gallery and case studies carry the most weight |
| Painting | HousePainter | No | Per-room or per-sq-ft ranges | |
| Junk removal, moving | LocalBusiness + HomeAndConstructionBusiness, MovingCompany | Same-day yes, 24/7 rarely | Yes, load sizes or hourly | OfferCatalog by load size |

Not emitted on purpose: a separate `Organization` (LocalBusiness already is one), `Brand`, `VideoObject` (add when a client has video), `Review` for third-party reviews, and `SearchAction` on WebSite (no site search).
