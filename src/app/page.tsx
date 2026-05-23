import Navbar from "@/components/public/Navbar";
import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import TimelineSection from "@/components/public/TimelineSection";
import PortfolioSection from "@/components/public/PortfolioSection";
import WriteupsSection, { WriteupItemData } from "@/components/public/WriteupsSection";
import ContactForm from "@/components/public/ContactForm";
import Footer from "@/components/public/Footer";

import { db } from "@/lib/db";
import { projectsWriteups, certificates, experiences, itemTechnologies, technologies, siteStats } from "@/lib/db/schema";
import { count, eq, desc } from "drizzle-orm";
import { ProjectItemData } from "@/components/public/ProjectShowcase";
import { CertificateData } from "@/components/public/CertificateGallery";
import { TechCategoryData } from "@/components/public/TechArsenal";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching to ensure fresh DB counts

export default async function HomePage() {
  let projectsCount = 0;
  let certsCount = 0;
  let ctfsCount = 0;
  let yearsExp = 3; // Default 3 years
  let monthsExp = 0; // Default 0 months

  // 1. Fetch Stats Counts
  try {
    const [projectsResult] = await db
      .select({ value: count() })
      .from(projectsWriteups)
      .where(eq(projectsWriteups.type, "PROJECT"));
    projectsCount = projectsResult?.value ?? 0;

    const [certsResult] = await db
      .select({ value: count() })
      .from(certificates);
    certsCount = certsResult?.value ?? 0;

    const [ctfsResult] = await db
      .select({ value: count() })
      .from(experiences)
      .where(eq(experiences.type, "COMPETITION"));
    ctfsCount = ctfsResult?.value ?? 0;
  } catch (error) {
    console.error("Failed to fetch statistics from database:", error);
  }

  // 1.5 Fetch Manual Overrides
  try {
    const [statsOverride] = await db.select().from(siteStats).limit(1);
    if (statsOverride) {
      if (statsOverride.manualProjectsCount !== null) projectsCount = statsOverride.manualProjectsCount;
      if (statsOverride.manualCertsCount !== null) certsCount = statsOverride.manualCertsCount;
      if (statsOverride.manualCtfsCount !== null) ctfsCount = statsOverride.manualCtfsCount;
      if (statsOverride.manualYearsExp !== null) yearsExp = statsOverride.manualYearsExp;
      if (statsOverride.manualMonthsExp !== null) monthsExp = statsOverride.manualMonthsExp;
    }
  } catch (error) {
    console.error("Failed to fetch manual stats:", error);
  }

  const stats = {
    projectsCount,
    certsCount,
    ctfsCount,
    yearsExp,
    monthsExp,
  };

  // 2. Fetch Projects Data dynamically
  let projectsData: ProjectItemData[] = [];
  try {
    const projectsList = await db
      .select({
        id: projectsWriteups.id,
        title: projectsWriteups.title,
        summary: projectsWriteups.summary,
        thumbnailUrl: projectsWriteups.thumbnailUrl,
        githubUrl: projectsWriteups.githubSyncUrl,
        demoUrl: projectsWriteups.demoUrl,
        featured: projectsWriteups.featured,
        category: projectsWriteups.category,
      })
      .from(projectsWriteups)
      .where(eq(projectsWriteups.type, "PROJECT"))
      .orderBy(desc(projectsWriteups.publishedAt));

    for (const proj of projectsList) {
      const techList = await db
        .select({ name: technologies.name })
        .from(itemTechnologies)
        .leftJoin(technologies, eq(itemTechnologies.techId, technologies.id))
        .where(eq(itemTechnologies.itemId, proj.id));

      projectsData.push({
        id: proj.id.toString(),
        title: proj.title,
        summary: proj.summary ?? "",
        techStack: techList.map((t) => t.name).filter(Boolean) as string[],
        gradient: proj.featured
          ? "from-cyan-400 via-purple-500 to-pink-500"
          : "from-purple-500 via-pink-500 to-cyan-400",
        githubUrl: proj.githubUrl ?? undefined,
        demoUrl: proj.demoUrl ?? undefined,
        thumbnailUrl: proj.thumbnailUrl ?? undefined,
        category: proj.category ?? undefined,
      });
    }
  } catch (err) {
    console.error("Failed to fetch projects from DB:", err);
  }

  // 3. Fetch Certificates Data dynamically
  let certificatesData: CertificateData[] = [];
  try {
    const certsList = await db
      .select()
      .from(certificates)
      .orderBy(desc(certificates.issueDate));

    certificatesData = certsList.map((c) => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      date: c.issueDate ? new Date(c.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
      verifyUrl: c.credentialUrl ?? "#",
      imageUrl: c.imageUrl ?? undefined,
      category: c.category ?? undefined,
    }));
  } catch (err) {
    console.error("Failed to fetch certificates from DB:", err);
  }

  // 4. Fetch Technologies Data dynamically (grouped by category)
  let techCategoriesData: TechCategoryData[] = [];
  try {
    const techList = await db.select().from(technologies);

    const categoriesMap: Record<string, { label: string; color: "purple" | "cyan" | "pink" | "green" | "blue"; items: { name: string; experienceYears?: number | null; experienceMonths?: number | null; iconUrl?: string | null }[] }> = {
      RED_TEAM: { label: "Red Team & Offensive Security", color: "purple", items: [] },
      BLUE_TEAM: { label: "Blue Team & Defensive Security", color: "blue", items: [] },
      WEB_DEV: { label: "Web Development", color: "cyan", items: [] },
      AI_DATA: { label: "AI & Data Science", color: "pink", items: [] },
      DEVOPS: { label: "DevOps & Tools", color: "green", items: [] },
      LANGUAGE: { label: "Languages & Frameworks", color: "blue", items: [] },
      OTHER: { label: "Other Technologies", color: "blue", items: [] },
    };

    for (const tech of techList) {
      const cat = tech.category || "OTHER";
      if (categoriesMap[cat]) {
        categoriesMap[cat].items.push({ name: tech.name, experienceYears: tech.experienceYears, experienceMonths: tech.experienceMonths, iconUrl: tech.iconUrl });
      } else {
        categoriesMap.OTHER.items.push({ name: tech.name, experienceYears: tech.experienceYears, experienceMonths: tech.experienceMonths, iconUrl: tech.iconUrl });
      }
    }

    techCategoriesData = Object.entries(categoriesMap)
      .filter(([_, data]) => data.items.length > 0)
      .map(([key, data]) => {
        // compute max experience in category to show as badge
        const maxExp = Math.max(...data.items.map(i => i.experienceYears || 0), 0);
        const expLabel = maxExp > 0 ? `${maxExp}+ Years` : (key === "RED_TEAM" || key === "WEB_DEV" ? "3+ Years" : "2+ Years");
        
        return {
          id: key.toLowerCase().replace("_", "-"),
          label: data.label,
          experience: expLabel,
          color: data.color,
          items: data.items,
        };
      });
  } catch (err) {
    console.error("Failed to fetch technologies from DB:", err);
  }

  // 5. Fetch Writeups Data dynamically
  let writeupsData: WriteupItemData[] = [];
  try {
    const writeupsList = await db
      .select({
        id: projectsWriteups.id,
        title: projectsWriteups.title,
        summary: projectsWriteups.summary,
        thumbnailUrl: projectsWriteups.thumbnailUrl,
        slug: projectsWriteups.slug,
        githubUrl: projectsWriteups.githubSyncUrl,
        featured: projectsWriteups.featured,
        category: projectsWriteups.category,
      })
      .from(projectsWriteups)
      .where(eq(projectsWriteups.type, "WRITEUP"))
      .orderBy(desc(projectsWriteups.publishedAt));

    for (const w of writeupsList) {
      const techList = await db
        .select({ name: technologies.name })
        .from(itemTechnologies)
        .leftJoin(technologies, eq(itemTechnologies.techId, technologies.id))
        .where(eq(itemTechnologies.itemId, w.id));

      writeupsData.push({
        id: w.id.toString(),
        title: w.title,
        summary: w.summary ?? "",
        techStack: techList.map((t) => t.name).filter(Boolean) as string[],
        gradient: w.featured
          ? "from-purple-500 via-pink-500 to-accent-cyan"
          : "from-green-400 via-emerald-500 to-cyan-400",
        detailUrl: `/writeups/${w.slug}`,
        githubUrl: w.githubUrl ?? undefined,
        thumbnailUrl: w.thumbnailUrl ?? undefined,
        category: w.category ?? "Security",
      });
    }
  } catch (err) {
    console.error("Failed to fetch writeups from DB:", err);
  }

  // 6. Fetch Experiences Data dynamically
  let experiencesData: any[] = [];
  try {
    const list = await db
      .select()
      .from(experiences)
      .orderBy(desc(experiences.startDate));

    experiencesData = list.map((e) => {
      const startStr = e.startDate ? new Date(e.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
      const endStr = e.endDate ? new Date(e.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present";
      
      let cat: "Work" | "Competition" | "Achievement" = "Work";
      if (e.type === "COMPETITION") cat = "Competition";
      if (e.type === "ACHIEVEMENT") cat = "Achievement";

      return {
        id: e.id,
        title: e.title,
        company: e.companyOrEvent,
        date: `${startStr} — ${endStr}`,
        description: e.description ?? "",
        category: cat,
      };
    });
  } catch (err) {
    console.error("Failed to fetch experiences from DB:", err);
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        <div className="section-divider" />
        <AboutSection stats={stats} />

        <div className="section-divider" />
        <TimelineSection data={experiencesData} />

        <div className="section-divider" />
        <PortfolioSection 
          projects={projectsData} 
          certificates={certificatesData} 
          techCategories={techCategoriesData} 
        />

        <div className="section-divider" />
        <WriteupsSection data={writeupsData} />

        <div className="section-divider" />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
