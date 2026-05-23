import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/cards/stats-card";
import { FileText, Clock, Briefcase, Flame } from "lucide-react";
import { portfolioProjects } from "@/config/data";

export async function LandingStats() {
  let logCount = 0;
  let projectCount = portfolioProjects.length;
  let latestAnalytics = null;

  try {
    const results = await Promise.all([
      prisma.dailyLog.count({ where: { published: true } }),
      prisma.analytics.findFirst({ orderBy: { week: "desc" } }),
    ]);
    logCount = results[0];
    latestAnalytics = results[1];
  } catch (error) {
    console.error("Database connection failed for LandingStats:", error);
  }

  const stats = [
    {
      title: "Days Logged",
      value: logCount,
      subtitle: "Daily entries documented",
      icon: <FileText />,
    },
    {
      title: "Hours Tracked",
      value: latestAnalytics?.totalHours || 0,
      subtitle: "Total internship hours",
      icon: <Clock />,
    },
    {
      title: "Projects Built",
      value: projectCount,
      subtitle: "Portfolio projects",
      icon: <Briefcase />,
    },
    {
      title: "Current Streak",
      value: `${latestAnalytics?.streak || 0}d`,
      subtitle: "Consecutive days",
      icon: <Flame />,
    },
  ];

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
