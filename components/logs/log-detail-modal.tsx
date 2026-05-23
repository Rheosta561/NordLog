"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { LocalLog } from "@/lib/local-logs";

interface LogDetailModalProps {
  log: LocalLog | null;
  onClose: () => void;
}

export function LogDetailModal({ log, onClose }: LogDetailModalProps) {
  if (!log) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{log.title}</h2>
            <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(log.date)}
              </span>
            </div>
          </div>

          {log.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {log.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {log.images.length > 0 && (
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              {log.images.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-border">
                  <img src={img} alt={`Log Image ${i + 1}`} className="w-full h-auto object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold tracking-tight mb-2">Key Learnings</h3>
              <div className="rounded-xl bg-muted/50 p-4 text-sm leading-relaxed text-foreground">
                {log.learnings || "No learnings recorded for this day."}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold tracking-tight mb-2">Detailed Diary</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                {log.diary || "No diary entry recorded for this day."}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
