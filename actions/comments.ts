"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { commentSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export async function addComment(data: unknown) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Must be signed in");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const validated = commentSchema.parse(data);

  const comment = await prisma.comment.create({
    data: {
      content: validated.content,
      userId: user.id,
      dailyLogId: validated.dailyLogId,
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  revalidatePath(`/logs`);
  return comment;
}

export async function editComment(commentId: string, content: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Must be signed in");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new Error("Comment not found");

  // Only the author can edit
  if (comment.userId !== user.id) throw new Error("Forbidden");

  const updated = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  revalidatePath(`/logs`);
  return updated;
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Must be signed in");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new Error("Comment not found");

  // Author or admin can delete
  if (comment.userId !== user.id && user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/logs`);
}
