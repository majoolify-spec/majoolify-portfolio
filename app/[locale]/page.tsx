import type { Metadata } from "next";
import { getHomeContent, getSiteSettings, getVisibleCaseStudies, resolveLocale } from "../../lib/content";
import { locales } from "../../lib/locale";
import {
  getHomeLanguageAlternates,
  getLocaleHomeUrl,
  getOgLocale,
  toAbsoluteUrl,
} from "../../lib/seo";
import { MarketingPage } from "../../components/marketing-page";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const [home, site] = await Promise.all([
    getHomeContent(resolvedLocale),
    getSiteSettings(),
  ]);
  const canonicalUrl = getLocaleHomeUrl(site.seo.siteUrl, resolvedLocale);
  const ogImage = toAbsoluteUrl(site.seo.siteUrl, site.seo.defaultOgImage);

  return {
    title: home.seo.title,
    description: home.seo.description,
    alternates: {
      canonical: canonicalUrl,
      languages: getHomeLanguageAlternates(site.seo.siteUrl),
    },
    keywords: site.seo.keywords,
    openGraph: {
      title: home.seo.title,
      description: home.seo.description,
      url: canonicalUrl,
      locale: getOgLocale(resolvedLocale),
      alternateLocale: [getOgLocale(resolvedLocale === "en" ? "fr" : "en")],
      images: [
        {
          url: ogImage,
          alt: `${site.brand.name} showcase`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: home.seo.title,
      description: home.seo.description,
      images: [ogImage],
    },
  };
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const [site, home, caseStudies] = await Promise.all([
    getSiteSettings(),
    getHomeContent(resolvedLocale),
    getVisibleCaseStudies(),
  ]);

  return (
    <MarketingPage
      locale={resolvedLocale}
      site={site}
      home={home}
      caseStudies={caseStudies}
    />
  );
}
