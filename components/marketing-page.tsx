import Link from "next/link";
import dynamic from "next/dynamic";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  Blocks,
  Bot,
  Building2,
  CircleDot,
  Globe,
  Sparkles,
  Workflow,
} from "lucide-react";
import { InteractiveLayer } from "./interactive-layer";
import { PublicFooter, PublicHeader } from "./site-chrome";
import { WorkShowcase } from "./work-showcase";
import { localizeCopy, type Locale } from "../lib/locale";
import type { CaseStudyMeta, HomeContent, SiteSettings } from "../lib/schemas";
import { getCaseStudyUrl } from "../lib/seo";
import { BUTTON_PRIMARY, BUTTON_SECONDARY, PANEL_SPACIOUS } from "../lib/ui-classes";

const ContactForm = dynamic(
  () => import("./contact-form").then((module) => module.ContactForm),
  {
    loading: () => (
      <div
        className={`${PANEL_SPACIOUS} h-[520px]`}
        aria-hidden
      />
    ),
  },
);

type MarketingPageProps = {
  locale: Locale;
  site: SiteSettings;
  home: HomeContent;
  caseStudies: CaseStudyMeta[];
};

export function MarketingPage({
  locale,
  site,
  home,
  caseStudies,
}: MarketingPageProps) {
  const heroWords = home.hero.title.split(" ");
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand.name,
    legalName: site.brand.legalName,
    url: site.seo.siteUrl,
    founder: {
      "@type": "Person",
      name: site.brand.founder,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: site.brand.country,
      addressLocality: site.brand.location,
    },
    sameAs: site.socials.map((social) => social.href),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.contact.email,
      },
    ],
  };
  const workJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: caseStudies.slice(0, 6).map((study, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: localizeCopy(study.title, locale),
        description: localizeCopy(study.summary, locale),
        url: getCaseStudyUrl(site.seo.siteUrl, locale, study.slug),
        creator: {
          "@type": "Person",
          name: site.brand.founder,
        },
      },
    })),
  };
  const experiments =
    locale === "en"
      ? [
          {
            title: "Motion-forward narrative UI",
            description:
              "Section choreography where typography, grids, and transitions carry the story without slowing performance.",
            tags: ["Scroll pacing", "Reveal system", "Design tokens"],
            icon: Sparkles,
            tone: "teal",
          },
          {
            title: "Prompt UX workbench",
            description:
              "Admin-oriented interaction patterns for prompt testing, guardrails, and usable human-in-the-loop review.",
            tags: ["Prompt QA", "Evaluation loops", "Operational clarity"],
            icon: Bot,
            tone: "amber",
          },
          {
            title: "Composable frontend architecture",
            description:
              "App Router systems that keep content, routing, and components aligned while product scope keeps evolving.",
            tags: ["Next.js App Router", "Server actions", "CMS-ready"],
            icon: Blocks,
            tone: "ink",
          },
        ]
      : [
          {
            title: "UI narrative orientée motion",
            description:
              "Une chorégraphie de sections où typographie, grilles et transitions portent le récit sans pénaliser la performance.",
            tags: ["Rythme de scroll", "Système de reveal", "Design tokens"],
            icon: Sparkles,
            tone: "teal",
          },
          {
            title: "Atelier UX pour prompts",
            description:
              "Des patterns d’interaction orientés admin pour tester les prompts, les garde-fous et les boucles de revue humaine.",
            tags: ["QA de prompts", "Boucles d’évaluation", "Clarté opérationnelle"],
            icon: Bot,
            tone: "amber",
          },
          {
            title: "Architecture frontend composable",
            description:
              "Des systèmes App Router qui gardent contenu, routing et composants alignés pendant que le scope produit évolue.",
            tags: ["Next.js App Router", "Server actions", "CMS ready"],
            icon: Blocks,
            tone: "ink",
          },
        ];

  return (
    <main className="min-h-screen">
      <a href="#main-content" className="skip-link">
        {locale === "en" ? "Skip to content" : "Aller au contenu"}
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workJsonLd) }}
      />
      <InteractiveLayer />
      <PublicHeader locale={locale} home={home} />

      <div id="main-content" className="shell rhythm-shell relative overflow-x-clip pt-8">
        <div className="ambient-orb ambient-orb--teal right-[-2rem] top-12 h-40 w-40" />
        <div className="ambient-orb ambient-orb--amber left-[-1rem] top-40 h-56 w-56" />

        <section className="hero-grid py-10 md:py-18">
          <div className="fade-up">
            <span className="eyebrow-badge">{home.hero.eyebrow}</span>
            <h1
              className="section-title signature-headline mt-6 max-w-5xl text-balance"
              aria-label={home.hero.title}
            >
              {heroWords.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  style={{ ["--word-index" as string]: index } as CSSProperties}
                >
                  {word}
                  {index === heroWords.length - 1 ? null : " "}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-[var(--muted)] md:text-xl">
              {home.hero.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 max-[380px]:grid max-[380px]:grid-cols-1">
              <Link
                href="#contact"
                className={`btn-magnetic ${BUTTON_PRIMARY} max-[380px]:justify-center`}
              >
                {home.hero.primaryCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#work"
                className={`btn-magnetic ${BUTTON_SECONDARY} max-[380px]:justify-center`}
              >
                {home.hero.secondaryCtaLabel}
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {home.hero.stats.map((stat) => (
                  <div key={stat.label} className="glass-panel rounded-[1.5rem] p-4">
                    <p className="text-3xl font-semibold text-[var(--foreground)]">{stat.value}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{stat.label}</p>
                </div>
                ))}
              </div>
              <div className="hero-signature-ribbon mt-6">
                <p>
                  {locale === "en"
                    ? "Majoolify by Ahmed Majoul • Frontend engineering • Next.js systems • AI prompt workflows"
                    : "Majoolify par Ahmed Majoul • Ingénierie frontend • Systèmes Next.js • Workflows de prompts IA"}
                </p>
              </div>
            </div>

            <div className="fade-up lg:pb-5">
            <div className="ink-panel relative overflow-hidden rounded-[2rem] p-6 md:p-8">
              <div className="absolute inset-x-0 top-0 h-px bg-white/12" />
              <p className="section-kicker on-ink-soft">
                {locale === "en" ? "Studio signal" : "Signal du studio"}
              </p>
              <div className="mt-5 space-y-4">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4">
                  <p className="on-ink-subtle text-sm">
                    {locale === "en" ? "Legal entity" : "Entité légale"}
                  </p>
                  <p className="mt-2 text-xl font-semibold">{site.brand.legalName}</p>
                  <p className="on-ink-soft mt-2 text-sm">
                    {locale === "en"
                      ? `${site.brand.founder}, founder and lead engineer, based in ${site.brand.location}.`
                      : `${site.brand.founder}, fondateur et ingénieur principal, basé à ${site.brand.location}.`}
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4">
                    <Sparkles className="h-5 w-5 text-[#ffd29a]" />
                    <p className="mt-3 font-semibold">
                      {locale === "en" ? "AI prompt systems" : "Systèmes de prompts IA"}
                    </p>
                    <p className="on-ink-soft mt-2 text-sm">
                      {locale === "en"
                        ? "Prompt architecture that ships with UI, workflow, and product constraints in mind."
                        : "Une architecture de prompts pensée avec l’UI, les workflows et les contraintes produit."}
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4">
                    <Workflow className="h-5 w-5 text-[#8ee3df]" />
                    <p className="mt-3 font-semibold">
                      {locale === "en" ? "Next.js execution" : "Exécution Next.js"}
                    </p>
                    <p className="on-ink-soft mt-2 text-sm">
                      {locale === "en"
                        ? "Structured frontend systems for product launches, internal tools, and AI features."
                        : "Des systèmes frontend structurés pour lancer des produits, outils internes et fonctions IA."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <p className="section-kicker">
            {locale === "en" ? "Capabilities wall" : "Mur de capacités"}
          </p>
          <div className="bento-wall mt-6">
            <article className="bento-card bento-card--ink">
              <p className="bento-eyebrow">{locale === "en" ? "Frontend craft" : "Craft frontend"}</p>
              <h3>
                {locale === "en"
                  ? "Interfaces that feel sharp in motion, not just static screenshots."
                  : "Des interfaces nettes en mouvement, pas seulement en capture statique."}
              </h3>
              <div className="bento-tags">
                <span>Next.js</span>
                <span>Motion rhythm</span>
                <span>Design systems</span>
              </div>
            </article>
            <article className="bento-card bento-card--teal">
              <p className="bento-eyebrow">{locale === "en" ? "Execution speed" : "Vitesse d’exécution"}</p>
              <h3>
                {locale === "en"
                  ? "From concept to deployable build with production constraints respected."
                  : "Du concept au build déployable en respectant les contraintes de production."}
              </h3>
              <div className="bento-metric">
                <strong>24h</strong>
                <span>{locale === "en" ? "typical first implementation sprint" : "sprint initial d’implémentation typique"}</span>
              </div>
            </article>
            <article className="bento-card bento-card--amber">
              <p className="bento-eyebrow">{locale === "en" ? "AI prompt engineering" : "Prompt engineering IA"}</p>
              <h3>
                {locale === "en"
                  ? "Prompt workflows integrated with real UX, guardrails, and admin operations."
                  : "Des workflows de prompts intégrés à une UX réelle, avec garde-fous et opérations admin."}
              </h3>
              <div className="bento-tags">
                <span>Prompt QA</span>
                <span>Human review</span>
                <span>Ops-ready</span>
              </div>
            </article>
          </div>
        </section>

        <section className="py-6">
          <div className={PANEL_SPACIOUS}>
            <p className="section-kicker">{home.credibility.eyebrow}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
              <h2 className="section-title text-[2.3rem] md:text-[3rem]">{home.credibility.title}</h2>
              <div className="grid gap-3">
                {home.credibility.items.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[1.2rem] border border-black/7 bg-white/70 p-4">
                    <CircleDot className="mt-1 h-4 w-4 text-[var(--accent)]" />
                    <p className="text-sm leading-7 text-[var(--muted)]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-28 py-14">
          <p className="section-kicker">{home.services.eyebrow}</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="section-title text-[2.8rem] md:text-[4rem]">{home.services.title}</h2>
              <p className="mt-4 max-w-2xl text-pretty text-[var(--muted)]">{home.services.intro}</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {site.services.map((service) => (
              <article
                key={service.slug}
                className="glass-panel rounded-[1.8rem] p-6 transition hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">{service.name}</p>
                  {service.featured ? (
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                      {locale === "en" ? "Featured" : "Mis en avant"}
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                  {localizeCopy(service.summary, locale)}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-[var(--foreground)]">
                  {service.bullets.map((bullet) => (
                    <li key={bullet.en} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--secondary)]" />
                      <span>{localizeCopy(bullet, locale)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="scroll-mt-28 py-14">
          <p className="section-kicker">{home.work.eyebrow}</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="section-title rhythm-title text-[2.8rem] md:text-[4rem]">{home.work.title}</h2>
              <p className="mt-4 max-w-2xl text-pretty text-[var(--muted)]">{home.work.intro}</p>
            </div>
          </div>
          <WorkShowcase locale={locale} caseStudies={caseStudies} />
        </section>

        <section id="experiments" className="scroll-mt-28 py-14">
          <p className="section-kicker">{locale === "en" ? "Frontend experiments" : "Expériences frontend"}</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="section-title rhythm-title text-[2.8rem] md:text-[4rem]">
                {locale === "en" ? "Small labs, high craft." : "Petits labs, gros niveau d’exécution."}
              </h2>
              <p className="mt-4 max-w-2xl text-pretty text-[var(--muted)]">
                {locale === "en"
                  ? "These are focused interaction studies that sharpen how client products feel in motion, structure, and AI usability."
                  : "Ce sont des études d’interaction ciblées qui renforcent la sensation produit côté motion, structure et usage IA."}
              </p>
            </div>
          </div>
          <div className="experiments-grid mt-8 grid gap-4 lg:grid-cols-3">
            {experiments.map((experiment) => {
              const Icon = experiment.icon;
              return (
                <article
                  key={experiment.title}
                  className={`experiment-card experiment-card--${experiment.tone}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-2xl border border-white/12 bg-white/10 p-2.5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="on-ink-muted rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
                      {locale === "en" ? "Lab" : "Lab"}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-white">{experiment.title}</h3>
                  <p className="on-ink-muted mt-3 text-sm leading-7">{experiment.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {experiment.tags.map((tag) => (
                      <span
                        key={tag}
                        className="on-ink-muted rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="experiment-canvas mt-6">
                    <span />
                    <span />
                    <span />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="process" className="scroll-mt-28 py-14">
          <p className="section-kicker">{home.process.eyebrow}</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="section-title text-[2.8rem] md:text-[4rem]">{home.process.title}</h2>
              <p className="mt-4 max-w-xl text-pretty text-[var(--muted)]">{home.process.intro}</p>
            </div>
            <div className="space-y-4">
              {home.process.steps.map((step, index) => (
                <div key={step.title} className="glass-panel rounded-[1.7rem] p-5">
                  <div className="flex gap-4">
                    <div className="on-ink flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-sm font-semibold">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
            <article className="ink-panel rounded-[2rem] p-7 md:p-8">
              <p className="section-kicker on-ink-soft">{home.expertise.eyebrow}</p>
              <h2 className="section-title mt-4 text-[2.6rem] md:text-[3.5rem] text-white">
                {home.expertise.title}
              </h2>
              <p className="on-ink-muted mt-4 text-pretty text-sm leading-7">{home.expertise.intro}</p>
              <div className="mt-6 space-y-3">
                {home.expertise.points.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-[1.2rem] border border-white/10 bg-white/4 p-4"
                  >
                    <Sparkles className="mt-1 h-4 w-4 text-[#ffd29a]" />
                    <p className="on-ink-muted text-sm leading-7">{point}</p>
                  </div>
                ))}
              </div>
            </article>

            <article id="about" className="scroll-mt-28 glass-panel rounded-[2rem] p-7 md:p-8">
              <p className="section-kicker">{home.story.eyebrow}</p>
              <h2 className="section-title mt-4 text-[2.6rem] md:text-[3.5rem]">{home.story.title}</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--muted)]">
                {home.story.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-black/7 bg-white/70 p-4">
                  <Building2 className="h-5 w-5 text-[var(--secondary)]" />
                  <p className="mt-3 text-sm font-semibold">
                    {locale === "en" ? "Legal delivery vehicle" : "Structure juridique"}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{site.brand.legalName}</p>
                </div>
                <div className="rounded-[1.5rem] border border-black/7 bg-white/70 p-4">
                  <Globe className="h-5 w-5 text-[var(--accent)]" />
                  <p className="mt-3 text-sm font-semibold">
                    {locale === "en" ? "Operating from Tunisia" : "Basé en Tunisie"}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{site.brand.location}</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="py-14">
          <p className="section-kicker">{home.testimonials.eyebrow}</p>
          <h2 className="section-title mt-4 text-[2.8rem] md:text-[4rem]">{home.testimonials.title}</h2>
          <p className="mt-4 max-w-2xl text-pretty text-[var(--muted)]">{home.testimonials.intro}</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {site.testimonials.map((testimonial) => (
              <blockquote key={testimonial.name} className="glass-panel rounded-[1.8rem] p-6">
                <p className="text-pretty text-base leading-8">
                  “{localizeCopy(testimonial.quote, locale)}”
                </p>
                <footer className="mt-6">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-28 py-14">
          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="section-kicker">{home.contact.eyebrow}</p>
              <h2 className="section-title mt-4 text-[2.8rem] md:text-[4rem]">{home.contact.title}</h2>
              <p className="mt-4 max-w-xl text-pretty text-[var(--muted)]">{home.contact.intro}</p>
              <div className="mt-6 space-y-3 text-sm text-[var(--muted)]">
                <p>
                  <span className="font-semibold text-[var(--foreground)]">Email:</span>{" "}
                  {site.contact.email}
                </p>
                <p>
                  <span className="font-semibold text-[var(--foreground)]">WhatsApp:</span>{" "}
                  {site.contact.whatsapp}
                </p>
                <p>{localizeCopy(site.contact.responseTime, locale)}</p>
                <p>{localizeCopy(site.contact.availabilityNote, locale)}</p>
              </div>
            </div>
            <ContactForm
              locale={locale}
              submitLabel={home.contact.submitLabel}
              successMessage={home.contact.formSuccess}
            />
          </div>
        </section>
      </div>

      <PublicFooter locale={locale} site={site} />
    </main>
  );
}
