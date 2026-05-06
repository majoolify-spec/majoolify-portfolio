import { compileMDX } from "next-mdx-remote/rsc";
import { unstable_cache } from "next/cache";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import type { MDXComponents } from "mdx/types";
import { isLocale, type Locale } from "./locale";
import { filterVisibleCaseStudies, orderCaseStudies } from "./case-study-order";
import {
  caseStudyMetaSchema,
  homeContentSchema,
  siteSettingsSchema,
} from "./schemas";

const CONTENT_ROOT = join(process.cwd(), "content");
const IS_DEV = process.env.NODE_ENV !== "production";

const mdxComponents: MDXComponents = {
  a: (props) => (
    <a
      {...props}
      className="underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition hover:text-[var(--accent-strong)]"
    />
  ),
  code: (props) => (
    <code
      {...props}
      className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-[0.9em] text-[var(--accent-strong)]"
    />
  ),
};

async function readJson<T>(filePath: string, parser: { parse: (value: unknown) => T }) {
  const raw = await readFile(filePath, "utf8");
  return parser.parse(JSON.parse(raw));
}

const getSiteSettingsCached = unstable_cache(
  async () => readJson(join(CONTENT_ROOT, "site.json"), siteSettingsSchema),
  ["site-settings"],
  { tags: ["site"] },
);

export async function getSiteSettings() {
  if (IS_DEV) {
    return readJson(join(CONTENT_ROOT, "site.json"), siteSettingsSchema);
  }

  return getSiteSettingsCached();
}

export async function getHomeContent(locale: Locale) {
  if (IS_DEV) {
    return readJson(
      join(CONTENT_ROOT, "locales", locale, "home.json"),
      homeContentSchema,
    );
  }

  const cached = unstable_cache(
    async () =>
      readJson(
        join(CONTENT_ROOT, "locales", locale, "home.json"),
        homeContentSchema,
      ),
    [`home-${locale}`],
    {
      tags: ["site", `home:${locale}`],
    },
  );

  return cached();
}

export async function getCaseStudySlugs() {
  const entries = await readdir(join(CONTENT_ROOT, "case-studies"), {
    withFileTypes: true,
  });

  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

export async function getCaseStudyMeta(slug: string) {
  if (IS_DEV) {
    return readJson(
      join(CONTENT_ROOT, "case-studies", slug, "meta.json"),
      caseStudyMetaSchema,
    );
  }

  const cached = unstable_cache(
    async () =>
      readJson(
        join(CONTENT_ROOT, "case-studies", slug, "meta.json"),
        caseStudyMetaSchema,
      ),
    [`case-study-meta-${slug}`],
    {
      tags: ["site", "case-study:index", `case-study:${slug}:en`, `case-study:${slug}:fr`],
    },
  );

  return cached();
}

export async function getCaseStudyBodySource(slug: string, locale: Locale) {
  if (IS_DEV) {
    return readFile(join(CONTENT_ROOT, "case-studies", slug, `${locale}.mdx`), "utf8");
  }

  const cached = unstable_cache(
    async () =>
      readFile(join(CONTENT_ROOT, "case-studies", slug, `${locale}.mdx`), "utf8"),
    [`case-study-body-${slug}-${locale}`],
    {
      tags: ["site", `case-study:${slug}:${locale}`],
    },
  );

  return cached();
}

export async function getOrderedCaseStudies() {
  const slugs = await getCaseStudySlugs();
  const studies = await Promise.all(slugs.map((slug) => getCaseStudyMeta(slug)));
  return orderCaseStudies(studies);
}

export async function getVisibleCaseStudies() {
  const studies = await getOrderedCaseStudies();
  return filterVisibleCaseStudies(studies);
}

export async function getVisibleCaseStudySlugs() {
  const studies = await getVisibleCaseStudies();
  return studies.map((study) => study.slug);
}

export async function getCaseStudyDetail(
  slug: string,
  locale: Locale,
  options?: { allowDraft?: boolean },
) {
  const meta = await getCaseStudyMeta(slug).catch(() => null);

  if (!meta) {
    notFound();
  }

  if (meta.status === "draft" && !options?.allowDraft) {
    notFound();
  }

  const source = await getCaseStudyBodySource(slug, locale).catch(() => null);

  if (!source) {
    notFound();
  }

  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
      parseFrontmatter: false,
    },
    components: mdxComponents,
  });

  return {
    meta,
    content,
  };
}

export function resolveLocale(locale: string): Locale {
  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}
