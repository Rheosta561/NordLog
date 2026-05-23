"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { weeklySummarySchema } from "@/schemas";
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

export async function getWeeklySummaries() {
  return prisma.weeklySummary.findMany({
    orderBy: { weekNumber: "desc" },
  });
}

export async function getWeeklySummary(weekNumber: number) {
  return prisma.weeklySummary.findUnique({ where: { weekNumber } });
}

export async function createWeeklySummary(data: unknown) {
  await requireAdmin();
  const validated = weeklySummarySchema.parse(data);

  const summary = await prisma.weeklySummary.create({ data: validated });

  revalidatePath("/weekly");
  revalidatePath("/dashboard/weekly");
  return summary;
}

export async function updateWeeklySummary(id: string, data: unknown) {
  await requireAdmin();
  const validated = weeklySummarySchema.parse(data);

  const summary = await prisma.weeklySummary.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/weekly");
  revalidatePath("/dashboard/weekly");
  return summary;
}

export async function deleteWeeklySummary(id: string) {
  await requireAdmin();
  await prisma.weeklySummary.delete({ where: { id } });
  revalidatePath("/weekly");
  revalidatePath("/dashboard/weekly");
}
