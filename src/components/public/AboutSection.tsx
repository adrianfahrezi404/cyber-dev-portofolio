"use client";

import { useEffect, useRef, useState } from "react";

const infoCards = [
  {
    icon: "🎓",
    title: "University",
    desc: "Jakarta Global University",
    color: "text-accent-cyan",
  },
  {
    icon: "🎯",
    title: "Cyber Security",
    desc: "Rali Linux, NMAP & Burp Suite",
    color: "text-accent-purple",
  },
  {
    icon: "💻",
    title: "Artificial Intelligence",
    desc: "Python",
    color: "text-accent-pink",
  },
  {
    icon: "🌐",
    title: "Web",
    desc: "React, Laravel & Neon",
    color: "text-accent-cyan",
  },
];

interface AboutSectionProps {
  stats?: {
    projectsCount: number;
    certsCount: number;
    ctfsCount: number;
    yearsExp: number;
    monthsExp: number;
  };
}

export default function AboutSection({ stats }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Calculate dynamic years of experience starting from 2024
  const autoYearsExp = Math.max(1, currentYear - 2024);
  const finalYearsExp = stats && stats.yearsExp !== undefined ? stats.yearsExp : autoYearsExp;
  const finalMonthsExp = stats && stats.monthsExp !== undefined ? stats.monthsExp : 0;

  // Dynamic values
  const projectsVal = stats && stats.projectsCount !== undefined ? `${stats.projectsCount}` : "3";
  const certsVal = stats && stats.certsCount !== undefined ? `${stats.certsCount}` : "3";
  const ctfsVal = stats && stats.ctfsCount !== undefined ? `${stats.ctfsCount}` : "5";
  
  let yearsVal = `${finalYearsExp}`;
  if (finalYearsExp > 0 || finalMonthsExp > 0) {
    yearsVal = `${finalYearsExp > 0 ? finalYearsExp + 'Y ' : ''}${finalMonthsExp > 0 ? finalMonthsExp + 'M' : ''}`.trim();
  } else if (finalYearsExp === 0 && finalMonthsExp === 0) {
    yearsVal = "0";
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    const fadeElements =
      sectionRef.current?.querySelectorAll(".fade-in-up");
    fadeElements?.forEach((el) => observer.observe(el));

    if (cardsRef.current) {
      observer.observe(cardsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-16 px-6 overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left - Text content */}
          <div className="flex-1">
            <h2 className="text-4xl sm:text-5xl font-mono font-bold mb-8 fade-in-up">
              About <span className="gradient-text italic">Me</span>
            </h2>

            <div className="space-y-5 fade-in-up">
              <p className="text-text-secondary text-lg leading-relaxed">
                Saya adalah mahasiswa{" "}
                <strong className="text-text-primary">Teknik Informatika</strong>{" "}
                di Jakarta Global University. Memiliki ketertarikan mendalam pada
                dunia{" "}
                <strong className="text-accent-cyan">Cyber Security</strong>,
                khususnya dalam aspek{" "}
                <em className="text-accent-purple">Red Teaming</em> dan{" "}
                <em className="text-accent-purple">Bug Bounty</em>.
              </p>

              <p className="text-text-secondary text-lg leading-relaxed">
                Bukan hanya membongkar celah keamanan, saya juga membangun solusi
                digital. Saya menggabungkan pemahaman jaringan dengan pengembangan
                web modern untuk menciptakan sistem yang aman dan efisien.
              </p>
            </div>

            {/* Info cards */}
            <div
              ref={cardsRef}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 stagger-children"
            >
              {infoCards.map((card) => (
                <div
                  key={card.title}
                  className="glass-card p-4 flex items-start gap-4 hover:border-white/15 transition-all group cursor-default"
                >
                  <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </span>
                  <div>
                    <h3 className="font-mono font-semibold text-text-primary text-sm">
                      {card.title}
                    </h3>
                    <p className={`text-sm ${card.color} opacity-80`}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Stats & Core Competencies */}
          <div className="flex-1 w-full fade-in-up">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { value: projectsVal, label: "PROJECTS" },
                { value: ctfsVal, label: "CTF SOLVED" },
                { value: certsVal, label: "CERTIFICATIONS" },
                { value: yearsVal, label: "EXPERIENCE" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="glass-card p-4 text-center border border-border-glass rounded-xl hover:border-accent-cyan/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all"
                >
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-accent-cyan">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-mono tracking-wider text-text-muted mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Core Competencies */}
            <div className="glass-card p-6 border border-border-glass rounded-2xl">
              <h3 className="font-mono text-sm font-semibold text-text-primary tracking-wider uppercase mb-5">
                Core Competencies
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: (
                      <svg
                        className="w-5 h-5 text-accent-purple"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    ),
                    title: "Red Teaming & Penetration Testing",
                    bg: "bg-accent-purple/10 border-accent-purple/20",
                  },
                  {
                    icon: (
                      <svg
                        className="w-5 h-5 text-accent-cyan"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    ),
                    title: "Fullstack Web Development",
                    bg: "bg-accent-cyan/10 border-accent-cyan/20",
                  },
                  {
                    icon: (
                      <svg
                        className="w-5 h-5 text-accent-pink"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    ),
                    title: "Artificial Intelligence",
                    bg: "bg-accent-pink/10 border-accent-pink/20",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border ${item.bg}`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-text-secondary">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-border-glass">
                {[
                  "Kali Linux",
                  "Burp Suite",
                  "Nmap",
                  "Python",
                  "Next.js",
                  "TypeScript",
                  "Laravel",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-[10px] font-mono text-text-muted bg-white/[0.03] border border-white/5 rounded-full hover:border-accent-cyan/20 hover:text-accent-cyan transition-all cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
