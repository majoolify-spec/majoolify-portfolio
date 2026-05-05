import { beforeEach, describe, expect, it } from "vitest";
import { buildGitHubPutBody } from "../lib/publisher";

describe("github publish payload", () => {
  beforeEach(() => {
    process.env.GITHUB_REPO_BRANCH = "main";
  });

  it("encodes UTF-8 content and includes branch", () => {
    const body = buildGitHubPutBody({
      message: "chore: update content",
      content: '{"hello":"world"}\n',
    });

    expect(body.message).toBe("chore: update content");
    expect(body.branch).toBe("main");
    expect(Buffer.from(body.content, "base64").toString("utf8")).toContain('"hello":"world"');
  });

  it("passes through sha when updating an existing file", () => {
    const body = buildGitHubPutBody({
      message: "chore: update content",
      content: "abc",
      sha: "known-sha",
    });

    expect(body.sha).toBe("known-sha");
  });
});
