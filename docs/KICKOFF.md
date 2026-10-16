# Kicking off a new client site

Two parts: the intake you collect before the session starts, and the prompt
you paste into a fresh Claude Code session in the new repo. The session then
follows `docs/NEW-CLIENT.md` and the skill order in `CLAUDE.md`.

## Part 1: Intake (collect before starting)

The fill-in version of this form, with file uploads and one saved record per
client, is at https://claude.ai/artifact/HfXXCVhxeVWGZAfHFV9VJb. Share it from
the page's Share menu with edit access when a client fills it in. The text
block below is the same intake for pasting into chat.

Blank is fine. Blank means the claim is hidden, never invented.

```
CLIENT INTAKE

Business
- Legal name / display name:
- Business type (template id, e.g. pressure-washing, roofing, painting):
- Phone:                      Email:
- Street address (and whether it may be shown):
- Founded (year):
- Hours (per day):
- Payment methods:
- Service radius (miles) and the cities to target (5 to 15):

Sources
- Current website URL:
- Google Business Profile URL:
- Facebook / Instagram / Yelp / Nextdoor / BBB URLs:
- Logo file (SVG or large PNG):
- Photo folder (owner's own job photos, rights confirmed: yes/no):

Trust (confirmed facts only)
- Google rating and review count:
- Insured (carrier) / licensed (number):
- Certifications, memberships, awards:
- Written guarantee, if any:
- Emergency / after-hours line (only if a human answers):
- Response-time promise they actually keep:
- Team members to show (name, role, photo):
- Named commercial clients (with permission):

Offers
- Current discounts or promos (with expiry):
- Maintenance plans with real prices:

Integrations
- Formspree form ID:
- Trustindex widget IDs: home / page / compact / badge:
- GTM or GA4 ID, Meta Pixel ID:
- Search Console verification token:

Repo and hosting
- Stack: Astro service template (default; do not change)
- GitHub repo (narsil-clients/<slug>-site), created from the template: yes/no
- Vercel connected: yes/no
- Production domain and current DNS host:
- HTML sitemap page on (default yes):
```

## Part 2: Kickoff prompt (paste into the new session)

Replace the bracketed values. Leave a line blank rather than guessing.

```
Build the client site for [Business Name] in this repo.

Stack: Astro 7 static site from the narsil-clients/narsil-clients service
template (Tailwind 4, Markdown content, Vercel). This is the default for
every client site. First confirm this repo is that template: astro.config.mjs,
src/site.config.ts, and src/views/ exist. If the repo holds anything else
(a Next.js starter, an empty repo, another template), stop and say so; the
fix is to copy the template's files in with one normal commit on main, not
to build in whatever is there.

Read README.md, CLAUDE.md, and docs/NEW-CLIENT.md first, then follow the
skill order in CLAUDE.md.

Intake:
[paste the completed intake block]

Rules for this build
- Facts come only from the intake, the current site, and the Google listing.
  Never invent years, counts, prices, credentials, or team names. Anything not
  confirmed stays blank and therefore hidden.
- Match the existing logo and brand colors. Sample them from the current site
  and the logo; name the hex values in DESIGN.md with the rationale.
- Photos: use the client's own only. Hero, about, one per service, and gallery
  projects. Keep source images in src/assets/images/.
- Services: one file per real service, 300 to 600 words, benefits, process,
  FAQs, related links. Categories only if there are two or more real groups.
- Locations: one file per target city. Give every service listed for a city a
  specific serviceNotes line, and restrict a city's services to those with
  notes so no combo page reads as templated.
- Run the content-humanizer agent over src/content when the copy is drafted.
- Keep a docs/HANDOFF.md with status, open items (config key per item), copy
  claims the owner should confirm, and decisions made. Add a short client
  section to CLAUDE.md that points to it.
- Before every commit: npm test (check, build, validate). Screenshot home,
  one service page, and one city page at 1366 and 390 wide and send them.
- Old-site URLs: map each to its new page as a permanent redirect in
  vercel.json. Keep unchanged paths unchanged.
- Keep the HTML sitemap page on (pages.sitemap) and, before reporting,
  fetch every link on /sitemap/ from the preview and confirm each returns
  200. The XML sitemap is what gets submitted to Search Console.
- Commit in logical steps on main and push. No PR unless asked.

Ask me only for decisions that change the work: replacing an existing repo's
contents, which pages to enable, and anything in the intake that conflicts
with the current site. Default everything else and note the assumption in
docs/HANDOFF.md.

When the build is green and deployed, report: the preview URL, what is live,
what is blank and why, the claims to confirm with the owner, and the DNS
cutover steps.
```

## What happens after the prompt

1. The session builds, humanizes, screenshots, and pushes to `main`.
2. Vercel deploys the preview; review it page by page with the client.
3. Fill the open items from `docs/HANDOFF.md` as the client sends them.
4. DNS cutover, then the live checks (status codes, sitemap, fonts,
   redirects, Trustindex allowed domain).
