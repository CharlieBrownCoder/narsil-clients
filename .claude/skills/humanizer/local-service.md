# Humanizer add-on: local service business copy

Read this together with `SKILL.md` when editing anything under `src/content/`
or the copy in `src/views/` and `src/components/`. It adds the patterns that
show up in AI-drafted contractor websites and that the base skill does not
name.

## Phrases to delete on sight

Rewrite the sentence so it says something specific about this business instead.

- "Look no further" / "Your search ends here"
- "Your trusted partner" / "your go-to [vertical]" / "one-stop shop"
- "In today's fast-paced world" / "In today's competitive market"
- "Top-notch" / "second to none" / "unparalleled" / "unmatched"
- "Peace of mind" (allowed once per site, in a sentence that says what the customer no longer has to do)
- "We take pride in" / "We pride ourselves on" / "commitment to excellence"
- "Whether you need X, Y, or Z, we've got you covered"
- "Don't hesitate to contact us" / "Contact us today to learn more"
- "Experience the difference" / "Discover why"
- "Nestled in" / "in the heart of" when describing a city
- "Transform your [home/space/property]" as a headline
- "Say goodbye to [problem]"

## Patterns common in this vertical

- **Adjective triads.** "Fast, reliable, and affordable." Pick the one that is
  actually true and provable, and prove it: "Most Plano jobs are done within a
  week of the first call."
- **Generic city paragraphs.** "Plano is a vibrant community with a rich
  history." Replace with something a local would recognise: neighborhoods,
  housing stock, soil, trees, weather, HOA rules, how far away the shop is.
- **Invented numbers.** Never add years in business, review counts, or
  customer counts that are not in `src/site.config.ts` or the client's brief.
- **Service page openers that define the service.** The reader knows what
  pressure washing is. Open with the problem they are looking at, or the result.
- **Identical combo pages.** Every `serviceNotes` paragraph must contain at
  least one fact that is only true of that city and that service.
- **Exclamation marks.** None in body copy. One is allowed in a promo banner.
- **Bold labels in lists.** "**Quality:** we deliver quality." Write the
  sentence or cut the bullet.

## The agency skeleton copy (don't reuse verbatim)

The client's reference sites share one WordPress kit, and its copy repeats
across dozens of unrelated businesses. Keep the section order; rewrite every
one of these in the client's own words:

- Title tag "City's Top Rated [Service] - 100% Satisfaction Guaranteed - Get a Fast Quote Here"
- Headline "[City]'s Top Rated [Service]" with nothing to back it up. Keep the shape only when a real review count or award sits next to it.
- "Get a Fast Quote" (fine as a button; don't make it the only CTA text on the page)
- "What our neighbors are saying" / "Hear from our happy customers"
- "Easy as 1-2-3" / "Our simple 3-step process"
- "Risk-free guarantee" / "100% satisfaction guaranteed" without saying what happens when it isn't
- "Ready to transform your [home]?" closer
- "We're glad you're here. How can we help?"

## What to keep

- First-person plural, present tense.
- Exact prices and timelines when the client has given them.
- Named neighborhoods, ZIPs, landmarks, and equipment.
- Short sentences. One claim per sentence.
- Headings in sentence case.

## Workflow

1. Draft with `brand-voice` profile in context.
2. Run `/humanizer` on each file with the instruction "Humanize the prose,
   keep frontmatter, links, and facts unchanged. Also apply local-service.md."
3. Read the `git diff`. Reject any change that altered a fact.
4. Commit.

A `grep` for the phrases above makes a cheap first pass:

```bash
grep -rniE "look no further|trusted partner|fast-paced|top-notch|peace of mind|pride ourselves|got you covered|don't hesitate|experience the difference|nestled|in the heart of" src/content
```
