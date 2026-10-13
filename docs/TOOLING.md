# Vendored tooling

Everything under `.claude/` is copied from a pinned upstream commit so a clone
of the template works with no plugin installs. Update by re-copying from the
fork in the `narsil-clients` GitHub org and bumping the commit here.

| Folder | Upstream | Fork commit | License | What we use |
| --- | --- | --- | --- | --- |
| `.claude/skills/humanizer/` | blader/humanizer v3.1.0 | narsil-clients/humanizer@225a6f3 | MIT | `SKILL.md` as-is, plus our `local-service.md` add-on |
| `.claude/skills/ui-ux-pro-max/` | nextlevelbuilder/ui-ux-pro-max-skill v2.15.0 | narsil-clients/ui-ux-pro-max-skill@7246805 | MIT (fonts OFL) | design-system generator, style/palette/font/UX data, Astro and Tailwind stack rules. Python 3 stdlib only. |
| `.claude/skills/design-standard/` | nateherkai/scroll-craft v0.3.1 (`references/taste.md` only) | narsil-clients/scroll-craft@75d81f7 | MIT | the measurable design floor; our own `SKILL.md` adds overrides for fast, conversion-first sites |
| `.claude/skills/{seo,accessibility,brand-discovery,brand-voice,article-writing,browser-qa,verification-loop,frontend-design-direction,design-system}/` | affaan-m/ECC v2.2.3 | narsil-clients/ECC@b92f181 | MIT | edited: ECC cross-references removed, local-service SEO rules added, brand-voice defaults rewritten |
| `.claude/agents/{seo-specialist,a11y-architect,marketing-agent}.md` | affaan-m/ECC v2.2.3 | same | MIT | "use proactively" removed |
| `.claude/agents/content-humanizer.md` | ours | | | batch humanizer over `src/content/` |

## Not vendored, used on the developer machine

- **gstack** (garrytan/gstack, fork narsil-clients/gstack). Install globally per its README. Its skills hardcode `~/.claude/skills/gstack` paths and need compiled Bun binaries, so they can't live in a project. Used for `/design-consultation`, `/design-review`, `/qa`, `/benchmark`. Disable its hourly update check: `gstack-config set update_check false`. Don't use team mode in a template.

## Reviewed and skipped

- **camoufox**: anti-detect browser for scraping sites that block bots. Nothing for a static site; its main use cases (Google Maps and SERP scraping) breach Google's terms. Plain Playwright covers competitor research and screenshots.
- **scroll-craft engine, devices, video scrubbing, hero-depth**: built for immersive art-piece pages. Would hurt LCP, CLS, and conversion on a contractor site.
- **ECC hooks and the other ~300 skills**: backend and SaaS focused; the hooks fire on every tool call and one blocks `astro dev` outside tmux.
