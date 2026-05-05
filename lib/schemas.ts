import { z } from "zod";

const localeTextSchema = z.object({
  en: z.string().min(1),
  fr: z.string().min(1),
});

export const socialLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
});

export const mediaAssetSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const serviceOfferingSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  summary: localeTextSchema,
  bullets: z.array(localeTextSchema).min(1),
  featured: z.boolean().default(false),
});

export const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  quote: localeTextSchema,
});

export const siteSettingsSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    legalName: z.string().min(1),
    founder: z.string().min(1),
    location: z.string().min(1),
    country: z.string().min(1),
    taglines: localeTextSchema,
    overview: localeTextSchema,
    legalBlurb: localeTextSchema,
  }),
  contact: z.object({
    email: z.string().email(),
    whatsapp: z.string().min(1),
    calendly: z.string().url().optional().or(z.literal("")),
    responseTime: localeTextSchema,
    availabilityNote: localeTextSchema,
  }),
  socials: z.array(socialLinkSchema).min(1),
  services: z.array(serviceOfferingSchema).min(1),
  testimonials: z.array(testimonialSchema).min(1),
  seo: z.object({
    siteUrl: z.string().url(),
    defaultTitle: z.string().min(1),
    defaultDescription: z.string().min(1),
    defaultOgImage: z.string().startsWith("/"),
    keywords: z.array(z.string().min(1)).min(1),
  }),
  admin: z.object({
    repository: z.string().min(1),
    branch: z.string().min(1),
  }),
});

export const homeContentSchema = z.object({
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  nav: z.object({
    work: z.string().min(1),
    services: z.string().min(1),
    process: z.string().min(1),
    about: z.string().min(1),
    contact: z.string().min(1),
  }),
  hero: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    intro: z.string().min(1),
    primaryCtaLabel: z.string().min(1),
    secondaryCtaLabel: z.string().min(1),
    stats: z.array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
      }),
    ),
  }),
  credibility: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    items: z.array(z.string().min(1)).min(1),
  }),
  services: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    intro: z.string().min(1),
  }),
  work: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    intro: z.string().min(1),
  }),
  process: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    intro: z.string().min(1),
    steps: z.array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    ),
  }),
  expertise: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    intro: z.string().min(1),
    points: z.array(z.string().min(1)).min(1),
  }),
  story: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    body: z.array(z.string().min(1)).min(1),
  }),
  testimonials: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    intro: z.string().min(1),
  }),
  contact: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    intro: z.string().min(1),
    submitLabel: z.string().min(1),
    formSuccess: z.string().min(1),
  }),
});

const caseStudyOutcomeSchema = z.object({
  label: localeTextSchema,
  value: z.string().min(1),
});

export const caseStudyMetaSchema = z.object({
  slug: z.string().min(1),
  status: z.enum(["live", "draft", "coming-soon"]),
  privacy: z.enum(["public", "redacted"]),
  featured: z.boolean(),
  year: z.number().int().positive(),
  clientLabel: z.string().min(1),
  role: z.string().min(1),
  services: z.array(z.string().min(1)).min(1),
  stack: z.array(z.string().min(1)).min(1),
  previewMedia: z.array(mediaAssetSchema).min(1),
  gallery: z.array(mediaAssetSchema).default([]),
  title: localeTextSchema,
  summary: localeTextSchema,
  outcomes: z.array(caseStudyOutcomeSchema).min(1),
  publicLinks: z.object({
    demoUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
  }),
});

export type SocialLink = z.infer<typeof socialLinkSchema>;
export type MediaAsset = z.infer<typeof mediaAssetSchema>;
export type ServiceOffering = z.infer<typeof serviceOfferingSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type HomeContent = z.infer<typeof homeContentSchema>;
export type CaseStudyMeta = z.infer<typeof caseStudyMetaSchema>;
export type CaseStudyBody = {
  en: string;
  fr: string;
};
