import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { getPublishMode } from "./publish-mode";

export type PublishEntry = {
  path: string;
  content: string | Buffer;
};

const GITHUB_API_BASE = "https://api.github.com";
const CONTENT_ROOT = join(process.cwd(), "content");
const UPLOADS_ROOT = join(process.cwd(), "public", "uploads", "portfolio");

function getGitHubHeaders() {
  const token = process.env.GITHUB_CONTENTS_TOKEN;

  if (!token) {
    throw new Error("Missing GITHUB_CONTENTS_TOKEN");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function getRepoPath(pathname: string) {
  return pathname.replaceAll("\\", "/").replace(/^\/+/, "");
}

function toBase64(content: string | Buffer) {
  return Buffer.isBuffer(content)
    ? content.toString("base64")
    : Buffer.from(content, "utf8").toString("base64");
}

export function buildGitHubPutBody(input: {
  message: string;
  content: string | Buffer;
  sha?: string;
}) {
  return {
    message: input.message,
    content: toBase64(input.content),
    branch: process.env.GITHUB_REPO_BRANCH || "main",
    ...(input.sha ? { sha: input.sha } : {}),
  };
}

async function getExistingSha(pathname: string) {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!owner || !repo) {
    throw new Error("Missing GitHub repository configuration");
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${getRepoPath(pathname)}?ref=${process.env.GITHUB_REPO_BRANCH || "main"}`,
    {
      headers: getGitHubHeaders(),
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`Failed to read existing GitHub file (${response.status})`);
  }

  const body = (await response.json()) as { sha?: string };
  return body.sha;
}

async function publishToGitHub(entries: PublishEntry[], message: string) {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!owner || !repo) {
    throw new Error("Missing GitHub repository configuration");
  }

  for (const entry of entries) {
    const sha = await getExistingSha(entry.path);
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${getRepoPath(entry.path)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getGitHubHeaders(),
        },
        body: JSON.stringify(
          buildGitHubPutBody({
            message,
            content: entry.content,
            sha,
          }),
        ),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub publish failed for ${entry.path}: ${response.status} ${errorText}`);
    }
  }
}

async function publishToLocal(entries: PublishEntry[]) {
  for (const entry of entries) {
    const normalizedPath = entry.path.replaceAll("\\", "/").replace(/^\/+/, "");
    let absolutePath: string;

    if (normalizedPath.startsWith("content/")) {
      absolutePath = join(CONTENT_ROOT, normalizedPath.slice("content/".length));
    } else if (normalizedPath.startsWith("public/uploads/portfolio/")) {
      absolutePath = join(
        UPLOADS_ROOT,
        normalizedPath.slice("public/uploads/portfolio/".length),
      );
    } else {
      throw new Error(`Unsupported local publish path: ${entry.path}`);
    }

    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, entry.content);
  }
}

export async function publishFiles(entries: PublishEntry[], message: string) {
  const mode = getPublishMode();

  if (mode === "dry-run") {
    return { mode, count: entries.length };
  }

  if (mode === "github") {
    await publishToGitHub(entries, message);
    return { mode, count: entries.length };
  }

  await publishToLocal(entries);
  return { mode, count: entries.length };
}
