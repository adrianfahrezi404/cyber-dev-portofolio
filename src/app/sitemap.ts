import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { projectsWriteups } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const revalidate = 3600; // Cache for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cyber.dev";

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  try {
    // Dynamic write-ups
    const writeups = await db
      .select({ slug: projectsWriteups.slug, updatedAt: projectsWriteups.updatedAt })
      .from(projectsWriteups)
      .where(eq(projectsWriteups.type, "WRITEUP"));

    const writeupRoutes = writeups.map((w) => ({
      url: `${baseUrl}/writeups/${w.slug}`,
      lastModified: w.updatedAt ? new Date(w.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...routes, ...writeupRoutes];
  } catch (error) {
    console.error("Failed to generate sitemap dynamically:", error);
    return routes;
  }
}
