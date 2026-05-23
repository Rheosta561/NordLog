"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit3, X, Save, Loader2, Star } from "lucide-react";
import { createPortfolioProject, updatePortfolioProject, deletePortfolioProject } from "@/actions/portfolio";
import type { PortfolioProjectType } from "@/types";

interface Props { projects: PortfolioProjectType[]; }

export function PortfolioManageClient({ projects }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PortfolioProjectType | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", techStack: "", githubUrl: "", liveUrl: "", coverImage: "", featured: false });

  const resetForm = () => { setForm({ title: "", description: "", techStack: "", githubUrl: "", liveUrl: "", coverImage: "", featured: false }); setEditing(null); setShowForm(false); };

  const handleEdit = (p: PortfolioProjectType) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, techStack: p.techStack.join(", "), githubUrl: p.githubUrl || "", liveUrl: p.liveUrl || "", coverImage: p.coverImage || "", featured: p.featured });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form, techStack: form.techStack.split(",").map((s) => s.trim()).filter(Boolean), gallery: [] };
    try {
      if (editing) { await updatePortfolioProject(editing.id, data); } else { await createPortfolioProject(data); }
      resetForm();
      router.refresh();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete this project?")) return; await deletePortfolioProject(id); router.refresh(); };

  const inputClass = "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring placeholder:text-muted-foreground";

  return (
    <div>
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="mb-6 flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
          <Plus className="h-3.5 w-3.5" /> New Project
        </button>
      )}

      {showForm && (
        <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">{editing ? "Edit" : "New"} Project</h3>
            <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project title" className={inputClass} required />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className={inputClass} required />
          <input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="Tech stack (comma-separated)" className={inputClass} />
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="GitHub URL" className={inputClass} />
            <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="Live URL" className={inputClass} />
          </div>
          <input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="Cover image URL" className={inputClass} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-foreground" />
            Featured project
          </label>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {editing ? "Update" : "Create"}
          </button>
        </motion.form>
      )}

      <div className="rounded-2xl border border-border bg-card">
        {projects.map((p, i) => (
          <div key={p.id} className={`flex items-center justify-between px-4 py-3 ${i !== projects.length - 1 ? "border-b border-border" : ""}`}>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{p.title}</p>
                {p.featured && <Star className="h-3 w-3 text-warning fill-warning" />}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{p.techStack.join(", ")}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => handleEdit(p)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><Edit3 className="h-3.5 w-3.5" /></button>
              <button onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <div className="px-4 py-8 text-center text-sm text-muted-foreground">No projects yet</div>}
      </div>
    </div>
  );
}
