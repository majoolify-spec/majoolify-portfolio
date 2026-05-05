"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccess } from "../../lib/auth";
import {
  getCaseStudyRevalidationTargets,
  getHomeRevalidationTargets,
  getSiteRevalidationTargets,
  type RevalidationTargets,
} from "../../lib/revalidate-targets";
import {
  caseStudyMetaSchema,
  homeContentSchema,
  siteSettingsSchema,
} from "../../lib/schemas";

async function requireAdmin() {
  const access = await getAdminAccess();

  if (!access.authorized) {
    throw new Error("Unauthorized");
  }

  return access;
}

async function publishFiles(
  ...args: Parameters<typeof import("../../lib/publisher").publishFiles>
) {
  const mod = await import("../../lib/publisher");
  return mod.publishFiles(...args);
}

function redirectWithStatus(path: string, status: string, detail?: string): never {
  const params = new URLSearchParams({ status });

  if (detail) {
    params.set("detail", detail);
  }

  const target = `${path}?${params.toString()}` as Parameters<typeof redirect>[0];
  redirect(target);
}

function applyRevalidation(targets: RevalidationTargets) {
  for (const tag of targets.tags) {
    revalidateTag(tag, "max");
  }

  for (const path of targets.paths) {
    revalidatePath(path);
  }
}

function parseJson<T>(value: FormDataEntryValue | null, parser: { parse: (input: unknown) => T }) {
  if (typeof value !== "string") {
    throw new Error("Missing JSON payload.");
  }

  return parser.parse(JSON.parse(value));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeFolder(value: string) {
  return value
    .replace(/\\/g, "/")
    .split("/")
    .map((segment) => slugify(segment))
    .filter(Boolean)
    .join("/");
}

function sanitizeFilename(value: string) {
  const parts = value.split(".");
  const extension = parts.length > 1 ? parts.pop() : "";
  const name = slugify(parts.join(".") || "asset");
  return extension ? `${name}.${extension.toLowerCase()}` : name;
}

function defaultCaseStudyMeta(slug: string) {
  return {
    slug,
    status: "draft",
    privacy: "public",
    featured: false,
    year: new Date().getFullYear(),
    clientLabel: "New client",
    role: "Lead frontend engineer",
    services: ["Next.js engineering"],
    stack: ["Next.js", "TypeScript"],
    previewMedia: [
      {
        src: "/uploads/portfolio/default-preview.svg",
        alt: "Default case study preview",
        width: 1600,
        height: 1100,
      },
    ],
    gallery: [],
    title: {
      en: "New case study",
      fr: "Nouvelle étude de cas",
    },
    summary: {
      en: "Replace this summary with the actual project context, outcome, and positioning.",
      fr: "Remplacez ce résumé par le contexte réel du projet, son résultat et son positionnement.",
    },
    outcomes: [
      {
        label: { en: "Outcome", fr: "Résultat" },
        value: "TBD",
      },
    ],
    publicLinks: {},
  };
}

export async function saveSiteAction(formData: FormData) {
  await requireAdmin();

  try {
    const site = parseJson(formData.get("payload"), siteSettingsSchema);
    await publishFiles(
      [{ path: "content/site.json", content: `${JSON.stringify(site, null, 2)}\n` }],
      "chore: update site settings",
    );
    applyRevalidation(getSiteRevalidationTargets());
  } catch (error) {
    redirectWithStatus(
      "/admin",
      "site-error",
      error instanceof Error ? error.message : "Unknown error",
    );
  }

  redirectWithStatus("/admin", "site-saved");
}

export async function saveHomeAction(locale: "en" | "fr", formData: FormData) {
  await requireAdmin();

  try {
    const home = parseJson(formData.get("payload"), homeContentSchema);
    await publishFiles(
      [
        {
          path: `content/locales/${locale}/home.json`,
          content: `${JSON.stringify(home, null, 2)}\n`,
        },
      ],
      `chore: update ${locale} home content`,
    );
    applyRevalidation(getHomeRevalidationTargets(locale));
  } catch (error) {
    redirectWithStatus(
      "/admin",
      `${locale}-error`,
      error instanceof Error ? error.message : "Unknown error",
    );
  }

  redirectWithStatus("/admin", `${locale}-saved`);
}

export async function createCaseStudyAction(formData: FormData) {
  await requireAdmin();

  const slug = slugify(String(formData.get("slug") || ""));

  if (!slug) {
    redirectWithStatus("/admin", "create-error", "Provide a valid slug.");
  }

  const result = await publishFiles(
    [
      {
        path: `content/case-studies/${slug}/meta.json`,
        content: `${JSON.stringify(defaultCaseStudyMeta(slug), null, 2)}\n`,
      },
      {
        path: `content/case-studies/${slug}/en.mdx`,
        content: `## Overview\n\nWrite the English case study narrative here.\n`,
      },
      {
        path: `content/case-studies/${slug}/fr.mdx`,
        content: `## Aperçu\n\nRédigez ici la narration française de l’étude de cas.\n`,
      },
    ],
    `feat: create case study ${slug}`,
  );

  applyRevalidation(getCaseStudyRevalidationTargets(slug));

  if (result.mode === "dry-run") {
    redirectWithStatus("/admin", "create-dry-run", slug);
  }

  redirectWithStatus(`/admin/case-studies/${slug}`, "created");
}

export async function saveCaseStudyAction(slug: string, formData: FormData) {
  await requireAdmin();

  try {
    const meta = parseJson(formData.get("meta"), caseStudyMetaSchema);
    if (meta.slug !== slug) {
      throw new Error("Slug inside meta.json must match the route slug.");
    }

    const bodyEn = String(formData.get("bodyEn") || "");
    const bodyFr = String(formData.get("bodyFr") || "");

    await publishFiles(
      [
        {
          path: `content/case-studies/${slug}/meta.json`,
          content: `${JSON.stringify(meta, null, 2)}\n`,
        },
        {
          path: `content/case-studies/${slug}/en.mdx`,
          content: bodyEn,
        },
        {
          path: `content/case-studies/${slug}/fr.mdx`,
          content: bodyFr,
        },
      ],
      `chore: update case study ${slug}`,
    );

    applyRevalidation(getCaseStudyRevalidationTargets(slug));
  } catch (error) {
    redirectWithStatus(
      `/admin/case-studies/${slug}`,
      "save-error",
      error instanceof Error ? error.message : "Unknown error",
    );
  }

  redirectWithStatus(`/admin/case-studies/${slug}`, "saved");
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirectWithStatus("/admin", "upload-error", "Choose a file to upload.");
  }

  const folder = sanitizeFolder(String(formData.get("folder") || ""));
  const safeName = `${Date.now()}-${sanitizeFilename(file.name)}`;
  const path = folder
    ? `public/uploads/portfolio/${folder}/${safeName}`
    : `public/uploads/portfolio/${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await publishFiles([{ path, content: buffer }], `feat: upload asset ${safeName}`);
  applyRevalidation(getSiteRevalidationTargets());

  redirectWithStatus("/admin", result.mode === "dry-run" ? "upload-dry-run" : "asset-uploaded", path);
}
