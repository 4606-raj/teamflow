import { FolderKanban } from "lucide-react"
import { PROJECT_STATUSES } from "@teamflow/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui"
import { type ProjectFormValues } from "./ProjectForm"

export function ProjectPreview({ values }: { values: ProjectFormValues }) {
  const statusLabel = PROJECT_STATUSES.find((status) => status.value === values.status)?.label

  return (
    <Card className="overflow-hidden border border-border/60 bg-gradient-to-br from-muted/80 to-background shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Project preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pb-6">
        <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl text-lg font-semibold text-white shadow-sm" style={{ backgroundColor: values.color }}>
              <FolderKanban aria-hidden="true" className="size-5" />
            </div>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{statusLabel}</span>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold tracking-tight">{values.name || "Untitled project"}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
              {values.description || "Add a project description to preview how it will appear in your workspace."}
            </p>
          </div>
          <div className="mt-5 space-y-3">
            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span className="font-medium text-foreground">68%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full" style={{ width: "68%", backgroundColor: values.color }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>14 of 20 tasks</span>
              <span>Jul 18</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Overview</p>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <PreviewRow label="Technologies" value={values.techStack?.length ? `${values.techStack.length} selected` : "None selected"} />
            <PreviewRow label="Tags" value={values.tags?.length ? `${values.tags.length} selected` : "None selected"} />
            <PreviewRow label="Status" value={statusLabel ?? "Not selected"} />
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </li>
  )
}
