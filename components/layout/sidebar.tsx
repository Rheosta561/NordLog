"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Briefcase,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/store";

const navItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Daily Logs", href: "/dashboard/logs", icon: FileText },
  { title: "Weekly", href: "/dashboard/weekly", icon: Calendar },
  { title: "Portfolio", href: "/dashboard/portfolio", icon: Briefcase },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground">
              <span className="text-xs font-bold text-background">N</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">
              NordLog
            </span>
          </Link>
        )}
        <button
          onClick={toggle}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200",
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-muted"
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10 h-4 w-4 flex-shrink-0",
                  isActive ? "text-foreground" : ""
                )}
              />
              {!isCollapsed && (
                <span className="relative z-10">{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Home className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Back to site</span>}
        </Link>
      </div>
    </aside>
  );
}
