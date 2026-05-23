"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineSectionProps {
  items: {
    title: string;
    date: string;
    description?: string;
  }[];
  className?: string;
}

export function TimelineSection({ items, className }: TimelineSectionProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Vertical line */}
      <div className="absolute left-3 top-0 h-full w-px bg-border" />

      <div className="space-y-8">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="relative flex gap-4 pl-9"
          >
            {/* Dot */}
            <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-border bg-card" />

            <div>
              <p className="text-xs text-muted-foreground">{item.date}</p>
              <p className="mt-0.5 text-sm font-medium">{item.title}</p>
              {item.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
