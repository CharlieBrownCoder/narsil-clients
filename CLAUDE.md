# Service business website template

Astro 7 + Tailwind 4 static site, deployed to Vercel. One config file per client
(`src/site.config.ts`) drives pages, schema, theme, forms, and tracking. Content
is Markdown and JSON under `src/content/`. New client: `docs/KICKOFF.md` has the
intake form and the paste-in prompt. Read `README.md` first, then
`docs/PAGES.md` and `docs/SCHEMA.md` when touching routes or structured data.

## Commands

- `npm run dev`, `npm run build`, `npm run check` (run `check` and `build` before every commit)
- `npm run new-client -- --name "X" --type roofing --city Austin --state TX` resets demo content
- `node scripts/theme-from-design-system.mjs "<description>" --name "X"` proposes theme tokens

## Rules

- Never hand-roll `<title>` or JSON-LD in a view. Use `src/lib/seo.ts` and `src/lib/schema.ts`.
- Share previews: og:title 60 chars or fewer, og:description 80 to 125, image 1200×630 PNG or JPG under 5 MB. Lead with the result, end on `social.valueLine`. `npm run validate` enforces it; rules in `docs/PAGES.md` "Share previews".
- Pages are toggled in `siteConfig.pages`. A disabled page must not build, appear in nav, or be in the sitemap.
- Service and city pages carry at least three visible FAQs and every FAQPage schema question is visible on the page; `/llms.txt` and each page's `dateModified` render from the page registry; `robots.txt` always allows the search agents. `npm run validate` holds all four; rules in `docs/PAGES.md` "Crawlers and AI".
- Every page type has a row in `src/lib/site-pages.ts`; the XML sitemaps render from it with `lastmod` from git, never build time, and `npm run validate` holds it to the built site. A combo page with no `serviceNotes` entry is noindex and out of the sitemap.
- Images go in `src/assets/` and render through Astro `<Image>` with width, height, and alt. Only the logo, favicon, and OG image live in `public/`.
- Fonts are self-hosted in `public/fonts/` with `font-display: swap`. No Google Fonts CDN.
- No client-side JS unless a component needs it. No scroll animation on the LCP element.
- Never invent business facts (years, review counts, prices). They come from `site.config.ts` or the client.
- Quote YAML strings that contain a colon.
- Every trust claim (rating, promise, credential, emergency line, team member) renders from a config or content value that defaults to blank. Blank means hidden. Never hardcode one in a view.

## Skills and agents in this repo (`.claude/`)

Use them in this order when onboarding a client:

1. `brand-discovery` → positioning brief
2. `brand-voice` → `VOICE PROFILE` from the client's real copy and reviews
3. `ui-ux-pro-max` → `node scripts/theme-from-design-system.mjs` → review, then set `theme` in config
4. `design-standard` (+ `frontend-design-direction`) → build pages; review at 1366 and 390 wide
5. `seo` skill and `seo-specialist` agent → titles, schema, service-area coverage, internal links
6. Write content, then `content-humanizer` agent over every file in `src/content/`
7. `accessibility` / `a11y-architect` → WCAG 2.2 AA pass
8. `browser-qa` and `verification-loop` → build, check, screenshot, diff review

Skills are vendored copies with their licenses alongside. Pinned versions are in
`docs/TOOLING.md`. Don't install the upstream plugins on top of them.

## If gstack is installed on this machine

Run `/design-consultation` once per client to fill `DESIGN.md`, then
`/design-review <vercel-preview-url>`, `/qa <url> --quick`, and `/benchmark`
before launch. `.gstack/` is gitignored.
