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
