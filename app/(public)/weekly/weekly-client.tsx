"use client";

import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { Trophy, AlertTriangle, Target, TrendingUp, Image as ImageIcon } from "lucide-react";
import { StatsCard } from "@/components/cards/stats-card";
import type { WeeklySummaryType, AnalyticsType } from "@/types";

interface Props {
  summaries: WeeklySummaryType[];
  analytics: AnalyticsType[];
}

export function WeeklyClient({ summaries, analytics }: Props) {
  const latest = analytics[analytics.length - 1];

  const chartData = analytics.map((a) => ({
    week: `W${a.week}`,
    productivity: a.productivityAverage,
    hours: a.totalHours,
    tasks: a.tasksCompleted,
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Weekly Summaries</h1>
        <p className="mt-2 text-muted-foreground">Progress tracked week by week</p>
      </div>

      {latest && (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Hours" value={latest.totalHours} icon={<TrendingUp />} />
          <StatsCard title="Tasks Done" value={latest.tasksCompleted} icon={<Target />} />
          <StatsCard title="Streak" value={`${latest.streak}d`} icon={<Trophy />} />
          <StatsCard title="Avg Productivity" value={`${latest.productivityAverage}/10`} icon={<TrendingUp />} />
        </div>
      )}

      {chartData.length > 0 && (
        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold">Productivity Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--color-border)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-border)" domain={[0, 10]} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="productivity" stroke="var(--color-foreground)" strokeWidth={2} dot={{ r: 3, fill: "var(--color-foreground)" }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold">Hours per Week</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--color-border)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-border)" />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} />
                <Bar dataKey="hours" fill="var(--color-foreground)" radius={[6, 6, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {summaries.length > 0 ? (
        <div className="space-y-6">
          {summaries.map((summary, i) => (
            <motion.div key={summary.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Week {summary.weekNumber}</span>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">{summary.title}</h3>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{summary.summary}</p>
              
              {summary.images && summary.images.length > 0 && (
                <div className="mb-8">
                  <div className="mb-3 flex items-center gap-2 font-medium text-xs uppercase tracking-wider text-muted-foreground">
                    <ImageIcon className="h-3 w-3" />
                    Attached Images
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                    {summary.images.map((img: string, idx: number) => (
                      <div key={idx} className="aspect-video w-full overflow-hidden rounded-xl border border-border">
                        <img src={img} alt="Weekly upload" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-3">
                {summary.wins.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-success"><Trophy className="h-3 w-3" /> Wins</div>
                    <ul className="space-y-2">{summary.wins.map((w, j) => (<li key={j} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="mt-1.5 block h-1 w-1 flex-shrink-0 rounded-full bg-success" />{w}</li>))}</ul>
                  </div>
                )}
                {summary.blockers.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-warning"><AlertTriangle className="h-3 w-3" /> Blockers</div>
                    <ul className="space-y-2">{summary.blockers.map((b, j) => (<li key={j} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="mt-1.5 block h-1 w-1 flex-shrink-0 rounded-full bg-warning" />{b}</li>))}</ul>
                  </div>
                )}
                {summary.nextWeekGoals.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground"><Target className="h-3 w-3" /> Next Week</div>
                    <ul className="space-y-2">{summary.nextWeekGoals.map((g, j) => (<li key={j} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="mt-1.5 block h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />{g}</li>))}</ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-muted-foreground">No weekly summaries yet</p>
        </div>
      )}
    </div>
  );
}
