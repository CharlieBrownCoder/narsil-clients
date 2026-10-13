# Service Business Website Template

A production-ready Astro template for local service companies (pressure washing, painting, junk removal, roofing, plumbing, electrical, HVAC, and more). One config file drives the whole site: business type, enabled pages, schema.org markup, theme, and tracking.

Built for SEO: static HTML, zero JS by default, JSON-LD on every page, programmatic service-area pages, sitemap, robots, canonical tags, Open Graph, and Core Web Vitals friendly markup.

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

Full checklist: [docs/NEW-CLIENT.md](docs/NEW-CLIENT.md).

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
scripts/
  new-client.mjs          ← content reset
  theme-from-design-system.mjs ← theme tokens from the ui-ux-pro-max generator
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

Every page emits a single `@graph` with the `LocalBusiness` subtype for the vertical (e.g. `RoofingContractor`, `Plumber`, `HousePainter`), `WebSite`, a typed `WebPage`, and `BreadcrumbList`. Service pages add `Service` with `areaServed` and optional `Offer`. FAQ sections add `FAQPage`. `AggregateRating` comes from `trust.rating` (keep it equal to the live Google count). Posts add `BlogPosting`. See [docs/SCHEMA.md](docs/SCHEMA.md).

## Theming

`theme` in the config sets brand colors, font families, corner radius, hero layout, logo, and OG image. Colors map to Tailwind utilities `bg-primary`, `text-accent`, etc. Fonts are self-hosted: drop `<slug>.woff2` in `public/fonts/` (see the README there). `.claude/skills/design-standard/` is the floor every page must pass; `DESIGN.md` is the per-client spec.

## Forms and reviews

Forms POST to Formspree. Create a form per client, put its ID in `forms.formspreeId`. Until it's set the button is disabled and says so. Successful submissions land on `/thank-you/`, which fires GA4 and Meta lead events if those IDs are set.

Reviews render through Trustindex. Create a widget per placement (home, reviews page, compact strip for service and city pages, footer badge) and put the IDs in `reviews.trustindex`. A blank ID hides that placement.

## Decisions baked in

- Programmatic service-area pages are **on**. Each location file has a `serviceNotes` map so combo pages carry unique copy. Add a note per service per city before launch to avoid thin content.
- Blog code is included but `pages.blog` defaults to **false**. Turn it on once a client has posts.
- Tracking supports GTM, GA4, and Meta Pixel, all off until IDs are added.
- Hosting is Vercel. `netlify.toml` was removed on purpose.
