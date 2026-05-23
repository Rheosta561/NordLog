import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LogCard } from "@/components/cards/log-card";
import { DailyLogType } from "@/types";

export async function LandingFeatured() {
  let logs: DailyLogType[] = [];

  try {
    const rawLogs = await prisma.dailyLog.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      take: 3,
      include: { _count: { select: { comments: true } } },
    });
    logs = rawLogs as unknown as DailyLogType[];
  } catch (error) {
    console.error("Database connection failed for LandingFeatured:", error);
  }

  if (logs.length === 0) return null;

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Recent Logs
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest entries from the journey
            </p>
          </div>
          <Link
            href="/logs"
            className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {logs.map((log: DailyLogType, i: number | undefined) => (
            <LogCard key={log.id} log={log} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
