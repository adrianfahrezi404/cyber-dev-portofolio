import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { projectsWriteups, itemTechnologies, technologies } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import MarkdownRenderer from "@/components/public/MarkdownRenderer";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 0; // Fresh content

export default async function WriteupDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch writeup content by slug
  const writeup = await db
    .select()
    .from(projectsWriteups)
    .where(and(eq(projectsWriteups.slug, slug), eq(projectsWriteups.type, "WRITEUP")))
    .limit(1)
    .then((rows) => rows[0]);

  if (!writeup) {
    notFound();
  }

  // 2. Fetch associated tech stack
  const techList = await db
    .select({ name: technologies.name })
    .from(itemTechnologies)
    .leftJoin(technologies, eq(itemTechnologies.techId, technologies.id))
    .where(eq(itemTechnologies.itemId, writeup.id));

  const techStack = techList.map((t) => t.name).filter(Boolean) as string[];

  // Format Date
  const dateFormatted = writeup.publishedAt
    ? new Date(writeup.publishedAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <>
      <Navbar />
      <main className="min-h-screen relative py-24 sm:py-32 overflow-hidden bg-bg-primary text-text-primary">
        {/* Decorative background grid and glow */}
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-10" />
        <div className="pointer-events-none absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-accent-purple/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            href="/#writeups"
            className="inline-flex items-center gap-2 mb-8 font-mono text-xs text-accent-cyan hover:text-white transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            _BACK_TO_HOME
          </Link>

          {/* Article Header */}
          <header className="mb-10 border-b border-border-glass pb-8">
            <div className="flex flex-wrap gap-2 items-center mb-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
                {writeup.title.toLowerCase().includes("devlog") ? "DevLog" : "Security Write-up"}
              </span>
              {dateFormatted && (
                <span className="text-xs font-mono text-slate-500">{dateFormatted}</span>
              )}
            </div>

            <h1 className="font-[family-name:var(--font-jetbrains)] text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
              {writeup.title}
            </h1>

            {writeup.summary && (
              <p className="text-base text-slate-400 font-mono italic mb-6 leading-relaxed border-l-2 border-accent-cyan pl-4">
                {writeup.summary}
              </p>
            )}

            {/* Tech Stack Badges */}
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300"
                  >
                    #{tech}
                  </span>
                ))}
              </div>
            )}

            {/* Actions: GitHub sync link */}
            {writeup.githubSyncUrl && (
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href={writeup.githubSyncUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                  Source: GitHub Markdown Sync
                </a>
              </div>
            )}
          </header>

          {/* Article Content */}
          <article className="prose prose-invert max-w-none">
            <MarkdownRenderer content={writeup.content} />
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
