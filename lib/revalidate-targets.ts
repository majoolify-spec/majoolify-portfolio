export type RevalidationTargets = {
  tags: string[];
  paths: string[];
};

export function getSiteRevalidationTargets(): RevalidationTargets {
  return {
    tags: ["site", "case-study:index", "home:en", "home:fr"],
    paths: ["/en", "/fr", "/admin"],
  };
}

export function getHomeRevalidationTargets(locale: "en" | "fr"): RevalidationTargets {
  return {
    tags: ["site", `home:${locale}`],
    paths: [`/${locale}`, "/admin"],
  };
}

export function getCaseStudyRevalidationTargets(slug: string): RevalidationTargets {
  return {
    tags: [
      "site",
      "case-study:index",
      `case-study:${slug}:en`,
      `case-study:${slug}:fr`,
    ],
    paths: [
      "/en",
      "/fr",
      "/admin",
      `/admin/case-studies/${slug}`,
      `/en/work/${slug}`,
      `/fr/work/${slug}`,
    ],
  };
}
