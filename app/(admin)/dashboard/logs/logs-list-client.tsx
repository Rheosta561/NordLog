"use client";


import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Trash2, Edit3, MessageSquare } from "lucide-react";
import { togglePublish, deleteDailyLog } from "@/actions/daily-logs";
import type { DailyLogType } from "@/types";

interface Props {
  logs: (DailyLogType & { _count?: { comments: number } })[];
}

export function LogsListClient({ logs }: Props) {
  const router = useRouter();

  const handleTogglePublish = async (id: string) => {
    await togglePublish(id);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this log?")) return;
    await deleteDailyLog(id);
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-border bg-card">
      {logs.map((log, i) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.03 }}
          className={`flex items-center justify-between px-4 py-3 ${
            i !== logs.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium">{log.title}</p>
              <span
                className={`flex-shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium ${
                  log.published
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {log.published ? "Published" : "Draft"}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{new Date(log.date).toLocaleDateString()}</span>
              <span>{log.tags.join(", ")}</span>
              {(log._count?.comments ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {log._count?.comments}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleTogglePublish(log.id)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title={log.published ? "Unpublish" : "Publish"}
            >
              {log.published ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
            <Link
              href={`/dashboard/logs/${log.id}/edit`}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => handleDelete(log.id)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      ))}
      {logs.length === 0 && (
        <div className="px-4 py-12 text-center text-sm text-muted-foreground">
          No logs yet. Create your first one!
        </div>
      )}
    </div>
  );
}
