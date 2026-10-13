# New client launch checklist

## 1. Repo
- [ ] GitHub → **Use this template** → `<client-slug>-site`
- [ ] `npm install && npm run new-client -- --name "..." --type <businessType> --city <City> --state <ST>`

## 2. Config (`src/site.config.ts`)
- [ ] `url` (final production domain, https, no trailing slash)
- [ ] `business.name`, `legalName`, `tagline`, `description` (150 to 300 words, mentions city and main services)
- [ ] `phone` / `phoneE164`, `email`
- [ ] `address` (set `showStreet: false` for service-area businesses that hide their address on GBP)
- [ ] `geo` lat/lng (Google Maps → right-click → copy coordinates)
- [ ] `hours`, `priceRange`, `paymentAccepted`
- [ ] `sameAs` (GBP, Facebook, Instagram, Yelp, BBB, Nextdoor, Angi, etc.)
- [ ] `googleReviewUrl`, `mapEmbedUrl`
- [ ] `business.locations[]`: real offices only, with street, hours, directions, parking. Empty for service-area-only businesses.
- [ ] `business.emergency`: `available: true` only if a human answers after hours. Set phone if different.
- [ ] `business.responseTimePromise`: only a promise they keep. Blank hides it.
- [ ] `business.credentials[]`: license numbers, insurance carrier, certifications, memberships. Nothing unverifiable.
- [ ] `tracking.searchConsoleVerification` once the property is added
- [ ] `pages` toggles
- [ ] `theme` colors, fonts, radius, heroStyle
- [ ] `trust.badges`, `guarantees`, `rating` (must match real review count)
- [ ] `tracking` IDs (GTM, or GA4 direct, plus Meta Pixel)
- [ ] `forms.formspreeId` (create the form at formspree.io, set the notification email there)
- [ ] `reviews.trustindex` widget IDs: home, page, compact, badge
- [ ] `promo`

## 3. Fonts (`public/fonts/`)
- [ ] Variable latin woff2 for the heading and body family, named `<slug>.woff2` (see `public/fonts/README.md`)
- [ ] `theme.fontHeading` / `theme.fontBody` match the family names exactly
- [ ] Static TTFs in `public/fonts/og/` for generated share images (see `public/fonts/README.md`)

## 4. Images
Source images live in `src/assets/images/` and are optimized at build (WebP, responsive sizes). Only three files stay in `public/`.

| File | Where | Size | Used on |
| --- | --- | --- | --- |
| `logo.svg` | `public/images/` | ~180×40 | header |
| `og-default.jpg` | `public/images/` | 1200×630 | social share default |
| `favicon.svg` | `public/` | square | tab icon |
| `hero.jpg` | `src/assets/images/` | 1600×1200 | home hero |
| `about.jpg` | `src/assets/images/` | 1600×1200 | about hero |
| `service-<slug>.jpg` | `src/assets/images/` | 1600×1200 | service pages (`image: ../../assets/images/...` in frontmatter) |
| `project-N-before/after.jpg` | `src/assets/images/` | 800×600 | gallery (`../assets/images/...` in projects.json) |
| `blog-*.jpg` | `src/assets/images/` | 1200×800 | posts |

Upload originals at those sizes; the build handles compression and formats.

## 5. Content (`src/content/`)
- [ ] One `services/<slug>.md` per service. 300 to 600 words each, with `benefits`, `process`, `faqs`, `related`.
- [ ] One `locations/<slug>.md` per city. Mark the home base `primary: true`. Fill `zips`, `neighborhoods`, `cityUrl`.
- [ ] **If `serviceAreaCombos` is on:** add a `serviceNotes.<service-slug>` paragraph for every service in every city. This is what makes the combo pages unique. Skip cities you can't write real copy for, or restrict them with `services: [...]`.
- [ ] `projects.json`: 3+ before/after pairs.
- [ ] `faqs.json`: 6+ general questions, plus per-service ones keyed by slug.
- [ ] `team.json`: real names, roles, photos. Or set `pages.team: false`.
- [ ] `categories.json` + `category` on each service when there are more than ~6 services.
- [ ] Mark `emergency: true` on services offered 24/7.
- [ ] `startingPrice` + `priceHigh` on services that should appear on `/pricing/`.
- [ ] `src/calculator.config.ts`: real base and per-unit ranges per service, or leave `enabled: false`.
- [ ] `projects/*.md`: 3+ before/after pairs; add a body to the best one to make it a case study.
- [ ] `resources/*.md` + the file in `public/downloads/`, or set `pages.resources: false`.
- [ ] `booking`: provider, URL or embed URL, or leave `none`.
- [ ] `posts/`: 2+ posts with a `category` (article, seasonal-guide, how-to, pricing) or leave `pages.blog: false`.
- [ ] Rewrite the About page copy in `src/views/About.astro`.
- [ ] Run the `content-humanizer` agent over every file in `src/content/` and review the diff.
- [ ] Fill `DESIGN.md` for this client (or run gstack `/design-consultation`).

## 6. Build and verify
- [ ] `npm run test` (check + build + validate). Fix every ERROR; read every warn. `THIN_COMBOS=fail npm run validate` before launch to force a note on every combo page.
- [ ] Open `dist/` pages, check titles and descriptions (`grep -o '<title>[^<]*' dist/**/index.html`)
- [ ] Validate 3 pages at https://validator.schema.org (home, a service, a combo)
- [ ] Lighthouse on home and a service page: aim for 95+ across the board

## 7. Deploy
- [ ] Import the repo in Vercel (framework preset Astro, output `dist`)
- [ ] Old URLs from a previous site go in `vercel.json` → `redirects` (301s)
- [ ] Custom domain + HTTPS
- [ ] Submit a test quote and confirm Formspree delivers it
- [ ] Submit `https://<domain>/sitemap-index.xml` in Google Search Console
- [ ] Add the site URL to Google Business Profile
