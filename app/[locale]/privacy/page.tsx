import type { Metadata } from "next";
import { PrivacyPage } from "../../../components/standalone-pages";
import { getHomeContent, getSiteSettings, resolveLocale } from "../../../lib/content";
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
  return buildPublicPageMetadata(site, resolvedLocale, "privacy");
}

export default async function PrivacyRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const [site, home] = await Promise.all([
    getSiteSettings(),
    getHomeContent(resolvedLocale),
  ]);

  return <PrivacyPage locale={resolvedLocale} site={site} home={home} />;
}
