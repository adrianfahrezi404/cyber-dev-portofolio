'use client';

import { useEffect, useRef, useState } from 'react';

/* ───────────────────────── Types ───────────────────────── */
export interface ProjectItemData {
  id: string;
  title: string;
  summary: string;
  techStack: string[];
  gradient: string;
  githubUrl?: string;
  demoUrl?: string;
  thumbnailUrl?: string;
  category?: string;
}

/* ───────────────────────── Sample Data ───────────────────────── */
const SAMPLE_PROJECTS: ProjectItemData[] = [
  {
    id: 'forensic-recovery',
    title: 'Forensic Document Recovery System',
    summary:
      'Advanced digital forensics tool for recovering deleted and corrupted documents from disk images, with automated evidence chain tracking and report generation.',
    techStack: ['Python', 'Forensics', 'Sleuth Kit'],
    gradient: 'from-purple-500 via-pink-500 to-cyan-400',
    githubUrl: 'https://github.com/adrianfahrezi404/forensic-recovery',
    demoUrl: '#',
  },
  {
    id: 'perpustakaan-digital',
    title: 'Web Perpustakaan Digital',
    summary:
      'Full-stack digital library management system with role-based access control, book cataloging, borrowing workflows, and integrated barcode scanning.',
    techStack: ['Laravel', 'MySQL', 'Bootstrap'],
    gradient: 'from-cyan-400 via-blue-500 to-purple-500',
    githubUrl: 'https://github.com/adrianfahrezi404/perpustakaan-digital',
    demoUrl: '#',
  },
  {
    id: 'vuln-scanner',
    title: 'Vulnerability Scanner CLI',
    summary:
      'Command-line vulnerability scanner integrating Nmap service detection with CVE database lookups and automated CVSS scoring for quick security assessments.',
    techStack: ['Python', 'Nmap', 'Security'],
    gradient: 'from-pink-500 via-red-500 to-orange-400',
    githubUrl: 'https://github.com/adrianfahrezi404/vuln-scanner',
    demoUrl: '#',
  },
  {
    id: 'portfolio-cyberdev',
    title: 'Portfolio CYBER.DEV',
    summary:
      'This cyberpunk-themed portfolio built with Next.js App Router, featuring glassmorphism design, CMS-powered content, and animated scroll-driven UI.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    gradient: 'from-cyan-400 via-purple-500 to-pink-500',
    githubUrl: 'https://github.com/adrianfahrezi404/cyber-dev',
    demoUrl: 'https://cyber.dev',
  },
];

interface ProjectShowcaseProps {
  data?: ProjectItemData[];
}

export default function ProjectShowcase({ data }: ProjectShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const projects = data !== undefined ? data : SAMPLE_PROJECTS;

  /* Intersection Observer for reveal animation */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.05 }
    );

    const targets = el.querySelectorAll('.fade-in-up');
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [projects]);

  return (
    <div ref={containerRef} className="w-full">
      {/* ── Project Grid ── */}
      {projects.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/5 bg-white/[0.01] rounded-xl">
          <p className="text-xs text-text-muted italic font-mono">No projects published yet.</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {projects.map((item, idx) => (
          <article
            key={item.id}
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] fade-in-up group glass-card overflow-hidden transition-all duration-700 opacity-0 translate-y-12 flex flex-col"
            style={{ transitionDelay: `${idx * 80}ms` }}
          >
            {/* Thumbnail image / placeholder (16:9 aspect, not cropped) */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-secondary flex items-center justify-center border-b border-border-glass group/thumb">
              {item.thumbnailUrl ? (
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover/thumb:scale-105"
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-85`} />
              )}
              
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.06)_2px,rgba(0,0,0,0.06)_4px)] pointer-events-none" />
              {/* Grid pattern */}
              <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
              
              {/* Center icon (only when no image and not hovered) */}
              {!item.thumbnailUrl && (
                <div className="absolute inset-0 flex items-center justify-center group-hover/thumb:opacity-0 transition-opacity duration-300">
                  <span className="font-mono text-5xl font-bold text-white/30 select-none">
                    {"{ }"}
                  </span>
                </div>
              )}

              {/* Hover Actions Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
                {item.githubUrl && item.githubUrl !== '#' && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-slate-900/90 text-white flex items-center justify-center border border-white/10 hover:bg-slate-800 hover:scale-110 transition-all duration-300"
                    title="GitHub Repository"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
                {item.demoUrl && item.demoUrl !== '#' && (
                  <a
                    href={item.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-slate-900/90 text-white flex items-center justify-center border border-white/10 hover:bg-slate-800 hover:scale-110 transition-all duration-300"
                    title="Live Demo"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
              {/* Badge */}
              <span
                className="mb-3 w-fit rounded-full px-3 py-0.5 font-mono text-[10px] font-semibold tracking-wider bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 uppercase"
              >
                {item.category || "PROJECT"}
              </span>

              <h3 className="mb-2 font-[family-name:var(--font-jetbrains)] text-lg font-semibold text-text-primary transition-colors duration-300">
                {item.title}
              </h3>

              <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-text-secondary flex-grow">
                {item.summary}
              </p>

              {/* Tech stack badges */}
              <div className="mb-5 flex flex-wrap gap-2">
                {item.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border-glass bg-bg-tertiary/60 px-2.5 py-0.5 font-mono text-[11px] text-text-muted transition-colors duration-200 group-hover:text-text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>


            </div>
          </article>
        ))}
      </div>
      )}
    </div>
  );
}
