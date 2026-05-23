'use client';

import { useState, useEffect, useRef } from 'react';
import ProjectShowcase, { ProjectItemData } from './ProjectShowcase';
import CertificateGallery, { CertificateData } from './CertificateGallery';
import TechArsenal, { TechCategoryData } from './TechArsenal';

interface PortfolioSectionProps {
  projects?: ProjectItemData[];
  certificates?: CertificateData[];
  techCategories?: TechCategoryData[];
}

type TabKey = 'projects' | 'certificates' | 'arsenal';

export default function PortfolioSection({
  projects,
  certificates,
  techCategories,
}: PortfolioSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('projects');
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
  }, []);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative py-16 sm:py-24 overflow-hidden"
    >
      {/* ── Background Decoration ── */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Heading ── */}
        <div
          className={`mb-12 text-center transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="font-[family-name:var(--font-jetbrains)] text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="gradient-text">Selected</span>{' '}
            <span className="text-text-primary">Portfolio</span>
          </h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent-cyan to-transparent" />
        </div>

        {/* ── Tab Switcher ── */}
        <div
          className={`mb-12 flex justify-center transition-all delay-200 duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="inline-flex flex-wrap sm:flex-nowrap gap-1 rounded-xl border border-border-glass bg-bg-card p-1.5 backdrop-blur-md">
            {[
              {
                key: 'projects' as TabKey,
                label: 'Selected Projects',
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
              },
              {
                key: 'certificates' as TabKey,
                label: 'Certifications',
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
              },
              {
                key: 'arsenal' as TabKey,
                label: 'Tech Arsenal',
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs sm:text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'text-text-muted hover:text-text-secondary border border-transparent'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active Tab Component ── */}
        <div className="transition-all duration-500">
          {activeTab === 'projects' && <ProjectShowcase data={projects} />}
          {activeTab === 'certificates' && <CertificateGallery data={certificates} />}
          {activeTab === 'arsenal' && <TechArsenal data={techCategories} />}
        </div>
      </div>
    </section>
  );
}
