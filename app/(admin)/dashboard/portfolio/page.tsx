import { prisma } from "@/lib/prisma";
import { PortfolioManageClient } from "./portfolio-manage-client";

export default async function PortfolioManagePage() {
  const projects = await prisma.portfolioProject.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage portfolio projects</p>
      </div>
      <PortfolioManageClient projects={projects} />
    </div>
  );
}
