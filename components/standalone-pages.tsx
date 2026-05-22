import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, MapPin, ShieldCheck } from "lucide-react";
import { ContactForm } from "./contact-form";
import { PublicFooter, PublicHeader } from "./site-chrome";
import { WorkShowcase } from "./work-showcase";
import { alternateLocale, localizeCopy, type Locale } from "../lib/locale";
import type { CaseStudyMeta, HomeContent, SiteSettings } from "../lib/schemas";
import { BUTTON_SECONDARY, PANEL_SPACIOUS, PANEL_STANDARD } from "../lib/ui-classes";

type SharedPageProps = {
  locale: Locale;
  site: SiteSettings;
  home: HomeContent;
};

type WorkIndexPageProps = SharedPageProps & {
  caseStudies: CaseStudyMeta[];
};

function PageShell({
  locale,
  home,
  site,
  segment,
  children,
}: SharedPageProps & {
  segment: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <PublicHeader locale={locale} home={home} localeHref={`/${alternateLocale(locale)}/${segment}`} />
      {children}
      <PublicFooter locale={locale} site={site} />
    </main>
  );
}

function PageHero({
  eyebrow,
  title,
  intro,
  aside,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  aside?: React.ReactNode;
}) {
  return (
    <section className="shell py-10 md:py-16">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.52fr] lg:items-end">
        <div>
          <p className="section-kicker">{eyebrow}</p>
          <h1 className="section-title mt-4 max-w-5xl text-[3.1rem] md:text-[5rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-pretty text-lg leading-8 text-[var(--muted)]">
            {intro}
          </p>
        </div>
        {aside ? <div className={PANEL_STANDARD}>{aside}</div> : null}
      </div>
    </section>
  );
}

export function WorkIndexPage({ locale, site, home, caseStudies }: WorkIndexPageProps) {
  return (
    <PageShell locale={locale} site={site} home={home} segment="work">
      <PageHero
        eyebrow={home.work.eyebrow}
        title={home.work.title}
        intro={home.work.intro}
        aside={
          <>
            <p className="section-kicker">
              {locale === "en" ? "Portfolio map" : "Carte du portfolio"}
            </p>
            <p className="mt-3 text-4xl font-semibold">{caseStudies.length}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              {locale === "en"
                ? "Public and redacted case studies with real delivery signal."
                : "Études de cas publiques et anonymisées avec du signal réel de livraison."}
            </p>
          </>
        }
      />
      <section className="shell pb-16">
        <WorkShowcase locale={locale} caseStudies={caseStudies} />
      </section>
    </PageShell>
  );
}

export function ServicesPage({ locale, site, home }: SharedPageProps) {
  return (
    <PageShell locale={locale} site={site} home={home} segment="services">
      <PageHero
        eyebrow={home.services.eyebrow}
        title={home.services.title}
        intro={home.services.intro}
        aside={
          <>
            <p className="section-kicker">
              {locale === "en" ? "Best fit" : "Meilleur fit"}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {locale === "en"
                ? "Frontend-heavy products where interface quality, route structure, content systems, and AI workflows all matter at the same time."
                : "Des produits très frontend où qualité d’interface, structure de routes, systèmes de contenu et workflows IA comptent ensemble."}
            </p>
          </>
        }
      />
      <section className="shell grid gap-4 pb-16 lg:grid-cols-3">
        {site.services.map((service) => (
          <article key={service.slug} className={`${PANEL_SPACIOUS} flex flex-col`}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl font-semibold">{service.name}</h2>
              {service.featured ? (
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                  {locale === "en" ? "Core" : "Central"}
                </span>
              ) : null}
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              {localizeCopy(service.summary, locale)}
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-7">
              {service.bullets.map((bullet) => (
                <li key={bullet.en} className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-strong)]" />
                  <span>{localizeCopy(bullet, locale)}</span>
                </li>
              ))}
            </ul>
            <Link href={`/${locale}/contact`} className={`${BUTTON_SECONDARY} mt-7 w-fit`}>
              {locale === "en" ? "Discuss this service" : "Discuter ce service"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </section>
    </PageShell>
  );
}

export function ContactPage({ locale, site, home }: SharedPageProps) {
  return (
    <PageShell locale={locale} site={site} home={home} segment="contact">
      <PageHero
        eyebrow={home.contact.eyebrow}
        title={home.contact.title}
        intro={home.contact.intro}
        aside={
          <div className="space-y-4 text-sm leading-7 text-[var(--muted)]">
            <p className="flex gap-3">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-strong)]" />
              <span>{site.contact.email}</span>
            </p>
            <p className="flex gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[var(--secondary)]" />
              <span>{site.brand.location}</span>
            </p>
            <p>{localizeCopy(site.contact.responseTime, locale)}</p>
          </div>
        }
      />
      <section className="shell grid gap-6 pb-16 lg:grid-cols-[0.7fr_1.3fr]">
        <div className={PANEL_STANDARD}>
          <p className="section-kicker">
            {locale === "en" ? "What to send" : "À envoyer"}
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--muted)]">
            {(locale === "en"
              ? [
                  "What you are building or trying to improve.",
                  "Current technical stack, timeline, and launch pressure.",
                  "The product outcome that needs to be true after delivery.",
                ]
              : [
                  "Ce que vous construisez ou cherchez à améliorer.",
                  "Stack actuelle, calendrier et pression de lancement.",
                  "Le résultat produit qui doit être vrai après livraison.",
                ]
            ).map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-strong)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-7 text-[var(--muted)]">
            {localizeCopy(site.contact.availabilityNote, locale)}
          </p>
        </div>
        <ContactForm
          locale={locale}
          submitLabel={home.contact.submitLabel}
          successMessage={home.contact.formSuccess}
        />
      </section>
    </PageShell>
  );
}

