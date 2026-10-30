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
| Case study | `/gallery/<slug>/` | "[service] [city] before and after" | LocalBusiness, WebSite, WebPage, BreadcrumbList, Article (about → Service) | `src/views/CaseStudy.astro`; only projects with a Markdown body |
| Pricing guide | `/pricing/` | "[vertical] cost [city]" | LocalBusiness (full), WebSite, WebPage, BreadcrumbList, ItemList of Offer + PriceSpecification, FAQPage | `src/views/PricingGuide.astro`; rows from `startingPrice`/`priceHigh` |
| Quote calculator | `/quote-calculator/` | "[vertical] cost calculator" | LocalBusiness (full), WebSite, WebPage, BreadcrumbList | `src/views/QuoteCalculatorPage.astro`; rules in `src/calculator.config.ts`; also embedded on matching service pages |
| Booking | `/book/` | "schedule [brand]" | LocalBusiness (full), WebSite, WebPage, BreadcrumbList | `src/views/Booking.astro`; `booking.provider` link or embed |
| Resources index + detail | `/resources/`, `/resources/<slug>/` | "[vertical] checklist" | LocalBusiness, WebSite, CollectionPage / WebPage + DigitalDocument, BreadcrumbList | `src/views/ResourcesIndex.astro`, `ResourceDetail.astro`; `gated: true` puts a Formspree form in front of the file |
| Gallery | `/gallery/` | "[vertical] before and after" | LocalBusiness, WebSite, CollectionPage, BreadcrumbList, ImageGallery | `src/views/GalleryPage.astro` |
| FAQ | `/faq/` | question queries | LocalBusiness, WebSite, FAQPage (page type) + FAQPage (entity), BreadcrumbList | `src/views/FaqPage.astro` |
| Blog index | `/blog/` | topical authority | LocalBusiness, WebSite, CollectionPage, BreadcrumbList, Blog | `src/views/BlogIndex.astro` |
| Blog post | `/blog/<slug>/` | informational | LocalBusiness, WebSite, WebPage, BreadcrumbList, BlogPosting | `src/views/BlogPost.astro` |
| Sitemap | `/sitemap/` | visitor-facing index of every page; the XML sitemaps for crawlers are `src/pages/sitemap-*.xml.ts` (below) | LocalBusiness, WebSite, CollectionPage, BreadcrumbList | `src/views/SitemapPage.astro` |
| Privacy | `/privacy-policy/` | noindex | LocalBusiness, WebSite | `src/views/PrivacyPolicy.astro` |
| Terms | `/terms/` | noindex | LocalBusiness, WebSite | `src/views/Terms.astro` |
| Thank you | `/thank-you/` | noindex, conversion event | none | `src/views/ThankYou.astro` |
| 404 | `/404/` | noindex | none | `src/pages/404.astro` |

## Adding a page type

1. Create `src/views/MyPage.astro` (copy `About.astro`).
2. Add a `PageKey` in `src/site.config.ts` and a row in `pages`.
3. Register the slug in `src/lib/optional-pages.ts` and map it in `src/pages/[page].astro`.
4. Add a nav entry if it belongs in the menu.
5. Add a row in `src/lib/site-pages.ts` so it reaches the XML sitemap. `npm run validate` fails until you do.

## Sitemaps

`src/lib/site-pages.ts` is the one list of every page the build produces, and `src/pages/sitemap-index.xml.ts` plus `src/pages/sitemap-[section].xml.ts` render it. `npm run validate` holds the list to the built site both ways: every indexable page is in exactly one sitemap, and every sitemap URL is an indexable page.

- **One file per section**: `sitemap-pages.xml`, `sitemap-services.xml`, `sitemap-service-areas.xml`, `sitemap-blog.xml` (only sections with a page are listed in the index). Search Console reports coverage per file, so which service-area pages Google declined is readable at a glance instead of from a 50-URL list.
- **`lastmod` from git, never the build time.** A page's date is the last commit touching its source: the Markdown file for a content page, the service and location files for a combo page, `site.config.ts` for a config-driven page. Build time would stamp every page "changed today" on each deploy and teach crawlers to ignore the field. On a shallow clone a file older than the clone boundary gets no lastmod rather than a wrong one, and the validator warns; set `VERCEL_DEEP_CLONE=true` on the Vercel project so the build sees full history.
- **No `changefreq`, no `priority`.** Google ignores both, and a uniform value is noise. The validator refuses them.
- **Thin service-by-city pages stay out.** A combo page without a `serviceNotes` entry for that service reads as templated, so it builds, links internally, and is `noindex` and absent from the sitemap until the note exists. Write the note and the page joins the sitemap on the next build. The sitemap is a statement of what deserves indexing, not a list of what exists.
- **Image entries** for the gallery's before and after photos, service photos, city photos, post images and resource covers, each with a caption, so "roof cleaning before and after" style image searches have something to find.
- **IndexNow** (Bing, Yandex; Google does not read it): set `tracking.indexNowKey` to 32 hex characters you generate, which builds `/<key>.txt`, and `scripts/indexnow.mjs` runs as `postbuild` and submits every URL whose lastmod is within the last seven days, only on a Vercel production deploy (`VERCEL_ENV=production`; `--force` to run by hand). A deploy that changed nothing submits nothing, and a refused or unreachable endpoint never fails the build.
- Google still needs the index submitted once in Search Console at launch (docs/NEW-CLIENT.md step 7).

