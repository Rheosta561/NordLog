export type UserRole = "ADMIN" | "USER";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string;
  role: UserRole;
}

export interface DailyLogType {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  topLearnings: string[];
  achievements: string[];
  mood: string;
  productivityScore: number;
  coverImage: string | null;
  images: string[];
  tags: string[];
  date: Date | string;
  published: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  comments?: CommentType[];
  _count?: { comments: number };
}

export interface WeeklySummaryType {
  id: string;
  title: string;
  weekNumber: number;
  summary: string;
  images?: string[];
  wins: string[];
  blockers: string[];
  nextWeekGoals: string[];
  createdAt: Date | string;
}

export interface CommentType {
  id: string;
  content: string;
  userId: string;
  dailyLogId: string;
  createdAt: Date | string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface PortfolioProjectType {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  coverImage: string | null;
  gallery: string[];
  featured: boolean;
  createdAt: Date | string;
}

export interface AnalyticsType {
  id: string;
  totalHours: number;
  tasksCompleted: number;
  streak: number;
  productivityAverage: number;
  week: number;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
}
