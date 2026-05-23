"use client";

import { useState, useEffect } from "react";

interface ContentItem {
  id: number;
  type: "PROJECT" | "WRITEUP";
  category: string | null;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  thumbnailUrl: string | null;
  githubSyncUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  publishedAt: string;
  techStack: string[];
}

export default function ContentAdminPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const viewType = "PROJECT";

  // Form State
  const [id, setId] = useState<number | null>(null);
  const type = "PROJECT";
  const [category, setCategory] = useState("Tools");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [githubSyncUrl, setGithubSyncUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [techString, setTechString] = useState(""); // Comma separated

  // UI Control
  const [formOpen, setFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content?type=${viewType}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setItems(data.items);
        }
      }
    } catch (err) {
      console.error("Failed to load contents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [viewType]);

  const resetForm = () => {
    setId(null);
    setCategory("Tools");
    setTitle("");
    setSummary("");
    setContent("");
    setThumbnailUrl("");
    setGithubSyncUrl("");
    setDemoUrl("");
    setFeatured(false);
    setTechString("");
    setError("");
    setSuccess("");
    setFormOpen(false);
  };

  const handleEdit = (item: ContentItem) => {
    setId(item.id);
    setCategory(item.category || "Tools");
    setTitle(item.title);
    setSummary(item.summary || "");
    setContent(item.content);
    setThumbnailUrl(item.thumbnailUrl || "");
    setGithubSyncUrl(item.githubSyncUrl || "");
    setDemoUrl(item.demoUrl || "");
    setFeatured(item.featured);
    setTechString(item.techStack.join(", "));
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

      setThumbnailUrl(data.url);
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

    // Parse technologies tags
    const techStack = techString
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const payload = {
      id,
      type,
      category,
      title,
      summary: summary || null,
      content,
      thumbnailUrl: thumbnailUrl || null,
      githubSyncUrl: githubSyncUrl || null,
      demoUrl: demoUrl || null,
      featured,
      techStack,
    };

    try {
      const method = id ? "PUT" : "POST";
      const res = await fetch("/api/content", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save item.");
        return;
      }

      setSuccess(`Content ${id ? "updated" : "created"} successfully!`);
      fetchContent();
      setTimeout(resetForm, 1000);
    } catch (err) {
      setError("Network connection error.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (deleteId: number) => {
    if (!confirm("Are you sure you want to delete this content item? This action is permanent!")) return;

    try {
      const res = await fetch(`/api/content?id=${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete.");
        return;
      }

      fetchContent();
    } catch (err) {
      alert("Network error deleting content.");
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Title & Filters */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Projects</h1>
          <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">
            Manage your portfolio projects
          </p>
        </div>
        {!formOpen && (
          <div className="flex gap-3">

            
            <button
              onClick={() => setFormOpen(true)}
              className="px-4 py-2 bg-accent-cyan text-bg-primary text-xs font-bold rounded-lg btn-glow-cyan transition-all"
            >
              + Add Content
            </button>
          </div>
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

      {/* Form Container */}
      {formOpen && (
        <div className="glass-card p-6 border border-white/5 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold uppercase text-accent-cyan">
              {id ? "Edit Content Item" : "Create Content Item"}
            </h3>
            <button onClick={resetForm} className="text-text-muted hover:text-white text-xs">
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              >
                <option value="Academic">Academic</option>
                <option value="Cyber">Cyber</option>
                <option value="AI">AI</option>
                <option value="Web">Web</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Forensic document analyzer"
                required
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Summary */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs text-text-muted uppercase">Short Summary (for Card previews)</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Briefly explain the objective and key highlights of this project..."
                rows={2}
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Content Markdown */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs text-text-muted uppercase">Content (Markdown format supported)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write full detailed documentation, guides, or writeups here..."
                rows={10}
                required
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs font-mono text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* GitHub Link */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">GitHub Repository Link</label>
              <input
                type="url"
                value={githubSyncUrl}
                onChange={(e) => setGithubSyncUrl(e.target.value)}
                placeholder="https://github.com/adrianfahrezi404/repo"
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Live Demo Link */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Live Demo Link</label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://my-demo-link.com"
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Technologies Comma-separated */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Technologies (comma-separated)</label>
              <input
                type="text"
                value={techString}
                onChange={(e) => setTechString(e.target.value)}
                placeholder="React, Laravel, Docker, Splunk, Nmap"
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3 pt-6">
              <input
                id="checkbox-featured"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-bg-secondary text-accent-cyan focus:ring-accent-cyan/30"
              />
              <label htmlFor="checkbox-featured" className="text-xs text-slate-300 font-bold uppercase select-none">
                Featured Content / Highlight
              </label>
            </div>

            {/* Secure Thumbnail Upload */}
            <div className="space-y-4 md:col-span-2 border-t border-white/5 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs text-text-muted uppercase font-bold">
                    Secure Project Thumbnail Upload 🛡️
                  </label>
                  <p className="text-[10px] text-text-muted leading-relaxed">
                    Allowed formats: JPG, PNG, WEBP, GIF (Max 5MB). The server verifies the file signature.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono file:font-bold file:bg-white/5 file:text-text-primary hover:file:bg-white/10"
                  />
                  {uploading && (
                    <p className="text-[10px] text-accent-cyan animate-pulse">
                      Encrypting & scanning image bytes on the server...
                    </p>
                  )}
                </div>

                <div className="aspect-[16/9] w-full bg-bg-secondary border border-white/5 rounded-lg flex items-center justify-center overflow-hidden relative">
                  {thumbnailUrl ? (
                    <>
                      <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-contain p-2" />
                      <button
                        type="button"
                        onClick={() => setThumbnailUrl("")}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-red-400 hover:text-red-300 text-[10px]"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-text-muted">No Image</span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
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

      {/* Contents List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
          <p className="text-xs text-text-muted italic">No content items recorded in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="glass-card border border-white/5 overflow-hidden flex flex-col justify-between">
              {/* Thumbnail 16:9 */}
              <div className="relative aspect-[16/9] w-full bg-bg-secondary flex items-center justify-center border-b border-white/5">
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="font-mono text-2xl text-white/10 select-none">{"{ }"}</span>
                )}
                {item.featured && (
                  <span className="absolute top-2 left-2 bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan px-2 py-0.5 text-[8px] font-bold uppercase rounded">
                    Featured
                  </span>
                )}
                {item.category && (
                  <span className="absolute top-2 right-2 bg-white/5 border border-white/10 text-white/60 px-2 py-0.5 text-[8px] font-bold uppercase rounded">
                    {item.category}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-xs text-slate-100 line-clamp-1">{item.title}</h4>
                  <p className="text-[10px] text-text-muted mt-2 line-clamp-2 leading-relaxed">
                    {item.summary || "No summary provided."}
                  </p>
                  
                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.techStack.map(tag => (
                      <span key={tag} className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/10 text-text-muted rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-[10px] text-accent-cyan hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