## Service areas vs. branches

`src/content/locations/*.md` are **cities served** (`/service-areas/`). They carry no address and emit `areaServed`.
`business.locations[]` in the config are **real offices** (`/locations/`). Each emits its own LocalBusiness with a street address. Never put a service-area city in `business.locations`.

## Trust components (all hidden when blank)

| Component | Source | Where |
| --- | --- | --- |
| `Hero` | `hero.*`, `theme.heroStyle/heroForm` | home (full), every inner page (compact) |
| `StatsStrip` | `trust.stats[]` | under the home hero |
| `TrustBar` | `trust.logos[]` else `trust.badges[]` | under every hero |
| `SectionDivider` | `theme.dividers` | hero bottom, CTA band top |
| `ComparisonTable` | `trust.comparison.rows[]` | home and About, after Why Us |
| `ServiceStrip` | `theme.serviceStrip` | icon tiles overlapping the home hero's bottom edge |
| `ProcessSteps` | `process[]` (home), `process` on each service | home, service pages |
| `GuaranteeBand` | `trust.guarantee` | home, after the comparison table |
| `ClientLogos` | `trust.clients[]` | home, under the stat strip |
| `OffersGrid` | `offers[]` | home after services, /pricing/ |
| `PlanTiers` | `plans[]` | home after How it works, /pricing/ |
| `StickyQuoteTab` | `theme.stickyQuoteTab` | every page, desktop only, off by default |
| `ResponsePromise` | `business.responseTimePromise` | hero, quote form |
| `EmergencyCta` | `business.emergency.available` | home, emergency services, /emergency/ |
| `Credentials` | `business.credentials[]` | about, /licenses-insurance/, /team/ |
| `TeamGrid` | `src/content/team.json` | home (3), about (6), /team/ |
| `Trustindex` | `reviews.trustindex.*` | home, /reviews/, service and city pages, footer |

Ideas not yet built, by vertical:

- **Financing** (roofing, HVAC, remodeling): `pages.financing` is reserved in the config.
- **Careers** (any): `pages.careers` is reserved.
- **Coupons / Specials**: the `promo` banner covers one offer; a dedicated page could list several.

## Share previews (Open Graph, X, LinkedIn, iMessage)

Every page ships `og:title`, `og:description`, `og:image` (with width, height, type and alt) and the matching `twitter:*` tags from `src/components/Seo.astro`. The copy comes from `src/lib/seo.ts`, never from a view. `npm run validate` fails the build on any page outside these limits.

| Tag | Limit | Why | Where it comes from |
| --- | --- | --- | --- |
| `og:title` | 60 characters or fewer | X and LinkedIn truncate past 60 | `meta.ogTitle`, else `buildOgTitle(title)`: the page title without the brand suffix (`og:site_name` carries the brand), then without its last ` \| ` segment while still over 60 |
| `og:description` | 80 to 125 characters (under 50 fails, 50 to 79 warns) | under 80 reads empty; past 125 mobile previews cut it with an ellipsis where the value proposition sits | `meta.ogDescription`, else `buildOgDescription(description)`: cut at the last sentence end inside 125, then `social.valueLine` appended when the result is under 80 and the line fits |
| `og:image` | 1200×630 (1.91:1), PNG or JPG, under 5 MB | the one size every platform renders at full width; WebP is not universal | the page photo through `shareImage()` when it is at least 1200×630, else the generated image, else `theme.ogImage` |

### Results first, values second

A share is read by someone who did not search for the service, so it has to say what they get, not what we are called.

- **Title**: the outcome or the offer. The home page uses `social.lead` ("Your home looking new again, in one visit"); a service or city page says the service and the place, because that is what the link is about; a case study says what changed. Hand-write `seo.ogTitle` in frontmatter when a page's `<title>` is a keyword string.
- **Description**: a service page shares its `excerpt` (write excerpts as outcomes: "removes algae, mold, and grime from siding without damaging your home"); a combo page shares the excerpt plus "Serving City, ST"; a city page says who it serves and then the value line; the home page shares `hero.subheadline`. Every one ends on `social.valueLine` when there is room.
- **`social.valueLine`** is the one line of value the business keeps ("Written quote first. Insured crews."), under 50 characters. It is appended to short descriptions and printed in the accent color on every generated image. Like every trust claim it defaults blank and blank means hidden. Never put a price, a rating, or a guarantee in it that the config does not already carry.
- Write content descriptions so the first sentence lands under 125 characters. The cut never breaks a sentence shorter than 40 characters, and a first sentence longer than 125 is cut at a word with an ellipsis, which is the thing to avoid.
- Per-page overrides: `seo.ogTitle` (max 60) and `seo.ogDescription` (80 to 125) in service, location and post frontmatter; the schema refuses values outside the limits.

