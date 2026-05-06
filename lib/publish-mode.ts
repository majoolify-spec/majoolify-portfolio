export type PublishMode = "github" | "local" | "dry-run";

function hasEnv(name: string) {
  return Boolean(process.env[name]?.trim());
}

export function getPublishMode(): PublishMode {
  if (process.env.ADMIN_PUBLISH_DRY_RUN === "1") {
    return "dry-run";
  }

  if (hasEnv("GITHUB_CONTENTS_TOKEN") && hasEnv("GITHUB_REPO_OWNER") && hasEnv("GITHUB_REPO_NAME")) {
    return "github";
  }

  return "local";
}

export function getPublishStatusLabel() {
  const mode = getPublishMode();

  if (mode === "github") {
    return `GitHub -> ${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}@${process.env.GITHUB_REPO_BRANCH || "main"}`;
  }

  if (mode === "dry-run") {
    return "Dry run validation mode";
  }

  return "Local filesystem fallback";
}
