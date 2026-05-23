import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectsWriteups, technologies, itemTechnologies } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

// Helper to categorize technologies automatically
function getAutomaticCategory(techName: string): { category: string; label: string; color: string } {
  const name = techName.toLowerCase();
  
  // 1. Blue Team / Defensive Security (Blue)
  const blueKeywords = ["splunk", "snort", "siem", "firewall", "incident response", "wazuh", "suricata", "defensive", "blue team", "blue-team", "wireshark (defensive)"];
  if (blueKeywords.some(k => name.includes(k))) {
    return { category: "BLUE_TEAM", label: "Blue Team & Defensive Security", color: "blue" };
  }

  // 2. Red Team / Offensive Security (Purple)
  const redKeywords = ["kali", "metasploit", "nmap", "burp", "penetration", "offensive", "exploit", "owasp", "hacking", "forensic", "sleuth", "wargame", "bandit", "ctf", "red team", "red-team"];
  if (redKeywords.some(k => name.includes(k))) {
    return { category: "RED_TEAM", label: "Red Team & Offensive Security", color: "purple" };
  }

  // 3. AI & Data Science (Pink)
  const aiKeywords = ["tensor", "pytorch", "keras", "scikit", "machine learning", "deep learning", "ai", "artificial intelligence", "data science", "numpy", "pandas", "jupyter", "matlab", "python"];
  if (aiKeywords.some(k => name.includes(k))) {
    return { category: "AI_DATA", label: "AI & Data Science", color: "pink" };
  }

  // 4. DevOps & Tools (Green)
  const devopsKeywords = ["docker", "kubernetes", "nginx", "vercel", "git", "github", "aws", "gcp", "azure", "ci/cd", "actions", "linux", "bash", "deploy"];
  if (devopsKeywords.some(k => name.includes(k))) {
    return { category: "DEVOPS", label: "DevOps & Tools", color: "green" };
  }

  // 5. Web Development (Cyan)
  const webKeywords = ["react", "next.js", "laravel", "vue", "tailwind", "mysql", "postgres", "bootstrap", "css", "html", "javascript", "typescript", "php", "node", "express", "mongo", "prisma", "drizzle", "subabase"];
  if (webKeywords.some(k => name.includes(k))) {
    return { category: "WEB_DEV", label: "Web Development", color: "cyan" };
  }

  // Default fallback (Language/Other -> Blue)
  return { category: "OTHER", label: "Languages & Frameworks", color: "blue" };
}

// ── GET: Fetch all projects or writeups (Public) ──
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // PROJECT | WRITEUP | ALL
    
    let query = db.select().from(projectsWriteups);
    
    if (type && type !== "ALL") {
      query = db.select().from(projectsWriteups).where(eq(projectsWriteups.type, type)) as any;
    }
    
    const items = await query.orderBy(desc(projectsWriteups.publishedAt));

    // Join with tech stacks
    const itemsWithTech = [];
    for (const item of items) {
      const techRows = await db
        .select({ name: technologies.name })
        .from(itemTechnologies)
        .leftJoin(technologies, eq(itemTechnologies.techId, technologies.id))
        .where(eq(itemTechnologies.itemId, item.id));
      
      itemsWithTech.push({
        ...item,
        techStack: techRows.map(r => r.name).filter(Boolean),
      });
    }

    return NextResponse.json({ success: true, items: itemsWithTech });
  } catch (error) {
    console.error("GET content error:", error);
    return NextResponse.json({ error: "Failed to fetch content." }, { status: 500 });
  }
}

