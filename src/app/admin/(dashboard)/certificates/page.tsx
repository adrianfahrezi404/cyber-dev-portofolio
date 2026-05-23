"use client";

import { useState, useEffect } from "react";

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string | null;
  imageUrl: string | null;
  category: string | null;
}

export default function CertificatesAdminPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [id, setId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("AI");
  
  // UI Controls
  const [formOpen, setFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCerts = async () => {
    try {
      const res = await fetch("/api/certificates");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCerts(data.certificates);
        }
      }
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const resetForm = () => {
    setId(null);
    setTitle("");
    setIssuer("");
    setIssueDate("");
    setCredentialUrl("");
    setImageUrl("");
    setCategory("AI");
    setError("");
    setSuccess("");
    setFormOpen(false);
  };

  const handleEdit = (cert: Certificate) => {
    setId(cert.id);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    // Format date string to YYYY-MM-DD for input field
    const formattedDate = cert.issueDate ? cert.issueDate.split("T")[0] : "";
    setIssueDate(formattedDate);
    setCredentialUrl(cert.credentialUrl || "");
    setImageUrl(cert.imageUrl || "");
    setCategory(cert.category || "AI");
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

      setImageUrl(data.url);
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
      title,
      issuer,
      issueDate,
      credentialUrl: credentialUrl || null,
      imageUrl: imageUrl || null,
      category,
    };

    try {
      const method = id ? "PUT" : "POST";
      const res = await fetch("/api/certificates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save certificate.");
        return;
      }

      setSuccess(`Certificate ${id ? "updated" : "created"} successfully!`);
      fetchCerts();
      setTimeout(resetForm, 1000);
    } catch (err) {
      setError("Network connection error.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (deleteId: number) => {
    if (!confirm("Are you sure you want to delete this certificate? This action is permanent!")) return;

    try {
      const res = await fetch(`/api/certificates?id=${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete.");
        return;
      }

      fetchCerts();
    } catch (err) {
      alert("Network error deleting certificate.");
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Title Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Certifications</h1>
          <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">
            Manage your verified professional credentials
          </p>
        </div>
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="px-4 py-2 bg-accent-cyan text-bg-primary text-xs font-bold rounded-lg btn-glow-cyan transition-all"
          >
            + Add Certificate
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
              {id ? "Edit Certificate" : "New Certificate"}
            </h3>
            <button onClick={resetForm} className="text-text-muted hover:text-white text-xs">
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Certificate Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CompTIA Security+"
                required
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Issuer */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Issuer / Organization</label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. CompTIA"
                required
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
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
                <option value="AI">AI</option>
                <option value="Cyber">Cyber</option>
                <option value="Web">Web</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Verification Link */}
            <div className="space-y-2">
              <label className="block text-xs text-text-muted uppercase">Credential Verification Link</label>
              <input
                type="url"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://verify.com/credential/123"
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
              />
            </div>

            {/* Secure Image Upload */}
            <div className="space-y-4 md:col-span-2 border-t border-white/5 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                {/* File Input */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs text-text-muted uppercase font-bold">
                    Secure Certificate Image Upload 🛡️
                  </label>
                  <p className="text-[10px] text-text-muted leading-relaxed">
                    Allowed formats: JPG, PNG, WEBP, GIF (Max 5MB). Images are scanned on the server for security.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono file:font-bold file:bg-white/5 file:text-text-primary hover:file:bg-white/10"
                  />
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-[10px] text-text-muted font-bold uppercase">OR PASTE URL</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://imgur.com/my-image.png"
                    className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2 text-xs text-text-primary focus:border-accent-cyan/50 focus:outline-none"
                  />
                  {uploading && (
                    <p className="text-[10px] text-accent-cyan animate-pulse">
                      Encrypting & scanning image bytes on the server...
                    </p>
                  )}
                </div>

                {/* Preview Box */}
                <div className="aspect-[16/9] w-full bg-bg-secondary border border-white/5 rounded-lg flex items-center justify-center overflow-hidden relative">
                  {imageUrl ? (
                    <>
                      <img src={imageUrl} alt="Certificate preview" className="w-full h-full object-contain p-2" />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
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

      {/* Grid of Existing Certs */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
        </div>
      ) : certs.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
          <p className="text-xs text-text-muted italic">No certificates recorded in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div key={cert.id} className="glass-card border border-white/5 overflow-hidden flex flex-col justify-between">
              {/* Image (16:9 Aspect, Contain) */}
              <div className="relative aspect-[16/9] w-full bg-bg-secondary flex items-center justify-center border-b border-white/5">
                {cert.imageUrl ? (
                  <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent-purple/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                )}
                {cert.category && (
                  <span className="absolute top-2 right-2 bg-white/5 border border-white/10 text-white/60 px-2 py-0.5 text-[8px] font-bold uppercase rounded">
                    {cert.category}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-100 line-clamp-1">{cert.title}</h4>
                  <p className="text-[10px] text-accent-cyan mt-1">{cert.issuer}</p>
                  <p className="text-[9px] text-text-muted mt-0.5">
                    Issued: {cert.issueDate ? cert.issueDate.split("T")[0] : ""}
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleEdit(cert)}
                    className="text-[10px] text-accent-cyan hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
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
