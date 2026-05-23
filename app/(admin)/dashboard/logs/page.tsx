import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { LogsListClient } from "./logs-list-client";

export default async function LogsManagementPage() {
  const logs = await prisma.dailyLog.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Daily Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">{logs.length} total entries</p>
        </div>
        <Link href="/dashboard/logs/new" className="flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
          <Plus className="h-3.5 w-3.5" />
          New Log
        </Link>
      </div>
      <LogsListClient logs={logs} />
    </div>
  );
}