// ── POST: Create new project/writeup (Admin only) ──
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { type, category, title, summary, content, thumbnailUrl, githubSyncUrl, demoUrl, featured, techStack } = body;

    if (!type || !title || !content) {
      return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
    }

    const slug = slugify(title, { lower: true, strict: true });

    let parsedThumbnailUrl = thumbnailUrl || null;
    if (parsedThumbnailUrl && parsedThumbnailUrl.includes("github.com") && parsedThumbnailUrl.includes("/blob/")) {
      parsedThumbnailUrl = parsedThumbnailUrl.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
    }

    // 1. Insert item
    const [inserted] = await db
      .insert(projectsWriteups)
      .values({
        type,
        category: category || null,
        title,
        slug,
        summary: summary || null,
        content,
        thumbnailUrl: parsedThumbnailUrl,
        githubSyncUrl: githubSyncUrl || null,
        demoUrl: demoUrl || null,
        featured: !!featured,
      })
      .returning();

    // 2. Sync technology tags
    if (techStack && Array.isArray(techStack)) {
      for (const name of techStack) {
        const trimmedName = name.trim();
        if (!trimmedName) continue;

        // Find or create technology
        let techRecord = await db
          .select()
          .from(technologies)
          .where(eq(technologies.name, trimmedName))
          .limit(1)
          .then(rows => rows[0]);

        if (!techRecord) {
          const autoCat = getAutomaticCategory(trimmedName);
          [techRecord] = await db
            .insert(technologies)
            .values({
              name: trimmedName,
              category: autoCat.category,
            })
            .returning();
        }

        // Link item to tech
        await db
          .insert(itemTechnologies)
          .values({
            itemId: inserted.id,
            techId: techRecord.id,
          })
          .onConflictDoNothing();
      }
    }

    revalidatePath("/");
    return NextResponse.json({ success: true, item: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST content error:", error);
    return NextResponse.json({ error: "Failed to create content." }, { status: 500 });
  }
}

// ── PUT: Update existing project/writeup (Admin only) ──
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { id, type, category, title, summary, content, thumbnailUrl, githubSyncUrl, demoUrl, featured, techStack } = body;

    if (!id || !type || !title || !content) {
      return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
    }

    const slug = slugify(title, { lower: true, strict: true });

    let parsedThumbnailUrl = thumbnailUrl || null;
    if (parsedThumbnailUrl && parsedThumbnailUrl.includes("github.com") && parsedThumbnailUrl.includes("/blob/")) {
      parsedThumbnailUrl = parsedThumbnailUrl.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
    }

    // 1. Update item
    const [updated] = await db
      .update(projectsWriteups)
      .set({
        type,
        category: category || null,
        title,
        slug,
        summary: summary || null,
        content,
        thumbnailUrl: parsedThumbnailUrl,
        githubSyncUrl: githubSyncUrl || null,
        demoUrl: demoUrl || null,
        featured: !!featured,
        updatedAt: new Date(),
      })
      .where(eq(projectsWriteups.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Item not found." }, { status: 444 });
    }

    // 2. Clear old links
    await db.delete(itemTechnologies).where(eq(itemTechnologies.itemId, id));

    // 3. Insert new technology links
    if (techStack && Array.isArray(techStack)) {
      for (const name of techStack) {
        const trimmedName = name.trim();
        if (!trimmedName) continue;

        // Find or create technology
        let techRecord = await db
          .select()
          .from(technologies)
          .where(eq(technologies.name, trimmedName))
          .limit(1)
          .then(rows => rows[0]);

        if (!techRecord) {
          const autoCat = getAutomaticCategory(trimmedName);
          [techRecord] = await db
            .insert(technologies)
            .values({
              name: trimmedName,
              category: autoCat.category,
            })
            .returning();
        }

        // Link item to tech
        await db
          .insert(itemTechnologies)
          .values({
            itemId: id,
            techId: techRecord.id,
          })
          .onConflictDoNothing();
      }
    }

    revalidatePath("/");
    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("PUT content error:", error);
    return NextResponse.json({ error: "Failed to update content." }, { status: 500 });
  }
}

// ── DELETE: Remove project/writeup (Admin only) ──
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");
    if (!idStr) {
      return NextResponse.json({ error: "ID required." }, { status: 400 });
    }

    const id = parseInt(idStr);
    const [deleted] = await db
      .delete(projectsWriteups)
      .where(eq(projectsWriteups.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Content not found." }, { status: 444 });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Content deleted successfully." });
  } catch (error) {
    console.error("DELETE content error:", error);
    return NextResponse.json({ error: "Failed to delete content." }, { status: 500 });
  }
}
