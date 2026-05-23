import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/cards/stats-card";
import { FileText, Calendar, Briefcase, MessageSquare, Clock, Flame } from "lucide-react";
import Link from "next/link";
import { portfolioProjects } from "@/config/data";

export default async function DashboardPage() {
  const [logCount, weeklyCount, commentCount, latestAnalytics, recentLogs] =
    await Promise.all([
      prisma.dailyLog.count(),
      prisma.weeklySummary.count(),
      prisma.comment.count(),
      prisma.analytics.findFirst({ orderBy: { week: "desc" } }),
      prisma.dailyLog.findMany({ orderBy: { date: "desc" }, take: 5, select: { id: true, title: true, slug: true, date: true, published: true } }),
    ]);
    
  const projectCount = portfolioProjects.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your internship progress</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Daily Logs" value={logCount} icon={<FileText />} />
        <StatsCard title="Weekly Summaries" value={weeklyCount} icon={<Calendar />} />
        <StatsCard title="Projects" value={projectCount} icon={<Briefcase />} />
        <StatsCard title="Comments" value={commentCount} icon={<MessageSquare />} />
        <StatsCard title="Total Hours" value={latestAnalytics?.totalHours || 0} icon={<Clock />} />
        <StatsCard title="Streak" value={`${latestAnalytics?.streak || 0}d`} icon={<Flame />} />
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/logs/new" className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
            + New Log
          </Link>
          <Link href="/dashboard/weekly" className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
            + Weekly Summary
          </Link>
        </div>
      </div>

      {/* Recent logs */}
      <div>
        <h2 className="mb-3 text-sm font-semibold">Recent Logs</h2>
        <div className="rounded-2xl border border-border bg-card">
          {recentLogs.map((log, i) => (
            <Link key={log.id} href={`/dashboard/logs/${log.id}/edit`} className={`flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50 ${i !== recentLogs.length - 1 ? "border-b border-border" : ""}`}>
              <div>
                <p className="text-sm font-medium">{log.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{new Date(log.date).toLocaleDateString()}</p>
              </div>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${log.published ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                {log.published ? "Published" : "Draft"}
              </span>
            </Link>
          ))}
          {recentLogs.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No logs yet. Create your first one!</div>
          )}
        </div>
      </div>
    </div>
  );
}
