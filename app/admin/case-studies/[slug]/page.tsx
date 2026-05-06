import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminAccess, getAdminSignInUrl } from "../../../../lib/auth";
import { getCaseStudyMeta } from "../../../../lib/content";
import { readCaseStudyEditorFile } from "../../../../lib/editor-content";
import { parseStatusAndDetail } from "../../../../lib/admin-search-params";
import { SubmitButton } from "../../../../components/admin/submit-button";
import { StatusBanner } from "../../../../components/admin/status-banner";
import { saveCaseStudyAction } from "../../actions";

export const metadata: Metadata = {
  title: "Admin Case Study",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function CaseStudyAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const access = await getAdminAccess();

  if (!access.authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-20">
        <div className="glass-panel max-w-xl rounded-[2rem] p-8 text-center">
          <h1 className="section-title text-[3rem]">Admin sign-in required</h1>
          <a href={getAdminSignInUrl()} className="on-ink mt-6 inline-flex rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold">
            Sign in
          </a>
        </div>
      </main>
    );
  }

  const { slug } = await params;
  const { status, detail } = parseStatusAndDetail(await searchParams);

  const meta = await getCaseStudyMeta(slug).catch(() => null);

  if (!meta) {
    notFound();
  }

  const [metaJson, bodyEn, bodyFr] = await Promise.all([
    readCaseStudyEditorFile(slug, "meta.json"),
    readCaseStudyEditorFile(slug, "en.mdx"),
    readCaseStudyEditorFile(slug, "fr.mdx"),
  ]);

  return (
    <main className="min-h-screen px-4 py-8 md:px-6 md:py-10">
      <div className="shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Case study editor</p>
            <h1 className="section-title mt-3 text-[3rem] md:text-[4rem]">{meta.title.en}</h1>
            <p className="mt-4 text-[var(--muted)]">{meta.slug}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="rounded-full border border-[var(--border)] px-4 py-3 text-sm font-semibold">
              Back to admin
            </Link>
            <a href={`/en/work/${slug}`} className="rounded-full border border-[var(--border)] px-4 py-3 text-sm font-semibold">
              EN preview
            </a>
            <a href={`/fr/work/${slug}`} className="on-ink rounded-full bg-[var(--foreground)] px-4 py-3 text-sm font-semibold">
              FR preview
            </a>
          </div>
        </div>

        <StatusBanner status={status} detail={detail} />

        <form action={saveCaseStudyAction.bind(null, slug)} className="space-y-6">
          <section className="glass-panel rounded-[1.8rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-kicker">meta.json</p>
                <h2 className="mt-3 text-2xl font-semibold">Structured metadata</h2>
              </div>
              <SubmitButton label="Publish case study" pendingLabel="Publishing..." />
            </div>
            <textarea name="meta" defaultValue={metaJson} className="admin-textarea mt-5 w-full" />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="glass-panel rounded-[1.8rem] p-6">
              <p className="section-kicker">en.mdx</p>
              <h2 className="mt-3 text-2xl font-semibold">English narrative</h2>
              <textarea name="bodyEn" defaultValue={bodyEn} className="admin-textarea mt-5 w-full" />
            </div>
            <div className="glass-panel rounded-[1.8rem] p-6">
              <p className="section-kicker">fr.mdx</p>
              <h2 className="mt-3 text-2xl font-semibold">French narrative</h2>
              <textarea name="bodyFr" defaultValue={bodyFr} className="admin-textarea mt-5 w-full" />
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}
