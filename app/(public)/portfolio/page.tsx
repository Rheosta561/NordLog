import { Metadata } from "next";
import { ProjectCard } from "@/components/cards/project-card";
import { portfolioProjects } from "@/config/data";
import { PortfolioProjectType } from "@/types";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Projects built during the internship",
};

export default function PortfolioPage() {
  const projects = portfolioProjects;

  const featured = projects.filter((p: PortfolioProjectType) => p.featured);
  const others = projects.filter((p: PortfolioProjectType) => !p.featured);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
        <p className="mt-2 text-muted-foreground">
          {projects.length} projects built during the internship
        </p>
      </div>

      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Featured
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {featured.map((p: PortfolioProjectType, i: number) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            All Projects
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p: PortfolioProjectType, i: number) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No projects yet
          </p>
        </div>
      )}
    </div>
  );
}
