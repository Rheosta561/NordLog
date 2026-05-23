"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Briefcase, ArrowRight } from "lucide-react";
import { useCommandPalette } from "@/store";
import { cn } from "@/lib/utils";

interface SearchResult {
  type: "log" | "project" | "page";
  title: string;
  href: string;
  subtitle?: string;
}

const staticPages: SearchResult[] = [
  { type: "page", title: "Home", href: "/", subtitle: "Landing page" },
  { type: "page", title: "Daily Logs", href: "/logs", subtitle: "Browse all logs" },
  { type: "page", title: "Weekly Summaries", href: "/weekly", subtitle: "Week by week" },
  { type: "page", title: "Portfolio", href: "/portfolio", subtitle: "Projects" },
  { type: "page", title: "Profile", href: "/profile", subtitle: "About" },
];

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>(staticPages);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      const t = setTimeout(() => {
        setResults(staticPages);
        setSelectedIndex(0);
      }, 0);
      return () => clearTimeout(t);
    }

    const filtered = staticPages.filter(
      (page) =>
        page.title.toLowerCase().includes(query.toLowerCase()) ||
        page.subtitle?.toLowerCase().includes(query.toLowerCase())
    );

    // Also search logs via API
    const searchTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults([...filtered, ...data]);
        } else {
          setResults(filtered);
        }
      } catch {
        setResults(filtered);
      }
    }, 200);

    const t2 = setTimeout(() => setSelectedIndex(0), 0);
    return () => {
      clearTimeout(searchTimer);
      clearTimeout(t2);
    };
  }, [query]);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      close();
      setQuery("");
    },
    [router, close]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        navigate(results[selectedIndex].href);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, results, selectedIndex, navigate]);

  // Global ⌘K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          const { open } = useCommandPalette.getState();
          open();
        }
      }
      if (e.key === "Escape" && isOpen) {
        close();
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  const getIcon = (type: string) => {
    switch (type) {
      case "log":
        return FileText;
      case "project":
        return Briefcase;
      default:
        return ArrowRight;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={() => {
              close();
              setQuery("");
            }}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed left-1/2 top-[20%] z-[101] w-full max-w-lg -translate-x-1/2"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search logs, projects, pages..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => {
                    close();
                    setQuery("");
                  }}
                  className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground"
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto p-2">
                {results.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No results found
                  </div>
                ) : (
                  results.map((result, i) => {
                    const Icon = getIcon(result.type);
                    return (
                      <button
                        key={`${result.type}-${result.href}`}
                        onClick={() => navigate(result.href)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                          i === selectedIndex
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted/60"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 truncate">
                          <span className="font-medium text-foreground">
                            {result.title}
                          </span>
                          {result.subtitle && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {result.subtitle}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {result.type}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
