"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { portfolioProjectSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user || user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

export async function getPortfolioProjects(options?: { featured?: boolean }) {
  const where: Record<string, unknown> = {};
  if (options?.featured !== undefined) where.featured = options.featured;

  return prisma.portfolioProject.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function createPortfolioProject(data: unknown) {
  await requireAdmin();
  const validated = portfolioProjectSchema.parse(data);

  const project = await prisma.portfolioProject.create({
    data: {
      ...validated,
      githubUrl: validated.githubUrl || null,
      liveUrl: validated.liveUrl || null,
    },
  });

  revalidatePath("/portfolio");
  revalidatePath("/dashboard/portfolio");
  return project;
}

export async function updatePortfolioProject(id: string, data: unknown) {
  await requireAdmin();
  const validated = portfolioProjectSchema.parse(data);

  const project = await prisma.portfolioProject.update({
    where: { id },
    data: {
      ...validated,
      githubUrl: validated.githubUrl || null,
      liveUrl: validated.liveUrl || null,
    },
  });

  revalidatePath("/portfolio");
  revalidatePath("/dashboard/portfolio");
  return project;
}

export async function deletePortfolioProject(id: string) {
  await requireAdmin();
  await prisma.portfolioProject.delete({ where: { id } });
  revalidatePath("/portfolio");
  revalidatePath("/dashboard/portfolio");
}
