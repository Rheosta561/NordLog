"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { formatDate, getReadingTime } from "@/lib/utils";
import { LearningCard } from "@/components/cards/learning-card";
import { CommentSection } from "@/components/shared/comment-section";
import { ReadingProgress } from "@/components/shared/reading-progress";
import { addComment, editComment, deleteComment } from "@/actions/comments";
import type { DailyLogType, CommentType } from "@/types";
import { useState } from "react";

interface Props {
  log: DailyLogType & { comments: CommentType[] };
}

export function LogDetailClient({ log }: Props) {

  const [comments, setComments] = useState(log.comments);

  const handleAddComment = async (content: string) => {
    const comment = await addComment({ content, dailyLogId: log.id });
    setComments((prev) => [comment as CommentType, ...prev]);
  };

  const handleEditComment = async (commentId: string, content: string) => {
    const updated = await editComment(commentId, content);
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? (updated as CommentType) : c))
    );
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: log.title,
        text: log.summary,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const moodEmoji: Record<string, string> = {
    great: "🔥",
    good: "😊",
    okay: "😐",
    tired: "😴",
    stressed: "😰",
  };

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-3xl px-6 py-12">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/logs"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to logs
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          {/* Tags */}
          {log.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {log.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {log.title}
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {log.summary}
          </p>

          {/* Meta bar */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(log.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {getReadingTime(log.content)}
            </span>
            <span>
              {moodEmoji[log.mood] || ""} {log.mood}
            </span>
            <span>Productivity: {log.productivityScore}/10</span>
            <button
              onClick={handleShare}
              className="ml-auto flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
          </div>
        </motion.header>

        {/* Cover image */}
        {log.coverImage && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10 overflow-hidden rounded-2xl border border-border"
          >
            <img
              src={log.coverImage}
              alt={log.title}
              className="w-full object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: log.content.replace(/\n/g, "<br />") }}
        />

        {/* Top Learnings */}
        {log.topLearnings.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-12"
          >
            <h2 className="mb-4 text-xl font-semibold tracking-tight">
              Top Learnings
            </h2>
            <div className="space-y-3">
              {log.topLearnings.map((learning, i) => (
                <LearningCard key={i} learning={learning} index={i} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Achievements */}
        {log.achievements.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-10"
          >
            <h2 className="mb-4 text-xl font-semibold tracking-tight">
              Achievements
            </h2>
            <ul className="space-y-2">
              {log.achievements.map((ach, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-success" />
                  {ach}
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Image gallery */}
        {log.images.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-10"
          >
            <h2 className="mb-4 text-xl font-semibold tracking-tight">
              Gallery
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {log.images.map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-border"
                >
                  <img
                    src={img}
                    alt={`Screenshot ${i + 1}`}
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Comments */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-14 border-t border-border pt-8"
        >
          <CommentSection
            comments={comments}
            dailyLogId={log.id}
            onAdd={handleAddComment}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        </motion.section>
      </article>
    </>
  );
}
