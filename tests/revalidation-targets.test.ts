import { describe, expect, it } from "vitest";
import {
  getCaseStudyRevalidationTargets,
  getHomeRevalidationTargets,
  getSiteRevalidationTargets,
} from "../lib/revalidate-targets";

describe("revalidation targets", () => {
  it("returns site-wide tags and paths", () => {
    const targets = getSiteRevalidationTargets();

    expect(targets.tags).toContain("site");
    expect(targets.paths).toContain("/en");
    expect(targets.paths).toContain("/fr");
  });

  it("returns locale-specific home targets", () => {
    const targets = getHomeRevalidationTargets("fr");

    expect(targets.tags).toEqual(["site", "home:fr"]);
    expect(targets.paths).toContain("/fr");
  });

  it("returns bilingual case-study invalidation coverage", () => {
    const targets = getCaseStudyRevalidationTargets("dynamic-prompt-studio");

    expect(targets.tags).toContain("case-study:dynamic-prompt-studio:en");
    expect(targets.tags).toContain("case-study:dynamic-prompt-studio:fr");
    expect(targets.paths).toContain("/en/work/dynamic-prompt-studio");
    expect(targets.paths).toContain("/fr/work/dynamic-prompt-studio");
  });
});
