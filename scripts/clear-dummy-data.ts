import { db } from "../src/lib/db";
import { projectsWriteups, certificates, technologies, experiences, itemTechnologies } from "../src/lib/db/schema";

async function clearData() {
  console.log("Clearing dummy data...");
  try {
    // Truncate tables using raw query if using standard drizzle, or just delete all
    await db.delete(itemTechnologies);
    await db.delete(projectsWriteups);
    await db.delete(certificates);
    await db.delete(technologies);
    await db.delete(experiences);

    console.log("Inserting real project: Iron Man Game...");
    await db.insert(projectsWriteups).values({
      type: "PROJECT",
      title: "Iron Man Game",
      slug: "iron-man-game",
      summary: "Iron Man Game project for portfolio.",
      content: "Real project: Iron Man Game. Built by Adrian Fahrezi.",
      demoUrl: "https://iron-man-game.vercel.app/",
      githubSyncUrl: "https://github.com/adrianfahrezi404/IronManGame",
      featured: true,
      thumbnailUrl: null, // No image specified
    });

    console.log("Done!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to clear data:", error);
    process.exit(1);
  }
}

clearData();
