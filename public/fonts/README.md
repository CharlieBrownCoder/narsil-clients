# Fonts

Self-hosted, latin subset, variable weight (100 to 900), SIL Open Font License.

File names are the font family name slugified: "Plus Jakarta Sans" → `plus-jakarta-sans.woff2`.
`BaseLayout.astro` builds the `@font-face` rules from `theme.fontHeading` and `theme.fontBody`
in `src/site.config.ts`, so adding a client font is:

1. Get the variable latin woff2 (Google Fonts via `https://fonts.googleapis.com/css2?family=<Name>:wght@400..800`, or Fontsource).
2. Save it here as `<slug>.woff2`.
3. Set `theme.fontHeading` / `theme.fontBody` to the family name.

If a font is not variable, save the weights you need as `<slug>-400.woff2`, `<slug>-700.woff2` and
set `theme.fontWeights` accordingly (see the comment in site.config.ts).

## OG image fonts (`og/`)

The share-image renderer (satori) cannot read variable fonts, so it needs static TTF instances:

- `og/<heading-slug>-800.ttf` (or 700 if the family has no 800)
- `og/<body-slug>-400.ttf` and `og/<body-slug>-600.ttf`

Get them from Google Fonts with a non-browser user agent, which returns TTF URLs:

```bash
curl -sS -A "curl/8.0" "https://fonts.googleapis.com/css?family=Inter:400,600|Plus+Jakarta+Sans:800"
```

If the files are missing, the build still succeeds and every page falls back to `public/images/og-default.jpg`.
