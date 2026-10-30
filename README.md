# Service Business Website Template

A production-ready Astro template for local service companies (pressure washing, painting, junk removal, roofing, plumbing, electrical, HVAC, and more). One config file drives the whole site: business type, enabled pages, schema.org markup, theme, and tracking.

Built for SEO: static HTML, zero JS by default, JSON-LD on every page, programmatic service-area pages, XML and HTML sitemaps, robots, canonical tags, Open Graph, and Core Web Vitals friendly markup.

## Stack

- Astro 7 (static output) + Tailwind CSS 4, images optimized at build (WebP/AVIF, responsive srcset)
- Content in Markdown and JSON under `src/content/`
- Hosted on Vercel (`vercel.json` included). Forms via Formspree. Reviews via Trustindex.
- Self-hosted fonts, no third-party requests on first paint
- Vendored Claude Code skills and agents in `.claude/` for design, SEO, content, and QA (see `docs/TOOLING.md`)

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
npm run check      # type-check Astro + TS
npm run validate   # post-build: broken links, titles, JSON-LD, alt text, thin combo pages
npm run test       # check + build + validate (what CI runs)
```

## Spinning up a new client

1. On GitHub, click **Use this template** and name the repo after the client.
2. Clone it, then reset the demo content:
   ```bash
   npm install
   npm run new-client -- --name "Acme Roofing" --type roofing --city Austin --state TX
   ```
3. Propose a theme: `node scripts/theme-from-design-system.mjs "<trade>, home services, <what makes them different>" --name "Acme"`. Review, then paste or `--write`.
4. Edit `src/site.config.ts`. Every field is commented. The ones that matter most for SEO: `url`, `business.*`, `pages`, `trust.rating`, and `business.sameAs`. Set `forms.formspreeId` and the `reviews.trustindex` widget IDs.
5. Drop fonts into `public/fonts/` and images into `src/assets/images/` (sizes in `docs/NEW-CLIENT.md`).
6. Fill `src/content/` (services, locations, posts, projects, faqs), then run the `content-humanizer` agent over it.
7. `npm run check && npm run build`, deploy to Vercel, submit the sitemap in Google Search Console.

Full checklist: [docs/NEW-CLIENT.md](docs/NEW-CLIENT.md). Intake form and kickoff prompt: [docs/KICKOFF.md](docs/KICKOFF.md).

## Project layout

```
.claude/                  ← vendored skills + agents (docs/TOOLING.md)
CLAUDE.md                 ← workflow and rules for Claude Code
DESIGN.md                 ← per-client design spec (demo filled in)
src/
  assets/images/          ← source images, optimized at build
  site.config.ts          ← the one file per client
  lib/
    business-types.ts     ← vertical → schema.org type registry
    schema.ts             ← JSON-LD builders
    seo.ts                ← title/description builders
    optional-pages.ts     ← which single pages exist
  content/                ← Markdown + JSON content collections
  theme-presets.ts        ← palettes + layout combos distilled from reference sites
  components/Trustindex.astro ← review widget, one ID per placement
  pages/                  ← routes (thin, delegate to views)
  views/                  ← full-page templates
  components/sections/    ← hero, service grid, FAQ, CTA, forms...
  layouts/BaseLayout.astro
docs/
  PAGES.md                ← every page type, its URL, and its schema
  SCHEMA.md               ← how structured data is composed
  NEW-CLIENT.md           ← launch checklist
  TOOLING.md              ← what's vendored in .claude/, from where, and what was skipped
  DESIGN-REFERENCE.md     ← pattern catalog from 32 reference sites
scripts/
  new-client.mjs          ← content reset
  theme-from-design-system.mjs ← theme tokens from the ui-ux-pro-max generator
  apply-preset.mjs        ← apply a named preset to site.config.ts
