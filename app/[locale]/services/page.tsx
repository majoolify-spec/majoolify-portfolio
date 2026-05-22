import type { Metadata } from "next";
import { ServicesPage } from "../../../components/standalone-pages";
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
  return buildPublicPageMetadata(site, resolvedLocale, "services");
}

export default async function ServicesRoutePage({
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

  return <ServicesPage locale={resolvedLocale} site={site} home={home} />;
}
