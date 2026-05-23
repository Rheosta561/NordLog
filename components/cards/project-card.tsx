"use client";

import { motion } from "framer-motion";
import { ExternalLink, Code2 } from "lucide-react";
import type { PortfolioProjectType } from "@/types";

interface ProjectCardProps {
  project: PortfolioProjectType;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-md"
    >
      {project.coverImage && (
        <div className="aspect-video overflow-hidden border-b border-border">
          <img
            src={project.coverImage}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="p-5">
        <div className="mb-1 flex items-start justify-between">
          <h3 className="text-base font-semibold tracking-tight">
            {project.title}
          </h3>
          {project.featured && (
            <span className="rounded-md bg-foreground px-2 py-0.5 text-[10px] font-medium text-background">
              Featured
            </span>
          )}
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        {/* Tech Stack */}
        {project.techStack.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Code2 className="h-3.5 w-3.5" />
              Source
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
