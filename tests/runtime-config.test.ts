import { afterEach, describe, expect, test } from "vitest";
import { getRuntimeConfigStatus } from "../lib/runtime-config";

const ORIGINAL_ENV = { ...process.env };

function resetEnv() {
  process.env = { ...ORIGINAL_ENV };
}

afterEach(() => {
  resetEnv();
});

describe("getRuntimeConfigStatus", () => {
  test("marks all systems ready with full configuration", () => {
    process.env.AUTH_SECRET = "secret";
    process.env.GITHUB_ID = "id";
    process.env.GITHUB_SECRET = "secret";
    process.env.GITHUB_ADMIN_USERS = "ahmedmajoul";
    process.env.GITHUB_CONTENTS_TOKEN = "token";
    process.env.GITHUB_REPO_OWNER = "owner";
    process.env.GITHUB_REPO_NAME = "repo";
    process.env.RESEND_API_KEY = "resend";
    process.env.CONTACT_FROM_EMAIL = "portfolio@majoolify.com";
    process.env.CONTACT_TO_EMAIL = "ahmed@majoolify.com";
    process.env.ADMIN_PUBLISH_DRY_RUN = "0";

    const status = getRuntimeConfigStatus();

    expect(status.auth.ready).toBe(true);
    expect(status.publish.ready).toBe(true);
    expect(status.publish.mode).toBe("github");
    expect(status.contact.ready).toBe(true);
  });

  test("treats publish mode as ready in dry-run even without github vars", () => {
    delete process.env.GITHUB_CONTENTS_TOKEN;
    delete process.env.GITHUB_REPO_OWNER;
    delete process.env.GITHUB_REPO_NAME;
    process.env.ADMIN_PUBLISH_DRY_RUN = "1";

    const status = getRuntimeConfigStatus();

    expect(status.publish.mode).toBe("dry-run");
    expect(status.publish.ready).toBe(true);
    expect(status.publish.missing).toEqual([]);
  });
});
