import { getWeeklySummaries } from "@/actions/weekly-gen";
import { WeeklyManageClient } from "./weekly-manage-client";

export default async function WeeklyManagePage() {
  const summaries = await getWeeklySummaries();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Weekly Summaries</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage weekly progress summaries using AI</p>
      </div>
      <WeeklyManageClient summaries={summaries} />
    </div>
  );
}
