"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  caseStudyExists,
  getDefaultCaseStudyMeta,
  getUploadValidationError,
  sanitizeFilename,
  sanitizeFolder,
  slugify,
} from "../../lib/admin-content";
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

  let existingCaseStudy = false;

  try {
    existingCaseStudy = await caseStudyExists(slug);
  } catch (error) {
    redirectWithStatus(
      "/admin",
      "create-error",
      error instanceof Error ? error.message : "Unknown error",
    );
  }

  if (existingCaseStudy) {
    redirectWithStatus(
      "/admin",
      "create-error",
      `Case study "${slug}" already exists.`,
    );
  }

  let result: Awaited<ReturnType<typeof publishFiles>>;

  try {
    result = await publishFiles(
      [
        {
          path: `content/case-studies/${slug}/meta.json`,
          content: `${JSON.stringify(getDefaultCaseStudyMeta(slug), null, 2)}\n`,
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
  } catch (error) {
    redirectWithStatus(
      "/admin",
      "create-error",
      error instanceof Error ? error.message : "Unknown error",
    );
  }

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

  const uploadValidationError = getUploadValidationError(file);
  if (uploadValidationError) {
    redirectWithStatus("/admin", "upload-error", uploadValidationError);
  }

  const folder = sanitizeFolder(String(formData.get("folder") || ""));
  const safeName = `${Date.now()}-${sanitizeFilename(file.name)}`;
  const path = folder
    ? `public/uploads/portfolio/${folder}/${safeName}`
    : `public/uploads/portfolio/${safeName}`;

  let result: Awaited<ReturnType<typeof publishFiles>>;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    result = await publishFiles([{ path, content: buffer }], `feat: upload asset ${safeName}`);
    applyRevalidation(getSiteRevalidationTargets());
  } catch (error) {
    redirectWithStatus(
      "/admin",
      "upload-error",
      error instanceof Error ? error.message : "Unknown error",
    );
  }

  redirectWithStatus("/admin", result.mode === "dry-run" ? "upload-dry-run" : "asset-uploaded", path);
}
