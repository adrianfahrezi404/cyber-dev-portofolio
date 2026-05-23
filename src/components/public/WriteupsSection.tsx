'use client';

import { useEffect, useRef, useState } from 'react';

/* ───────────────────────── Types ───────────────────────── */
export interface WriteupItemData {
  id: string;
  title: string;
  summary: string;
  techStack: string[];
  gradient: string;
  detailUrl: string;
  githubUrl?: string;
  category: string;
}

/* ───────────────────────── Sample Data ───────────────────────── */
const SAMPLE_WRITEUPS: WriteupItemData[] = [
  {
    id: 'htb-keeper',
    title: 'HackTheBox — Machine Writeup: Keeper',
    summary:
      'In-depth walkthrough of the Keeper machine covering initial enumeration, default credential exploitation, KeePass memory dump analysis (CVE-2023-32784), and privilege escalation.',
    techStack: ['Linux', 'CVE Analysis', 'KeePass'],
    gradient: 'from-green-400 via-emerald-500 to-cyan-400',
    detailUrl: '/writeups/htb-keeper',
    githubUrl: 'https://github.com/adrianfahrezi404/cybersecurity-writeups',
    category: 'Security',
  },
  {
    id: 'thm-bof',
    title: 'TryHackMe — Buffer Overflow Guide',
    summary:
      'Comprehensive guide covering stack-based buffer overflow exploitation, from fuzzing and offset identification through to shellcode generation and ASLR bypass techniques.',
    techStack: ['Binary Exploitation', 'GDB', 'x86 ASM'],
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    detailUrl: '/writeups/thm-bof',
    githubUrl: 'https://github.com/adrianfahrezi404/cybersecurity-writeups',
    category: 'Security',
  },
  {
    id: 'devlog-ai-waf',
    title: 'DevLog — Building an AI-Powered WAF CLI',
    summary:
      'Step-by-step process of designing and building a machine-learning-based Web Application Firewall command line utility, detailing regex optimizations, dataset training, and real-time packet interception.',
    techStack: ['Python', 'Machine Learning', 'Network Security'],
    gradient: 'from-purple-500 via-pink-500 to-accent-cyan',
    detailUrl: '/writeups/devlog-ai-waf',
    githubUrl: 'https://github.com/adrianfahrezi404/cyber-dev',
    category: 'DevLog',
  },
];

interface WriteupsSectionProps {
  data?: WriteupItemData[];
}

export default function WriteupsSection({ data }: WriteupsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const writeups = data && data.length > 0 ? data : SAMPLE_WRITEUPS;

  /* Intersection Observer for reveal animation */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [writeups]);

  return (
    <section
      id="writeups"
      ref={sectionRef}
      className="relative py-16 sm:py-24 overflow-hidden"
    >
      {/* ── Background Decoration ── */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Heading ── */}
        <div
          className={`mb-12 text-center transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="font-[family-name:var(--font-jetbrains)] text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="gradient-text">Write-ups</span>{' '}
            <span className="text-text-primary">&amp; DevLogs</span>
          </h2>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Walkthroughs of cybersecurity challenges, machine writeups, and project development logs detailing workflows, problem solving, and architectural decisions.
          </p>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent-cyan to-transparent" />
        </div>

        {/* ── Grid ── */}
        <div className="flex flex-wrap justify-center gap-6">
          {writeups.map((item, idx) => (
            <article
              key={item.id}
              className={`w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] fade-in-up group glass-card flex flex-col overflow-hidden transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${200 + idx * 80}ms` }}
            >
              {/* Card top banner */}
              <div
                className={`relative h-32 w-full overflow-hidden bg-gradient-to-br ${item.gradient} opacity-85 transition-transform duration-500 group-hover:scale-[1.02]`}
              >
                {/* Overlay patterns */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
                  }}
                />
                <div className="absolute inset-0 grid-pattern opacity-25" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-4xl font-bold text-white/20 select-none">
                    {item.category === 'Security' ? '> _' : 'log()'}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-5">
                {/* Category badge */}
                <span
                  className={`mb-3 w-fit rounded-full px-2.5 py-0.5 font-mono text-[9px] font-semibold tracking-wider bg-accent-pink/15 text-accent-pink border border-accent-pink/20`}
                >
                  {item.category.toUpperCase()}
                </span>

                <h3 className="mb-2 font-[family-name:var(--font-jetbrains)] text-base font-semibold text-text-primary transition-colors duration-300 group-hover:text-accent-cyan leading-snug">
                  {item.title}
                </h3>

                <p className="mb-4 line-clamp-3 text-xs sm:text-sm leading-relaxed text-text-secondary flex-grow">
                  {item.summary}
                </p>

                {/* Tech stack badges */}
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {item.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border-glass bg-bg-tertiary/60 px-2 py-0.5 font-mono text-[10px] text-text-muted transition-colors duration-200 group-hover:border-accent-cyan/20 group-hover:text-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="mt-auto flex gap-3">
                  <a
                    href={item.detailUrl}
                    className="btn-glow-cyan flex items-center gap-1.5 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5 px-3.5 py-1.5 font-mono text-[10px] sm:text-xs font-medium text-accent-cyan transition-all duration-300 hover:bg-accent-cyan/15"
                  >
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Read More
                  </a>
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-border-glass bg-bg-tertiary/40 px-3.5 py-1.5 font-mono text-[10px] sm:text-xs font-medium text-text-muted transition-all duration-300 hover:border-accent-purple/30 hover:text-accent-purple"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                      Source
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
