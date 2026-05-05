import type { CaseStudyMeta } from "./schemas";

export function orderCaseStudies(studies: CaseStudyMeta[]) {
  return [...studies].sort((left, right) => {
    if (left.featured !== right.featured) {
      return Number(right.featured) - Number(left.featured);
    }

    return right.year - left.year;
  });
}

export function filterVisibleCaseStudies(studies: CaseStudyMeta[]) {
  return studies.filter((study) => study.status !== "draft");
}
