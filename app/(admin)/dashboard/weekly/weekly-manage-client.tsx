"use client";

import { Calendar, CheckCircle2, AlertCircle, Target, Image as ImageIcon } from "lucide-react";

interface Props {
  summaries: any[];
}

export function WeeklyManageClient({ summaries }: Props) {
  return (
    <div>
      <div className="space-y-6">
        {summaries.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-semibold">Week {s.weekNumber}: {s.title}</h3>
              </div>
            </div>

            <p className="mb-6 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {s.summary}
            </p>

            {s.images && s.images.length > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2 font-medium text-sm text-foreground">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  Attached Images
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {s.images.map((img: string, i: number) => (
                    <div key={i} className="h-24 w-32 shrink-0 overflow-hidden rounded-lg border border-border">
                      <img src={img} alt="Weekly upload" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
              {/* Wins */}
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2 font-medium text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Key Wins
                </div>
                {s.wins && s.wins.length > 0 ? (
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {s.wins.map((win: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-green-500/50" />
                        <span>{win}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground opacity-70">No wins recorded.</p>
                )}
              </div>

              {/* Blockers */}
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2 font-medium text-sm text-foreground">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Challenges
                </div>
                {s.blockers && s.blockers.length > 0 ? (
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {s.blockers.map((blocker: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-500/50" />
                        <span>{blocker}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground opacity-70">No blockers faced.</p>
                )}
              </div>

              {/* Next Week Goals */}
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2 font-medium text-sm text-foreground">
                  <Target className="h-4 w-4 text-blue-500" />
                  Next Week Goals
                </div>
                {s.nextWeekGoals && s.nextWeekGoals.length > 0 ? (
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {s.nextWeekGoals.map((goal: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-500/50" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground opacity-70">No goals set.</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {summaries.length === 0 && (
          <div className="rounded-2xl border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
            No weekly summaries yet. Use the secure generation route to analyze your logs.
          </div>
        )}
      </div>
    </div>
  );
}
