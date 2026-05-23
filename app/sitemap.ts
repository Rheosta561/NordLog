import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const logs = await prisma.dailyLog.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const logUrls = logs.map((log) => ({
    url: `${siteConfig.url}/logs/${log.slug}`,
    lastModified: log.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/logs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/weekly`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/profile`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...logUrls,
  ];
}
