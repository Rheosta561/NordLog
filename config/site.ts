import type { NavItem } from "@/types";

export const siteConfig = {
  name: "NordLog",
  description:
    "A premium internship progress tracking platform for documenting growth and showcasing technical progress.",
  url: "https://nordlog.vercel.app",
  ogImage: "/og.png",
  author: {
    name: "Anubhav Mishra",
    email: "anubhav@example.com",
    github: "https://github.com/Rheosta561",
    linkedin: "https://www.linkedin.com/in/anubhav-mishra-2b8175285/",
    twitter: "https://twitter.com/anubhavmishra",
    leetcode: "https://leetcode.com/u/rheoanubhav/",
  },
};

export const publicNavItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Logs", href: "/logs" },
  { title: "Weekly", href: "/weekly" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Profile", href: "/profile" },
];

export const adminNavItems: NavItem[] = [
  { title: "Overview", href: "/dashboard" },
  { title: "Daily Logs", href: "/dashboard/logs" },
  { title: "Weekly", href: "/dashboard/weekly" },
  { title: "Portfolio", href: "/dashboard/portfolio" },
  { title: "Analytics", href: "/dashboard/analytics" },
];

export const moods = [
  { value: "great", label: "Great", emoji: "🔥" },
  { value: "good", label: "Good", emoji: "😊" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "tired", label: "Tired", emoji: "😴" },
  { value: "stressed", label: "Stressed", emoji: "😰" },
];
