// ===========================================
// CYBER.DEV Portfolio — GitHub Helpers
// Webhook verification & content fetching
// ===========================================

import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verify GitHub webhook signature (X-Hub-Signature-256)
 * Uses timing-safe comparison to prevent timing attacks
 */
export function verifyGitHubSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;

  const expectedSig =
    "sha256=" +
    createHmac("sha256", secret).update(payload).digest("hex");

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSig);

  if (sigBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(sigBuffer, expectedBuffer);
}

/**
 * Fetch raw Markdown content from a GitHub URL
 */
export async function fetchGitHubMarkdown(rawUrl: string): Promise<string> {
  // Ensure we're using the raw URL format
  const url = rawUrl
    .replace("github.com", "raw.githubusercontent.com")
    .replace("/blob/", "/");

  const response = await fetch(url, {
    headers: {
      Accept: "text/plain",
    },
    next: { revalidate: 0 }, // Always fetch fresh
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch GitHub content: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}

/**
 * Parse a GitHub push webhook payload to extract modified Markdown files
 */
export function extractModifiedMarkdownFiles(
  payload: Record<string, unknown>
): string[] {
  const commits = payload.commits as Array<{
    added: string[];
    modified: string[];
  }> | undefined;

  if (!commits) return [];

  const markdownFiles = new Set<string>();

  for (const commit of commits) {
    for (const file of [...(commit.added || []), ...(commit.modified || [])]) {
      if (file.endsWith(".md") || file.endsWith(".mdx")) {
        markdownFiles.add(file);
      }
    }
  }

  return Array.from(markdownFiles);
}

/**
 * Build a raw GitHub URL from repo info and file path
 */
export function buildRawGitHubUrl(
  repoFullName: string,
  branch: string,
  filePath: string
): string {
  return `https://raw.githubusercontent.com/${repoFullName}/${branch}/${filePath}`;
}
