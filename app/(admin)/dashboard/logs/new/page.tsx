import { LogEditorForm } from "../log-editor-form";

export default function NewLogPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">New Daily Log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Document your progress for the day
        </p>
      </div>
      <LogEditorForm />
    </div>
  );
}
