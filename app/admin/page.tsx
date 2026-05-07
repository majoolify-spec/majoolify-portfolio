import type { Metadata } from "next";
import Link from "next/link";
import { getAdminAccess, getAdminSignInUrl, getAdminSignOutUrl } from "../../lib/auth";
import { getOrderedCaseStudies } from "../../lib/content";
import { readHomeEditorFile, readSiteEditorFile } from "../../lib/editor-content";
import { getPublishStatusLabel } from "../../lib/publish-mode";
import { getRuntimeConfigStatus } from "../../lib/runtime-config";
import { SubmitButton } from "../../components/admin/submit-button";
import { StatusBanner } from "../../components/admin/status-banner";
import { parseStatusAndDetail } from "../../lib/admin-search-params";
import {
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  PANEL_STANDARD,
} from "../../lib/ui-classes";
import {
  createCaseStudyAction,
  saveHomeAction,
  saveSiteAction,
  uploadMediaAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const QUICK_ACTION_PANEL = "rounded-[1.4rem] border border-black/8 bg-white/70 p-4";
const CASE_STUDY_CARD_PANEL = "rounded-[1.5rem] border border-black/8 bg-white/70 p-5";

function SignInScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <div className="glass-panel max-w-2xl rounded-[2rem] p-8 md:p-10">
        <p className="section-kicker">Admin access</p>
        <h1 className="section-title mt-4 text-[3rem]">Portfolio backoffice</h1>
        <p className="mt-4 max-w-xl text-pretty text-[var(--muted)]">
          Sign in with the allowed GitHub account to edit public copy, case studies,
          and uploaded assets. In local development you can also use the test bypass
          route when configured.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={getAdminSignInUrl()}
            className={BUTTON_PRIMARY}
          >
            Sign in with GitHub
          </a>
          <Link href="/en" className={BUTTON_SECONDARY}>
            Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}

function RuntimeSetupPanel() {
  const status = getRuntimeConfigStatus();
  const rows = [
    {
      label: "GitHub admin auth",
      ready: status.auth.ready,
      missing: status.auth.missing,
    },
    {
      label: `Git publish backend (${status.publish.mode})`,
      ready: status.publish.ready,
      missing: status.publish.missing,
    },
    {
      label: "Contact email delivery",
      ready: status.contact.ready,
      missing: status.contact.missing,
    },
  ];

  return (
    <section className={`${PANEL_STANDARD} mt-8`}>
      <p className="section-kicker">Runtime setup</p>
      <h2 className="mt-3 text-2xl font-semibold">Environment diagnostics</h2>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Use this as a production checklist for auth, publishing, and inquiry delivery.
      </p>
      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`rounded-[1.2rem] border px-4 py-3 ${
              row.ready
                ? "border-emerald-200 bg-emerald-50"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            <p className="text-sm font-semibold">
              {row.ready ? "Ready" : "Needs setup"} - {row.label}
            </p>
            {!row.ready && row.missing.length > 0 ? (
              <p className="mt-1 text-xs text-[var(--muted)]">
                Missing: {row.missing.join(", ")}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const access = await getAdminAccess();

  if (!access.authorized) {
    return <SignInScreen />;
  }

  const { status, detail } = parseStatusAndDetail(await searchParams);

  const [siteJson, homeEnJson, homeFrJson, caseStudies] = await Promise.all([
    readSiteEditorFile(),
    readHomeEditorFile("en"),
    readHomeEditorFile("fr"),
    getOrderedCaseStudies(),
  ]);

  return (
    <main className="min-h-screen px-4 py-8 md:px-6 md:py-10">
      <div className="shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Admin</p>
            <h1 className="section-title mt-3 text-[3rem] md:text-[4.2rem]">Majoolify backoffice</h1>
            <p className="mt-4 max-w-3xl text-pretty text-[var(--muted)]">
              Edit live portfolio content, manage bilingual copy, and publish case
              study updates through the configured repo publishing pipeline.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/en" className={BUTTON_SECONDARY}>
              View site
            </Link>
            <a href={getAdminSignOutUrl()} className={BUTTON_PRIMARY}>
              Sign out
            </a>
          </div>
        </div>

        <StatusBanner status={status} detail={detail} />

        <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={PANEL_STANDARD}>
            <p className="section-kicker">Session</p>
            <p className="mt-3 text-xl font-semibold">{access.label}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Publish backend: {getPublishStatusLabel()}
            </p>
          </div>
          <div className={PANEL_STANDARD}>
            <p className="section-kicker">Quick actions</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <form action={createCaseStudyAction} className={QUICK_ACTION_PANEL}>
                <label className="block text-sm font-semibold">New case study slug</label>
                <input name="slug" placeholder="majoolify-new-build" className="admin-input mt-3" />
                <div className="mt-4">
                  <SubmitButton label="Create draft" pendingLabel="Creating..." />
                </div>
              </form>
              <form action={uploadMediaAction} className={QUICK_ACTION_PANEL}>
                <label className="block text-sm font-semibold">Upload media asset</label>
                <input type="file" name="file" className="mt-3 block w-full text-sm" />
                <input name="folder" placeholder="optional/subfolder" className="admin-input mt-3" />
                <div className="mt-4">
                  <SubmitButton label="Upload" pendingLabel="Uploading..." />
                </div>
              </form>
            </div>
          </div>
        </section>

        <RuntimeSetupPanel />

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <form action={saveSiteAction} className={PANEL_STANDARD}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="section-kicker">content/site.json</p>
                <h2 className="mt-3 text-2xl font-semibold">Shared brand, SEO, contacts, services</h2>
              </div>
              <SubmitButton label="Publish site config" pendingLabel="Publishing..." />
            </div>
            <textarea name="payload" defaultValue={siteJson} className="admin-textarea mt-5 w-full" />
          </form>

          <div className="space-y-6">
            <form action={saveHomeAction.bind(null, "en")} className={PANEL_STANDARD}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="section-kicker">content/locales/en/home.json</p>
                  <h2 className="mt-3 text-2xl font-semibold">English homepage copy</h2>
                </div>
                <SubmitButton label="Publish EN" pendingLabel="Publishing..." />
              </div>
              <textarea name="payload" defaultValue={homeEnJson} className="admin-textarea mt-5 w-full" />
            </form>

            <form action={saveHomeAction.bind(null, "fr")} className={PANEL_STANDARD}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="section-kicker">content/locales/fr/home.json</p>
                  <h2 className="mt-3 text-2xl font-semibold">French homepage copy</h2>
                </div>
                <SubmitButton label="Publish FR" pendingLabel="Publishing..." />
              </div>
              <textarea name="payload" defaultValue={homeFrJson} className="admin-textarea mt-5 w-full" />
            </form>
          </div>
        </section>

        <section className={`${PANEL_STANDARD} mt-8`}>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">Case studies</p>
              <h2 className="mt-3 text-2xl font-semibold">Current portfolio entries</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {caseStudies.map((study) => (
              <article key={study.slug} className={CASE_STUDY_CARD_PANEL}>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  {study.slug}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{study.title.en}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{study.summary.en}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[var(--accent-strong)]">
                    {study.status}
                  </span>
                  <span className="rounded-full bg-[var(--secondary-soft)] px-3 py-1 text-[var(--secondary)]">
                    {study.privacy}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
                  <a href={`/admin/case-studies/${study.slug}`} className="text-[var(--accent-strong)]">
                    Edit
                  </a>
                  <a href={`/en/work/${study.slug}`} className="text-[var(--muted)]">
                    EN preview
                  </a>
                  <a href={`/fr/work/${study.slug}`} className="text-[var(--muted)]">
                    FR preview
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
