import { useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Plus, X } from "lucide-react"
import {
  FormField,
  Input,
  MultiSelect,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Textarea,
  Button,
} from "@/shared/components/ui"
import {
  PROJECT_COLORS,
  PROJECT_STATUSES,
  projectCreateSchema,
  projectMemberRoleValues,
  type CreateProjectRequest,
  type ProjectMemberRole,
} from "@teamflow/types"
import { lookupsApi, type MemberOption, type SelectOption } from "../api/lookups.api"

export type ProjectFormValues = z.input<typeof projectCreateSchema>

type ProjectFormProps = {
  defaultValues?: Partial<ProjectFormValues>
  onSubmit: (data: CreateProjectRequest) => Promise<void> | void
  onCancel?: () => void
  onValuesChange?: (values: ProjectFormValues) => void
  submitLabel?: string
  pendingLabel?: string
  isPending?: boolean
}

const initialValues: ProjectFormValues = {
  name: "",
  description: "",
  color: PROJECT_COLORS[0].value,
  status: "PLANNING",
  tags: [],
  techStack: [],
  members: [],
}

function ProjectForm({
  defaultValues,
  onSubmit,
  onCancel,
  onValuesChange,
  submitLabel = "Save project",
  pendingLabel = "Saving...",
  isPending = false,
}: ProjectFormProps) {
  const [tags, setTags] = useState<SelectOption[]>([])
  const [technologies, setTechnologies] = useState<SelectOption[]>([])
  const [members, setMembers] = useState<MemberOption[]>([])
  const [memberId, setMemberId] = useState("")
  const [memberRole, setMemberRole] = useState<ProjectMemberRole>("Developer")
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues, unknown, CreateProjectRequest>({
    resolver: zodResolver(projectCreateSchema),
    defaultValues: { ...initialValues, ...defaultValues },
  })
  const watchedValues = useWatch({ control })
  const values = useMemo(() => ({ ...initialValues, ...watchedValues }) as ProjectFormValues, [watchedValues])

  useEffect(() => {
    let active = true

    Promise.all([lookupsApi.tags(), lookupsApi.technologies(), lookupsApi.members()]).then(([loadedTags, loadedTechnologies, loadedMembers]) => {
      if (!active) return
      setTags(loadedTags)
      setTechnologies(loadedTechnologies)
      setMembers(loadedMembers)
    })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    onValuesChange?.(values)
  }, [onValuesChange, values])

  const selectedMembers = values.members ?? []
  const addMember = () => {
    if (!memberId || selectedMembers.some((member) => member.id === memberId)) return

    setValue("members", [...selectedMembers, { id: memberId, role: memberRole }], {
      shouldDirty: true,
      shouldValidate: true,
    })
    setMemberId("")
  }

  const removeMember = (id: string) => {
    setValue("members", selectedMembers.filter((member) => member.id !== id), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField label="Project name" htmlFor="project-name" error={errors.name?.message} required>
        <Input
          id="project-name"
          placeholder="Willy and Co."
          className="h-11"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
      </FormField>

      <FormField label="Description" htmlFor="project-description" error={errors.description?.message} required>
        <Textarea
          id="project-description"
          placeholder="Add a short project summary"
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
        />
      </FormField>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Tech Stack" htmlFor="technologies" error={errors.techStack?.message} required>
          <MultiSelect
            id="technologies"
            options={technologies}
            value={values.techStack ?? []}
            onValueChange={(value) => setValue("techStack", value, { shouldDirty: true, shouldValidate: true })}
            placeholder="Select technologies"
            searchPlaceholder="Search technologies..."
            aria-invalid={Boolean(errors.techStack)}
          />
        </FormField>

        <FormField label="Tags" htmlFor="tags" error={errors.tags?.message} required>
          <MultiSelect
            id="tags"
            options={tags}
            value={values.tags ?? []}
            onValueChange={(value) => setValue("tags", value, { shouldDirty: true, shouldValidate: true })}
            placeholder="Select tags"
            searchPlaceholder="Search tags..."
            aria-invalid={Boolean(errors.tags)}
          />
        </FormField>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Status" htmlFor="status" error={errors.status?.message} required>
          <input type="hidden" aria-invalid={Boolean(errors.status)} {...register("status")} />
          <Select
            items={PROJECT_STATUSES}
            value={values.status}
            onValueChange={(value) => {
              if (value) {
                setValue("status", value as ProjectFormValues["status"], { shouldDirty: true, shouldValidate: true })
              }
            }}
          >
            <SelectTrigger className="w-full" aria-invalid={Boolean(errors.status)}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                {PROJECT_STATUSES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Project color" error={errors.color?.message} required>
          <input type="hidden" aria-invalid={Boolean(errors.color)} {...register("color")} />
          <div className="flex min-h-9 flex-wrap items-center gap-2">
            {PROJECT_COLORS.map((color) => {
              const isSelected = values.color === color.value

              return (
                <button
                  key={color.name}
                  type="button"
                  aria-label={`Choose ${color.name} project color`}
                  aria-pressed={isSelected}
                  aria-invalid={Boolean(errors.color)}
                  onClick={() => setValue("color", color.value, { shouldDirty: true, shouldValidate: true })}
                  className={`relative flex size-8 items-center justify-center rounded-full border-2 transition-all ${
                    isSelected ? "scale-110 border-foreground/60" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  {isSelected && <Check aria-hidden="true" className="size-4 text-white" />}
                </button>
              )
            })}
          </div>
        </FormField>
      </div>

      <FormField label="Project members" error={errors.members?.message}>
        <div className="rounded-xl border border-border/70 p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={memberId} onValueChange={(value) => setMemberId(value ?? "")}>
              <SelectTrigger className="w-full sm:min-w-0 sm:flex-1">
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Organization members</SelectLabel>
                  {members.filter((member) => !selectedMembers.some((selected) => selected.id === member.id)).map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={memberRole} onValueChange={(value) => value && setMemberRole(value as ProjectMemberRole)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  {projectMemberRoleValues.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" onClick={addMember} disabled={!memberId} className="w-full sm:w-auto">
              <Plus aria-hidden="true" />
              Add
            </Button>
          </div>

          {selectedMembers.length > 0 && (
            <div className="mt-3 divide-y rounded-lg border border-border/70">
              {selectedMembers.map((selectedMember) => {
                const member = members.find((option) => option.id === selectedMember.id)
                return (
                  <div key={selectedMember.id} className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{member?.name ?? selectedMember.id}</p>
                      {member && <p className="truncate text-xs text-muted-foreground">{member.email}</p>}
                    </div>
                    <div className="flex items-center gap-2 sm:shrink-0">
                      <Select
                        value={selectedMember.role}
                        onValueChange={(value) => {
                          if (!value) return
                          setValue("members", selectedMembers.map((item) => item.id === selectedMember.id ? { ...item, role: value as ProjectMemberRole } : item), {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }}
                      >
                        <SelectTrigger className="w-full sm:w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {projectMemberRoleValues.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove ${member?.name ?? "member"}`} onClick={() => removeMember(selectedMember.id)}>
                        <X aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </FormField>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="sm:min-w-32" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isPending} className="sm:min-w-40">
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export { ProjectForm }
