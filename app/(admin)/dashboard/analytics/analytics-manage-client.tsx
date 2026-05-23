"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit3, X, Save, Loader2 } from "lucide-react";
import { createAnalytics, updateAnalytics, deleteAnalytics } from "@/actions/analytics";
import type { AnalyticsType } from "@/types";

interface Props { analytics: AnalyticsType[]; }

export function AnalyticsManageClient({ analytics }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AnalyticsType | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ totalHours: 0, tasksCompleted: 0, streak: 0, productivityAverage: 5, week: analytics.length + 1 });

  const resetForm = () => { setForm({ totalHours: 0, tasksCompleted: 0, streak: 0, productivityAverage: 5, week: analytics.length + 1 }); setEditing(null); setShowForm(false); };

  const handleEdit = (a: AnalyticsType) => {
    setEditing(a);
    setForm({ totalHours: a.totalHours, tasksCompleted: a.tasksCompleted, streak: a.streak, productivityAverage: a.productivityAverage, week: a.week });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await updateAnalytics(editing.id, form); } else { await createAnalytics(form); }
      resetForm();
      router.refresh();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await deleteAnalytics(id); router.refresh(); };

  const inputClass = "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring placeholder:text-muted-foreground";

  return (
    <div>
      {!showForm && (
        <button onClick={() => { setForm({ ...form, week: analytics.length + 1 }); setShowForm(true); }}
          className="mb-6 flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
          <Plus className="h-3.5 w-3.5" /> Add Week
        </button>
      )}

      {showForm && (
        <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">{editing ? "Edit" : "New"} Analytics</h3>
            <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div><label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Week</label><input type="number" value={form.week} onChange={(e) => setForm({ ...form, week: parseInt(e.target.value) })} className={inputClass} required /></div>
            <div><label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Hours</label><input type="number" step="0.5" value={form.totalHours} onChange={(e) => setForm({ ...form, totalHours: parseFloat(e.target.value) })} className={inputClass} required /></div>
            <div><label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Tasks Completed</label><input type="number" value={form.tasksCompleted} onChange={(e) => setForm({ ...form, tasksCompleted: parseInt(e.target.value) })} className={inputClass} required /></div>
            <div><label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Streak (days)</label><input type="number" value={form.streak} onChange={(e) => setForm({ ...form, streak: parseInt(e.target.value) })} className={inputClass} required /></div>
            <div><label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Productivity Avg</label><input type="number" step="0.1" min="0" max="10" value={form.productivityAverage} onChange={(e) => setForm({ ...form, productivityAverage: parseFloat(e.target.value) })} className={inputClass} required /></div>
          </div>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {editing ? "Update" : "Create"}
          </button>
        </motion.form>
      )}

      <div className="rounded-2xl border border-border bg-card">
        {analytics.map((a, i) => (
          <div key={a.id} className={`flex items-center justify-between px-4 py-3 ${i !== analytics.length - 1 ? "border-b border-border" : ""}`}>
            <div>
              <p className="text-sm font-medium">Week {a.week}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{a.totalHours}h · {a.tasksCompleted} tasks · {a.streak}d streak · {a.productivityAverage}/10</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => handleEdit(a)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><Edit3 className="h-3.5 w-3.5" /></button>
              <button onClick={() => handleDelete(a.id)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
        {analytics.length === 0 && <div className="px-4 py-8 text-center text-sm text-muted-foreground">No analytics data yet</div>}
      </div>
    </div>
  );
}
