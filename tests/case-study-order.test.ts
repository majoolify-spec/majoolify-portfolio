import { describe, expect, it } from "vitest";
import { filterVisibleCaseStudies, orderCaseStudies } from "../lib/case-study-order";
import type { CaseStudyMeta } from "../lib/schemas";

const studies: CaseStudyMeta[] = [
  {
    slug: "draft-one",
    status: "draft",
    privacy: "public",
    featured: true,
    year: 2022,
    clientLabel: "Draft",
    role: "Role",
    services: ["Service"],
    stack: ["Next.js"],
    previewMedia: [{ src: "/x.svg", alt: "x", width: 1, height: 1 }],
    gallery: [],
    title: { en: "Draft", fr: "Draft" },
    summary: { en: "Draft", fr: "Draft" },
    outcomes: [{ label: { en: "Outcome", fr: "Résultat" }, value: "x" }],
    publicLinks: {},
  },
  {
    slug: "public-new",
    status: "live",
    privacy: "public",
    featured: true,
    year: 2026,
    clientLabel: "Live",
    role: "Role",
    services: ["Service"],
    stack: ["Next.js"],
    previewMedia: [{ src: "/y.svg", alt: "y", width: 1, height: 1 }],
    gallery: [],
    title: { en: "Live", fr: "Live" },
    summary: { en: "Live", fr: "Live" },
    outcomes: [{ label: { en: "Outcome", fr: "Résultat" }, value: "x" }],
    publicLinks: {},
  },
  {
    slug: "public-old",
    status: "coming-soon",
    privacy: "redacted",
    featured: false,
    year: 2024,
    clientLabel: "Old",
    role: "Role",
    services: ["Service"],
    stack: ["Next.js"],
    previewMedia: [{ src: "/z.svg", alt: "z", width: 1, height: 1 }],
    gallery: [],
    title: { en: "Old", fr: "Old" },
    summary: { en: "Old", fr: "Old" },
    outcomes: [{ label: { en: "Outcome", fr: "Résultat" }, value: "x" }],
    publicLinks: {},
  },
];

describe("case study ordering", () => {
  it("orders featured studies first, then by year", () => {
    const ordered = orderCaseStudies(studies);

    expect(ordered.map((study) => study.slug)).toEqual([
      "public-new",
      "draft-one",
      "public-old",
    ]);
  });

  it("filters drafts from public lists", () => {
    const visible = filterVisibleCaseStudies(studies);

    expect(visible.map((study) => study.slug)).toEqual(["public-new", "public-old"]);
  });
});
