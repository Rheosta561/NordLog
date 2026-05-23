import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex flex-col items-center gap-2.5 sm:flex-row sm:items-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground">
            <span className="text-[10px] font-bold text-background">N</span>
          </div>
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name} • Developed by {siteConfig.author.name}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/logs"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Logs
          </Link>
          <Link
            href="/portfolio"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Portfolio
          </Link>
          <Link
            href="/profile"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Profile
          </Link>
          {siteConfig.author.github && (
            <a
              href={siteConfig.author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          )}
          {siteConfig.author.linkedin && (
            <a
              href={siteConfig.author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
          )}
          {/* @ts-ignore */}
          {siteConfig.author.leetcode && (
            <a
              /* @ts-ignore */
              href={siteConfig.author.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              LeetCode
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
