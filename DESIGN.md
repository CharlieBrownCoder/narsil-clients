---
design-md-format: spec
---

# Design spec: ClearShine Pressure Washing (demo client)

The measurable floor every page must pass is in
`.claude/skills/design-standard/`. This file holds what is specific to this
client. Replace it per client; `gstack /design-consultation` can generate it.

## Brand

- Positioning: the local, eco-friendly pressure washer that shows up when it says it will.
- Audience: homeowners 35 to 65 in Plano, Frisco, McKinney, Allen. Many HOA-driven.
- Tone: direct, practical, neighborly. No hype.

## Tokens (mirror of `src/site.config.ts` → `theme`)

| Token | Value | Use |
| --- | --- | --- |
| primary | #0E7490 | links, primary buttons, icons |
| primaryDark | #155E75 | hover |
| secondary | #0F172A | headings, footer, dark sections |
| accent | #F59E0B | the one CTA color (phone, Free Quote) |
| neutral | #F8FAFC | alternating section backgrounds |
| heading font | Plus Jakarta Sans 700/800 | h1 to h3 |
| body font | Inter 400/500/600 | everything else |
| radius | rounded (0.75rem) | buttons, cards, images |
| hero | photo + form | full-bleed job photo, dark scrim, copy left, quote card right |
| headings | uppercase | h1/h2 only |
| dividers | angle | hero bottom and CTA band top |
| service cards | photo | service image + icon chip |

## Type scale

- h1: 2.5rem mobile → 3.75rem desktop, tracking -0.02em, line-height 1.05, max 2 lines at 390px
- h2: 1.875rem → 2.25rem
- body: 1rem / 1.75, measure 62ch
- eyebrow: 0.875rem, uppercase, tracking 0.08em, primary

## Section rhythm

Hero → trust bar → services → why us → work (gallery) → reviews (dark) → areas → FAQ → form → CTA band. Alternate white and neutral. Dark sections: reviews and footer only.

## Imagery

Real job photos, landscape, 4:3. Before/after pairs side by side. No stock crews in matching polos.

## Do not

- Animate the hero.
- Add a third font or a gradient headline.
- Put the phone number anywhere but the header, hero, CTA band, footer, and mobile bar.
