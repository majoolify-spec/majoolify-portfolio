import Link from "next/link";
import { ArrowUpRight, Globe2, ShieldCheck } from "lucide-react";
import type { HomeContent, SiteSettings } from "../lib/schemas";
import { alternateLocale, type Locale } from "../lib/locale";
import { BUTTON_SECONDARY } from "../lib/ui-classes";

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
    <Link
      href={href}
      className={BUTTON_SECONDARY}
    >
      <Globe2 className="h-4 w-4" />
      {targetLocale.toUpperCase()}
    </Link>
  );
}

export function PublicHeader({ locale, home }: PublicHeaderProps) {
  const base = `/${locale}`;
  const navItems = [
    { key: "work", label: home.nav.work },
    { key: "services", label: home.nav.services },
    { key: "process", label: home.nav.process },
    { key: "about", label: home.nav.about },
    { key: "contact", label: home.nav.contact },
  ] as const;

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[rgba(247,240,228,0.8)] backdrop-blur-xl">
      <div className="shell py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href={base} className="flex items-center gap-3">
            <span className="on-ink inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--foreground)] text-sm font-semibold">
              M
            </span>
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-[var(--muted)]">
                MAJOOLIFY
              </p>
              <p className="text-xs text-[var(--muted)]">Engineering studio</p>
            </div>
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-5 text-sm text-[var(--muted)] lg:flex">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={`${base}#${item.key}`}
                className="inline-flex min-h-9 min-w-10 items-center justify-center rounded-full px-3 py-1 transition hover:bg-white/60 hover:text-[var(--foreground)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LocaleSwitch locale={locale} href={`/${alternateLocale(locale)}`} />
            <Link
              href="/admin"
              className={`${BUTTON_SECONDARY} hidden md:inline-flex`}
            >
              Admin
            </Link>
          </div>
        </div>

        <nav
          aria-label="Sections"
          className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden"
        >
          {navItems.map((item) => (
            <a
              key={item.key}
              href={`${base}#${item.key}`}
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1.5 text-sm font-medium whitespace-nowrap text-[var(--muted)] transition hover:border-[rgba(15,118,110,0.3)] hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="header-progress" aria-hidden />
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
              rel="noopener noreferrer"
              className={BUTTON_SECONDARY}
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
