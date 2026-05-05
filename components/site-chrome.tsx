import Link from "next/link";
import { ArrowUpRight, Globe2, ShieldCheck } from "lucide-react";
import type { HomeContent, SiteSettings } from "../lib/schemas";
import { alternateLocale, type Locale } from "../lib/locale";

type PublicHeaderProps = {
  locale: Locale;
  home: HomeContent;
};

export function LocaleSwitch({
  locale,
  href,
}: {
  locale: Locale;
  href: string;
}) {
  const targetLocale = alternateLocale(locale);

  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5"
    >
      <Globe2 className="h-4 w-4" />
      {targetLocale.toUpperCase()}
    </a>
  );
}

export function PublicHeader({ locale, home }: PublicHeaderProps) {
  const base = `/${locale}`;

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[rgba(247,240,228,0.8)] backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-4 py-4">
        <a href={base} className="flex items-center gap-3">
          <span className="on-ink inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--foreground)] text-sm font-semibold">
            M
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-[var(--muted)]">
              MAJOOLIFY
            </p>
            <p className="text-xs text-[var(--muted)]">Engineering studio</p>
          </div>
        </a>
        <nav className="hidden items-center gap-5 text-sm text-[var(--muted)] lg:flex">
          <a href={`${base}#work`} className="inline-flex min-h-9 min-w-10 items-center justify-center py-1">
            {home.nav.work}
          </a>
          <a href={`${base}#services`} className="inline-flex min-h-9 min-w-10 items-center justify-center py-1">
            {home.nav.services}
          </a>
          <a href={`${base}#process`} className="inline-flex min-h-9 min-w-10 items-center justify-center py-1">
            {home.nav.process}
          </a>
          <a href={`${base}#about`} className="inline-flex min-h-9 min-w-10 items-center justify-center py-1">
            {home.nav.about}
          </a>
          <a href={`${base}#contact`} className="inline-flex min-h-9 min-w-10 items-center justify-center py-1">
            {home.nav.contact}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <LocaleSwitch locale={locale} href={`/${alternateLocale(locale)}`} />
          <Link
            href="/admin"
            className="hidden rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium md:inline-flex"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter({
  locale,
  site,
}: {
  locale: Locale;
  site: SiteSettings;
}) {
  return (
    <footer className="mt-20 border-t border-black/5 pb-10 pt-8">
      <div className="shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="section-kicker">Majoolify</p>
          <p className="mt-3 text-pretty text-sm text-[var(--muted)]">
            {locale === "en"
              ? site.brand.legalBlurb.en
              : site.brand.legalBlurb.fr}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {site.socials.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium"
            >
              {social.label}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
      <div className="shell mt-6 flex flex-col gap-3 text-xs text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {site.brand.legalName}
        </p>
        <p className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          {locale === "en"
            ? `Registered in ${site.brand.country}. Built by Ahmed Majoul.`
            : `Société enregistrée en ${site.brand.country}. Réalisé par Ahmed Majoul.`}
        </p>
      </div>
    </footer>
  );
}
