# Page types

Every page type, what it is for, which query it targets, and what structured data it emits.

| Page | Route | Targets | Schema in @graph | Source |
| --- | --- | --- | --- | --- |
| Home | `/` | "[vertical] [city]" | LocalBusiness (full: hours, geo, areaServed, OfferCatalog, AggregateRating), WebSite, WebPage, BreadcrumbList, FAQPage | `src/pages/index.astro` |
| Services index | `/services/` | "[vertical] services [city]" | LocalBusiness, WebSite, CollectionPage, BreadcrumbList, ItemList | `src/views/ServicesIndex.astro` |
| Service detail | `/services/<slug>/` | "[service] [city]" | LocalBusiness, WebSite, ItemPage, BreadcrumbList, Service (+Offer, areaServed), FAQPage | `src/views/ServiceDetail.astro` |
| Service areas index | `/service-areas/` | "[vertical] near me" | LocalBusiness (full, all areas), WebSite, CollectionPage, BreadcrumbList | `src/views/LocationsIndex.astro` |
| City page | `/service-areas/<city>/` | "[vertical] [other city]" | LocalBusiness (areaServed = city, OfferCatalog), WebSite, WebPage, BreadcrumbList, FAQPage | `src/views/LocationDetail.astro` |
| Service × City | `/service-areas/<city>/<service>/` | "[service] [other city]" | LocalBusiness, WebSite, ItemPage, BreadcrumbList, Service (areaServed = city), FAQPage | `src/views/ServiceLocation.astro` |
| About | `/about/` | brand, E-E-A-T | LocalBusiness (full), WebSite, AboutPage, BreadcrumbList | `src/views/About.astro` |
| Contact | `/contact/` | "[brand] phone" | LocalBusiness (full), WebSite, ContactPage, BreadcrumbList | `src/views/Contact.astro` |
| Reviews | `/reviews/` | "[brand] reviews" | LocalBusiness + Review[] + AggregateRating, WebSite, CollectionPage, BreadcrumbList | `src/views/Reviews.astro` |
| Gallery | `/gallery/` | "[vertical] before and after" | LocalBusiness, WebSite, CollectionPage, BreadcrumbList, ImageGallery | `src/views/GalleryPage.astro` |
| FAQ | `/faq/` | question queries | LocalBusiness, WebSite, FAQPage (page type) + FAQPage (entity), BreadcrumbList | `src/views/FaqPage.astro` |
| Blog index | `/blog/` | topical authority | LocalBusiness, WebSite, CollectionPage, BreadcrumbList, Blog | `src/views/BlogIndex.astro` |
| Blog post | `/blog/<slug>/` | informational | LocalBusiness, WebSite, WebPage, BreadcrumbList, BlogPosting | `src/views/BlogPost.astro` |
| Privacy | `/privacy-policy/` | noindex | LocalBusiness, WebSite | `src/views/PrivacyPolicy.astro` |
| Thank you | `/thank-you/` | noindex, conversion event | none | `src/views/ThankYou.astro` |
| 404 | `/404/` | noindex | none | `src/pages/404.astro` |

## Adding a page type

1. Create `src/views/MyPage.astro` (copy `About.astro`).
2. Add a `PageKey` in `src/site.config.ts` and a row in `pages`.
3. Register the slug in `src/lib/optional-pages.ts` and map it in `src/pages/[page].astro`.
4. Add a nav entry if it belongs in the menu.

Ideas not yet built, by vertical:

- **Financing** (roofing, HVAC, remodeling): `pages.financing` is reserved in the config.
- **Careers** (any): `pages.careers` is reserved.
- **Emergency service** landing (plumbing, electrical, locksmith): a service file with `featured: true` and 24/7 copy covers most of it today.
- **Pricing page** (junk removal, cleaning): use `startingPrice` on services, or add a view.
- **Coupons / Specials**: the `promo` banner covers one offer; a dedicated page could list several.
- **Case studies** (commercial): a blog post with a `service` link works until there is enough volume.

## Internal linking map

- Home → every service, top 8 locations, FAQ, contact
- Service → related services, every combo page for that service, blog posts tagged with it
- City → every combo page in that city, all services
- Combo → its service, its city, sibling combos in the same city
- Blog post → its related service
- Footer → all services, top 10 locations, all nav pages
