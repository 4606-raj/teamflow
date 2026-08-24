import { useAuthStore } from '@/features/auth';
import { useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, Clock3, ListTodo, Plus, type LucideIcon } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';
import { DashboardShell } from '../components/DashboardShell';

export default function Dashboard() {
    const logout = useAuthStore(state => state.logout);
    const me = useAuthStore(state => state.fetchCurrentUser);
    const user = useAuthStore(state => state.user);

    useEffect(() => {
        me();
    }, [me]);

    if (!user) return null;

    const firstName = user.firstName || 'there';
    const today = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date());

    return (
        <DashboardShell user={user} onLogout={logout}>
            <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
                <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{today}</p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Good morning, {firstName}</h1>
                        <p className="mt-2 text-muted-foreground">Here&apos;s what&apos;s happening across your workspace.</p>
                    </div>
                    <Button type="button" className="w-full sm:w-auto">
                        <Plus aria-hidden="true" />
                        Create task
                    </Button>
                </section>

                <section aria-label="Workspace summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard label="Total tasks" value="24" detail="+12% from last week" icon={ListTodo} />
                    <SummaryCard label="Completed" value="18" detail="+8% from last week" icon={CheckCircle2} />
                    <SummaryCard label="In progress" value="6" detail="2 due today" icon={Clock3} />
                    <SummaryCard label="Team members" value={String(user?.organizations?.length || 1)} detail="Active members" icon={ListTodo} />
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between border-b">
                            <div>
                                <CardTitle>Recent tasks</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">Stay up to date with your team&apos;s work.</p>
                            </div>
                            <Button type="button" variant="ghost" size="sm">View all <ArrowUpRight aria-hidden="true" /></Button>
                        </CardHeader>
                        <CardContent className="divide-y p-0">
                            {['Finalize project brief', 'Review design feedback', 'Prepare sprint planning'].map((task, index) => (
                                <div key={task} className="flex items-center gap-3 px-6 py-4">
                                    <span className={index === 0 ? 'size-2 rounded-full bg-amber-500' : 'size-2 rounded-full bg-primary'} />
                                    <span className="flex-1 text-sm font-medium">{task}</span>
                                    <span className="text-xs text-muted-foreground">{index === 0 ? 'Today' : `${index + 1}d ago`}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick start</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">Common actions to keep moving.</p>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Button type="button" variant="outline" className="justify-start"><Plus aria-hidden="true" /> Create a task</Button>
                            <Button type="button" variant="outline" className="justify-start"><ListTodo aria-hidden="true" /> Browse projects</Button>
                            <Button type="button" variant="outline" className="justify-start"><ArrowUpRight aria-hidden="true" /> Invite teammates</Button>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </DashboardShell>
    );
}

function SummaryCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: LucideIcon }) {
    return (
        <Card size="sm">
            <CardContent className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
                </div>
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-4" />
                </div>
            </CardContent>
        </Card>
    );
}