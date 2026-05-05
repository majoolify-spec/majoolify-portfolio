import type { MetadataRoute } from "next";
import { getSiteSettings, getVisibleCaseStudySlugs } from "../lib/content";
import { locales } from "../lib/locale";
import { toAbsoluteUrl } from "../lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, slugs] = await Promise.all([
    getSiteSettings(),
    getVisibleCaseStudySlugs(),
  ]);

  const now = new Date();
  const pages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: toAbsoluteUrl(site.seo.siteUrl, `/${locale}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: {
      languages: {
        en: toAbsoluteUrl(site.seo.siteUrl, "/en"),
        fr: toAbsoluteUrl(site.seo.siteUrl, "/fr"),
      },
    },
  }));

  const caseStudyPages: MetadataRoute.Sitemap = slugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: toAbsoluteUrl(site.seo.siteUrl, `/${locale}/work/${slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: toAbsoluteUrl(site.seo.siteUrl, `/en/work/${slug}`),
          fr: toAbsoluteUrl(site.seo.siteUrl, `/fr/work/${slug}`),
        },
      },
    })),
  );

  return [...pages, ...caseStudyPages];
}
