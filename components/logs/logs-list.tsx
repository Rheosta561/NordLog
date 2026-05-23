"use client";

import { useState, useMemo } from "react";
import { Search, CalendarDays } from "lucide-react";
import { LogCard } from "@/components/cards/log-card";
import { LogDetailModal } from "./log-detail-modal";
import type { LocalLog } from "@/lib/local-logs";

interface LogsListProps {
  logs: LocalLog[];
}

export function LogsList({ logs }: LogsListProps) {
  const [activeLog, setActiveLog] = useState<LocalLog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Search filter (checks title, diary, learnings, and tags)
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        log.title.toLowerCase().includes(q) ||
        log.diary.toLowerCase().includes(q) ||
        log.learnings.toLowerCase().includes(q) ||
        log.tags.some(t => t.toLowerCase().includes(q));

      // Date range filter
      const logDate = new Date(log.date).getTime();
      const matchesStart = !startDate || logDate >= new Date(startDate).getTime();
      
      // End date should include the whole day, so we add 24h
      let matchesEnd = true;
      if (endDate) {
        const endDateTime = new Date(endDate).getTime();
        matchesEnd = logDate <= endDateTime + 86400000;
      }

      return matchesSearch && matchesStart && matchesEnd;
    });
  }, [logs, searchQuery, startDate, endDate]);

  return (
    <>
      <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search diaries, learnings, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-ring placeholder:text-muted-foreground"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 w-full min-w-[140px] rounded-xl border border-border bg-card pl-10 pr-3 text-sm outline-none transition-colors focus:border-ring text-muted-foreground dark:[color-scheme:dark]"
            />
          </div>
          <span className="text-muted-foreground text-sm">-</span>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 w-full min-w-[140px] rounded-xl border border-border bg-card pl-10 pr-3 text-sm outline-none transition-colors focus:border-ring text-muted-foreground dark:[color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border bg-card/50">
          <p className="text-lg font-medium text-foreground">
            No logs found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search query or date range.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLogs.map((log, i) => (
            <LogCard
              key={log.id}
              log={log}
              index={i}
              onClick={() => setActiveLog(log)}
            />
          ))}
        </div>
      )}

      {activeLog && (
        <LogDetailModal
          log={activeLog}
          onClose={() => setActiveLog(null)}
        />
      )}
    </>
  );
}
