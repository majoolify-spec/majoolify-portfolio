export type ConfigAreaStatus = {
  ready: boolean;
  missing: string[];
};

export type RuntimeConfigStatus = {
  auth: ConfigAreaStatus;
  publish: ConfigAreaStatus & { mode: "github" | "local" | "dry-run" };
  contact: ConfigAreaStatus;
};

function hasEnv(name: string) {
  return Boolean(process.env[name]?.trim());
}

function collectMissing(keys: string[]) {
  return keys.filter((key) => !hasEnv(key));
}

function getPublishMode(): "github" | "local" | "dry-run" {
  if (process.env.ADMIN_PUBLISH_DRY_RUN === "1") {
    return "dry-run";
  }

  if (
    hasEnv("GITHUB_CONTENTS_TOKEN") &&
    hasEnv("GITHUB_REPO_OWNER") &&
    hasEnv("GITHUB_REPO_NAME")
  ) {
    return "github";
  }

  return "local";
}

export function getRuntimeConfigStatus(): RuntimeConfigStatus {
  const authMissing = collectMissing([
    "AUTH_SECRET",
    "GITHUB_ID",
    "GITHUB_SECRET",
    "GITHUB_ADMIN_USERS",
  ]);

  const publishMode = getPublishMode();
  const publishMissing = collectMissing([
    "GITHUB_CONTENTS_TOKEN",
    "GITHUB_REPO_OWNER",
    "GITHUB_REPO_NAME",
  ]);

  const contactMissing = collectMissing([
    "RESEND_API_KEY",
    "CONTACT_FROM_EMAIL",
    "CONTACT_TO_EMAIL",
  ]);

  return {
    auth: {
      ready: authMissing.length === 0,
      missing: authMissing,
    },
    publish: {
      ready: publishMode === "dry-run" || publishMissing.length === 0,
      missing: publishMode === "dry-run" ? [] : publishMissing,
      mode: publishMode,
    },
    contact: {
      ready: contactMissing.length === 0,
      missing: contactMissing,
    },
  };
}
