# Page types

Every page type, what it is for, which query it targets, and what structured data it emits.

| Page | Route | Targets | Schema in @graph | Source |
| --- | --- | --- | --- | --- |
| Home | `/` | "[vertical] [city]" | LocalBusiness (full: hours, geo, areaServed, OfferCatalog, AggregateRating), WebSite, WebPage, BreadcrumbList, FAQPage | `src/pages/index.astro` |
| Services index | `/services/` | "[vertical] services [city]" | LocalBusiness, WebSite, CollectionPage, BreadcrumbList, ItemList | `src/views/ServicesIndex.astro` |
| Service category hub | `/services/<category>/` | "[category] [city]" | LocalBusiness, WebSite, CollectionPage, BreadcrumbList, ItemList | `src/views/ServiceCategory.astro` |
| Service detail | `/services/<slug>/` | "[service] [city]" | LocalBusiness, WebSite, ItemPage, BreadcrumbList, Service (+Offer, areaServed), FAQPage | `src/views/ServiceDetail.astro` |
| Service areas index | `/service-areas/` | "[vertical] near me" | LocalBusiness (full, all areas), WebSite, CollectionPage, BreadcrumbList | `src/views/LocationsIndex.astro` |
| City page | `/service-areas/<city>/` | "[vertical] [other city]" | LocalBusiness (areaServed = city, OfferCatalog), WebSite, WebPage, BreadcrumbList, FAQPage | `src/views/LocationDetail.astro` |
| Service × City | `/service-areas/<city>/<service>/` | "[service] [other city]" | LocalBusiness, WebSite, ItemPage, BreadcrumbList, Service (areaServed = city), FAQPage | `src/views/ServiceLocation.astro` |
| Branches index | `/locations/` | "[brand] near me" | LocalBusiness (full) + one LocalBusiness per branch with `parentOrganization` | `src/views/BranchesIndex.astro` |
| Branch detail | `/locations/<slug>/` | "[brand] [branch city]" | LocalBusiness, WebSite, WebPage, BreadcrumbList, branch LocalBusiness (address, geo, hasMap, hours) | `src/views/BranchDetail.astro` |
| Team | `/team/` | E-E-A-T | LocalBusiness, WebSite, AboutPage, BreadcrumbList, Person[] | `src/views/Team.astro` |
| Licenses & Insurance | `/licenses-insurance/` | "[brand] insured" | LocalBusiness (full, hasCredential), WebSite, WebPage, BreadcrumbList | `src/views/LicensesInsurance.astro` |
| Emergency | `/emergency/` | "emergency [vertical] [city]" | LocalBusiness (full), WebSite, WebPage, BreadcrumbList; emergency services carry `hoursAvailable` 24/7 | `src/views/Emergency.astro` |
| About | `/about/` | brand, E-E-A-T | LocalBusiness (full), WebSite, AboutPage, BreadcrumbList | `src/views/About.astro` |
| Contact | `/contact/` | "[brand] phone" | LocalBusiness (full), WebSite, ContactPage, BreadcrumbList | `src/views/Contact.astro` |
| Reviews | `/reviews/` | "[brand] reviews" | LocalBusiness (full, with AggregateRating from `trust.rating`), WebSite, CollectionPage, BreadcrumbList. Reviews themselves render in the Trustindex widget. | `src/views/Reviews.astro` |
| Gallery | `/gallery/` | "[vertical] before and after" | LocalBusiness, WebSite, CollectionPage, BreadcrumbList, ImageGallery | `src/views/GalleryPage.astro` |
| FAQ | `/faq/` | question queries | LocalBusiness, WebSite, FAQPage (page type) + FAQPage (entity), BreadcrumbList | `src/views/FaqPage.astro` |
| Blog index | `/blog/` | topical authority | LocalBusiness, WebSite, CollectionPage, BreadcrumbList, Blog | `src/views/BlogIndex.astro` |
| Blog post | `/blog/<slug>/` | informational | LocalBusiness, WebSite, WebPage, BreadcrumbList, BlogPosting | `src/views/BlogPost.astro` |
| Privacy | `/privacy-policy/` | noindex | LocalBusiness, WebSite | `src/views/PrivacyPolicy.astro` |
| Terms | `/terms/` | noindex | LocalBusiness, WebSite | `src/views/Terms.astro` |
| Thank you | `/thank-you/` | noindex, conversion event | none | `src/views/ThankYou.astro` |
| 404 | `/404/` | noindex | none | `src/pages/404.astro` |

## Adding a page type

1. Create `src/views/MyPage.astro` (copy `About.astro`).
2. Add a `PageKey` in `src/site.config.ts` and a row in `pages`.
3. Register the slug in `src/lib/optional-pages.ts` and map it in `src/pages/[page].astro`.
4. Add a nav entry if it belongs in the menu.

## Service areas vs. branches

`src/content/locations/*.md` are **cities served** (`/service-areas/`). They carry no address and emit `areaServed`.
`business.locations[]` in the config are **real offices** (`/locations/`). Each emits its own LocalBusiness with a street address. Never put a service-area city in `business.locations`.

## Trust components (all hidden when blank)

| Component | Source | Where |
| --- | --- | --- |
| `ResponsePromise` | `business.responseTimePromise` | hero, quote form |
| `EmergencyCta` | `business.emergency.available` | home, emergency services, /emergency/ |
| `Credentials` | `business.credentials[]` | about, /licenses-insurance/, /team/ |
| `TeamGrid` | `src/content/team.json` | home (3), about (6), /team/ |
| `Trustindex` | `reviews.trustindex.*` | home, /reviews/, service and city pages, footer |

Ideas not yet built, by vertical:

- **Financing** (roofing, HVAC, remodeling): `pages.financing` is reserved in the config.
- **Careers** (any): `pages.careers` is reserved.
- **Pricing guide**: aggregate `startingPrice` across services with an estimate disclaimer.
- **Case studies**: extend projects with a Markdown body for story pages.
- **Coupons / Specials**: the `promo` banner covers one offer; a dedicated page could list several.
- **Quote calculator**: optional island, pricing rules in config, ranges only.

## Internal linking map

- Home → every service, top 8 locations, FAQ, contact
- Service → related services, every combo page for that service, blog posts tagged with it
- City → every combo page in that city, all services
- Combo → its service, its city, sibling combos in the same city
- Blog post → its related service
- Footer → all services, top 10 locations, all nav pages
