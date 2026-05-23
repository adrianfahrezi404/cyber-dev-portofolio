import { NextRequest, NextResponse } from "next/server";
import { verifyGitHubSignature, fetchGitHubMarkdown, extractModifiedMarkdownFiles, buildRawGitHubUrl } from "@/lib/github";
import { db } from "@/lib/db";
import { projectsWriteups, technologies, itemTechnologies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import slugify from "slugify";

// Helper to parse frontmatter
function parseFrontmatter(markdown: string): {
  frontmatter: Record<string, string>;
  content: string;
} {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: markdown };
  }

  const frontmatterBlock = match[1];
  const content = match[2];
  const frontmatter: Record<string, string> = {};

  frontmatterBlock.split("\n").forEach((line) => {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(":").trim();
      frontmatter[key] = value.replace(/^['"]|['"]$/g, ""); // Strip quotes
    }
  });

  return { frontmatter, content };
}

// Helper to categorize tech automatically
function getAutomaticCategory(techName: string): string {
  const name = techName.toLowerCase();
  if (["splunk", "snort", "siem", "firewall", "incident response", "wazuh", "suricata", "defensive", "blue team", "blue-team"].some(k => name.includes(k))) {
    return "BLUE_TEAM";
  }
  if (["kali", "metasploit", "nmap", "burp", "penetration", "offensive", "exploit", "owasp", "hacking", "forensic", "ctf"].some(k => name.includes(k))) {
    return "RED_TEAM";
  }
  if (["tensor", "pytorch", "keras", "scikit", "machine learning", "ai", "artificial intelligence", "data science", "python"].some(k => name.includes(k))) {
    return "AI_DATA";
  }
  if (["docker", "kubernetes", "nginx", "vercel", "git", "linux", "bash"].some(k => name.includes(k))) {
    return "DEVOPS";
  }
  if (["react", "next.js", "laravel", "vue", "tailwind", "mysql", "postgres", "html", "javascript", "typescript"].some(k => name.includes(k))) {
    return "WEB_DEV";
  }
  return "OTHER";
}

export async function POST(request: NextRequest) {
  try {
    const payloadText = await request.text();
    const signature = request.headers.get("x-hub-signature-256");
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!secret) {
      console.error("GITHUB_WEBHOOK_SECRET is not configured.");
      return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
    }

    // 1. Verify GitHub Signature (HMAC timing-safe check)
    if (!verifyGitHubSignature(payloadText, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    const payload = JSON.parse(payloadText);
    const repo = payload.repository;
    const ref = payload.ref; // e.g., "refs/heads/main"

    if (!repo || !ref) {
      return NextResponse.json({ message: "Not a push event or missing data." }, { status: 200 });
    }

    const branch = ref.replace("refs/heads/", "");
    const repoFullName = repo.full_name;

    // 2. Extract modified markdown files (.md / .mdx)
    const modifiedFiles = extractModifiedMarkdownFiles(payload);

    if (modifiedFiles.length === 0) {
      return NextResponse.json({ message: "No markdown files changed." }, { status: 200 });
    }

    const syncedFiles = [];

    // 3. Process each modified file
    for (const filePath of modifiedFiles) {
      const rawUrl = buildRawGitHubUrl(repoFullName, branch, filePath);

      try {
        // Fetch raw markdown content
        const markdown = await fetchGitHubMarkdown(rawUrl);
        const { frontmatter, content } = parseFrontmatter(markdown);

        const title = frontmatter.title || filePath.split("/").pop()?.replace(".md", "") || "Untitled";
        const summary = frontmatter.summary || null;
        const type = (frontmatter.type as "PROJECT" | "WRITEUP") || "WRITEUP";
        const demoUrl = frontmatter.demoUrl || null;
        const thumbnailUrl = frontmatter.thumbnailUrl || null;
        const featured = frontmatter.featured === "true";
        const slug = frontmatter.slug || slugify(title, { lower: true, strict: true });

        // Parse tech stack
        const techString = frontmatter.techStack || "";
        const techStack = techString.split(",").map(t => t.trim()).filter(Boolean);

        // Check if item exists in DB (by githubSyncUrl or slug)
        let item = await db
          .select()
          .from(projectsWriteups)
          .where(eq(projectsWriteups.githubSyncUrl, rawUrl))
          .limit(1)
          .then(rows => rows[0]);

        if (!item) {
          // Fallback check by slug
          item = await db
            .select()
            .from(projectsWriteups)
            .where(eq(projectsWriteups.slug, slug))
            .limit(1)
            .then(rows => rows[0]);
        }

        let itemId: number;

        if (item) {
          // Update existing
          const [updated] = await db
            .update(projectsWriteups)
            .set({
              title,
              slug,
              summary,
              content,
              thumbnailUrl: thumbnailUrl || item.thumbnailUrl,
              demoUrl: demoUrl || item.demoUrl,
              featured,
              githubSyncUrl: rawUrl,
              updatedAt: new Date(),
            })
            .where(eq(projectsWriteups.id, item.id))
            .returning();
          itemId = updated.id;
        } else {
          // Create new
          const [created] = await db
            .insert(projectsWriteups)
            .values({
              type,
              title,
              slug,
              summary,
              content,
              thumbnailUrl,
              demoUrl,
              featured,
              githubSyncUrl: rawUrl,
            })
            .returning();
          itemId = created.id;
        }

        // Sync technologies links
        await db.delete(itemTechnologies).where(eq(itemTechnologies.itemId, itemId));
        for (const techName of techStack) {
          let tech = await db
            .select()
            .from(technologies)
            .where(eq(technologies.name, techName))
            .limit(1)
            .then(rows => rows[0]);

          if (!tech) {
            const cat = getAutomaticCategory(techName);
            [tech] = await db
              .insert(technologies)
              .values({
                name: techName,
                category: cat,
              })
              .returning();
          }

          await db
            .insert(itemTechnologies)
            .values({
              itemId,
              techId: tech.id,
            })
            .onConflictDoNothing();
        }

        syncedFiles.push(filePath);
      } catch (err) {
        console.error(`Failed to sync file ${filePath}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${syncedFiles.length} file(s).`,
      syncedFiles,
    });
  } catch (error) {
    console.error("GitHub Webhook Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
