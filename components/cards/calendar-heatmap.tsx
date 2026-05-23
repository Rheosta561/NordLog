"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CalendarHeatmapProps {
  data: { date: string; count: number }[];
  className?: string;
}

export function CalendarHeatmap({ data, className }: CalendarHeatmapProps) {
  // Build a map of date -> count
  const dataMap = new Map(data.map((d) => [d.date, d.count]));

  // Generate last 20 weeks of dates
  const weeks: string[][] = [];
  const today = new Date();
  for (let w = 19; w >= 0; w--) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      week.push(date.toISOString().split("T")[0]);
    }
    weeks.push(week);
  }

  const getLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
  };

  const levelColors = [
    "bg-muted",
    "bg-foreground/15",
    "bg-foreground/30",
    "bg-foreground/50",
    "bg-foreground/70",
  ];

  return (
    <div className={cn("", className)}>
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((date) => {
              const count = dataMap.get(date) || 0;
              const level = getLevel(count);
              return (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: wi * 0.01 }}
                  className={cn(
                    "h-3 w-3 rounded-[3px] transition-colors",
                    levelColors[level]
                  )}
                  title={`${date}: ${count} ${count === 1 ? "log" : "logs"}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>Less</span>
        {levelColors.map((color, i) => (
          <div key={i} className={cn("h-3 w-3 rounded-[3px]", color)} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
