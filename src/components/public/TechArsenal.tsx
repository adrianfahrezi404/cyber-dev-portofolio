'use client';

import { useEffect, useRef, useState } from 'react';

/* ───────────────────────── Types ───────────────────────── */
export interface TechItemData {
  name: string;
  experienceYears?: number | null;
  experienceMonths?: number | null;
  iconUrl?: string | null;
}

export interface TechCategoryData {
  id: string;
  label: string;
  experience: string;
  color: 'purple' | 'cyan' | 'pink' | 'green' | 'blue';
  items: TechItemData[];
}

/* ───────────────────────── Color Maps ───────────────────────── */
const COLOR_MAP: Record<
  TechCategoryData['color'],
  {
    heading: string;
    badge: string;
    glow: string;
    border: string;
    iconBg: string;
    text: string;
  }
> = {
  purple: {
    heading: 'text-accent-purple',
    badge: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]',
    border: 'group-hover:border-accent-purple/40',
    iconBg: 'bg-accent-purple/5 border-accent-purple/15 text-accent-purple',
    text: 'text-accent-purple',
  },
  cyan: {
    heading: 'text-accent-cyan',
    badge: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(0,240,255,0.35)]',
    border: 'group-hover:border-accent-cyan/40',
    iconBg: 'bg-accent-cyan/5 border-accent-cyan/15 text-accent-cyan',
    text: 'text-accent-cyan',
  },
  pink: {
    heading: 'text-accent-pink',
    badge: 'bg-accent-pink/10 text-accent-pink border-accent-pink/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(236,72,153,0.35)]',
    border: 'group-hover:border-accent-pink/40',
    iconBg: 'bg-accent-pink/5 border-accent-pink/15 text-accent-pink',
    text: 'text-accent-pink',
  },
  green: {
    heading: 'text-accent-green',
    badge: 'bg-accent-green/10 text-accent-green border-accent-green/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(34,197,94,0.35)]',
    border: 'group-hover:border-accent-green/40',
    iconBg: 'bg-accent-green/5 border-accent-green/15 text-accent-green',
    text: 'text-accent-green',
  },
  blue: {
    heading: 'text-[#3b82f6]',
    badge: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]',
    border: 'group-hover:border-[#3b82f6]/40',
    iconBg: 'bg-[#3b82f6]/5 border-[#3b82f6]/15 text-[#3b82f6]',
    text: 'text-[#3b82f6]',
  },
};

/* ───────────────────────── Static Sample Data ───────────────────────── */
const SAMPLE_TECH_CATEGORIES: TechCategoryData[] = [
  {
    id: 'red-team',
    label: 'Red Team & Offensive Security',
    experience: '3+ Years',
    color: 'purple',
    items: [
      { name: 'Kali Linux' },
      { name: 'Burp Suite' },
      { name: 'Metasploit' },
      { name: 'Wireshark' },
      { name: 'Nmap' },
      { name: 'OWASP Top 10' },
      { name: 'Bash Script' },
      { name: 'Python Security' },
    ],
  },
  {
    id: 'web-dev',
    label: 'Web Development',
    experience: '3+ Years',
    color: 'cyan',
    items: [
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'Laravel' },
      { name: 'Node.js' },
      { name: 'TypeScript' },
      { name: 'PostgreSQL' },
      { name: 'Tailwind CSS' },
      { name: 'Express.js' },
    ],
  },
  {
    id: 'ai-data',
    label: 'AI & Data Science',
    experience: '2+ Years',
    color: 'pink',
    items: [
      { name: 'Python' },
      { name: 'TensorFlow' },
      { name: 'scikit-learn' },
      { name: 'MATLAB' },
      { name: 'Jupyter' },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps & Tools',
    experience: '2+ Years',
    color: 'green',
    items: [
      { name: 'Docker' },
      { name: 'Git' },
      { name: 'Linux' },
      { name: 'Nginx' },
      { name: 'Vercel' },
    ],
  },
  {
    id: 'blue-team',
    label: 'Blue Team & Defensive Security',
    experience: '2+ Years',
    color: 'blue',
    items: [
      { name: 'Incident Response' },
      { name: 'Splunk' },
      { name: 'Snort' },
      { name: 'Wireshark (Defensive)' },
      { name: 'SIEM' },
      { name: 'Firewalls' },
    ],
  },
];

interface TechArsenalProps {
  data?: TechCategoryData[];
}

export default function TechArsenal({ data }: TechArsenalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const categories = data !== undefined ? data : SAMPLE_TECH_CATEGORIES;
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    new Set()
  );

  /* Per-category stagger */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    categoryRefs.current.forEach((el, id) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCategories((prev) => new Set(prev).add(id));
            obs.unobserve(el);
          }
        },
        { threshold: 0.05 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  return (
    <div ref={containerRef} className="w-full">
      {/* ── Category Groups ── */}
      {categories.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/5 bg-white/[0.01] rounded-xl">
          <p className="text-xs text-text-muted italic font-mono">No tech arsenal items populated.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((category) => {
            const colors = COLOR_MAP[category.color];
          const catVisible = visibleCategories.has(category.id);

          return (
            <div
              key={category.id}
              ref={(el) => {
                if (el) categoryRefs.current.set(category.id, el);
              }}
              className="w-full"
            >
              {/* Category Header */}
              <div
                className={`mb-6 flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-4 transition-all duration-600 ${
                  catVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
                }`}
              >
                <h3
                  className={`font-[family-name:var(--font-jetbrains)] text-base font-semibold ${colors.heading}`}
                >
                  {category.label}
                </h3>
                <span
                  className={`rounded-full border px-3 py-0.5 font-mono text-[10px] font-semibold tracking-wider ${colors.badge}`}
                >
                  {category.experience}
                </span>
              </div>

              {/* Tech Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {category.items.map((tech, idx) => {
                  const techInitial = tech.name.charAt(0).toUpperCase();

                  return (
                    <div
                      key={tech.name}
                      className={`group glass-card flex flex-col items-center gap-3 rounded-xl border border-border-glass p-4 transition-all duration-500 ${colors.glow} ${colors.border} hover:scale-[1.04] ${
                        catVisible
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-6 opacity-0'
                      }`}
                      style={{
                        transitionDelay: catVisible
                          ? `${idx * 50}ms`
                          : '0ms',
                      }}
                    >
                      {/* Icon */}
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg border transition-all duration-300 overflow-hidden ${colors.iconBg}`}
                      >
                        {tech.iconUrl ? (
                          <img src={tech.iconUrl} alt={tech.name} className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-xl font-bold font-mono">{techInitial}</span>
                        )}
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-center font-mono text-xs font-medium text-text-secondary transition-colors duration-300 group-hover:text-text-primary">
                          {tech.name}
                        </span>
                        {((tech.experienceYears ?? 0) > 0 || (tech.experienceMonths ?? 0) > 0) && (
                          <span className={`text-[9px] font-mono mt-1 px-2 py-0.5 rounded-full border ${colors.badge} bg-transparent`}>
                            {(tech.experienceYears ?? 0) > 0 ? `${tech.experienceYears}y ` : ''}
                            {(tech.experienceMonths ?? 0) > 0 ? `${tech.experienceMonths}m` : ((tech.experienceYears ?? 0) === 0 ? '0m' : '')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
