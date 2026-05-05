import type { Metadata } from "next";
import { getHomeContent, getSiteSettings, getVisibleCaseStudies, resolveLocale } from "../../lib/content";
import { locales } from "../../lib/locale";
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

  return {
    title: home.seo.title,
    description: home.seo.description,
    alternates: {
      canonical: `/${resolvedLocale}`,
      languages: {
        en: "/en",
        fr: "/fr",
      },
    },
    keywords: site.seo.keywords,
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
