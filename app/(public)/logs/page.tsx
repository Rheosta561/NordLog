import { Metadata } from "next";
import { getDailyLogs } from "@/lib/local-logs";
import { LogsList } from "@/components/logs/logs-list";

export const dynamic = "auto";

export const metadata: Metadata = {
  title: "Daily Logs",
  description: "Browse daily internship progress logs",
};

export default async function LogsPage() {
  const allLogs = getDailyLogs();
  const total = allLogs.length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">What did I learn today at Qualcomm?</h1>
        <p className="mt-2 text-muted-foreground">
          {total} {total === 1 ? "entry" : "entries"} documenting my journey as an Interim Engineering Intern (2M)
        </p>
      </div>

      {/* Logs Client List (handles search, date filter, grid, and modal) */}
      <LogsList logs={allLogs} />
    </div>
  );
}
