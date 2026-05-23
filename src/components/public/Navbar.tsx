'use client';

import { useState, useEffect, useCallback } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Writeups', href: '#writeups' },
  { label: 'Contact', href: '#contact' },
] as const;

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for navbar background intensity
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver scroll-spy
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Smooth scroll handler
  const handleNav = useCallback(
    (href: string) => {
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileOpen(false);
    },
    [],
  );

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0e1a]/90 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,240,255,0.06)]'
            : 'bg-[#0a0e1a]/60 backdrop-blur-md'
        } border-b border-white/5`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* ── Logo ── */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNav('#home');
              }}
              className="group flex items-center gap-0.5 font-mono text-xl font-bold tracking-tight select-none"
            >
              <span className="text-white transition-colors group-hover:text-slate-200">
                CYBER
              </span>
              <span className="text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] transition-all group-hover:drop-shadow-[0_0_14px_rgba(0,240,255,0.9)]">
                .DEV
              </span>
              {/* Tiny blinking cursor after logo */}
              <span className="typing-cursor ml-0.5 inline-block h-5 w-[2px] bg-[#00f0ff]" />
            </a>

            {/* ── Desktop nav links ── */}
            <ul className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = activeSection === href.slice(1);
                return (
                  <li key={href}>
                    <a
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNav(href);
                      }}
                      className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 rounded-md ${
                        isActive
                          ? 'text-[#00f0ff]'
                          : 'text-slate-400 hover:text-slate-100'
                      }`}
                    >
                      {label}

                      {/* Active underline indicator */}
                      <span
                        className={`absolute bottom-0.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#00f0ff] transition-all duration-300 ${
                          isActive
                            ? 'w-4/5 opacity-100 shadow-[0_0_6px_rgba(0,240,255,0.5)]'
                            : 'w-0 opacity-0'
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* ── Mobile hamburger button ── */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
              className="relative z-50 flex md:hidden h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:text-[#00f0ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff]/50"
            >
              <div className="flex h-5 w-6 flex-col justify-between">
                <span
                  className={`block h-[2px] rounded-full bg-current transition-all duration-300 origin-center ${
                    mobileOpen ? 'translate-y-[9px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`block h-[2px] rounded-full bg-current transition-all duration-200 ${
                    mobileOpen ? 'scale-x-0 opacity-0' : ''
                  }`}
                />
                <span
                  className={`block h-[2px] rounded-full bg-current transition-all duration-300 origin-center ${
                    mobileOpen ? '-translate-y-[9px] -rotate-45' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile slide-in overlay ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile slide-in panel ── */}
      <aside
        className={`fixed top-0 right-0 z-40 h-full w-72 bg-[#0a0e1a]/95 backdrop-blur-2xl border-l border-white/5 transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-2 pt-24 px-6">
          {NAV_LINKS.map(({ label, href }, i) => {
            const isActive = activeSection === href.slice(1);
            return (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(href);
                }}
                style={{ transitionDelay: mobileOpen ? `${i * 60}ms` : '0ms' }}
                className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-300 ${
                  mobileOpen
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-8 opacity-0'
                } ${
                  isActive
                    ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                }`}
              >
                {/* Decorative dot */}
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    isActive ? 'bg-[#00f0ff] shadow-[0_0_6px_rgba(0,240,255,0.6)]' : 'bg-slate-600 group-hover:bg-slate-400'
                  }`}
                />
                {label}
              </a>
            );
          })}

          {/* Mobile-only decorative line */}
          <div className="mt-6 section-divider" />
          <p className="mt-4 text-center text-xs text-slate-600 font-mono tracking-widest">
            CYBER.DEV v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
