'use client';

import { useEffect, useRef } from 'react';

/* ─── Types ─── */
export interface CertificateData {
  id: number;
  title: string;
  issuer: string;
  date: string;
  verifyUrl: string;
  gradient?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  category?: string;
}

/* ─── Static Sample Data ─── */
const SAMPLE_CERTIFICATES: CertificateData[] = [
  {
    id: 1,
    title: 'Machine Learning untuk Pemula',
    issuer: 'Dicoding Indonesia',
    date: 'Sep 2024',
    verifyUrl: '#',
    gradient: 'from-[#a855f7]/40 via-[#ec4899]/30 to-[#00f0ff]/20',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#a855f7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4Z" />
        <circle cx="12" cy="14" r="2" />
        <path d="M12 16v2" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Belajar Dasar AI',
    issuer: 'Dicoding Indonesia',
    date: 'Aug 2024',
    verifyUrl: '#',
    gradient: 'from-[#00f0ff]/40 via-[#22c55e]/30 to-[#a855f7]/20',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#00f0ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'MikroTik MTCNA',
    issuer: 'ID-Networkers',
    date: 'Jan 2025',
    verifyUrl: '#',
    gradient: 'from-[#22c55e]/40 via-[#00f0ff]/30 to-[#ec4899]/20',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#22c55e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'CompTIA Security+',
    issuer: 'CompTIA',
    date: 'Mar 2025',
    verifyUrl: '#',
    gradient: 'from-[#ec4899]/40 via-[#a855f7]/30 to-[#00f0ff]/20',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#ec4899]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Belajar Membuat Aplikasi Web',
    issuer: 'Dicoding Indonesia',
    date: 'Jul 2024',
    verifyUrl: '#',
    gradient: 'from-[#facc15]/40 via-[#22c55e]/30 to-[#00f0ff]/20',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#facc15]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

interface CertificateGalleryProps {
  data?: CertificateData[];
}

export default function CertificateGallery({ data }: CertificateGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const certificates = data !== undefined ? data : SAMPLE_CERTIFICATES;

  /* Scroll-reveal with IntersectionObserver */
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
  }, [certificates]);

  // helper function to get fallback gradient
  const getGradient = (id: number) => {
    const gradients = [
      'from-[#a855f7]/40 via-[#ec4899]/30 to-[#00f0ff]/20',
      'from-[#00f0ff]/40 via-[#22c55e]/30 to-[#a855f7]/20',
      'from-[#22c55e]/40 via-[#00f0ff]/30 to-[#ec4899]/20',
      'from-[#ec4899]/40 via-[#a855f7]/30 to-[#00f0ff]/20',
      'from-[#facc15]/40 via-[#22c55e]/30 to-[#00f0ff]/20'
    ];
    return gradients[id % gradients.length];
  };

  // helper function to get fallback icon
  const getIcon = (id: number) => {
    // Return a generic certificate ribbon icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#00f0ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="11" r="3" />
        <path d="m9 14 3-3 3 3" />
      </svg>
    );
  };

  return (
    <div ref={containerRef} className="w-full">
      {/* ── Certificate Grid ── */}
      {certificates.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/5 bg-white/[0.01] rounded-xl">
          <p className="text-xs text-text-muted italic font-mono">No certificates verified yet.</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {certificates.map((cert, idx) => (
          <article
            key={cert.id}
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] fade-in-up group glass-card flex flex-col transition-all duration-300 hover:scale-[1.03] opacity-0 translate-y-8"
            style={{ transitionDelay: `${idx * 70}ms` }}
          >
            {/* Image / Gradient placeholder (16:9 aspect, not cropped) */}
            <div className="relative aspect-[16/9] w-full rounded-t-[var(--radius-md)] overflow-hidden bg-bg-secondary flex items-center justify-center border-b border-border-glass">
              {cert.imageUrl ? (
                <img
                  src={cert.imageUrl}
                  alt={cert.title}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${cert.gradient || getGradient(cert.id)} opacity-80`} />
              )}

              {/* Scanline overlay */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
                }}
                aria-hidden="true"
              />

              {/* Centered icon (fallback when no image) */}
              {!cert.imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    {cert.icon || getIcon(cert.id)}
                  </div>
                </div>
              )}

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
              
              {/* Category Badge */}
              {cert.category && (
                <span className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm border border-white/10 text-white/80 px-2 py-0.5 text-[8px] font-bold uppercase rounded">
                  {cert.category}
                </span>
              )}
            </div>

            {/* Card body */}
            <div className="flex flex-col flex-1 p-5 sm:p-6">
              <h3 className="font-mono text-base font-semibold text-slate-100 group-hover:text-white transition-colors leading-snug">
                {cert.title}
              </h3>

              <p className="text-sm text-[#00f0ff] font-medium mt-1.5">
                {cert.issuer}
              </p>

              <p className="text-xs font-mono text-slate-500 mt-1">
                {cert.date}
              </p>

              {/* Spacer */}
              <div className="flex-1 min-h-4" />

              {/* Verify button */}
              {cert.verifyUrl && cert.verifyUrl !== '#' && (
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-mono
                    border border-[#00f0ff]/30 text-[#00f0ff]
                    bg-[#00f0ff]/[0.06] hover:bg-white/10
                    transition-all duration-300
                    btn-glow-cyan w-fit
                  "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Verify
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      )}
    </div>
  );
}
