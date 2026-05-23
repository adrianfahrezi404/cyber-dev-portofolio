"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

const socialLinks = [
  {
    name: "GitHub",
    handle: "adrianfahrezi404",
    href: "https://github.com/adrianfahrezi404",
    color: "hover:border-slate-400/50 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]",
    icon: (
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    ),
  },
  {
    name: "LinkedIn",
    handle: "Adrian Dwi Fahrezi Rizki",
    href: "https://www.linkedin.com/in/adrian-dwi-fahrezi-rizki",
    color: "hover:border-[#0077b5]/50 hover:text-[#0077b5] hover:shadow-[0_0_15px_rgba(0,119,181,0.25)]",
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  {
    name: "Instagram",
    handle: "@y.yaan_",
    href: "https://www.instagram.com/y.yaan_",
    color: "hover:border-[#e1306c]/50 hover:text-[#e1306c] hover:shadow-[0_0_15px_rgba(225,48,108,0.25)]",
    icon: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    ),
  },
  {
    name: "TikTok",
    handle: "@y.yaan_",
    href: "https://www.tiktok.com/@y.yaan_",
    color: "hover:border-[#ff0050]/50 hover:text-[#00f2fe] hover:shadow-[0_0_15px_rgba(255,0,80,0.25)]",
    icon: (
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    ),
  },
  {
    name: "YouTube",
    handle: "@iyann_02",
    href: "https://youtube.com/@iyann_02",
    color: "hover:border-[#ff0000]/50 hover:text-[#ff0000] hover:shadow-[0_0_15px_rgba(255,0,0,0.25)]",
    icon: (
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    ),
  },
  {
    name: "Email",
    handle: "adriandwifahrezirizki@gmail.com",
    href: "mailto:adriandwifahrezirizki@gmail.com",
    color: "hover:border-accent-cyan hover:text-accent-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.25)]",
    icon: (
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
  },
];

const formatDate = (dateString: string) => {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "rate-limited"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );

    const els = sectionRef.current?.querySelectorAll(".fade-in-up");
    els?.forEach((el) => observer.observe(el));

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/contact");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.messages) {
            setComments(data.messages);
          }
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
    
    const interval = setInterval(fetchComments, 5000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const handlePinToggle = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !currentStatus }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, isPinned: !currentStatus } : c
          ).sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
        );
      }
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 429) {
        setStatus("rate-limited");
        setErrorMessage("Terlalu banyak permintaan. Coba lagi nanti.");
        return;
      }

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Gagal mengirim pesan.");
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });

      // Update comments dynamically
      if (data.comment) {
        setComments((prev) => [data.comment, ...prev].slice(0, 5));
      }

      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setErrorMessage("Koneksi gagal. Periksa jaringan Anda.");
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-16 px-6">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-mono font-bold">
            Contact <span className="gradient-text italic">Me</span>
          </h2>
          <p className="text-text-secondary mt-4 max-w-lg mx-auto">
            Membangun koneksi yang aman untuk kolaborasi atau pertanyaan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 fade-in-up">
          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2"
              >
                Identity Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your name"
                required
                minLength={2}
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/30 transition-all font-mono text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter your email address"
                required
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/30 transition-all font-mono text-sm"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Type your message here..."
                required
                minLength={10}
                rows={5}
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/30 transition-all font-mono text-sm resize-none"
              />
            </div>

            {/* Status messages */}
            {status === "success" && (
              <div className="flex items-center gap-2 text-accent-green text-sm font-mono px-4 py-3 bg-accent-green/10 border border-accent-green/20 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Transmisi berhasil! Pesan Anda telah diterima.
              </div>
            )}
            {(status === "error" || status === "rate-limited") && (
              <div className="flex items-center gap-2 text-red-400 text-sm font-mono px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3.5 bg-accent-green text-bg-primary font-semibold font-mono rounded-lg btn-glow-cyan transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={
                status !== "loading"
                  ? {
                      boxShadow:
                        "0 0 20px rgba(34,197,94,0.3), 0 0 40px rgba(34,197,94,0.1)",
                    }
                  : undefined
              }
            >
              {status === "loading" ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Transmitting...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Execute Transmission
                </>
              )}
            </button>
          </form>

          {/* Active Uplinks (Social Links) */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-accent-cyan/10 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-accent-cyan"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-mono font-bold text-accent-cyan">
                Active Uplinks
              </h3>
            </div>

            <p className="text-text-secondary text-sm mb-6">
              Terhubung langsung melalui jaringan sosial berikut. Pilih frekuensi
              komunikasi Anda.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className={`glass-card p-4 flex items-center gap-3 transition-all hover:scale-[1.02] ${link.color} group`}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 group-hover:text-inherit transition-all">
                    <svg
                      className="w-5 h-5 text-text-secondary group-hover:text-inherit transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {link.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono font-semibold text-sm text-text-primary group-hover:text-inherit transition-colors">
                      {link.name}
                    </p>
                    <p className="text-xs text-text-muted group-hover:text-inherit group-hover:opacity-80 transition-colors">
                      {link.handle}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Recent Transmissions (Comments) */}
            <div className="mt-8 border-t border-white/5 pt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-accent-purple/10 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-accent-purple"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-mono font-bold text-accent-purple">
                  Recent Transmissions
                </h3>
              </div>

              {commentsLoading ? (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-text-muted text-sm font-mono italic">
                  No transmissions received yet. Be the first!
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment, index) => (
                    <div
                      key={comment.id || index}
                      className="glass-card p-4 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-accent-purple/20 transition-all duration-300 rounded-lg flex flex-col gap-2 animate-fade-in"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-accent-cyan">
                            {comment.name}
                          </span>
                          {comment.isPinned && (
                            <svg className="w-4 h-4 text-accent-purple" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-text-muted">
                            {formatDate(comment.createdAt)}
                          </span>
                          {session?.user && (
                            <button
                              onClick={() => handlePinToggle(comment.id, comment.isPinned)}
                              className="text-xs text-text-muted hover:text-accent-cyan transition-colors"
                              title={comment.isPinned ? "Unpin comment" : "Pin comment"}
                            >
                              {comment.isPinned ? "Unpin" : "Pin"}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed font-sans break-words whitespace-pre-wrap">
                        {comment.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
