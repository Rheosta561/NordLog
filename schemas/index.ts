import { z } from "zod";

export const dailyLogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  summary: z.string().min(1, "Summary is required").max(500),
  content: z.string().min(1, "Content is required"),
  topLearnings: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  mood: z.string().min(1, "Mood is required"),
  productivityScore: z.number().min(1).max(10),
  coverImage: z.string().optional(),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  date: z.string().min(1, "Date is required"),
  published: z.boolean().default(false),
});

export const weeklySummarySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  weekNumber: z.number().min(1, "Week number is required"),
  summary: z.string().min(1, "Summary is required"),
  wins: z.array(z.string()).default([]),
  blockers: z.array(z.string()).default([]),
  nextWeekGoals: z.array(z.string()).default([]),
});

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000),
  dailyLogId: z.string().min(1),
});

export const portfolioProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  techStack: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  coverImage: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

export const analyticsSchema = z.object({
  totalHours: z.number().min(0),
  tasksCompleted: z.number().min(0),
  streak: z.number().min(0),
  productivityAverage: z.number().min(0).max(10),
  week: z.number().min(1),
});

export type DailyLogFormData = z.infer<typeof dailyLogSchema>;
export type WeeklySummaryFormData = z.infer<typeof weeklySummarySchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type PortfolioProjectFormData = z.infer<typeof portfolioProjectSchema>;
export type AnalyticsFormData = z.infer<typeof analyticsSchema>;