### Generated images

One template, `src/lib/og-image.ts`, renders every image: brand mark, the page's headline, a context line, `social.valueLine`, the domain and phone, in the theme's colors and fonts. `src/lib/og-pages.ts` is the variable map: one row per page (title, subtitle), so a site with hundreds of service-area pages gets a distinct image for each with no design work. Add a row to cover a new page type. Titles there are what the image shows, so write the offer or the outcome ("Get a free quote", "Before & after"), not a keyword string.

Pages not listed, and all pages when `public/fonts/og/` has no TTFs, fall back to `theme.ogImage` (`public/images/og-default.jpg`, 1200×630). Posts, service pages, and case studies that set their own image use a 1200×630 crop of it, but only when the source is at least that size: a smaller photo falls back to the generated image because Astro never enlarges and the validator measures every share image.

To check a preview: `npm run build && npm run validate`, then open `dist/og/home.png`. The validator reports every page's share problem by path.

## Section rhythm

One rule sets the vertical gap between sections: `.section` in `src/styles/global.css`, `py-12 md:py-14 lg:py-16`, which is 96px per section on phones, 112px on tablets and 128px on laptops and desktops (measured 2026-10-30; it was 128 / 192 with no laptop step, and section padding was 22% of a laptop home page). The hero sits one step above it.

The home hero's CTA row renders from `md` up. Below that `MobileCallBar` already carries Call Now and Free Quote, so the hero pair was a duplicate that cost about 100px of the first screen and wrapped at 360 wide (measured 2026-10-30: the quote form's first field moved from 761px to 661px at 390 wide, above the fold, and the hero from 1265px to 1109px). The response promise renders once in the hero; the compact form inside it does not repeat it. Alternating section backgrounds carry the rhythm, so the gap can be this tight without sections touching; below `py-10 md:py-14` the eyebrow-to-heading stack starts to meet the section edge, and the design standard's rule (more space above a heading than below it) stops holding.

Padding is a small share of a phone page (7% of the demo home page), so a long phone page is a section-count problem: every grid stacks to one column. `npm run validate` warns when the home page passes 12 sections; the answer is to ask at kickoff which of team, plans, comparison, gallery, offers and client logos the client needs on the home page, and leave the rest to their own pages.

## Crawlers and AI

What a search engine, an AI Overview or an agent gets from a built page, beyond the sitemaps above. `npm run validate` check 8 holds all of it.

- **`dateModified` on every page.** The layout stamps the page's WebPage schema node with the same git lastmod the sitemap carries, so the two never disagree. A view that sets its own `dateModified` keeps it. Freshness is one of the few signals an AI surface reads directly.
- **`/llms.txt`** renders from the same registry as the sitemaps: the business (type, city, phone, email, hours, site, sitemap), then one line per indexable page with its title and a one-line summary, grouped by section. Thin combo pages stay out of it as they stay out of the sitemap, and the validator holds its URL set equal to the sitemaps'. An emerging convention rather than a standard; it costs nothing and cannot drift.
- **`robots.txt` names the AI crawlers.** Search agents (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Claude-User, DuckAssistBot) are always allowed: a local business gains from being cited. The training-only agents (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent, Bytespider) are allowed by default and refused when `crawlers.allowAiTraining` is false, for a client who asks. Blocking Google-Extended does not remove a site from AI Overviews, which use Googlebot; it only opts out of Gemini training. Bing matters more than it looks: ChatGPT search and Copilot run on its index.
- **Answer first.** AI Overviews lift the paragraph that answers the question. Every service and city page carries at least three FAQ entries, every FAQPage schema question is visible on the page as a `<summary>` (Google requires it, and the validator refuses a schema-only question), and the writing rule in `docs/KICKOFF.md` is that a service or city page opens with a two-sentence direct answer before the pitch.
- Not done, deliberately: a Markdown mirror of every page, Speakable schema (news only), hreflang (single-language sites).

## Internal linking map

- Home → every service, top 8 locations, FAQ, contact
- Service → related services, every combo page for that service, blog posts tagged with it
- City → every combo page in that city, all services
- Combo → its service, its city, sibling combos in the same city
- Blog post → its related service
- Footer → all services, top 10 locations, all nav pages
