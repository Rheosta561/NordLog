"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Plus, Save, Loader2 } from "lucide-react";
import { dailyLogSchema, type DailyLogFormData } from "@/schemas";
import { createDailyLog, updateDailyLog } from "@/actions/daily-logs";
import { moods } from "@/config/site";
import type { DailyLogType } from "@/types";

interface Props {
  log?: DailyLogType;
}

export function LogEditorForm({ log }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [newLearning, setNewLearning] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DailyLogFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(dailyLogSchema) as any,
    defaultValues: {
      title: log?.title || "",
      summary: log?.summary || "",
      content: log?.content || "",
      topLearnings: log?.topLearnings || [],
      achievements: log?.achievements || [],
      mood: log?.mood || "good",
      productivityScore: log?.productivityScore || 5,
      coverImage: log?.coverImage || "",
      images: log?.images || [],
      tags: log?.tags || [],
      date: log
        ? new Date(log.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      published: log?.published || false,
    },
  });

  const topLearnings = watch("topLearnings");
  const achievements = watch("achievements");
  const tags = watch("tags");
  const productivityScore = watch("productivityScore");

  const onSubmit = async (data: DailyLogFormData) => {
    setSaving(true);
    try {
      if (log) {
        await updateDailyLog(log.id, data);
      } else {
        await createDailyLog(data);
      }
      router.push("/dashboard/logs");
      router.refresh();
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const addItem = (
    field: "topLearnings" | "achievements" | "tags",
    value: string,
    setter: (v: string) => void
  ) => {
    if (!value.trim()) return;
    // eslint-disable-next-line react-hooks/incompatible-library
    const current = watch(field) as string[];
    setValue(field, [...current, value.trim()]);
    setter("");
  };

  const removeItem = (field: "topLearnings" | "achievements" | "tags", index: number) => {
    const current = watch(field) as string[];
    setValue(field, current.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const { url } = await res.json();
          const images = watch("images");
          setValue("images", [...images, url]);
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring placeholder:text-muted-foreground";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Title
        </label>
        <input {...register("title")} placeholder="Day 1: Getting Started" className={inputClass} />
        {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
      </div>

      {/* Date + Mood + Productivity */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</label>
          <input type="date" {...register("date")} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Mood</label>
          <select {...register("mood")} className={inputClass}>
            {moods.map((m) => (
              <option key={m.value} value={m.value}>{m.emoji} {m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Productivity ({productivityScore}/10)
          </label>
          <input
            type="range"
            min={1}
            max={10}
            {...register("productivityScore", { valueAsNumber: true })}
            className="mt-2 w-full accent-foreground"
          />
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Summary</label>
        <textarea {...register("summary")} rows={2} placeholder="Brief summary of the day..." className={inputClass} />
        {errors.summary && <p className="mt-1 text-xs text-destructive">{errors.summary.message}</p>}
      </div>

      {/* Content */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Content (Markdown)</label>
        <textarea {...register("content")} rows={12} placeholder="Write your daily log content..." className={`${inputClass} font-mono text-xs leading-relaxed`} />
        {errors.content && <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>}
      </div>

      {/* Top Learnings */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Top Learnings</label>
        <div className="space-y-2">
          {topLearnings.map((l, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
              <span className="flex-1">{l}</span>
              <button type="button" onClick={() => removeItem("topLearnings", i)} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input value={newLearning} onChange={(e) => setNewLearning(e.target.value)} placeholder="Add a learning..." className={inputClass}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addItem("topLearnings", newLearning, setNewLearning); }
              }}
            />
            <button type="button" onClick={() => addItem("topLearnings", newLearning, setNewLearning)} className="rounded-xl bg-muted px-3 py-2 text-muted-foreground transition-colors hover:text-foreground">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Achievements</label>
        <div className="space-y-2">
          {achievements.map((a, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
              <span className="flex-1">{a}</span>
              <button type="button" onClick={() => removeItem("achievements", i)} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input value={newAchievement} onChange={(e) => setNewAchievement(e.target.value)} placeholder="Add an achievement..." className={inputClass}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addItem("achievements", newAchievement, setNewAchievement); }
              }}
            />
            <button type="button" onClick={() => addItem("achievements", newAchievement, setNewAchievement)} className="rounded-xl bg-muted px-3 py-2 text-muted-foreground transition-colors hover:text-foreground">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Tags</label>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {tags.map((t, i) => (
            <span key={i} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
              {t}
              <button type="button" onClick={() => removeItem("tags", i)} className="text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag..." className={inputClass}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addItem("tags", newTag, setNewTag); }
            }}
          />
          <button type="button" onClick={() => addItem("tags", newTag, setNewTag)} className="rounded-xl bg-muted px-3 py-2 text-muted-foreground transition-colors hover:text-foreground">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cover Image URL */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Cover Image URL</label>
        <input {...register("coverImage")} placeholder="https://..." className={inputClass} />
      </div>

      {/* Image Upload */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Gallery Images</label>
        <div className="mb-2 grid grid-cols-4 gap-2">
          {watch("images").map((img, i) => (
            <div key={i} className="group relative aspect-video overflow-hidden rounded-lg border border-border">
              <img src={img} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => { const imgs = watch("images"); setValue("images", imgs.filter((_, idx) => idx !== i)); }}
                className="absolute right-1 top-1 rounded-md bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-6 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground">
          <Upload className="h-4 w-4" />
          Upload images
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {log ? "Update" : "Create"} Log
        </button>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" {...register("published")} className="accent-foreground" />
          Publish immediately
        </label>
      </div>
    </form>
  );
}
