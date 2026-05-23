"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Layers } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import type { LocalLog } from "@/lib/local-logs";

interface LogCardProps {
  log: LocalLog;
  index?: number;
  onClick?: () => void;
}

export function LogCard({ log, index = 0, onClick }: LogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <div 
        onClick={onClick}
        className="group block cursor-pointer"
      >
        <article className="overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-md">
          {log.images.length > 0 && (
            <div className="aspect-[2.4/1] overflow-hidden">
              <img
                src={log.images[0]}
                alt={log.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          )}
          <div className="p-5">
            {/* Tags */}
            {log.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {log.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className="mb-2 text-lg font-semibold tracking-tight group-hover:text-accent transition-colors">
              {log.title}
            </h3>

            {/* Summary */}
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {truncate(log.learnings || log.diary, 140)}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(log.date)}
                </span>
                {log.images.length > 1 && (
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    {log.images.length} photos
                  </span>
                )}
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </article>
      </div>
    </motion.div>
  );
}
