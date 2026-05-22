import type { MetadataRoute } from "next";
import { getSiteSettings, getVisibleCaseStudySlugs } from "../lib/content";
import { locales } from "../lib/locale";
import { getPublicPageCopy, publicPageSegments } from "../lib/public-page-metadata";
import {
  getCaseStudyLanguageAlternates,
  getCaseStudyUrl,
  getHomeLanguageAlternates,
  getLocalizedPageLanguageAlternates,
  getLocalizedPageUrl,
  getLocaleHomeUrl,
} from "../lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, slugs] = await Promise.all([
    getSiteSettings(),
    getVisibleCaseStudySlugs(),
  ]);

  const now = new Date();
  const pages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: getLocaleHomeUrl(site.seo.siteUrl, locale),
    lastModified: now,
    changeFrequency: "weekly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: {
      languages: getHomeLanguageAlternates(site.seo.siteUrl),
    },
  }));

  const caseStudyPages: MetadataRoute.Sitemap = slugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: getCaseStudyUrl(site.seo.siteUrl, locale, slug),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: getCaseStudyLanguageAlternates(site.seo.siteUrl, slug),
      },
    })),
  );

  const standalonePages: MetadataRoute.Sitemap = publicPageSegments.flatMap((segment) =>
    locales.map((locale) => ({
      url: getLocalizedPageUrl(site.seo.siteUrl, locale, segment),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: getPublicPageCopy(segment, locale).priority,
      alternates: {
        languages: getLocalizedPageLanguageAlternates(site.seo.siteUrl, segment),
      },
    })),
  );

  return [...pages, ...standalonePages, ...caseStudyPages];
}
