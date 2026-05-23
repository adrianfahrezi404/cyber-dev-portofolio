'use client';

import { useEffect, useRef, useState } from 'react';

/* ─── Types ─── */
type Category = 'All' | 'Work' | 'Competition' | 'Achievement';

interface TimelineItem {
  id: number;
  title: string;
  company: string;
  date: string;
  description: string;
  category: Exclude<Category, 'All'>;
}

/* ─── Sample Data ─── */
const TIMELINE_DATA: TimelineItem[] = [
  {
    id: 1,
    title: 'IT Intern',
    company: 'Bank BTPN Syariah',
    date: 'Jan 2025 — Apr 2025',
    description:
      'Contributed to the internal IT infrastructure team, assisting with network security monitoring, system troubleshooting, and automation scripts for daily operational tasks.',
    category: 'Work',
  },
  {
    id: 2,
    title: 'OverTheWire Bandit — Level 34',
    company: 'OverTheWire Wargames',
    date: 'Nov 2024',
    description:
      'Completed all 34 levels of the Bandit wargame, mastering Linux CLI, SSH tunneling, privilege escalation, and scripting challenges in a CTF-style environment.',
    category: 'Achievement',
  },
  {
    id: 3,
    title: 'CTF Competition Winner',
    company: 'CyberJawara National CTF',
    date: 'Oct 2024',
    description:
      'Secured top placement in the CyberJawara Capture The Flag competition, solving challenges across web exploitation, cryptography, forensics, and reverse engineering.',
    category: 'Competition',
  },
  {
    id: 4,
    title: 'Web Developer — Freelance',
    company: 'Self-Employed',
    date: '2024 — Present',
    description:
      'Designing and developing modern, high-performance websites for clients using Next.js, Tailwind CSS, and headless CMS solutions with a focus on cybersecurity best practices.',
    category: 'Work',
  },
  {
    id: 5,
    title: 'Finalist — Hackathon UI',
    company: 'Universitas Indonesia',
    date: 'Mar 2025',
    description:
      'Reached the finals of the prestigious Universitas Indonesia Hackathon, building an AI-powered cybersecurity dashboard prototype within a 48-hour sprint.',
    category: 'Competition',
  },
];

/* ─── Filter Tabs Config ─── */
const TABS: { label: Category; color: string; activeClass: string }[] = [
  {
    label: 'All',
    color: 'text-[#00f0ff]',
    activeClass: 'bg-[#00f0ff]/15 border-[#00f0ff]/60 text-[#00f0ff] shadow-[0_0_14px_rgba(0,240,255,0.25)]',
  },
  {
    label: 'Work',
    color: 'text-[#a855f7]',
    activeClass: 'bg-[#a855f7]/15 border-[#a855f7]/60 text-[#a855f7] shadow-[0_0_14px_rgba(168,85,247,0.25)]',
  },
  {
    label: 'Competition',
    color: 'text-[#ec4899]',
    activeClass: 'bg-[#ec4899]/15 border-[#ec4899]/60 text-[#ec4899] shadow-[0_0_14px_rgba(236,72,153,0.25)]',
  },
  {
    label: 'Achievement',
    color: 'text-[#22c55e]',
    activeClass: 'bg-[#22c55e]/15 border-[#22c55e]/60 text-[#22c55e] shadow-[0_0_14px_rgba(34,197,94,0.25)]',
  },
];

/* ─── Category helpers ─── */
function categoryAccent(cat: TimelineItem['category']) {
  switch (cat) {
    case 'Work':
      return { dot: 'bg-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.6)]', text: 'text-[#a855f7]', border: 'border-[#a855f7]/30', glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]' };
    case 'Competition':
      return { dot: 'bg-[#ec4899] shadow-[0_0_12px_rgba(236,72,153,0.6)]', text: 'text-[#ec4899]', border: 'border-[#ec4899]/30', glow: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]' };
    case 'Achievement':
      return { dot: 'bg-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.6)]', text: 'text-[#22c55e]', border: 'border-[#22c55e]/30', glow: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]' };
  }
}

