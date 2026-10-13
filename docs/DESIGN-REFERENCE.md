# Design reference: what the client's favorite trade sites do

33 sites the client admires were captured on 2026-10-13 at 1366×900 and
390×844 (full page too), with fonts, CTA colors, nav order, H2 order, widgets,
schema types, platform, and transfer size extracted from the live DOM. Four
reviewers graded them against one brief. One site (exploringtemecula.com)
served a 403 to the desktop fetch and is excluded from the numbers.

This file records what was found and how it maps onto the template. The
measurable rules live in `.claude/skills/design-standard/`; the presets live
in `src/theme-presets.ts`.

## The numbers (32 sites)

| Measure | Result |
| --- | --- |
| Platform | 30 WordPress (mostly one Elementor agency kit), 1 Next.js, 1 custom |
| Page weight | median 2.2 MB, 252 KB to 17 MB; median ~110 requests, 4.5 to 9.5 s load |
| Heading font | Poppins 7, Montserrat 5, Oswald 2, then one each: Saira, Barlow Condensed, Chakra Petch, Teko, Audiowide, Nunito, Playfair, Rubik |
| Heading weight | 700 to 900 on 13 of 32; 400 to 600 on the rest |
| Body font | system stack on 27 of 32 (no body webfont loaded) |
| Visible H1 size | median 20 px: the keyword "Service in City" line, with the display headline as an H2 or div |
| Nav order | Home › About › Services › Service Area › Gallery › Reviews › Blog › Contact on most of the agency kit |
| Header | logo left, links, phone with icon, filled CTA. Static (not sticky) on 30 of 32. Top utility bar on 5 |
| CTA label | "Get a Fast Quote" on 19 sites; "Get a Free Quote" 3; "Book Now/Online" 5; "Instant Quote" 2 |
| Mobile CTA | "Get Pricing" + "Click to Call" halves under the headline on ~15 sites; sticky bottom bar on only 4 |
| Form in hero | 11 of 32 (4 to 8 fields in a white card on the right) |
| Video in hero | 4 of 32 |
| Review widgets | NiceJob 4, Google reviews embed 4, Elfsight 1, Trustindex 1; 4 sites show no rating anywhere |
| Schema | WebSite 30, Organization 28, FAQPage 24, LocalBusiness 22, Person 19, Article 19, Place 18, BreadcrumbList 7 (the Rank Math default set) |
| Pages linked | reviews 30, about 29, services 25, blog 24, gallery 20, areas 19, careers 17, FAQ 17, pricing 3, financing 2 |
| Tracking | GTM 28, Meta Pixel 11, CallRail 2, chat widgets 4 |

## The shared skeleton

Most of the set follows one section order. The template implements each block
as a config-driven component; blank config hides the block.

