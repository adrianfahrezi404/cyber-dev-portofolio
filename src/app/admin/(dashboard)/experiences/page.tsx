"use client";

import { useState, useEffect } from "react";

interface Experience {
  id: number;
  title: string;
  companyOrEvent: string;
  description: string | null;
  type: "WORK" | "COMPETITION" | "ACHIEVEMENT";
  startDate: string;
  endDate: string | null;
}

export default function ExperiencesAdminPage() {
  const [exps, setExps] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [id, setId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [companyOrEvent, setCompanyOrEvent] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"WORK" | "COMPETITION" | "ACHIEVEMENT">("WORK");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);

  // UI Control
  const [formOpen, setFormOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchExps = async () => {
    try {
      const res = await fetch("/api/experiences");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setExps(data.experiences);
        }
      }
    } catch (err) {
      console.error("Failed to load experiences:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExps();
  }, []);

  const resetForm = () => {
    setId(null);
    setTitle("");
    setCompanyOrEvent("");
    setDescription("");
    setType("WORK");
    setStartDate("");
    setEndDate("");
    setIsCurrent(false);
    setError("");
    setSuccess("");
    setFormOpen(false);
  };

  const handleEdit = (exp: Experience) => {
    setId(exp.id);
    setTitle(exp.title);
    setCompanyOrEvent(exp.companyOrEvent);
    setDescription(exp.description || "");
    setType(exp.type);
    setStartDate(exp.startDate ? exp.startDate.split("T")[0] : "");
    if (exp.endDate) {
      setEndDate(exp.endDate.split("T")[0]);
      setIsCurrent(false);
    } else {
      setEndDate("");
      setIsCurrent(true);
    }
    setError("");
    setSuccess("");
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      id,
      title,
      companyOrEvent,
      description: description || null,
      type,
      startDate,
      endDate: isCurrent ? null : endDate || null,
    };

    try {
      const method = id ? "PUT" : "POST";
      const res = await fetch("/api/experiences", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save experience.");
        return;
      }

      setSuccess(`Experience ${id ? "updated" : "created"} successfully!`);
      fetchExps();
      setTimeout(resetForm, 1000);
    } catch (err) {
      setError("Network connection error.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (deleteId: number) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;

    try {
      const res = await fetch(`/api/experiences?id=${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete.");
        return;
      }

      fetchExps();
    } catch (err) {
      alert("Network error deleting experience.");
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Experiences &amp; Timeline</h1>
          <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">
            Manage internship, job history, and competition achievements
          </p>
        </div>
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="px-4 py-2 bg-accent-cyan text-bg-primary text-xs font-bold rounded-lg btn-glow-cyan transition-all"
          >
            + Add Experience
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs">
          {success}
        </div>
      )}

      {/* Editor Panel */}
      {formOpen && (
        <div className="glass-card p-6 border border-white/5 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold uppercase text-accent-cyan">
              {id ? "Edit Experience" : "New Experience"}
            </h3>
            <button onClick={resetForm} className="text-text-muted hover:text-white text-xs">
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Role / Title / Rank</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. IT Intern, 1st Winner"
                required
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Company / Event */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Company / Event Name</label>
              <input
                type="text"
                value={companyOrEvent}
                onChange={(e) => setCompanyOrEvent(e.target.value)}
                placeholder="e.g. Bank BTPN Syariah, CyberJawara"
                required
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Category Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              >
                <option value="WORK">Professional Work / Intern</option>
                <option value="COMPETITION">CTF / Competition</option>
                <option value="ACHIEVEMENT">Achievement / Milestone</option>
              </select>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <label className="block text-xs text-text-muted uppercase font-mono">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-text-muted uppercase font-mono">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isCurrent}
                  className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none disabled:opacity-30"
                />
              </div>
            </div>

            {/* Checkbox Ongoing */}
            <div className="flex items-center gap-3">
              <input
                id="checkbox-current"
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-bg-secondary text-accent-cyan focus:ring-accent-cyan/30"
              />
              <label htmlFor="checkbox-current" className="text-xs text-slate-300 font-bold uppercase select-none">
                Ongoing / Present Role
              </label>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs text-text-muted uppercase">Description / Details</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain key responsibilities, achievements, or wargame solved challenges..."
                rows={4}
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end gap-3 border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-text-secondary rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2 bg-accent-cyan text-bg-primary font-bold text-xs rounded-lg btn-glow-cyan disabled:opacity-50"
              >
                {actionLoading ? "SAVING..." : id ? "UPDATE" : "SAVE"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
        </div>
      ) : exps.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
          <p className="text-xs text-text-muted italic">No experience entries found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {exps.map((exp) => (
            <div
              key={exp.id}
              className="glass-card p-5 border border-white/5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-accent-cyan/20 transition-all duration-300"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-sm text-slate-100">{exp.title}</h4>
                  <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-text-muted uppercase font-bold">
                    {exp.type}
                  </span>
                </div>
                <p className="text-xs text-accent-cyan">{exp.companyOrEvent}</p>
                <p className="text-[10px] text-text-muted font-sans line-clamp-1 mt-1">
                  {exp.description || "No description provided."}
                </p>
              </div>

              <div className="flex flex-col md:items-end gap-2 shrink-0">
                <span className="text-[10px] text-text-muted">
                  {exp.startDate ? exp.startDate.split("T")[0] : ""} to {exp.endDate ? exp.endDate.split("T")[0] : "Present"}
                </span>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="text-[10px] text-accent-cyan hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-[10px] text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
