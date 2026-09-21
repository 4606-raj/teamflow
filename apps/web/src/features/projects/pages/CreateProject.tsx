'use client'

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, Check, FolderKanban } from 'lucide-react';
import { Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
    Label,
    MultiSelect,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue } from '@/shared/components/ui';

import { DashboardShell } from '@/shared/layouts/DashboardShell';
import { lookupsApi, type SelectOption } from '../api/lookups.api';
import { type CreateProjectRequest, projectCreateSchema } from '@teamflow/types'
import { PROJECT_COLORS, PROJECT_STATUSES } from '@teamflow/types'
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProject } from '../hooks/use-create-project';
import { useNavigate } from 'react-router-dom';

export default function CreateProject() {
    const [tags, setTags] = useState<SelectOption[]>([]);
    const [technologies, setTechnologies] = useState<SelectOption[]>([]);
    const createProject = useCreateProject();
    const navigate = useNavigate()
    const isCreating = createProject.isPending;

    // fetching lookups | tags and technologies
    useEffect(() => {
        async function loadLookups() {
            const [tags, technologies] = await Promise.all([
                lookupsApi.tags(),
                lookupsApi.technologies(),
            ]);

            setTags(tags);
            setTechnologies(technologies);
        }

        loadLookups();
    }, []);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: {errors, isSubmitting},
    } = useForm<z.input<typeof projectCreateSchema>, unknown, CreateProjectRequest>({
        resolver: zodResolver(projectCreateSchema),
        defaultValues: {
            name: '',
            description: '',
            color: PROJECT_COLORS[0].value,
            status: 'PLANNING',
            tags: [],
            techStack: [],
            members: [],
        }
    })

    const submitForm = async (data: CreateProjectRequest) => {

        const res = await createProject.mutateAsync(data);
        console.log(res)

        navigate('/projects')
    }
    const formValues = useWatch({ control });
    const selectedTagLabels = tags
        .filter((tag) => formValues.tags?.includes(tag.value))
        .map((tag) => tag.label);
    const selectedTechnologyLabels = technologies
        .filter((technology) => formValues.techStack?.includes(technology.value))
        .map((technology) => technology.label);

    return (
        <DashboardShell>
            <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Create project</h1>
                    </div>
                    <Button type="button" variant="outline" className="gap-2">
                        <ArrowLeft aria-hidden="true" className="size-4" />
                        Back to projects
                    </Button>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                    <Card className="shadow-sm ring-1 ring-border/60">
                        <CardHeader className="space-y-2 pb-4">
                            <CardTitle className="text-2xl">Project details</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6 pb-6">

                            <form onSubmit={handleSubmit(submitForm)}>
                                <div className="mb-4 space-y-2">
                                    <Label htmlFor="project-name">Project name <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="project-name"
                                        placeholder="Willy and Co."
                                        className="h-11 rounded-xl"
                                        aria-invalid={Boolean(errors.name)}
                                        {...register('name')}
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                                </div>

                                <div className="mb-4 space-y-2">
                                    <Label htmlFor="project-description">Description <span className="text-destructive">*</span></Label>
                                    <textarea
                                        id="project-description"
                                        placeholder="Add a short project summary"
                                        className={`min-h-28 w-full rounded-xl border bg-input/30 px-3 py-2 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm ${errors.description ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20' : 'border-input'}`}
                                        aria-invalid={Boolean(errors.description)}
                                        {...register('description')}
                                    />
                                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="mb-4 space-y-2">
                                        <Label htmlFor="technologies">Tech Stack <span className="text-destructive">*</span></Label>

                                        <MultiSelect
                                            id="technologies"
                                            options={technologies}
                                            value={formValues.techStack ?? []}
                                            onValueChange={(value) => setValue('techStack', value, { shouldDirty: true, shouldValidate: true })}
                                            placeholder="Select technologies"
                                            searchPlaceholder="Search technologies..."
                                            aria-invalid={Boolean(errors.techStack)}
                                        />
                                        {errors.techStack && <p className="text-sm text-destructive">{errors.techStack.message}</p>}
                                    </div>

                                    <div className="mb-4 space-y-2">
                                        <Label htmlFor="tags">Tags <span className="text-destructive">*</span></Label>

                                        <MultiSelect
                                            id="tags"
                                            options={tags}
                                            value={formValues.tags ?? []}
                                            onValueChange={(value) => setValue('tags', value, { shouldDirty: true, shouldValidate: true })}
                                            placeholder="Select tags"
                                            searchPlaceholder="Search tags..."
                                            aria-invalid={Boolean(errors.tags)}
                                        />
                                        {errors.tags && <p className="text-sm text-destructive">{errors.tags.message}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="mb-4 space-y-2">
                                        <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>

                                        <input type="hidden" aria-invalid={Boolean(errors.status)} {...register('status')} />
                                        <Select items={PROJECT_STATUSES} value={formValues.status} onValueChange={(value) => {
                                            if (value) {
                                                setValue('status', value as CreateProjectRequest['status'], { shouldDirty: true, shouldValidate: true });
                                            }
                                        }}>
                                          <SelectTrigger className={`w-full ${errors.status ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20' : ''}`} aria-invalid={Boolean(errors.status)}>
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
                                        {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>Project color <span className="text-destructive">*</span></Label>
                                    <input type="hidden" aria-invalid={Boolean(errors.color)} {...register('color')} />
                                    <div className="flex flex-wrap gap-3">
                                        {PROJECT_COLORS.map((color) => {
                                            const isSelected = formValues.color === color.value;

                                            return (
                                                <button
                                                    key={color.name}
                                                    type="button"
                                                    aria-label={`Choose ${color.name} project color`}
                                                    aria-pressed={isSelected}
                                                    aria-invalid={Boolean(errors.color)}
                                                    onClick={() => setValue('color', color.value, { shouldDirty: true, shouldValidate: true })}
                                                    className={`relative flex size-11 items-center justify-center rounded-full border-2 transition-all ${isSelected ? 'scale-105 border-foreground/60' : 'border-transparent'}`}
                                                    style={{ backgroundColor: color.value }}
                                                >
                                                    {isSelected && <Check aria-hidden="true" className="size-4 text-white" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.color && <p className="text-sm text-destructive">{errors.color.message}</p>}
                                </div>

                                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                    <Button type="button" variant="outline" className="sm:min-w-32">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting || isCreating} className="sm:min-w-40">
                                        {isCreating ? 'Creating...' : 'Create project'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border border-border/60 bg-gradient-to-br from-muted/80 to-background shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Project preview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pb-6">
                            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex size-12 items-center justify-center rounded-2xl text-lg font-semibold text-white shadow-sm" style={{ backgroundColor: formValues.color }}>
                                        <FolderKanban aria-hidden="true" className="size-5" />
                                    </div>
                                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                        {PROJECT_STATUSES.find((status) => status.value === formValues.status)?.label}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold tracking-tight">{formValues.name || 'Untitled project'}</h2>
                                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                                        {formValues.description || 'Add a project description to preview how it will appear in your workspace.'}
                                    </p>
                                </div>

                                <div className="mt-5 space-y-3">
                                    <div>
                                        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Progress</span>
                                            <span className="font-medium text-foreground">68%</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                                            <div className="h-full rounded-full" style={{ width: '68%', backgroundColor: formValues.color }} />
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
                                    <li className="flex items-center justify-between gap-4">
                                        <span>Technologies</span>
                                        <span className="text-right font-medium text-foreground">
                                            {selectedTechnologyLabels.length > 0 ? selectedTechnologyLabels.join(', ') : 'None selected'}
                                        </span>
                                    </li>
                                    <li className="flex items-center justify-between gap-4">
                                        <span>Tags</span>
                                        <span className="text-right font-medium text-foreground">
                                            {selectedTagLabels.length > 0 ? selectedTagLabels.join(', ') : 'None selected'}
                                        </span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span>Status</span>
                                        <span className="font-medium text-foreground">
                                            {PROJECT_STATUSES.find((status) => status.value === formValues.status)?.label}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardShell>
    );
}