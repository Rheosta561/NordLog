"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { dailyLogSchema } from "@/schemas";
import { slugify } from "@/lib/utils";
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

export async function getDailyLogs(options?: {
  published?: boolean;
  take?: number;
  skip?: number;
  tag?: string;
}) {
  const where: Record<string, unknown> = {};
  if (options?.published !== undefined) where.published = options.published;
  if (options?.tag) where.tags = { has: options.tag };

  const [logs, total] = await Promise.all([
    prisma.dailyLog.findMany({
      where,
      orderBy: { date: "desc" },
      take: options?.take || 20,
      skip: options?.skip || 0,
      include: { _count: { select: { comments: true } } },
    }),
    prisma.dailyLog.count({ where }),
  ]);

  return { logs, total };
}

export async function getDailyLogBySlug(slug: string) {
  return prisma.dailyLog.findUnique({
    where: { slug },
    include: {
      comments: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createDailyLog(data: unknown) {
  await requireAdmin();
  const validated = dailyLogSchema.parse(data);

  const log = await prisma.dailyLog.create({
    data: {
      ...validated,
      slug: slugify(validated.title) + "-" + Date.now().toString(36),
      date: new Date(validated.date),
    },
  });

  revalidatePath("/logs");
  revalidatePath("/dashboard/logs");
  return log;
}

export async function updateDailyLog(id: string, data: unknown) {
  await requireAdmin();
  const validated = dailyLogSchema.parse(data);

  const log = await prisma.dailyLog.update({
    where: { id },
    data: {
      ...validated,
      date: new Date(validated.date),
    },
  });

  revalidatePath("/logs");
  revalidatePath(`/logs/${log.slug}`);
  revalidatePath("/dashboard/logs");
  return log;
}

export async function deleteDailyLog(id: string) {
  await requireAdmin();

  const log = await prisma.dailyLog.delete({ where: { id } });

  revalidatePath("/logs");
  revalidatePath("/dashboard/logs");
  return log;
}

export async function togglePublish(id: string) {
  await requireAdmin();

  const log = await prisma.dailyLog.findUnique({ where: { id } });
  if (!log) throw new Error("Not found");

  const updated = await prisma.dailyLog.update({
    where: { id },
    data: { published: !log.published },
  });

  revalidatePath("/logs");
  revalidatePath(`/logs/${updated.slug}`);
  revalidatePath("/dashboard/logs");
  return updated;
}