| Order | Reference block | Template |
| --- | --- | --- |
| 1 | Hero: dark photo or duotone, eyebrow, 2 to 3 line uppercase headline with one accent phrase, 2×2 check bullets, quote + phone buttons, optional quote card | `Hero` with `theme.heroStyle`, `heroForm`, `heroScrim`, `hero.*` |
| 2 | Icon strip of services overlapping the hero edge (Tagg, Smart Scoops, ProShield, Dream Clean, Jeff, 561) | `ServiceStrip` (`theme.serviceStrip`) |
| 3 | Trust row: badge logos, award seals, "5.0 · 91 Google reviews" | `TrustBar` (`trust.logos`), stars line in hero |
| 4 | Stat strip with 4 to 7 numbers (Matt, Dream Clean, Jeff "15+ years") | `StatsStrip` (`trust.stats`) |
| 5 | "Trusted by" client logos (Professor, Matt) | `ClientLogos` (`trust.clients`) |
| 6 | Intro split: photo + copy + bullets | `WhyUs` |
| 7 | Services: photo tiles with label bars (Martz, Professor, Concrete Fixers) or icon cards | `ServiceGrid` (`theme.serviceCards`) with "From $X" chips |
| 8 | Specials / coupons / plan tiers / "starting at" pricing (Concrete Fixers, CJ's, Mt Baker, Knight, Green Light) | `OffersGrid` (`offers`), `PlanTiers` (`plans`), `/pricing/` |
| 9 | Why choose us: 4 to 6 benefit cards | `WhyUs` |
| 10 | "Easy as 1-2-3" process | `ProcessSteps` (`process`) |
| 11 | Comparison table, company column highlighted (Rufus, Boost, Shield, Knight, Martz) | `ComparisonTable` (`trust.comparison`) |
| 12 | Guarantee band ("Risk-free", dollar guarantees on HighLevel) | `GuaranteeBand` (`trust.guarantee`) |
| 13 | Team / owner story | `TeamGrid`, About |
| 14 | Before/after grid | `Gallery`, case studies |
| 15 | Reviews ("What neighbors are saying") | `Trustindex` |
| 16 | Service area list or map | `LocationGrid`, branches |
| 17 | FAQ | `Faq` |
| 18 | "Ready to…?" CTA band + footer | `Cta`, `Footer` |

## What the top-graded sites share

Reviewers' top tier: Shield Roofing (A-), Tagg Concrete Coatings (A-),
HighLevel Garage Doors (A-), Matt the Driveway Guy (A-), then ProShield,
Ernie Haro, Green Light, Junk Bros (B+).

- A real crew, owner, or wrapped truck in the hero. Stock duotone photos
  (Jeff, 561) read generic even on the same layout.
- Proof inside the first 900 px: a review count with a source, award seals,
  certification badges, or a stat strip. "Top rated" with no number is the
  tell of the weak sites.
- Quote and phone as a pair on both breakpoints; the strongest mobile folds
  are the two-button halves plus a sticky call bar (Shield, HighLevel).
- A form in the hero when the service is quotable from a photo (coatings,
  roofing, pressure washing). Four to six fields. Mt Baker's two-step with a
  progress bar is the best version of it.
- Money on the page: plan tiers, coupons with expiry, "starting at" prices,
  dollar-amount guarantees. Reviewers rated these above every icon grid.
- One visual device per brand so the sites don't look identical: lime
  duotone (Junk Bros), cloud-shaped edges (Big Foam), mountain divider
  (Mt Baker), sticker buttons with hard shadows (Knight, Smart Scoops), gold
  diagonal behind an owner cutout (Ernie Haro), polygon-masked owner (Junk
  Bros), cracked-concrete lettering (Concrete Fixers), stat strip (Matt),
  mascot (HighLevel, Jeff, Smart Scoops, Rufus), two-tone headline (most).

## What the weak sites share

- Scroll-triggered rendering and lazy sliders that leave 400 to 4,000 px
  blank: 7 of 8 in one batch had at least one empty block on capture.
- No phone number in the mobile fold (CPM, Bend Fit, Jeff, Green Light).
- Hidden keyword H1 at 15 to 25 px with the visible headline as an H2, plus
  6 to 12 stacked "Service in City" H2s near the footer.
- Three competing CTAs in the header, 15-item navs, 8 to 11 field forms that
  push the submit below the mobile fold.
- 2 to 17 MB pages, 100+ requests, 5 to 9 s loads; hero video as the LCP.
- Empty "coming soon" components: blank review widgets, missing coach or
  team photos, zero-count counters.

## Per-site findings

Columns: hero pattern · nav · mobile fold · primary CTA · trust above fold · section order · palette (dominant, accent, dark) · type (heading/body, weight, lines) · photography · component worth copying · what hurts · grade.

| slug | vertical | hero pattern | nav pattern | mobile fold | primary CTA treatment | trust signals above fold | section order (first 8) | palette | type | photography style | component worth copying | things that hurt | grade |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| voltvikings | electrical | `centered`/`illustration`: purple vector mountains, 3-line white display headline, orange pill | `logo-left links-right phone+cta`, floating cream card | logo+MENU, 3-line headline, full-width CTA, no phone | #FF9143 pill, black text, 10px radius, bolt icon | none | intro, 8 illustrated services, values, guarantee band, why-choose, reviews, 3-step | #532C85, #FF9143, #28074D | Saira 700 caps, system; 3 lines | vector scene and mascot only | custom-illustrated service grid | 1.2MB, 6.4s, 57 req; headline not the H1 | B- |
| callhighlevel | garage doors | `split`: flat navy, bellhop mascot right; eyebrow, 64px H1, Book/Call pair | `top-bar` plus `logo-left links-right phone+cta` | 4-line H1, stacked Book/Call, sticky Book/Call/Text bar | red #D22630, calendar icon, 7px; ghost CALL | 5.0/91 reviews, Google Guaranteed, BBB, IDEA strip | badges, manifesto, services, differentiators, guarantees, reviews, CTA band, towns | #1A1630, #D22630, #F5F4F0 | Barlow Condensed 900, Barlow; 3 lines | mascot illustration only | guarantee cards with dollar promises; 3-cell sticky bar | no job photos; no FAQPage; 4.8s despite 759KB | A- |
| fireflyeffects | outdoor lighting | `image-bg`/`form-in-hero`: night house photo, teal scrim, 2-line headline, 8-field form | `logo-left links-right phone+cta`; phone button renders empty | 4-line headline, 8 tiny fields, no phone | lime #6CDD0A full-width, navy text, 5px radius | none | intro, blank service cards, consultation band, benefits, gallery, why-trust, guarantee, void | #003649, #6CDD0A, #0C5AA6 | Poppins 700, Poppins; 2 lines | real night-lit houses, cartoon firefly | service-type dropdown in hero form | overlapping duplicate H2; 1883px overflow; broken phone button; no analytics | C- |
| ernieharoelectric | electrical | `image-bg`/`split`: van photo, navy scrim; owner cutout on gold diagonal; 2x2 bullets | `logo-left links-right phone+cta`, white phone pill | 3-line headline, 4 bullets, PRICING/CALL pair, seals | gold #DF9731 square, black text, bolt icon | 4 bullets (licensed, warranty, pricing); 5 award badges | value cards, intro/counters, services, Call/Text band, why-choose, guarantee, reviews | #19212C, #DF9731, #1E6FE0 | Chakra Petch/condensed 700, Poppins-like; 2 lines | real owner cutout, techs | award-seal row under hero CTA | 2.2MB; counters show 0+; 6 stacked keyword H2s | B+ |
| trianglehomedetailing | pressure washing | `video-bg`: roof tech, charcoal scrim; 3-line H1, 2x2 bullets, CTA/phone pair | `logo-left links-right phone+cta`, quote button only | 3-line headline, 4 bullets, PRICING/CALL pair | mint #7AE1BF square, charcoal text, 0 radius | 4 bullets (25-yr warranty); 3-check strip | check strip, carousel, intro, tiles, why-choose, plans band, benefits, review | #25282A, #7AE1BF, #1E2022 | Poppins 800, Poppins; 3 lines | real video, job photos | year-round service-plan membership band | 8.7s, 2MB, video LCP; broken carousel; eyebrow H1, stacked keyword H2s | B- |
| thedreamcleanteam | home cleaning | `split`: owner cutout on navy clouds; 2-line two-tone H1, 3 stat checks | `logo-left links-right phone+cta`, 9 links, Login | 2-line H1, 3 checks, Book/Call pair; 400px void | sky #4FBEE6, 7px radius, serif label | 150,000 turns, 4.9 guest-rating stats | carousel, intro, city links, Inc 5000, reviews band, benefits, guarantee | #113A70, #4FBEE6, #0B2A52 | Poppins 800, Poppins; 2 lines | owner cutout, stock shots | Inc 5000 press card; review-count bubble | 81 req, 75 images; 3 header CTAs; blank logo row | B- |
| valkyriewraps | vehicle wraps | `split`/`video-bg`: streak video, 3-line techno headline, wrapped truck right | floating white card, `logo-left links-right phone+cta` | 3-line headline; clipped CTA label; 800px void; no phone | yellow #FFC700 2-line label, hazard-stripe corners | "Top-Rated" word only | icons, intro, wrap types, Spot/Partial/Full tiers, benefits, guarantee, 3M band, gallery | #090D22, #FFC700, #009DFF | Orbitron-like display 700, Roboto-like; 3 lines | generic "YOUR COMPANY" vehicle mockups | Spot/Partial/Full coverage comparison with vehicle renders | no H1; 2.6MB, 119 req; video hero; template mockups | C+ |
| concretefixers | concrete | `form-in-hero`/`split`: navy grunge, cracked-concrete lettering, B&W owner cutout, 4-field quote card | `logo-left links-right phone+cta`, red phone button | 2-line headline, PRICING/CALL pair, owner cutout; form hidden | red #EB0404, white text, 2px radius | none | icons, intro/as-seen-on, photo services, Call/Text band, team, before/afters, benefits, reviews | #1E375F, #EB0404, #0B1424 | Teko/condensed 600, cracked lettering, Poppins-like; 2 lines | owner cutout, real team, before/afters | dashed-border per-service coupon cards ($200-$500 off) | 10.9MB, 146 req; font-display auto; 11 stacked keyword H2s | C+ |
| cjswindowscleaning | window cleaning | `split`: navy over faded house; framed squeegee photo right; review eyebrow | `logo-left links-right phone+cta`, 2-line quote button | 550px dead space above copy; eyebrow, PRICING/CALL pair | yellow #FFB522 with microcopy; blue #1669F4 phone twin | 800+ 5-star reviews eyebrow | icons, intro, Maintenance Plans, features, photo services, Bundle-and-Save, why-trust, guarantee | #082C69, #FFB522, #1669F4 | Audiowide 400 caps, Poppins-like; 2 lines | real ladder/squeegee shots, team | Maintenance Plans tiers with check/x feature rows | 3.3MB, 108 req, 66 images; 11 stacked keyword H2s | B |
| callrufusroofing | roofing | `image-bg`: branded truck, ~70% teal scrim, centered 2-line ~70px headline, amber button | `logo-left links-right phone+cta` (outlined phone), `transparent-over-hero` | logo+MENU; 3 lines; GET PRICING + outlined CLICK TO CALL | #FFC162 fill, navy text, 5px radius | none | hero; services; comparison table; guarantee band; 3 steps; quality band; reviews; FAQ | #064B61 / #FFC162 / #053A4B | Montserrat 800 / system; 2 lines | real truck, dog mascot | Independent vs Roofing Co vs Rufus check/X table | title "Home"; 4 sections blank until scroll; hidden duplicate H2s; 1454KB | C |
| smartscoops | dog waste pickup | `image-bg`: staged customer/dog/tech photo, light scrim, 2-line ~90px headline, phone + quote buttons | `logo-left links-right phone+cta`, white bar | logo+hamburger; 2 lines; Instant Quote + phone buttons | #F88C18, white, hard black offset shadow; all offsite | none | hero; 5-icon service strip; perks cards; referral tiers; QR pet tag; guarantee band; Google reviews; 3-step tabs | #F88C18 / #FFFFFF / #1D1C1D | Nunito 700 / Poppins; 2 lines | real lifestyle, corgi mascot | "5.0, 234 reviews on Google" strip over dated review cards | 3124KB/136req (heaviest), Elfsight + chat; H2s wasted on tiers | B |
| tivertransportation | private transportation | `image-bg`: Escalade, ~60% black scrim, 3-line ~64px serif headline, check bullets, gold + outlined buttons | `logo-left links-right phone+cta` (no phone), `transparent-over-hero`; links wrap | logo+MENU; 3 lines; bullets; quote + call buttons | #D8B350 gold gradient, white small-caps serif, square | benefit bullets only | hero; service slider; split; VIP photo grid; Why Choose split; faded text; benefits; 3 steps | #0A0F14 / #D8B350 / #000000 | Playfair Display SC 500 / Rubik; 3 lines | real fleet, black/gold | check-bullet row above CTA pair | nav wraps; 3 blank bands; 2 H2s; booking offsite; 1787KB | C |
| taggconcretecoatings | concrete coatings | `form-in-hero`: crew photo, ~40% navy scrim, "#1 Rated" eyebrow, 3-line 60px headline, 6-field card right | `logo-left links-right phone+cta` (no phone), `transparent-over-hero`, `sticky` side tab | logo+hamburger; 4 lines; full form; `sticky` bottom bar | #0071BA, white, 2px radius | "#1 Rated" eyebrow, 5-man crew photo | hero+form; 7-icon service strip; split + financing/one-day bullets; service cards; Why Trust; guarantee band; reviews; 3 steps | #0071BA / #FFFFFF / #151C24 | Montserrat 900 / Montserrat; 3 lines | real crew, real floor before/afters | hero form card + mobile sticky bar | title = brand name; 15 nav items; 5 fold CTAs; 2 reviews, no count | A- |
| dhathleticfitcenter | fitness center | `image-bg`: kids-class photo, dark gradient, founder cutout, 2-line ~130px condensed italic headline | `top-bar` banner + `logo-left links-right` (no phone/cta), `transparent-over-hero` | banner + logo bar eat ~310px; no CTA in fold | #F40000, navy text (~3.5:1), square | founder photo only | hero; split Join; 4 class tiles; benefits; coach names; 3 testimonials; 3 steps; FAQ | #F40000 / #042551 / #1A0B3A | Oswald italic 700 / system; 2 lines | real gym shots, cutout celebrity | announcement top-bar; two-tone headline | mobile CTA below fold; coach photos missing; no reviews; 2418KB, 6.5s | D+ |
| jefflikescleanwindows | window and gutter cleaning | `image-bg` + `illustration`: stock house, teal duotone, mascot right, 3-line 61px headline, orange pill | `logo-left links-right phone+cta` (no phone), light bar | logo+hamburger; 3 lines; orange pill; no phone | #EA5329, white, 12px radius; opens Jobber form | "TOP-RATED" in headline only | hero; value cards; split + "15+ years" stat; 5-tab services; guarantee band; reviews; 1-2-3 steps; map | #1E9DBE / #EA5329 / #0D3B5E | Poppins 800 / Poppins; 3 lines | stock duotone hero | value cards overlapping hero edge; stat tile | 11.7k px tall; map blank; 2024KB/91req; no phone number anywhere | B- |
| martzpressurewashing | pressure washing | `image-bg`: tech portrait, blue duotone, eyebrow H1 + 2-line ~72px headline, red pill | `logo-left links-right phone+cta` (two pills), dark bar | logo+hamburger; 2 lines; red pill; no phone | #ED0000, navy text, 30px pill, icon | none | hero; split + circle photo; 6 photo service tiles; benefits split; numbered steps; before/after; reviews; comparison table | #1B3F7D / #ED0000 / #042551 | Rubik eyebrow + Poppins 800 / Poppins; 2 lines | real tech + job tiles | 6-tile photo service grid with label bars | before/after + comparison cells blank; hidden duplicate H2s; 2026KB/110req | C+ |
| greenlightgraphics | design wraps | `image-bg`: fleet photo, dark scrim, centered 2-line 80/110px headline, bullets, green CTA, 6 badges | `logo-left links-right phone+cta` (phone box only), `transparent-over-hero` | logo+MENU; 2 lines; bullets; CTA; 6 badges in fold | neon #3BFF3B block, dark text, micro-copy above label | 6 certification badges (3M, Avery, Orafol, PDAA) | hero; split; quality band; pricing $499/$999/$2499; benefits; solution cards; CTA band; reviews | #051C22 / #3BFF3B / #000000 | Alata 400 / Alata; 2 lines | real client wraps (Chick-fil-A, Braves) | badge row under CTA; "starting at" pricing | 6.1s load; no analytics; faded pricing copy; no phone on mobile | B+ |
| mattthedrivewayguy | pressure washing | `form-in-hero`+`video-bg`, 70% navy scrim, H1 left, 5-field card right | `logo-left links-right phone+cta`, `transparent-over-hero`, static | logo+MENU, H1 37px, blue CTA+ghost; no phone/form/sticky | #0069E8 10px-radius, 2-line label+arrow, x6 | BBB-A+ bar + 7-stat strip (700+ reviews) in-fold | hero-form, trust-stats, why-us, crew, 13-logos, services-x6, guarantee, video | #0A1A2E, #0069E8, #061124 | DM Sans/DM Sans, 900, 2 | real crew, truck cut-outs | fold-bottom trust bar+stat strip; FAQ quoting "$300" | 3.3MB/143 req, 16.3k-px page, blank cards | A- |
| coolnaturally | HVAC | `split`, greyscale room photo, red condensed headline, product composite | `top-bar` (red) + `logo-left links-right`, 2 CTAs, static | logo+hamburger, Quote/Call pair under header, sticky CTA | #0170B9 0-radius Oswald caps+chevron; red/green buttons compete | "Platinum QC Dealer" eyebrow + QuietCool logo | hero, financing-0%, how-it-works+video, products-x4, warranty, specs-x5, benefits, reviews-blank | #F2F2F2, #C80000, #0170B9 | Oswald/Arial, 300, 2 | greyscale stock interior | financing banner under hero; mobile quote/call pair | 2.6MB/171 req, ~4k-px empty product sections | D+ |
| junk-bros | junk removal | `image-bg` duotone-teal job site, lime headline, truck cut-out+"Book Now" sticker | `logo-left links-right phone+cta`, `transparent-over-hero`, static | logo+MENU, headline, Fast-Quote+Click-to-Call pair, truck, stars+"400+ reviews" | #A9FF52 3px-radius black caps, outlined phone beside, x7 | 5 stars, "400+ five-star reviews" | hero, icon-band, owner-story, photo-tiles-x6, licensed+partners, benefits-x4, reviews-x3, blank-widget | #002A3A, #A9FF52, #FFFFFF | Poppins/Lato, 800, 3 | duotone job photos, truck cut-outs, owner cut-out | CTA+phone+review-count hero trio; owner on polygon mask | 3.3MB, blank FAQ+380px empty block, 12 slider H2 dupes | B+ |
| professorpressurewash | pressure washing | `image-bg` blue-tinted house, stroked "TOP RATED" headline, 2 pills, tech cut-out | `logo-left links-right` + pill cta, white, static | logo+MENU, headline, Get-Pricing+Click-to-Call pills, ~500px empty blue below | #2788FC pill, white border+glow, phone pill beside, x5 | "TOP RATED" headline word only | hero, services-blank, experts+4-checks, trusted-by-logos-x4, photo-services-x4, family-owned, benefits-x6, guarantee | #2788FC, #DCEBFF, #172E63 | Poppins/Poppins, 800, 3 | real owner with wand | "Trusted By" logo bar (Costco, Wyndham) | 2.6MB; blank services slider under hero, blank reviews; 0 forms | C+ |
| bigfoam | foam party events | `split` 50/50, party photo left, pink panel with headline+phone right; cloud-edge divider | `logo-left`, 3 centered yellow links, pink "BOOK NOW!", static | logo+hamburger, mobile-only cartoon dinos, 34px headline, phone+Book-Now pair | phone number is hero CTA; #E15AAB/#F3EB08 sticker buttons | none | hero, go-BIG-split, foam-party+video, cannon-checklist, safety-badges-x4, how-it-works-half-blank, surprise-blank, 1-2-3 | #E15AAB, #F3EB08, #0C003F | Grandstander/Grandstander, 900, 2 | real party crowds + cartoon mascot art | cloud-shaped SVG section edges; sticker buttons | 380 words, zero reviews, blank Instagram+2 missing images | C- |
| mtbakerwindows | window and exterior cleaning | `form-in-hero`+`image-bg` duotone-blue mountains, 2-step 6-field form right | `logo-left links-right phone+cta` (orange), `transparent-over-hero`, static | logo+MENU, headline, full 6-field form+NEXT fills the fold | #FF9C00 nav, #2091CB in-page, orange plans: three colors, x8 | clipped "1,000+ Reviews" badge only | hero-form, badges-x5, year-round-split, plan-pricing-x3, service-slider, watermark+van, real-people+4-cards, guarantee-white-on-white | #1C4D99, #FF9C00, #050A24 | Be Vietnam Pro/same, 800, 3 | duotone landscape, van cut-out | 2-step quote form with progress bar; MOST-POPULAR plan cards | heaviest 3.9MB/125 req; 2 headings white-on-white; right rail bug above 1366 | B- |
| knightwindowwashing | window/pressure washing | `video-bg` van-wrap footage, 50% teal scrim, `centered` Google badge + rotated mint CTA | `logo-left links-right phone+cta` ("Service Plans"), `transparent-over-hero`, static | 280px header, logo+MENU, Google badge, 4-line headline, Get-Pricing+Click-to-Call pair | #8EE9AF 5px-radius dark caps, rotated, hard shadow (sticker), x11 | Google Reviews 5-star badge, "Top Choice" | hero, 5-second-form-strip, split+4-checks, photo-services-x4, plan-cards-x3, reviews-with-headshots, comparison-table, guarantee | #EFF6F1, #8EE9AF, #142123 | Montserrat/Montserrat, 700, 3 | van video, real before/after pairs | 7-row x/check comparison table (Solo/Franchise/Knight); before/after grid | slowest 7.9s/145 req; form strip fades in (CLS); 2 blank sections | B |
| 561carpetandtile | carpet/tile cleaning | `form-in-hero`+`image-bg` blue-overlay stock child+dog, 90px headline left, 7-field+4-checkbox form right | `logo-left links-right phone+cta` (gold), navy, static | logo+MENU, headline, gold CTA, SMS promise, 5 fields; submit below fold | gold gradient #EAC100-#F7A823 pill, one square corner, x11 | "respond within minutes via SMS" promise; no stars | hero-form, service-strip-x5, since-2007-split, services-blank, guarantee, before/after-blank-x3, benefit-tiles-x5, reviews-blank | #002B47, #F5A623, #1877F2 | Poppins/Poppins, 800, 4 | obvious stock (child+retriever, couple+dog) | icon service strip overlapping hero; checkbox service picker | 307 words; 3 blank sections (~2.3k px); no LocalBusiness schema; lightest 864KB | C |
| cpmlawncare | landscaping | `image-bg`: yard photo, ~55% scrim, 22px italic H1 eyebrow, 2-line ~64px serif headline, green pill | `transparent-over-hero`, logo-left links-right + pill, no phone | 3-line headline + pill; no phone, no sticky | green #699C11 pill, 7 repeats | "Top Rated" eyebrow only | Hero, About, 4 tiles, Sod, 3 steps, guarantee, reviews, Areas map | #EFF5F9, #699C11, #222 | Vollkorn / system, 700, 2 | real yard + drone, some stock | map with pins under an overlapping Areas card (6 towns + photo CTA) | 3.9MB, 124 req, 5.8s; H1 as eyebrow; starless reviews; empty gallery | C+ |
| bend-fit | fitness | `image-bg`: class photo, 50% scrim, white circle blob behind 1-line ~80px headline, coral square button | white inset bar, logo-left links-right + coral button, no phone | 1-line headline, coral button; no phone, no sticky | coral #E27B6C square, white caps | none | Hero, welcome, photo + coral panel, 5 class columns (empty images), ~1000px blank embed, FAQ | #FFF, #E27B6C, #54595F | Poppins-style / Roboto, 700, 1 | 2 low-res real class photos | photo + solid-color copy panel split; nothing else | no phone, no reviews, empty cards, 1000px dead zone, trades title tag, 476 words | D |
| proshieldsurfacecoatings | floor coatings | `form-in-hero` + `image-bg`: wrapped truck + house, ~65% scrim; 2-line 60px Montserrat 800 H1, 2x2 orange-check benefits; white 4-field card + orange pill right | `transparent-over-hero` black band, logo-left, 8 links, white phone pill | 3-line H1 then 7-line paragraph; GET PRICING + CLICK TO CALL at fold bottom, language widget covering the call button | orange #FF9B30 pill, dark text, ~8 repeats | 5.0 stars/63 reviews, licensed, lifetime guarantee (text), phone in nav; Google badge below | Hero+form, 6-tab service strip, Why-polyurea, 4 service cards, Why-Trust checklist, guarantee, 3 steps, reviews | #1E1E1E + #FBF7F1, #FF9B30, #191A1B | Montserrat / system sans, 800, 2 | real crews, truck wrap, finished floors; 81 images | 6-service icon tab strip with arrows floating over the hero's bottom edge | 4.7MB, 179 req, 11k px, 3 forms; mobile CTAs below fold; H2 typo; all-caps + wavy dividers | B+ |
| designindentistry | dentist | `image-bg` light wash: B&W dentist/patient photo fading to white, 20px H1 eyebrow, 2-line ~64px caps charcoal headline, pale-aqua button + outlined phone button | `centered logo` + hamburger-only, phone + email text left | phone/email row, 2-line headline, full-width aqua + outlined phone buttons; no sticky | pale aqua #B1E4E8 rectangle, letter-spaced caps, low weight | "#1 Trusted" claim, phone twice | Hero, doctor card, aqua band, 6 service tiles, 3 benefit cards, What We Do, Mission, starless testimonies | #FFF, #B1E4E8 (+gold #9C7A3C), #303030 | Proxima Nova / same, 700 caps, 2 | desaturated real doctor shots, stock close-ups, paper/marble textures | doctor card: textured paper card, circular portrait overlapping top-right corner, button hanging off bottom edge | 6.3s on 848KB (slow server); hamburger hides services; pale CTA; no stars | C+ |
| prestigeprophoto | photography | `split` + `form-in-hero`: navy copy left (16px caps H1 eyebrow, 3-line ~64px serif headline), twilight exterior right, gray 3-field quote bar overlapping both columns | navy bar, logo-left, 4 links, light-blue quote button + outlined phone | photo lost to dark blur, 2-line headline, phone + quote buttons, ~500px empty, H1 10px | light blue #86BAE5 square, navy letter-spaced serif caps | FAA Approved / Part 107 Licensed / Fully Insured checks, phone in nav | Hero, 3 icon cards, 16-photo grid, drone grid, twilight grid, 2 videos, staging (3 empty boxes), 2 testimonials | #0F1C25, #86BAE5, #0F1C25 | Playfair-style serif / Baskerville-style serif, 700, 3 | portfolio-grade twilight, interior, aerial | one-row inline quote bar (3 fields + button) overlapping the hero's bottom edge | 16.9MB, 162 req, 9.5s; empty mobile hero, 10px H1; empty staging boxes; no stars | C+ |
| boostroofing | roofing | `form-in-hero` + `image-bg`: owner by orange wrapped truck, ~55% scrim, 3-line ~64px white headline (an H2; 23px H1 mid-page), orange rectangle; gray 4-field card right | `transparent-over-hero`, logo-left, 7 links, outlined white phone pill | 3-line headline, orange GET PRICING + outlined CLICK TO CALL side by side, truck photo, quote form inside the fold | orange #F14800 rectangle, white caps, 5px radius, 7 repeats | "Top Rated", "Locally Owned", owner + branded truck, phone in nav; no stars | Hero+form, duotone photo, Core Services (empty), comparison table, guarantee band, 3 steps (empty), 1-review carousel, map (empty) | #434349 + #FFF, #F14800, #0E0E0F | Montserrat / Montserrat, 700, 3 | 2 real photos (owner + truck, crew), orange duotone | comparison table: company column a solid orange block (logo header, white checks) beside two gray competitor columns | 3 sections render empty (services, steps, map); 461 words; blank review avatar; 6.9s on 1.3MB | B- |
| shieldroofrepair | roofing | `image-bg`: 3 wrapped trucks, blue ~60% scrim, gold eyebrow, 1-line 74px Bebas Expanded H1, gold + blue buttons, 3 icon trust pills, chevron edge | `top-bar` (socials, phone, email, reviews pill) + logo-left 9 links, phone pill, gold quote pill; `transparent-over-hero`, `sticky` | blue top bar with gold quote pill, 2-line H1, gold + blue buttons, 3 stacked trust pills, full-width gold sticky CALL NOW bar | gold #FFC111 pill, navy caps; blue #0281C7 call secondary; 21 tel links | Since 2009, Top-Rated on Google, Licensed/Insured/Veteran-Owned pills; FB + Google 5.0 stars just below | Hero, before/after split, 2x2 numbered service cards, brand-logo carousel, Why Choose, featured Google review, comparison table (9 certs), phone CTA band | #001522 + #0281C7, #FFC111, #001522 | Bebas Neue Pro Expanded / Montserrat, 800, 1 | real fleet, drone job shots, before/after, vector truck | icon trust-pill row under the hero buttons, plus the sticky mobile CALL NOW bar | 13.5k px, 5.6MB, 114 req, 7.2s; small nav links crowd 1366; 5+ redundant CTA bands; no LocalBusiness/FAQ schema | A- |
| exploringtemecula | real estate | desktop fetch returned 403; mobile capture shows a teal serif headline over a pool photo with a sticky Call/Text bar | | | | | | | | | | not captured | n/a |

## Palettes by vertical, and the presets they became

CTA colors are read from the live DOM; dominant and dark colors from the reviewers.

| Vertical | Reference palettes | Preset |
| --- | --- | --- |
| Roofing, electrical, concrete, garage doors | navy #0B1220–#1E375F + orange/gold/red (#F14800, #FFC111, #DF9731, #EB0404, #D22630) | `navy-orange`, `slate-yellow`, `charcoal-red` |
| Junk removal, landscaping, tree, pest | dark teal #002A3A + lime #A9FF52/#3BFF3B; forest green #699C11 | `navy-lime`, `forest-cream` |
| Pressure washing, window cleaning, cleaning | blue #0069E8/#2788FC/#1B3F7D + sky/mint/cyan; navy + yellow (#FFB522) | `ocean-sky`, `teal-amber` |
| Painting, locksmith, premium brands | purple #532C85 + orange #FF9143; black + gold #D8B350 | `royal-gold` |
| Dentist, photography, calm brands | white + pale aqua #B1E4E8; navy + light blue #86BAE5 | `clean-light` |

## Template mapping

| Reference pattern | Template | Status |
| --- | --- | --- |
| Full-bleed dark photo hero, copy left | `theme.heroStyle: 'photo'` | built this pass |
| Owner/truck cutout on brand background | `theme.heroStyle: 'cutout'` + `hero.cutout` | built this pass |
| Duotone photo tint | `theme.heroScrim: 'duotone'` | built this pass |
| Two-tone headline | `hero.headline` with `*accent*` | built this pass |
| Uppercase heavy headings | `theme.headingCase: 'uppercase'` | built this pass |
| 2×2 check bullets / trust pills in hero | `hero.bullets`, `hero.bulletStyle` | built this pass |
| Quote + phone pair, mobile halves | `Hero` | built this pass |
| CTA microcopy | `hero.ctaNote` | built this pass |
| Quote card in hero | `theme.heroForm` | built this pass |
| Icon service strip over hero edge | `theme.serviceStrip` | built this pass |
| Badge / award row | `trust.logos` | built this pass |
| Stat strip | `trust.stats` | built this pass |
| "Trusted by" client logos | `trust.clients` | built this pass |
| Photo service tiles with "From $X" | `theme.serviceCards: 'photo'`, `startingPrice` | built this pass |
| Coupons, plan tiers, starting-at pricing | `offers`, `plans`, `/pricing/` | built this pass |
| 1-2-3 process band | `process` | built this pass |
| Comparison table, our column highlighted | `trust.comparison` | built this pass |
| Guarantee band | `trust.guarantee` | built this pass |
| Angled / curved / wave / cloud / mountain section edges | `theme.dividers` | built this pass |
| Sticker buttons | `theme.buttonStyle: 'sticker'` | built this pass |
| Sticky side quote tab | `theme.stickyQuoteTab` | built, off by default |
| Sticky mobile call bar | `MobileCallBar` | already built |
| Review count + stars near the CTA | hero stars line, `Trustindex` | already built |
| Before/after grid, case studies | `Gallery`, `/gallery/<slug>/` | already built |
| Service areas list / map | `LocationGrid`, branches | already built |
| Two-step quote form with progress bar | `forms.steps: 2` | built this pass |
| Cloud-shaped and mountain-shaped edges | `theme.dividers: 'cloud' \| 'mountain'` | built this pass |
| Mascot / illustrated services | content, not template | commission per client |

## Deliberately not adopted

- Hidden 15–25 px keyword H1 with the display headline as an H2, and the
  stacked "Service in City" H2s. The display headline is the H1 and
  carries the city.
- Hero video. The LCP element stays a static image.
- Scroll-entrance animation on content, lazy sliders, review carousels that
  emit duplicate H2s. Everything renders statically.
- Three header CTAs, 15-item navs, 8 to 11 field forms.
- 2 MB+ pages. The demo ships under 400 KB on the home page with fonts and
  images included.
- The agency's title formula ("City's Top Rated Y - 100% Satisfaction
  Guaranteed - Get a Fast Quote Here") and section copy ("Neighbors are
  saying", "Easy as 1-2-3", "Risk-free guarantee", "Ready to…?"). The
  skeleton is worth copying; the copy is not. See
  `.claude/skills/humanizer/local-service.md`.

## Raw material

Screenshots, extracted data (`results.json`), and the four reviewer reports
are in the session scratchpad, not in the repository. Re-run
`capture.mjs` against a new reference list when the client adds sites.
