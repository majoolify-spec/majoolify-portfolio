import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { caseStudyMetaSchema, homeContentSchema, siteSettingsSchema } from "../lib/schemas";

async function readJson(pathname: string) {
  const raw = await readFile(resolve(process.cwd(), pathname), "utf8");
  return JSON.parse(raw);
}

describe("content loading", () => {
  it("parses shared site settings and both locale home files", async () => {
    const site = siteSettingsSchema.parse(await readJson("content/site.json"));
    const homeEn = homeContentSchema.parse(await readJson("content/locales/en/home.json"));
    const homeFr = homeContentSchema.parse(await readJson("content/locales/fr/home.json"));

    expect(site.brand.name).toBe("Majoolify");
    expect(homeEn.hero.title).toContain("Beautiful software products");
    expect(homeFr.hero.title).toContain("Des produits logiciels");
  });

  it("parses all case study directories and validates required files", async () => {
    const caseStudiesRoot = resolve(process.cwd(), "content", "case-studies");
    const entries = await readdir(caseStudiesRoot, { withFileTypes: true });
    const slugs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

    const studies = await Promise.all(
      slugs.map(async (slug) => {
        const basePath = join("content", "case-studies", slug);
        const value = await readJson(`${basePath}/meta.json`);
        await readFile(resolve(process.cwd(), `${basePath}/en.mdx`), "utf8");
        await readFile(resolve(process.cwd(), `${basePath}/fr.mdx`), "utf8");
        return caseStudyMetaSchema.parse(value);
      }),
    );

    expect(slugs.length).toBeGreaterThan(0);
    expect(studies).toHaveLength(slugs.length);
    expect(studies.every((study) => slugs.includes(study.slug))).toBe(true);
    expect(studies.some((study) => study.privacy === "redacted")).toBe(true);
  });
});
