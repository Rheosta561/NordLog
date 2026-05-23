"use client";

import { useState, useEffect } from "react";
import { Calendar, Zap, Rocket, Loader2, CheckCircle2, AlertCircle, Target, ArrowRight, X } from "lucide-react";
import { getWeeklySummaries } from "@/actions/weekly-gen";

export function CurrentPipeline() {
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadLatestSummary() {
      try {
        const summaries = await getWeeklySummaries();
        if (summaries && summaries.length > 0) {
          setSummary(summaries[0]);
        }
      } catch (err) {
        console.error("Failed to load latest summary", err);
      } finally {
        setLoading(false);
      }
    }
    loadLatestSummary();
  }, []);

  const truncateText = (text: string, length = 150) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  return (
    <>
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Qualcomm Internship Insights</h2>
              <p className="mt-2 text-muted-foreground">The latest weekly progress and reflections, summarized by AI.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card py-20 text-center shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">Loading latest insights...</p>
            </div>
          ) : !summary ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center">
              <Rocket className="mb-4 h-10 w-10 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground">No Insights Generated Yet</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                The weekly summary has not been generated for this week.
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{summary.title}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Week {summary.weekNumber}
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-foreground" />
                  AI Generated
                </div>
              </div>

              {/* Truncated Text */}
              <div className="mb-8">
                <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {truncateText(summary.summary, 200)}
                </p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Read full insights
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Selected Images Preview */}
              {summary.images && summary.images.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
                  {summary.images.slice(0, 4).map((img: string, i: number) => (
                    <div key={i} className="aspect-video w-full overflow-hidden rounded-2xl border border-border">
                      <img src={img} alt="Weekly highlight" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Detailed Modal */}
      {showModal && summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-lg md:p-8">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-2 text-2xl font-bold">{summary.title}</h2>
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground border-b border-border pb-6">
              <Calendar className="h-4 w-4" />
              Week {summary.weekNumber}
            </div>

            <p className="mb-8 text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {summary.summary}
            </p>

            {/* Images in Modal */}
            {summary.images && summary.images.length > 0 && (
              <div className="mb-8">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Featured Images</h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {summary.images.map((img: string, i: number) => (
                    <div key={i} className="aspect-video w-full overflow-hidden rounded-xl border border-border">
                      <img src={img} alt="Weekly highlight" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
              {/* Wins */}
              <div className="rounded-2xl border border-border bg-muted/30 p-5">
                <div className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Key Wins
                </div>
                {summary.wins && summary.wins.length > 0 ? (
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {summary.wins.map((win: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500/50" />
                        <span>{win}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground opacity-70">No wins recorded.</p>
                )}
              </div>

              {/* Blockers */}
              <div className="rounded-2xl border border-border bg-muted/30 p-5">
                <div className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Challenges
                </div>
                {summary.blockers && summary.blockers.length > 0 ? (
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {summary.blockers.map((blocker: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/50" />
                        <span>{blocker}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground opacity-70">No blockers faced.</p>
                )}
              </div>

              {/* Next Week Goals */}
              <div className="rounded-2xl border border-border bg-muted/30 p-5">
                <div className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <Target className="h-5 w-5 text-blue-500" />
                  Next Week Goals
                </div>
                {summary.nextWeekGoals && summary.nextWeekGoals.length > 0 ? (
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {summary.nextWeekGoals.map((goal: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/50" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground opacity-70">No goals set.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
