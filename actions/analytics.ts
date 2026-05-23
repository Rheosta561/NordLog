"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { analyticsSchema } from "@/schemas";
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

export async function getAnalytics() {
  return prisma.analytics.findMany({ orderBy: { week: "desc" } });
}

export async function getLatestAnalytics() {
  return prisma.analytics.findFirst({ orderBy: { week: "desc" } });
}

export async function createAnalytics(data: unknown) {
  await requireAdmin();
  const validated = analyticsSchema.parse(data);

  const analytics = await prisma.analytics.create({ data: validated });

  revalidatePath("/weekly");
  revalidatePath("/dashboard/analytics");
  return analytics;
}

export async function updateAnalytics(id: string, data: unknown) {
  await requireAdmin();
  const validated = analyticsSchema.parse(data);

  const analytics = await prisma.analytics.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/weekly");
  revalidatePath("/dashboard/analytics");
  return analytics;
}

export async function deleteAnalytics(id: string) {
  await requireAdmin();
  await prisma.analytics.delete({ where: { id } });
  revalidatePath("/weekly");
  revalidatePath("/dashboard/analytics");
}
