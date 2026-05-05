import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react";
import {
  getCaseStudyDetail,
  getVisibleCaseStudySlugs,
  getSiteSettings,
  resolveLocale,
} from "../../../../lib/content";
import { alternateLocale, locales } from "../../../../lib/locale";
import { getOgLocale, toAbsoluteUrl } from "../../../../lib/seo";
import { LocaleSwitch, PublicFooter } from "../../../../components/site-chrome";

export async function generateStaticParams() {
  const slugs = await getVisibleCaseStudySlugs();

  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedLocale = resolveLocale(locale);
  const [detail, site] = await Promise.all([
    getCaseStudyDetail(slug, resolvedLocale),
    getSiteSettings(),
  ]);

  const canonicalUrl = toAbsoluteUrl(site.seo.siteUrl, `/${resolvedLocale}/work/${slug}`);
  const preview = detail.meta.previewMedia[0];
  const previewImage = toAbsoluteUrl(site.seo.siteUrl, preview.src);

  return {
    title: detail.meta.title[resolvedLocale],
    description: detail.meta.summary[resolvedLocale],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: toAbsoluteUrl(site.seo.siteUrl, `/en/work/${slug}`),
        fr: toAbsoluteUrl(site.seo.siteUrl, `/fr/work/${slug}`),
      },
    },
    openGraph: {
      type: "article",
      title: detail.meta.title[resolvedLocale],
      description: detail.meta.summary[resolvedLocale],
      url: canonicalUrl,
      locale: getOgLocale(resolvedLocale),
      alternateLocale: [getOgLocale(alternateLocale(resolvedLocale))],
      images: [
        {
          url: previewImage,
          alt: preview.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: detail.meta.title[resolvedLocale],
      description: detail.meta.summary[resolvedLocale],
      images: [previewImage],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const resolvedLocale = resolveLocale(locale);
  const [{ meta, content }, site] = await Promise.all([
    getCaseStudyDetail(slug, resolvedLocale),
    getSiteSettings(),
  ]);

  const preview = meta.previewMedia[0];
  const isRedacted = meta.privacy === "redacted";
  const canonicalUrl = toAbsoluteUrl(site.seo.siteUrl, `/${resolvedLocale}/work/${slug}`);
  const caseStudyJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: meta.title[resolvedLocale],
    description: meta.summary[resolvedLocale],
    inLanguage: resolvedLocale,
    creator: {
      "@type": "Person",
      name: site.brand.founder,
    },
    publisher: {
      "@type": "Organization",
      name: site.brand.legalName,
      url: site.seo.siteUrl,
    },
    url: canonicalUrl,
    datePublished: `${meta.year}-01-01`,
    dateModified: `${meta.year}-12-31`,
    keywords: meta.stack.join(", "),
    image: meta.previewMedia.map((asset) => toAbsoluteUrl(site.seo.siteUrl, asset.src)),
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyJsonLd) }}
      />
      <header className="border-b border-black/5 bg-[rgba(247,240,228,0.8)] backdrop-blur-xl">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-4">
          <Link
            href={`/${resolvedLocale}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            {resolvedLocale === "en" ? "Back to portfolio" : "Retour au portfolio"}
          </Link>
          <div className="flex items-center gap-3">
            <LocaleSwitch
              locale={resolvedLocale}
              href={`/${alternateLocale(resolvedLocale)}/work/${slug}`}
            />
            <Link href="/admin" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium">
              Admin
            </Link>
          </div>
        </div>
      </header>

      <div className="shell py-10">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="section-kicker">
              {meta.clientLabel} • {meta.year}
            </p>
            <h1 className="section-title mt-4 text-[3rem] md:text-[4.6rem]">
              {meta.title[resolvedLocale]}
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-[var(--muted)]">
              {meta.summary[resolvedLocale]}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {meta.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {!isRedacted && meta.publicLinks.demoUrl ? (
                <a
                  href={meta.publicLinks.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="on-ink inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold"
                >
                  Live demo
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
              {!isRedacted && meta.publicLinks.repoUrl ? (
                <a
                  href={meta.publicLinks.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold"
                >
                  Repository
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>

          <div className="glass-panel overflow-hidden rounded-[2rem]">
            <div className="relative aspect-[16/11]">
              <Image
                src={preview.src}
                alt={preview.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
              />
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  {resolvedLocale === "en" ? "Role" : "Rôle"}
                </p>
                <p className="mt-2 font-semibold">{meta.role}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  {resolvedLocale === "en" ? "Services" : "Services"}
                </p>
                <p className="mt-2 font-semibold">{meta.services.join(" • ")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {meta.outcomes.map((outcome) => (
            <div key={`${outcome.label.en}-${outcome.value}`} className="glass-panel rounded-[1.6rem] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
                {outcome.label[resolvedLocale]}
              </p>
              <p className="mt-3 text-2xl font-semibold">{outcome.value}</p>
            </div>
          ))}
        </section>

        {isRedacted ? (
          <section className="glass-panel mt-8 rounded-[1.8rem] p-5">
            <div className="flex gap-3">
              <Lock className="mt-1 h-5 w-5 text-[var(--secondary)]" />
              <div>
                <p className="font-semibold">
                  {resolvedLocale === "en"
                    ? "Some client details are intentionally withheld."
                    : "Certains détails client sont volontairement masqués."}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  {resolvedLocale === "en"
                    ? "The delivery approach, outcomes, and technical framing are real. Sensitive identity and operational details stay private."
                    : "L’approche, les résultats et le cadrage technique sont réels. Les éléments sensibles restent privés."}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="case-prose mt-12 max-w-4xl">{content}</section>

        {meta.gallery.length > 0 ? (
          <section className="mt-14">
            <h2 className="section-title text-[2.4rem] md:text-[3.2rem]">
              {resolvedLocale === "en" ? "Selected visuals" : "Visuels sélectionnés"}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {meta.gallery.map((asset) => (
                <div key={asset.src} className="glass-panel overflow-hidden rounded-[1.8rem]">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={asset.src}
                      alt={asset.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <PublicFooter locale={resolvedLocale} site={site} />
    </main>
  );
}
