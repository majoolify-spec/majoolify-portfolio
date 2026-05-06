import { access } from "node:fs/promises";
import { join } from "node:path";
import type { CaseStudyMeta } from "./schemas";

const CASE_STUDIES_ROOT = join(process.cwd(), "content", "case-studies");
const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

const ALLOWED_UPLOAD_EXTENSIONS = new Set([
  "avif",
  "gif",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "webp",
]);

const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
]);

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sanitizeFolder(value: string) {
  return value
    .replace(/\\/g, "/")
    .split("/")
    .map((segment) => slugify(segment))
    .filter(Boolean)
    .join("/");
}

export function sanitizeFilename(value: string) {
  const parts = value.split(".");
  const extension = parts.length > 1 ? parts.pop() : "";
  const name = slugify(parts.join(".") || "asset");
  return extension ? `${name}.${extension.toLowerCase()}` : name;
}

export async function caseStudyExists(slug: string) {
  try {
    await access(join(CASE_STUDIES_ROOT, slug, "meta.json"));
    return true;
  } catch {
    return false;
  }
}

export function getDefaultCaseStudyMeta(slug: string): CaseStudyMeta {
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

export function getUploadValidationError(file: File) {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return "File is too large. Maximum allowed size is 10MB.";
  }

  if (file.type && !ALLOWED_UPLOAD_MIME_TYPES.has(file.type.toLowerCase())) {
    return "Unsupported file type. Allowed: SVG, PNG, JPG, WEBP, AVIF, GIF.";
  }

  const extension = sanitizeFilename(file.name).split(".").pop()?.toLowerCase();
  if (!extension || !ALLOWED_UPLOAD_EXTENSIONS.has(extension)) {
    return "Unsupported file extension. Allowed: .svg, .png, .jpg, .jpeg, .webp, .avif, .gif.";
  }

  return null;
}