```

## Page types

| Page | URL | Toggle |
| --- | --- | --- |
| Home | `/` | always |
| Services index + detail | `/services/`, `/services/<slug>/` | `pages.services` |
| Service category hubs | `/services/<category>/` | `categories.json` + `category` on services |
| Service areas index + city | `/service-areas/`, `/service-areas/<city>/` | `pages.serviceAreas` |
| Physical branches | `/locations/`, `/locations/<slug>/` | `pages.locations` + `business.locations[]` |
| Case studies | `/gallery/<slug>/` | projects with a Markdown body |
| Pricing guide | `/pricing/` | `pages.pricingGuide` |
| Quote calculator | `/quote-calculator/` | `pages.quoteCalculator` + `src/calculator.config.ts` |
| Booking | `/book/` | `pages.booking` + `booking.provider` |
| Resources | `/resources/`, `/resources/<slug>/` | `pages.resources` + `src/content/resources/` |
| Service × City combo | `/service-areas/<city>/<service>/` | `pages.serviceAreaCombos` |
| About, Contact, Reviews, Gallery, FAQ, Team, Emergency, Licenses & Insurance | `/about/` etc. | `pages.<key>` |
| Blog index + post | `/blog/`, `/blog/<slug>/` | `pages.blog` |
| Privacy, Terms, Thank-you, 404 | | `pages.privacyPolicy`, `pages.terms`, always |

Disabled pages are not built, not in the nav, and not in the sitemap.

## Schema.org

Every page emits a single `@graph` with the `LocalBusiness` subtype for the vertical (e.g. `RoofingContractor`, `Plumber`, `HousePainter`), `WebSite`, a typed `WebPage`, and `BreadcrumbList`. Service pages add `Service` with `areaServed` and optional `Offer`. FAQ sections add `FAQPage`. `AggregateRating` comes from `trust.rating` (keep it equal to the live Google count). Posts add `BlogPosting`. See [docs/SCHEMA.md](docs/SCHEMA.md).

## Theming

`theme` in the config sets brand colors, font families, corner radius, and five layout switches:

| Key | Values | What it changes |
| --- | --- | --- |
| `heroStyle` | `photo` (default), `cutout`, `split`, `centered` | full-bleed photo with scrim; brand background with a cut-out person or truck; light split; centered copy |
| `heroForm` | true/false | quote card inside the hero on desktop |
| `heroScrim` | `dark`, `brand`, `duotone` | photo treatment: dark scrim, brand-color scrim, or duotone tint |
| `buttonStyle` | `flat`, `sticker` | sticker adds a hard offset shadow |
| `headingCase` | `uppercase`, `normal` | h1/h2 only |
| `dividers` | `angle`, `curve`, `wave`, `cloud`, `mountain`, `none` | shaped edge under the hero and above the CTA band |
| `serviceCards` | `photo`, `icon` | service photo cards or icon tiles |
| `serviceStrip` | true/false | icon tiles overlapping the hero's bottom edge |
| `stickyQuoteTab` | true/false | desktop side tab, off by default |

The `hero` block holds the home headline (with `*accent*` markup for the highlighted words), subheadline, image, optional cutout PNG, and checkmark bullets. `trust.stats` renders a big-number strip and `trust.logos` a badge row under the hero; both hidden when empty.

Nine presets distilled from the reference sites live in `src/theme-presets.ts`. List them with `node scripts/apply-preset.mjs` and apply one with `node scripts/apply-preset.mjs navy-orange`. See `docs/DESIGN-REFERENCE.md` for where each pattern came from.

Colors map to Tailwind utilities `bg-primary`, `text-accent`, etc. Fonts are self-hosted: drop `<slug>.woff2` in `public/fonts/` (see the README there). `.claude/skills/design-standard/` is the floor every page must pass; `DESIGN.md` is the per-client spec.

## Forms and reviews

Forms POST to Formspree. Create a form per client, put its ID in `forms.formspreeId`. `forms.steps: 2` (default) asks about the job first and contact details second, with a progress bar; set `1` for a single screen. Without JavaScript both steps render and the form still submits. Until it's set the button is disabled and says so. Successful submissions land on `/thank-you/`, which fires GA4 and Meta lead events if those IDs are set.

Reviews render through Trustindex. Create a widget per placement (home, reviews page, compact strip for service and city pages, footer badge) and put the IDs in `reviews.trustindex`. A blank ID hides that placement. The loader is deferred until the page has loaded and the widget is near the viewport (PR #2, the LCP fix), and the loader script is injected inside the widget container, not `<body>`: Trustindex renders beside its own script tag, so a body-level script rendered every widget below the footer and left the section empty (fixed after #2; client sites built before the fix need the same one-line change in `src/components/Trustindex.astro`, as Beachside did in its PR #47).

## Decisions baked in

- Programmatic service-area pages are **on**. Each location file has a `serviceNotes` map so combo pages carry unique copy. Add a note per service per city before launch to avoid thin content.
- Blog code is included but `pages.blog` defaults to **false**. Turn it on once a client has posts.
- Tracking supports GTM, GA4, and Meta Pixel, all off until IDs are added. Phone clicks and CTA clicks fire `phone_call` and `cta_click` events once a tracker is set.
- Every trust claim (rating, response promise, credentials, emergency line, team) comes from config or content and is hidden when blank.
- Hosting is Vercel. `netlify.toml` was removed on purpose.
- `/llms.txt`, `dateModified` on every page's schema, named AI crawlers in `robots.txt` (training agents switchable off per client), and at least three visible FAQs on every service and city page (docs/PAGES.md, Crawlers and AI).
- XML sitemaps are per section with `lastmod` from git and image entries; thin service-by-city pages (no `serviceNotes`) are noindex and left out until they have copy; IndexNow pings Bing on production deploys when a key is set (docs/PAGES.md, Sitemaps).
- The quote calculator shows a range, never a single price, and sends its inputs with the lead. Rules live in `src/calculator.config.ts` and are off after `new-client`.
- Social share images are generated at build from brand fonts and colors. Static TTFs go in `public/fonts/og/` (see `public/fonts/README.md`). Share copy is held to og:title ≤ 60 and og:description 80–125 characters, images to 1200×630 under 5 MB, by `npm run validate` (docs/PAGES.md "Share previews").
