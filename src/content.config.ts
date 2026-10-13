import { defineCollection, type SchemaContext } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

const seo = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    noindex: z.boolean().optional(),
  })
  .optional();

const faq = z.object({ question: z.string(), answer: z.string() });

/** One file per service: src/content/services/<slug>.md */
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: ({ image }: SchemaContext) => z.object({
    title: z.string(),
    /** Short name for nav/cards, e.g. "House Washing" */
    shortTitle: z.string().optional(),
    excerpt: z.string(),
    icon: z.string().default('spark'),
    /** Category id from categories.json. Optional; enables /services/<category>/ hubs. */
    category: z.string().optional(),
    /** Offered 24/7. Needs business.emergency.available in config to show the CTA. */
    emergency: z.boolean().default(false),
    /** Relative to this file, e.g. ../../assets/images/service-x.jpg. Optimized at build. */
    image: image().optional(),
    imageAlt: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    /** Starting price for schema Offer and UI. Omit to hide. */
    startingPrice: z.number().optional(),
    /** Typical high end, shown on the pricing guide as a range. */
    priceHigh: z.number().optional(),
    priceUnit: z.string().optional(), // "per visit", "per sq ft"
    benefits: z.array(z.string()).default([]),
    process: z.array(z.object({ title: z.string(), description: z.string() })).default([]),
    faqs: z.array(faq).default([]),
    related: z.array(z.string()).default([]),
    /** schema.org serviceType string, defaults to title */
    serviceType: z.string().optional(),
    seo,
  }),
});

/** One file per city/town: src/content/locations/<slug>.md */
const locations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: ({ image }: SchemaContext) => z.object({
    city: z.string(),
    state: z.string(),
    /** Primary = the home base, listed first and gets extra schema weight */
    primary: z.boolean().default(false),
    zips: z.array(z.string()).default([]),
    neighborhoods: z.array(z.string()).default([]),
    landmarks: z.array(z.string()).default([]),
    geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
    /** Wikipedia / official city URL for schema sameAs on the City entity */
    cityUrl: z.url().optional(),
    /** Restrict services for this city. Empty = all services. */
    services: z.array(z.string()).default([]),
    /**
     * City-specific notes per service slug. Used to make service+city combo pages
     * genuinely unique. Strongly recommended if serviceAreaCombos is enabled.
     */
    serviceNotes: z.record(z.string(), z.string()).default({}),
    image: image().optional(),
    order: z.number().default(100),
    seo,
  }),
});

/** Blog posts: src/content/posts/<slug>.md */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }: SchemaContext) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    image: image().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /** "article" | "seasonal-guide" | "how-to" | "pricing" | "news". Drives the blog filter and label. */
    category: z.string().default('article'),
    /** Related service slug for internal linking */
    service: z.string().optional(),
    draft: z.boolean().default(false),
    seo,
  }),
});

/**
 * Projects: src/content/projects/<slug>.md
 * Frontmatter alone = gallery card. Add a body (300+ words) and it also becomes a
 * case-study page at /gallery/<slug>/ with Article schema.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }: SchemaContext) => z.object({
    title: z.string(),
    description: z.string(),
    service: z.string().optional(),
    /** Free text shown on the card, e.g. "Kings Ridge, Plano" */
    location: z.string().optional(),
    /** Location slug for internal linking to /service-areas/<slug>/ */
    locationSlug: z.string().optional(),
    before: image().optional(),
    after: image(),
    date: z.coerce.date().optional(),
    /** Case-study facts. Shown as a stat strip when present. */
    stats: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

/**
 * Downloadable resources: src/content/resources/<slug>.md
 * The file lives in public/downloads/. gated:true puts a lead form in front of it.
 */
const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: ({ image }: SchemaContext) => z.object({
    title: z.string(),
    description: z.string(),
    /** Path under public/, e.g. /downloads/spring-checklist.pdf */
    file: z.string(),
    fileType: z.string().default('PDF'),
    gated: z.boolean().default(true),
    cover: image().optional(),
    service: z.string().optional(),
    order: z.number().default(100),
  }),
});

/** Service categories (optional hubs): src/content/categories.json */
const categories = defineCollection({
  loader: file('./src/content/categories.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    order: z.number().default(100),
  }),
});

/** Team members: src/content/team.json. Real people only. */
const team = defineCollection({
  loader: file('./src/content/team.json'),
  schema: ({ image }: SchemaContext) => z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    photo: image().optional(),
    yearsExperience: z.number().optional(),
    certifications: z.array(z.string()).default([]),
    sameAs: z.array(z.url()).default([]),
    order: z.number().default(100),
  }),
});

const faqs = defineCollection({
  loader: file('./src/content/faqs.json'),
  schema: z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
    /** "general" or a service slug */
    category: z.string().default('general'),
    order: z.number().default(100),
  }),
});

export const collections = { services, locations, posts, projects, resources, faqs, categories, team };