export function AboutPage({ locale, site, home }: SharedPageProps) {
  return (
    <PageShell locale={locale} site={site} home={home} segment="about">
      <PageHero
        eyebrow={home.story.eyebrow}
        title={home.story.title}
        intro={localizeCopy(site.brand.overview, locale)}
        aside={
          <>
            <p className="section-kicker">
              {locale === "en" ? "Studio" : "Studio"}
            </p>
            <p className="mt-3 text-xl font-semibold">{site.brand.legalName}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              {site.brand.founder} - {site.brand.location}
            </p>
          </>
        }
      />
      <section className="shell grid gap-6 pb-16 lg:grid-cols-[1.05fr_0.95fr]">
        <article className={PANEL_SPACIOUS}>
          <p className="section-kicker">{home.story.eyebrow}</p>
          <div className="mt-5 space-y-5 text-base leading-8 text-[var(--muted)]">
            {home.story.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
        <div className="space-y-4">
          {home.credibility.items.map((item) => (
            <div key={item} className={PANEL_STANDARD}>
              <ShieldCheck className="h-5 w-5 text-[var(--accent-strong)]" />
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export function PrivacyPage({ locale, site, home }: SharedPageProps) {
  const sections =
    locale === "en"
      ? [
          {
            title: "What is collected",
            body: "The contact form asks for your name, email address, company or product context, and project brief. A hidden anti-spam field may also be submitted by automated bots.",
          },
          {
            title: "How it is used",
            body: "Submitted information is used only to review the inquiry, respond to the project request, and decide whether Majoolify is a practical fit for the work.",
          },
          {
            title: "Where it is sent",
            body: "When email delivery is configured, the inquiry is delivered to Majoolify by email through the configured transactional email provider.",
          },
          {
            title: "Retention and requests",
            body: `You can request deletion or correction of inquiry information by emailing ${site.contact.email}.`,
          },
        ]
      : [
          {
            title: "Données collectées",
            body: "Le formulaire de contact demande votre nom, adresse e-mail, entreprise ou contexte produit, et brief projet. Un champ anti-spam masqué peut aussi être soumis par des bots.",
          },
          {
            title: "Utilisation",
            body: "Les informations envoyées servent uniquement à examiner la demande, répondre au projet et décider si Majoolify est un fit pratique pour la mission.",
          },
          {
            title: "Transmission",
            body: "Quand l’envoi d’e-mail est configuré, la demande est transmise à Majoolify par e-mail via le fournisseur transactionnel configuré.",
          },
          {
            title: "Conservation et demandes",
            body: `Vous pouvez demander la suppression ou la correction des informations envoyées en écrivant à ${site.contact.email}.`,
          },
        ];

  return (
    <PageShell locale={locale} site={site} home={home} segment="privacy">
      <PageHero
        eyebrow={locale === "en" ? "Privacy" : "Confidentialité"}
        title={locale === "en" ? "Privacy notice" : "Notice de confidentialité"}
        intro={
          locale === "en"
            ? "A plain-language note on what the portfolio contact form collects and how Majoolify uses inquiry information."
            : "Une note claire sur les données collectées par le formulaire de contact et leur utilisation par Majoolify."
        }
      />
      <section className="shell grid gap-4 pb-16 md:grid-cols-2">
        {sections.map((section) => (
          <article key={section.title} className={PANEL_STANDARD}>
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{section.body}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
