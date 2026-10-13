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
- [ ] `pages` toggles
- [ ] `theme` colors, fonts, radius, heroStyle
- [ ] `trust.badges`, `guarantees`, `rating` (must match real review count)
- [ ] `tracking` IDs (GA4 or GTM, Meta Pixel, CallRail)
- [ ] `promo`

## 3. Images (`public/images/`)
| File | Size | Used on |
| --- | --- | --- |
| `logo.svg` | ~180×40 | header |
| `og-default.jpg` | 1200×630 | social share default |
| `hero.jpg` | 1600×1200 | home hero |
| `about.jpg` | 1600×1200 | about hero |
| `service-<slug>.jpg` | 1600×1200 | service pages (set `image` in frontmatter) |
| `project-N-before/after.jpg` | 800×600 | gallery |
| `blog-*.jpg` | 1200×800 | posts |
| `favicon.svg` (in `public/`) | square | tab icon |

Compress everything (Squoosh, ImageOptim). Target under 200 KB per hero image.

## 4. Content (`src/content/`)
- [ ] One `services/<slug>.md` per service. 300 to 600 words each, with `benefits`, `process`, `faqs`, `related`.
- [ ] One `locations/<slug>.md` per city. Mark the home base `primary: true`. Fill `zips`, `neighborhoods`, `cityUrl`.
- [ ] **If `serviceAreaCombos` is on:** add a `serviceNotes.<service-slug>` paragraph for every service in every city. This is what makes the combo pages unique. Skip cities you can't write real copy for, or restrict them with `services: [...]`.
- [ ] `testimonials.json`: 6+ real reviews with names, locations, dates.
- [ ] `projects.json`: 3+ before/after pairs.
- [ ] `faqs.json`: 6+ general questions, plus per-service ones keyed by slug.
- [ ] `posts/`: 2+ posts or set `pages.blog: false`.
- [ ] Rewrite the About page copy in `src/views/About.astro`.

## 5. Build and verify
- [ ] `npm run check && npm run build`
- [ ] Open `dist/` pages, check titles and descriptions (`grep -o '<title>[^<]*' dist/**/index.html`)
- [ ] Validate 3 pages at https://validator.schema.org (home, a service, a combo)
- [ ] Lighthouse on home and a service page: aim for 95+ across the board

## 6. Deploy
- [ ] Connect repo to Netlify / Vercel / Cloudflare Pages (build `npm run build`, publish `dist`)
- [ ] Custom domain + HTTPS
- [ ] Netlify: confirm the `quote` form appears under Forms and set notification email
- [ ] Submit `https://<domain>/sitemap-index.xml` in Google Search Console
- [ ] Add the site URL to Google Business Profile
