import { useMemo, useState } from 'react';
import { BriefcaseBusiness, CalendarDays, FolderKanban, Plus, Search, Users } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/shared/components/ui';
import { DashboardShell } from '@/shared/layouts/DashboardShell';

type ProjectStatus = 'Active' | 'Planning' | 'Completed';

type Project = {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    tasks: number;
    completedTasks: number;
    members: number;
    dueDate: string;
    color: string;
};

const projects: Project[] = [
    {
        id: 'website-redesign',
        name: 'Website redesign',
        description: 'Refresh the marketing site and improve the customer journey.',
        status: 'Active',
        tasks: 24,
        completedTasks: 16,
        members: 6,
        dueDate: 'Jun 28, 2026',
        color: 'bg-sky-500',
    },
    {
        id: 'mobile-app',
        name: 'Mobile app',
        description: 'Build the first mobile experience for customers on the go.',
        status: 'Planning',
        tasks: 12,
        completedTasks: 3,
        members: 4,
        dueDate: 'Jul 18, 2026',
        color: 'bg-violet-500',
    },
    {
        id: 'team-onboarding',
        name: 'Team onboarding',
        description: 'Create a smooth onboarding flow for new team members.',
        status: 'Completed',
        tasks: 18,
        completedTasks: 18,
        members: 3,
        dueDate: 'May 30, 2026',
        color: 'bg-emerald-500',
    },
];

const statusFilters = ['All', 'Active', 'Planning', 'Completed'] as const;
type StatusFilter = (typeof statusFilters)[number];

export default function Projects() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState<StatusFilter>('All');

    const filteredProjects = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesStatus = status === 'All' || project.status === status;
            const matchesQuery =
                !normalizedQuery ||
                project.name.toLowerCase().includes(normalizedQuery) ||
                project.description.toLowerCase().includes(normalizedQuery);

            return matchesStatus && matchesQuery;
        });
    }, [query, status]);

    if (!user) return null;

    return (
        <DashboardShell user={user} onLogout={logout}>
            <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
                <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Workspace</p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Projects</h1>
                        <p className="mt-2 text-muted-foreground">Plan, track, and deliver your team&apos;s work.</p>
                    </div>
                    <Button type="button" className="w-full sm:w-auto">
                        <Plus aria-hidden="true" />
                        New project
                    </Button>
                </section>

                <section aria-label="Project summary" className="grid gap-4 sm:grid-cols-3">
                    <SummaryCard label="Total projects" value={String(projects.length)} icon={FolderKanban} />
                    <SummaryCard label="Active projects" value={String(projects.filter((project) => project.status === 'Active').length)} icon={BriefcaseBusiness} />
                    <SummaryCard label="Completed projects" value={String(projects.filter((project) => project.status === 'Completed').length)} icon={CalendarDays} />
                </section>

                <section className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                aria-label="Search projects"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search projects..."
                                className="h-10 bg-background pl-9"
                            />
                        </div>
                        <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1" role="group" aria-label="Filter projects by status">
                            {statusFilters.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setStatus(filter)}
                                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                        status === filter ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                    aria-pressed={status === filter}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredProjects.length > 0 ? (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <FolderKanban aria-hidden="true" className="size-6" />
                                </div>
                                <h2 className="mt-4 text-lg font-semibold tracking-tight">No projects found</h2>
                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">Try a different search or status filter.</p>
                            </CardContent>
                        </Card>
                    )}
                </section>
            </div>
        </DashboardShell>
    );
}

function ProjectCard({ project }: { project: Project }) {
    const completion = Math.round((project.completedTasks / project.tasks) * 100);

    return (
        <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="gap-4">
                <div className="flex items-start justify-between gap-3">
                    <div className={`flex size-10 items-center justify-center rounded-xl ${project.color} text-white`}>
                        <FolderKanban aria-hidden="true" className="size-5" />
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{project.status}</span>
                </div>
                <div>
                    <CardTitle>{project.name}</CardTitle>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div>
                    <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{completion}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completion}%` }} />
                    </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project.completedTasks} of {project.tasks} tasks</span>
                    <span className="flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="size-3.5" />{project.dueDate}</span>
                </div>
                <div className="flex items-center gap-1.5 border-t pt-4 text-xs text-muted-foreground">
                    <Users aria-hidden="true" className="size-3.5" />
                    {project.members} {project.members === 1 ? 'member' : 'members'}
                </div>
            </CardContent>
        </Card>
    );
}

function SummaryCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof FolderKanban }) {
    return (
        <Card size="sm">
            <CardContent className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-4" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
