import type { Metadata } from "next";
import type { Locale } from "./locale";
import type { SiteSettings } from "./schemas";
import {
  getLocalizedPageLanguageAlternates,
  getLocalizedPageUrl,
  toAbsoluteUrl,
} from "./seo";

export const publicPageSegments = ["work", "services", "contact", "about", "privacy"] as const;

export type PublicPageSegment = (typeof publicPageSegments)[number];

const pageCopy: Record<
  PublicPageSegment,
  Record<Locale, { title: string; description: string; priority: number }>
> = {
  work: {
    en: {
      title: "Work",
      description:
        "Selected Majoolify case studies across Next.js delivery, frontend systems, AI prompt workflows, and redacted client work.",
      priority: 0.9,
    },
    fr: {
      title: "Réalisations",
      description:
        "Études de cas Majoolify autour de Next.js, systèmes frontend, workflows de prompts IA et livraisons client anonymisées.",
      priority: 0.85,
    },
  },
  services: {
    en: {
      title: "Services",
      description:
        "Majoolify services for Next.js product engineering, frontend systems, design execution, and AI prompt workflow delivery.",
      priority: 0.85,
    },
    fr: {
      title: "Services",
      description:
        "Services Majoolify pour l’ingénierie produit Next.js, les systèmes frontend, l’exécution design et les workflows IA.",
      priority: 0.8,
    },
  },
  contact: {
    en: {
      title: "Contact",
      description:
        "Contact Majoolify for frontend product builds, Next.js implementation, AI workflow systems, and software delivery inquiries.",
      priority: 0.8,
    },
    fr: {
      title: "Contact",
      description:
        "Contacter Majoolify pour des builds frontend, implémentations Next.js, systèmes IA et demandes de livraison logicielle.",
      priority: 0.75,
    },
  },
  about: {
    en: {
      title: "About",
      description:
        "About Majoolify, Ahmed Majoul’s Tunisia-based software development studio for frontend products and AI workflow execution.",
      priority: 0.75,
    },
    fr: {
      title: "À propos",
      description:
        "À propos de Majoolify, le studio logiciel d’Ahmed Majoul basé en Tunisie pour les produits frontend et workflows IA.",
      priority: 0.7,
    },
  },
  privacy: {
    en: {
      title: "Privacy",
      description:
        "Majoolify privacy notice for contact form inquiries and project communication.",
      priority: 0.35,
    },
    fr: {
      title: "Confidentialité",
      description:
        "Notice de confidentialité Majoolify pour les demandes envoyées via le formulaire de contact.",
      priority: 0.3,
    },
  },
};

export function getPublicPageCopy(segment: PublicPageSegment, locale: Locale) {
  return pageCopy[segment][locale];
}

export function buildPublicPageMetadata(
  site: SiteSettings,
  locale: Locale,
  segment: PublicPageSegment,
): Metadata {
  const copy = getPublicPageCopy(segment, locale);
  const canonicalUrl = getLocalizedPageUrl(site.seo.siteUrl, locale, segment);
  const ogImage = toAbsoluteUrl(site.seo.siteUrl, site.seo.defaultOgImage);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: canonicalUrl,
      languages: getLocalizedPageLanguageAlternates(site.seo.siteUrl, segment),
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          alt: `${site.brand.name} ${copy.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [ogImage],
    },
  };
}
