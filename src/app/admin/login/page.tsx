"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Only used for registration
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if this is the first time setup
  useEffect(() => {
    const checkUsers = async () => {
      try {
        const res = await fetch("/api/admin/check-users");
        if (res.ok) {
          const data = await res.json();
          setIsFirstTime(data.count === 0);
        }
      } catch (err) {
        console.error("Failed to check admin users:", err);
      }
    };
    checkUsers();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email,
        password,
        name: name || "Admin",
      });

      if (authError) {
        setError(authError.message || "Failed to create account.");
        setLoading(false);
        return;
      }

      setSuccess("Admin account created successfully! Logging in...");
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (isFirstTime === null) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-slate-100 flex items-center justify-center font-mono">
        <div className="w-6 h-6 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden grid-pattern">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-card p-8 border border-white/5 relative z-10 shadow-[0_0_50px_rgba(0,240,255,0.05)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-mono font-bold tracking-wider">
            CYBER<span className="text-accent-cyan">.DEV</span>
          </h1>
          <p className="text-xs text-text-muted mt-2 uppercase tracking-widest">
            {isFirstTime ? "Initial Admin Setup" : "Control Panel Login"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs font-mono">
            {success}
          </div>
        )}

        {isFirstTime ? (
          /* REGISTRATION FORM (First time only) */
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2 font-mono">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adrian"
                required
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2 font-mono">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cyber.dev"
                required
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2 font-mono">
                Setup Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent-cyan text-bg-primary font-bold font-mono rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 btn-glow-cyan"
            >
              {loading ? "INITIALIZING SETUP..." : "CREATE ADMIN ACCOUNT"}
            </button>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2 font-mono">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@address.com"
                required
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2 font-mono">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent-cyan text-bg-primary font-bold font-mono rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 btn-glow-cyan"
            >
              {loading ? "AUTHENTICATING..." : "ACCESS CONTROL PANEL"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
