import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { PROJECT_COLORS } from "@teamflow/types"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui"
import { DashboardShell } from "@/shared/layouts/DashboardShell"
import { ProjectForm, type ProjectFormValues } from "../components/ProjectForm"
import { ProjectPreview } from "../components/ProjectPreview"
import { useNavigate, useParams } from "react-router-dom"
import { useGetOneProject, useUpdateProject } from "../hooks/use-project"

export default function EditProject() {
  const { projectId } = useParams<{ projectId: string }>();

  const [formValues, setFormValues] = useState<ProjectFormValues>({
    name: "",
    description: "",
    color: PROJECT_COLORS[0].value,
    status: "PLANNING",
    tags: [],
    techStack: [],
    members: [],
  })
  const projectQuery = useGetOneProject(projectId)
  const updateProject = useUpdateProject(projectId ?? "")
  const navigate = useNavigate()

  if (!projectId || projectQuery.isLoading) {
    return <DashboardShell><div className="p-8 text-muted-foreground">Loading project...</div></DashboardShell>
  }

  if (projectQuery.isError || !projectQuery.data?.data) {
    return <DashboardShell><div className="p-8 text-destructive">Unable to load project.</div></DashboardShell>
  }

  const project = projectQuery.data.data;

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Edit project</h1>
          </div>
          <Button type="button" variant="outline" className="gap-2" onClick={() => navigate("/projects")}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to projects
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <Card className="shadow-sm ring-1 ring-border/60">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-2xl">Project details</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">

              <ProjectForm
                key={project.id}
                defaultValues={{
                  name: project.name,
                  description: project.description ?? "",
                  color: project.color ?? PROJECT_COLORS[0].value,
                  status: project.status,
                  tags: project.tags.map((tag) => tag.id),
                  techStack: project.techStack.map((technology) => technology.id),
                  members: project.members.map(({ id, role }) => ({ id, role })),
                }}
                onSubmit={async (data) => {
                  await updateProject.mutateAsync(data)
                  navigate("/projects")
                }}
                onCancel={() => navigate("/projects")}
                onValuesChange={setFormValues}
                submitLabel="Save changes"
                pendingLabel="Saving..."
                isPending={updateProject.isPending}
              />
            </CardContent>
          </Card>

          <ProjectPreview values={formValues} />
        </div>
      </div>
    </DashboardShell>
  )
}
