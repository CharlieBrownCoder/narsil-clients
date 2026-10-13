# Service Business Website Template

A production-ready Astro template for local service companies (pressure washing, painting, junk removal, roofing, plumbing, electrical, HVAC, and more). One config file drives the whole site: business type, enabled pages, schema.org markup, theme, and tracking.

Built for SEO: static HTML, zero JS by default, JSON-LD on every page, programmatic service-area pages, sitemap, robots, canonical tags, Open Graph, and Core Web Vitals friendly markup.

## Stack

- Astro 7 (static output) + Tailwind CSS 4
- Content in Markdown and JSON under `src/content/`
- Deploys anywhere static files go (Netlify, Vercel, Cloudflare Pages)

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
npm run check      # type-check Astro + TS
```

## Spinning up a new client

1. On GitHub, click **Use this template** and name the repo after the client.
2. Clone it, then reset the demo content:
   ```bash
   npm install
   npm run new-client -- --name "Acme Roofing" --type roofing --city Austin --state TX
   ```
3. Edit `src/site.config.ts`. Every field is commented. The ones that matter most for SEO: `url`, `business.*`, `pages`, `trust.rating`, and `business.sameAs`.
4. Replace images in `public/images/` (see sizes in `docs/NEW-CLIENT.md`).
5. Fill `src/content/` (services, locations, posts, testimonials, projects, faqs).
6. `npm run build`, deploy, submit the sitemap in Google Search Console.

Full checklist: [docs/NEW-CLIENT.md](docs/NEW-CLIENT.md).

## Project layout

```
src/
  site.config.ts          ← the one file per client
  lib/
    business-types.ts     ← vertical → schema.org type registry
    schema.ts             ← JSON-LD builders
    seo.ts                ← title/description builders
    optional-pages.ts     ← which single pages exist
  content/                ← Markdown + JSON content collections
  pages/                  ← routes (thin, delegate to views)
  views/                  ← full-page templates
  components/sections/    ← hero, service grid, FAQ, CTA, forms...
  layouts/BaseLayout.astro
docs/
  PAGES.md                ← every page type, its URL, and its schema
  SCHEMA.md               ← how structured data is composed
  NEW-CLIENT.md           ← launch checklist
scripts/new-client.mjs    ← content reset
```

## Page types

| Page | URL | Toggle |
| --- | --- | --- |
| Home | `/` | always |
| Services index + detail | `/services/`, `/services/<slug>/` | `pages.services` |
| Service areas index + city | `/service-areas/`, `/service-areas/<city>/` | `pages.serviceAreas` |
| Service × City combo | `/service-areas/<city>/<service>/` | `pages.serviceAreaCombos` |
| About, Contact, Reviews, Gallery, FAQ | `/about/` etc. | `pages.<key>` |
| Blog index + post | `/blog/`, `/blog/<slug>/` | `pages.blog` |
| Privacy, Thank-you, 404 | | always / `pages.privacyPolicy` |

Disabled pages are not built, not in the nav, and not in the sitemap.

## Schema.org

Every page emits a single `@graph` with the `LocalBusiness` subtype for the vertical (e.g. `RoofingContractor`, `Plumber`, `HousePainter`), `WebSite`, a typed `WebPage`, and `BreadcrumbList`. Service pages add `Service` with `areaServed` and optional `Offer`. FAQ sections add `FAQPage`. Reviews add `Review` + `AggregateRating`. Posts add `BlogPosting`. See [docs/SCHEMA.md](docs/SCHEMA.md).

## Theming

`theme` in the config sets brand colors, Google Fonts, corner radius, hero layout, logo, and OG image. Colors map to Tailwind utilities `bg-primary`, `text-accent`, etc. For deeper changes edit `src/styles/global.css`.

## Forms

Defaults to Netlify Forms (zero config on Netlify). Switch `forms.provider` to `formspree` or `custom` and set `forms.action`. Successful submissions land on `/thank-you/`, which fires GA4 and Meta lead events if those IDs are set.

## Decisions made with defaults (change as needed)

- Programmatic service-area pages are **on**. Each location file has a `serviceNotes` map so combo pages carry unique copy. Add a note per service per city before launch to avoid thin content.
- Reviews are curated in `testimonials.json`, not pulled live.
- Blog is on. Set `pages.blog: false` to hide it until there is content.
- Analytics are config-driven and off until IDs are added.
