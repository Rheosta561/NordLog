import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LogDetailClient } from "./log-detail-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const log = await prisma.dailyLog.findUnique({
    where: { slug },
    select: { title: true, summary: true, coverImage: true },
  });
  if (!log) return { title: "Not Found" };

  return {
    title: log.title,
    description: log.summary,
    openGraph: {
      title: log.title,
      description: log.summary,
      images: log.coverImage ? [log.coverImage] : [],
    },
  };
}

export default async function LogDetailPage({ params }: Props) {
  const { slug } = await params;
  const log = await prisma.dailyLog.findUnique({
    where: { slug },
    include: {
      comments: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!log || !log.published) notFound();

  return <LogDetailClient log={log} />;
}
