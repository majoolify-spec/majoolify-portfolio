import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Locale } from "./locale";

const CONTENT_ROOT = join(process.cwd(), "content");

export async function readSiteEditorFile() {
  return readFile(join(CONTENT_ROOT, "site.json"), "utf8");
}

export async function readHomeEditorFile(locale: Locale) {
  return readFile(join(CONTENT_ROOT, "locales", locale, "home.json"), "utf8");
}

export async function readCaseStudyEditorFile(
  slug: string,
  filename: "meta.json" | "en.mdx" | "fr.mdx",
) {
  return readFile(join(CONTENT_ROOT, "case-studies", slug, filename), "utf8");
}
