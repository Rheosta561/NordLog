"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Trash2, Edit3, X, Check } from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import type { CommentType } from "@/types";

interface CommentSectionProps {
  comments: CommentType[];
  dailyLogId: string;
  onAdd: (content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onEdit: (commentId: string, content: string) => Promise<void>;
}

export function CommentSection({
  comments,
  onAdd,
  onDelete,
  onEdit,
}: CommentSectionProps) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const isAdmin = (session?.user as Record<string, unknown>)?.role === "ADMIN";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;
    setLoading(true);
    try {
      await onAdd(newComment.trim());
      setNewComment("");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    await onEdit(commentId, editContent.trim());
    setEditingId(null);
    setEditContent("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt=""
                className="h-8 w-8 rounded-full"
              />
            ) : (
              getInitials(session.user?.name || "U")
            )}
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || loading}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      ) : (
        <p className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-center text-sm text-muted-foreground">
          Sign in to leave a comment
        </p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {comment.user.image ? (
                  <img
                    src={comment.user.image}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  getInitials(comment.user.name || "U")
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {comment.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                {editingId === comment.id ? (
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleEdit(comment.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {comment.content}
                  </p>
                )}

                {/* Actions */}
                {session &&
                  (session.user?.id === comment.userId || isAdmin) &&
                  editingId !== comment.id && (
                    <div className="mt-1.5 flex items-center gap-2">
                      {session.user?.id === comment.userId && (
                        <button
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditContent(comment.content);
                          }}
                          className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(comment.id)}
                        className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
