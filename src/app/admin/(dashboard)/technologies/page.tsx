"use client";

import { useState, useEffect } from "react";

interface Technology {
  id: number;
  name: string;
  iconUrl: string | null;
  category: string;
  experienceYears: number;
  experienceMonths: number;
}

export default function TechnologiesAdminPage() {
  const [techs, setTechs] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [experienceYears, setExperienceYears] = useState(0);
  const [experienceMonths, setExperienceMonths] = useState(0);
  
  // UI Controls
  const [formOpen, setFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTechs = async () => {
    try {
      const res = await fetch("/api/technologies");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTechs(data.technologies);
        }
      }
    } catch (err) {
      console.error("Failed to load technologies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechs();
  }, []);

  const resetForm = () => {
    setId(null);
    setName("");
    setIconUrl("");
    setCategory("OTHER");
    setExperienceYears(0);
    setExperienceMonths(0);
    setError("");
    setSuccess("");
    setFormOpen(false);
  };

  const handleEdit = (tech: Technology) => {
    setId(tech.id);
    setName(tech.name);
    setIconUrl(tech.iconUrl || "");
    setCategory(tech.category || "OTHER");
    setExperienceYears(tech.experienceYears || 0);
    setExperienceMonths(tech.experienceMonths || 0);
    setError("");
    setSuccess("");
    setFormOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "File upload failed.");
        return;
      }

      setIconUrl(data.url);
      setSuccess("File uploaded and secured successfully!");
    } catch (err) {
      setError("Network error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      id,
      name,
      iconUrl: iconUrl || null,
      category,
      experienceYears,
      experienceMonths,
    };

    try {
      const method = id ? "PUT" : "POST";
      const res = await fetch("/api/technologies", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save technology.");
        return;
      }

      setSuccess(`Technology ${id ? "updated" : "created"} successfully!`);
      fetchTechs();
      setTimeout(resetForm, 1000);
    } catch (err) {
      setError("Network connection error.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (deleteId: number) => {
    if (!confirm("Are you sure you want to delete this technology? This action is permanent!")) return;

    try {
      const res = await fetch(`/api/technologies?id=${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete.");
        return;
      }

      fetchTechs();
    } catch (err) {
      alert("Network error deleting technology.");
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Title Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Tech Arsenal</h1>
          <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">
            Manage your technology stack and experience
          </p>
        </div>
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="px-4 py-2 bg-accent-cyan text-bg-primary text-xs font-bold rounded-lg btn-glow-cyan transition-all"
          >
            + Add Technology
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

      {/* Editor Modal / Container */}
      {formOpen && (
        <div className="glass-card p-6 border border-white/5 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold uppercase text-accent-cyan">
              {id ? "Edit Technology" : "New Technology"}
            </h3>
            <button onClick={resetForm} className="text-text-muted hover:text-white text-xs">
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Technology Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Next.js"
                required
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              >
                <option value="RED_TEAM">Red Team & Offensive Security</option>
                <option value="BLUE_TEAM">Blue Team & Defensive Security</option>
                <option value="WEB_DEV">Web Development</option>
                <option value="AI_DATA">AI & Data Science</option>
                <option value="DEVOPS">DevOps & Tools</option>
                <option value="LANGUAGE">Languages & Frameworks</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Experience Years */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Experience (Years)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Experience Months */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Experience (Months)</label>
              <input
                type="number"
                min="0"
                max="11"
                step="1"
                value={experienceMonths}
                onChange={(e) => setExperienceMonths(parseInt(e.target.value) || 0)}
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Icon Link */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Icon URL (Optional)</label>
              <input
                type="url"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://example.com/icon.png"
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Secure Image Upload */}
            <div className="space-y-4 md:col-span-2 border-t border-white/5 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs text-text-muted uppercase font-bold">
                    Upload Custom Icon 🛡️
                  </label>
                  <p className="text-[10px] text-text-muted leading-relaxed">
                    Allowed formats: JPG, PNG, WEBP, GIF, SVG (Max 5MB).
                  </p>
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono file:font-bold file:bg-white/5 file:text-text-primary hover:file:bg-white/10"
                  />
                  {uploading && (
                    <p className="text-[10px] text-accent-cyan animate-pulse">
                      Uploading image...
                    </p>
                  )}
                </div>

                <div className="aspect-square w-full max-w-[100px] bg-bg-secondary border border-white/5 rounded-lg flex items-center justify-center overflow-hidden relative">
                  {iconUrl ? (
                    <>
                      <img src={iconUrl} alt="Icon preview" className="w-full h-full object-contain p-2" />
                      <button
                        type="button"
                        onClick={() => setIconUrl("")}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-red-400 hover:text-red-300 text-[10px]"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-text-muted">No Icon</span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Control */}
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
                disabled={actionLoading || uploading}
                className="px-4 py-2 bg-accent-cyan text-bg-primary font-bold text-xs rounded-lg btn-glow-cyan disabled:opacity-50"
              >
                {actionLoading ? "SAVING..." : id ? "UPDATE" : "SAVE"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Existing Techs */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
        </div>
      ) : techs.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
          <p className="text-xs text-text-muted italic">No technologies recorded in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {techs.map((tech) => (
            <div key={tech.id} className="glass-card p-4 border border-white/5 flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center overflow-hidden">
                  {tech.iconUrl ? (
                    <img src={tech.iconUrl} alt={tech.name} className="w-6 h-6 object-contain" />
                  ) : (
                    <span className="text-xs text-text-muted font-bold">{tech.name.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(tech)} className="text-[10px] text-accent-cyan">Edit</button>
                  <button onClick={() => handleDelete(tech.id)} className="text-[10px] text-red-400">Del</button>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-100">{tech.name}</h4>
                <p className="text-[9px] text-text-muted mt-1">{tech.category}</p>
                <p className="text-[9px] text-accent-purple mt-0.5">
                  {tech.experienceYears > 0 ? `${tech.experienceYears}y ` : ''}
                  {tech.experienceMonths > 0 ? `${tech.experienceMonths}m` : (tech.experienceYears === 0 ? '0m' : '')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
