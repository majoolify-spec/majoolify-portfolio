import type { Locale } from "./locale";

const OG_LOCALE_BY_LOCALE: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
};

export function toAbsoluteUrl(siteUrl: string, path: string) {
  return new URL(path, siteUrl).toString();
}

export function getOgLocale(locale: Locale) {
  return OG_LOCALE_BY_LOCALE[locale];
}

export function getLocaleHomePath(locale: Locale) {
  return `/${locale}`;
}

export function getCaseStudyPath(locale: Locale, slug: string) {
  return `/${locale}/work/${slug}`;
}

export function getLocaleHomeUrl(siteUrl: string, locale: Locale) {
  return toAbsoluteUrl(siteUrl, getLocaleHomePath(locale));
}

export function getCaseStudyUrl(siteUrl: string, locale: Locale, slug: string) {
  return toAbsoluteUrl(siteUrl, getCaseStudyPath(locale, slug));
}

export function getHomeLanguageAlternates(siteUrl: string) {
  return {
    en: getLocaleHomeUrl(siteUrl, "en"),
    fr: getLocaleHomeUrl(siteUrl, "fr"),
    "x-default": getLocaleHomeUrl(siteUrl, "en"),
  };
}

export function getCaseStudyLanguageAlternates(siteUrl: string, slug: string) {
  return {
    en: getCaseStudyUrl(siteUrl, "en", slug),
    fr: getCaseStudyUrl(siteUrl, "fr", slug),
  };
}
