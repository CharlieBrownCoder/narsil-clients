---
name: design-standard
description: The measurable design floor every client site built from this template must meet. Use when building or reviewing any page, section, or component, when picking type sizes, spacing, colors, or motion, and when a design review says a page looks generic or like a template.
license: MIT (references/taste.md from scroll-craft by Nate Herk; see LICENSE-scroll-craft)
---

# Design standard

This skill holds the rules a page must pass on the rendered result. It is a
floor, not a style. Style comes from `src/site.config.ts` theme tokens and from
`ui-ux-pro-max`. Judgment about what fits the client comes from
`frontend-design-direction`.

Read `references/taste.md` once per session before writing markup. Then apply
the overrides below, which exist because these sites must load fast, convert,
and rank, not win design awards.

## Overrides for local service sites

**Keep from taste.md:** Spacing, Typography, Colour, Text over media, Depth,
Cards, Motion, States and content, the refuse list, the squint test.

**Ignore from taste.md:** the `--sc-*` token names (this template uses Tailwind
4 `@theme` tokens in `src/styles/global.css`), the ban on Inter, and the ban on
em dashes as a *rule* (the humanizer skill handles dashes in copy).

**Hard rules added here:**

1. **LCP element is static.** The hero image or headline never animates, never
   waits on JS, never sits behind a video. No video above the fold.
2. **No scroll-jacking, no parallax heroes, no pinned sections.** Entry
   fade-ins below the fold are fine: 14px rise, 600ms ease-out, once, gated on
   `prefers-reduced-motion`.
3. **CLS under 0.1.** Every image has `width` and `height`. Fonts are
   self-hosted with `font-display: swap` and size-adjusted fallbacks.
4. **One primary CTA per screen.** It is the phone number on mobile and the
   quote form on desktop. Same label everywhere: "Get a Free Quote".
5. **Hero: headline two lines max at 1366px and three at 390px, subtext 20
   words max, CTA visible without scrolling, no more than four text elements
   plus the bullet grid.**
6. **Contrast measured on the render:** body 4.5:1, large text and controls
   3:1, including text over images (use a local scrim, never a full overlay).
7. **Identical-card grids are the refuse list's first item.** The service grid
   may be a grid, but cards differ by icon, image, or a one-line proof point.
   Never three equal columns of icon + heading + sentence with nothing else.
8. **Trust is shown, not labeled.** Real review count, real license number,
   real photos. Badges without a fact behind them are removed.
9. **Mobile is designed, not shrunk.** Check every page at 390px. The sticky
   call bar must not cover content or the form submit button.
10. **Section rhythm is the one `.section` rule** (`docs/PAGES.md`, Section
    rhythm): 96 / 112 / 128px per section at phone / tablet / laptop. Do not
    add per-section padding; let the alternating backgrounds carry the break.
    A home page past 12 sections is a content decision, not a spacing one.

## The trade-site pattern (from docs/DESIGN-REFERENCE.md)

The client's reference set of 32 sites converges on one above-the-fold
pattern. Build it unless `DESIGN.md` says otherwise:

1. **Eyebrow**: "[Vertical] in [City], [ST]" in the accent color, small caps.
2. **Headline**: "[City]'s Top-Rated *[Service]* Company" or "[Region]'s Best
   [Service]", 4 to 8 words, one phrase in the accent color, uppercase heavy
   sans when `headingCase: uppercase`. Two lines at 1366, three at 390 max.
3. **Subheadline**: one sentence, under 20 words, says what and the guarantee.
4. **Four checkmark bullets** in a 2×2 grid (licensed & insured, guarantee,
   pricing promise, scheduling promise).
5. **Two CTAs**: filled accent "Get a Free Quote" + outlined phone number.
   Same pair on mobile, stacked, with the sticky call bar below.
6. **Response promise and the star line** under the CTAs.
7. **Quote card** on the right at desktop when `heroForm: true`; otherwise
   the photo carries the right half.
8. **Trust row** directly under the hero: badge logos or icon badges, then
   the stat strip when real numbers exist.
9. **Section edge**: angled or curved divider into the next section.
10. **A number inside the first 900 px**: review count with its source, years,
    jobs, or an award. "Top rated" with no number is the tell of the weak
    sites in the reference set.
11. **One visual device per client** so sites built from the template don't
    look alike: pick exactly one of duotone tint, sticker buttons, a
    cutout, a shaped divider, a stat strip, or a mascot, and leave the rest
    at defaults.

What the reference set does that we deliberately don't: 2 MB+ pages, hero
video, three competing CTAs in the header, review counts in the headline
that go stale, and uppercase body copy.

## Review procedure

When asked to review a page:

1. Build and screenshot at 1366 and 390 wide, full page.
2. Walk `references/taste.md` section by section and the hard rules above.
3. For each failure, give the file and line, the computed value you saw, and
   the fix. Vague feedback ("feels generic") is not a finding.
4. Fix in the smallest diff that passes, one commit per rule.
