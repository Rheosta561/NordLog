import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const [logs, projects] = await Promise.all([
    prisma.dailyLog.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { summary: { contains: q, mode: "insensitive" } },
          { tags: { hasSome: [q.toLowerCase()] } },
        ],
      },
      select: { title: true, slug: true, summary: true },
      take: 5,
    }),
    prisma.portfolioProject.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { title: true, id: true, description: true },
      take: 3,
    }),
  ]);

  const results = [
    ...logs.map((log) => ({
      type: "log" as const,
      title: log.title,
      href: `/logs/${log.slug}`,
      subtitle: log.summary.slice(0, 60),
    })),
    ...projects.map((p) => ({
      type: "project" as const,
      title: p.title,
      href: `/portfolio`,
      subtitle: p.description.slice(0, 60),
    })),
  ];

  return NextResponse.json(results);
}
