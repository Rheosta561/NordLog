import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { WeeklyClient } from "./weekly-client";

export const metadata: Metadata = {
  title: "Weekly Summaries",
  description: "Week-by-week internship progress and analytics",
};

export default async function WeeklyPage() {
  const [summaries, analytics] = await Promise.all([
    prisma.weeklySummary.findMany({ orderBy: { weekNumber: "desc" } }),
    prisma.analytics.findMany({ orderBy: { week: "asc" } }),
  ]);

  return <WeeklyClient summaries={summaries} analytics={analytics} />;
}
