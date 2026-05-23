import { prisma } from "@/lib/prisma";
import { AnalyticsManageClient } from "./analytics-manage-client";

export default async function AnalyticsManagePage() {
  const analytics = await prisma.analytics.findMany({ orderBy: { week: "desc" } });
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage weekly analytics data</p>
      </div>
      <AnalyticsManageClient analytics={analytics} />
    </div>
  );
}
