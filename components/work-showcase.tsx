"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useState, startTransition } from "react";
import { ArrowRight } from "lucide-react";
import { localizeCopy, type Locale } from "../lib/locale";
import type { CaseStudyMeta } from "../lib/schemas";

type WorkShowcaseProps = {
  locale: Locale;
  caseStudies: CaseStudyMeta[];
};

type FilterOption = {
  key: string;
  label: string;
};

function buildFilters(locale: Locale, studies: CaseStudyMeta[]): FilterOption[] {
  const base: FilterOption[] = [
    {
      key: "all",
      label: locale === "en" ? "All projects" : "Tous les projets",
    },
  ];

  const serviceLabels = Array.from(new Set(studies.flatMap((study) => study.services)));
  const serviceFilters = serviceLabels.slice(0, 4).map((service) => ({
    key: service,
    label: service,
  }));

  return [...base, ...serviceFilters];
}

export function WorkShowcase({ locale, caseStudies }: WorkShowcaseProps) {
  const filters = buildFilters(locale, caseStudies);
  const [activeFilter, setActiveFilter] = useState<string>(filters[0]?.key ?? "all");
  const deferredFilter = useDeferredValue(activeFilter);
  const isFiltering = deferredFilter !== activeFilter;
  const filteredStudies =
    deferredFilter === "all"
      ? caseStudies
      : caseStudies.filter((study) => study.services.includes(deferredFilter));

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const isActive = filter.key === activeFilter;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => {
                startTransition(() => {
                  setActiveFilter(filter.key);
                });
              }}
              className={`filter-chip ${isActive ? "is-active" : ""}`}
              aria-pressed={isActive}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-sm text-[var(--muted)]" role="status" aria-live="polite">
        {locale === "en"
          ? `${filteredStudies.length} projects shown`
          : `${filteredStudies.length} projets affichés`}
      </div>

      <div className="work-grid mt-8 grid gap-5 lg:grid-cols-3" data-filtering={isFiltering}>
        {filteredStudies.map((study, index) => {
          const preview = study.previewMedia[0];
          const isRedacted = study.privacy === "redacted";
          const challenge = study.outcomes[1] ?? study.outcomes[0];

          return (
            <article
              key={study.slug}
              className="work-card glass-panel group overflow-hidden rounded-[2rem]"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <Image
                  src={preview.src}
                  alt={preview.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.045]"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1724]/60 via-transparent to-transparent" />
                <div className="work-card-pulse absolute -right-8 -top-8 h-28 w-28 rounded-full bg-teal-300/20 blur-2xl" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 text-white">
                  <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                    {study.status}
                  </span>
                  {isRedacted ? (
                    <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-semibold">
                      {locale === "en" ? "Redacted" : "Confidentiel"}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  {study.clientLabel} • {study.year}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-balance">
                  {localizeCopy(study.title, locale)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  {localizeCopy(study.summary, locale)}
                </p>
                <div className="mt-4 rounded-2xl border border-black/10 bg-white/64 p-3">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    {locale === "en" ? "Engineering challenge" : "Défi d’ingénierie"}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                    {localizeCopy(challenge.label, locale)}: {challenge.value}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {study.stack.slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent-strong)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/${locale}/work/${study.slug}`}
                  className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[var(--accent-strong)] transition group-hover:translate-x-1"
                >
                  {locale === "en" ? "Open case study" : "Voir l’étude de cas"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
