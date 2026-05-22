import type { Metadata } from "next";
import { WorkIndexPage } from "../../../components/standalone-pages";
import { getHomeContent, getSiteSettings, getVisibleCaseStudies, resolveLocale } from "../../../lib/content";
import { locales } from "../../../lib/locale";
import { buildPublicPageMetadata } from "../../../lib/public-page-metadata";

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
  const site = await getSiteSettings();
  return buildPublicPageMetadata(site, resolvedLocale, "work");
}

export default async function WorkPage({
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
    <WorkIndexPage
      locale={resolvedLocale}
      site={site}
      home={home}
      caseStudies={caseStudies}
    />
  );
}
