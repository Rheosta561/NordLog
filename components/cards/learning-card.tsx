"use client";

import { motion } from "framer-motion";

interface LearningCardProps {
  learning: string;
  index: number;
}

export function LearningCard({ learning, index }: LearningCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
    >
      <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
        <span className="text-xs font-semibold text-muted-foreground">
          {index + 1}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{learning}</p>
    </motion.div>
  );
}
