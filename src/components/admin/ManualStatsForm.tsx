"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManualStatsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [stats, setStats] = useState({
    manualProjectsCount: "",
    manualCertsCount: "",
    manualCtfsCount: "",
    manualYearsExp: "",
    manualMonthsExp: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats({
            manualProjectsCount: data.stats.manualProjectsCount?.toString() || "",
            manualCertsCount: data.stats.manualCertsCount?.toString() || "",
            manualCtfsCount: data.stats.manualCtfsCount?.toString() || "",
            manualYearsExp: data.stats.manualYearsExp?.toString() || "",
            manualMonthsExp: data.stats.manualMonthsExp?.toString() || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Manual stats updated successfully! The public profile is now showing these numbers.");
        router.refresh(); // Purge client router cache
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to save stats.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-xs text-text-muted animate-pulse">Loading stats configuration...</div>;
  }

  return (
    <div className="glass-card p-6 border border-white/5 space-y-6 mt-8">
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-accent-cyan">
          Public Profile Statistics (About Me)
        </h3>
        <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
          Override the automatically calculated statistics for the About Me section. Leave blank to auto-calculate.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="block text-xs text-text-muted uppercase">Projects Count</label>
          <input
            type="number"
            value={stats.manualProjectsCount}
            onChange={(e) => setStats({ ...stats, manualProjectsCount: e.target.value })}
            placeholder="Auto"
            className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-text-muted uppercase">Certifications Count</label>
          <input
            type="number"
            value={stats.manualCertsCount}
            onChange={(e) => setStats({ ...stats, manualCertsCount: e.target.value })}
            placeholder="Auto"
            className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-text-muted uppercase">CTFs Solved Count</label>
          <input
            type="number"
            value={stats.manualCtfsCount}
            onChange={(e) => setStats({ ...stats, manualCtfsCount: e.target.value })}
            placeholder="Auto"
            className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-text-muted uppercase">Years Experience</label>
          <input
            type="number"
            value={stats.manualYearsExp}
            onChange={(e) => setStats({ ...stats, manualYearsExp: e.target.value })}
            placeholder="Auto"
            className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-text-muted uppercase">Months Experience</label>
          <input
            type="number"
            value={stats.manualMonthsExp}
            onChange={(e) => setStats({ ...stats, manualMonthsExp: e.target.value })}
            placeholder="0"
            className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-4 flex justify-end mt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 transition-all"
          >
            {saving ? "Saving..." : "Save Overrides"}
          </button>
        </div>
      </form>
    </div>
  );
}
