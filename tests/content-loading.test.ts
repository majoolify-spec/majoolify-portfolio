import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
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

  it("parses all case study metadata files", async () => {
    const slugs = [
      "ai-frontend-testing-platform",
      "dynamic-prompt-studio",
      "confidential-agency-dashboard",
    ];

    const studies = await Promise.all(
      slugs.map((slug) =>
        readJson(`content/case-studies/${slug}/meta.json`).then((value) =>
          caseStudyMetaSchema.parse(value),
        ),
      ),
    );

    expect(studies).toHaveLength(3);
    expect(studies.some((study) => study.privacy === "redacted")).toBe(true);
  });
});