function categoryIcon(cat: TimelineItem['category']) {
  switch (cat) {
    case 'Work':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      );
    case 'Competition':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 22V8a4 4 0 0 0-4-4H6v13a2 2 0 0 0 2 2h4Z" />
          <path d="M14 22V8a4 4 0 0 1 4-4h4v13a2 2 0 0 1-2 2h-6Z" />
        </svg>
      );
    case 'Achievement':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
  }
}

interface TimelineSectionProps {
  data?: TimelineItem[];
}

/* ─── Component ─── */
export default function TimelineSection({ data }: TimelineSectionProps) {
  const [activeTab, setActiveTab] = useState<Category>('All');
  const sectionRef = useRef<HTMLElement>(null);
  const timelineItems = data !== undefined ? data : TIMELINE_DATA;

  /* Scroll-reveal using IntersectionObserver */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = section.querySelectorAll('.fade-in-up');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeTab, timelineItems]);

  const filtered =
    activeTab === 'All'
      ? timelineItems
      : timelineItems.filter((item) => item.category === activeTab);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* ── Heading ── */}
        <div className="text-center mb-14 fade-in-up">
          <h2 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100">
            Experience &amp;{' '}
            <span className="gradient-text">Achievements</span>
          </h2>
          <div className="glow-line w-24 mx-auto mt-5" />
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 fade-in-up">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`
                  px-5 py-2 rounded-full text-sm font-mono border transition-all duration-300 cursor-pointer
                  ${
                    isActive
                      ? tab.activeClass
                      : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200 bg-white/[0.03]'
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Timeline ── */}
        <div className="relative">
          {/* Center line (desktop) / Left line (mobile) */}
          {filtered.length > 0 && <div className="timeline-line" aria-hidden="true" />}

          <div className="space-y-12 md:space-y-16">
            {filtered.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/5 bg-white/[0.01] rounded-xl fade-in-up">
                <p className="text-xs text-text-muted italic font-mono">No experiences found for this category.</p>
              </div>
            ) : (
              filtered.map((item, idx) => {
                const accent = categoryAccent(item.category);
              const isLeft = idx % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`
                    fade-in-up relative flex flex-col
                    md:flex-row md:items-start
                    ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}
                  `}
                  style={{ transitionDelay: `${idx * 120}ms` }}
                >
                  {/* Card side */}
                  <div
                    className={`
                      ml-12 md:ml-0 md:w-[calc(50%-28px)]
                      ${isLeft ? 'md:pr-4' : 'md:pl-4'}
                    `}
                  >
                    <article
                      className={`
                        glass-card p-5 sm:p-6 transition-all duration-300
                        ${accent.glow} hover:border-white/15 group
                      `}
                    >
                      {/* Icon + Category badge */}
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 ${accent.text}`}
                        >
                          {categoryIcon(item.category)}
                        </span>
                        <span
                          className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${accent.border} ${accent.text} bg-white/[0.03]`}
                        >
                          {item.category}
                        </span>
                      </div>

                      {/* Title & company */}
                      <h3 className="font-mono text-lg font-semibold text-slate-100 group-hover:text-white transition-colors">
                        {item.title}
                      </h3>
                      <p className={`text-sm font-medium mt-0.5 ${accent.text}`}>
                        {item.company}
                      </p>

                      {/* Date */}
                      <p className="text-xs font-mono text-slate-500 mt-1.5">
                        {item.date}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-slate-400 leading-relaxed mt-3">
                        {item.description}
                      </p>
                    </article>
                  </div>

                  {/* Dot — center on desktop, left on mobile */}
                  <div
                    className={`
                      absolute top-3
                      left-[14px] md:left-1/2
                      -translate-x-1/2
                    `}
                  >
                    <div className={`timeline-dot !bg-current ${accent.text}`}>
                      <span className={`block w-3.5 h-3.5 rounded-full ${accent.dot}`} />
                    </div>
                  </div>

                  {/* Empty spacer for opposite side on desktop */}
                  <div className="hidden md:block md:w-[calc(50%-28px)]" />
                </div>
              );
            })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
