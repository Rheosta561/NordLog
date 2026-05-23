import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LogEditorForm } from "../../log-editor-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLogPage({ params }: Props) {
  const { id } = await params;
  const log = await prisma.dailyLog.findUnique({ where: { id } });
  if (!log) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Log</h1>
        <p className="mt-1 text-sm text-muted-foreground">{log.title}</p>
      </div>
      <LogEditorForm log={log} />
    </div>
  );
}
