import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Check, LogOut, Mail, Plus, Sparkles, Users } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, Input, Label } from '@/shared/components/ui';
import { type CreateOrganizationSchema, createOrganizationSchema } from '@/features/organizaions';
import { organizationApi } from '@/features/organizaions/api/organizations.api';
import { useAuthStore } from '@/features/auth';
import type { Invitation } from '@teamflow/types';
import { invitationsApi } from '../api/invitations.api';

function OnboardingHeader({ firstName, onLogout }: { firstName: string | null; onLogout: () => void }) {
    return (
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b bg-muted/20 px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex items-start gap-3">
                <div className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm sm:flex">
                    <Sparkles aria-hidden="true" className="size-5" />
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Welcome{firstName ? `, ${firstName}` : ''}</p>
                    <p className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Set up your workspace</p>
                    <p className="mt-1 text-sm text-muted-foreground">Join your team or start a new workspace.</p>
                </div>
            </div>
            <Button type="button" size="sm" variant="ghost" className="-mr-2 shrink-0" onClick={onLogout}>
                <LogOut aria-hidden="true" />
                <span className="hidden sm:inline">Log out</span>
            </Button>
        </CardHeader>
    );
}

function InvitationItem({ invitation, pendingToken, onAction }: {
    invitation: Invitation;
    pendingToken: string | null;
    onAction: (invitation: Invitation, accepted: boolean) => void;
}) {
    const isPending = pendingToken === invitation.token;

    return (
        <li className="flex flex-col gap-4 rounded-xl border bg-card px-4 py-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 aria-hidden="true" className="size-5" />
                </div>
                <div className="min-w-0">
                    <h3 className="truncate font-medium tracking-tight">{invitation.organization.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail aria-hidden="true" className="size-3.5" />
                        Invited as {invitation.role.toLowerCase()}
                    </p>
                </div>
            </div>
            <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                <Button type="button" size="sm" className="flex-1 sm:flex-none" onClick={() => onAction(invitation, true)} disabled={pendingToken !== null || invitation.token === null}>
                    <Check aria-hidden="true" />
                    {isPending ? 'Working...' : 'Accept'}
                </Button>
                <Button type="button" size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => onAction(invitation, false)} disabled={pendingToken !== null || invitation.token === null}>
                    Reject
                </Button>
            </div>
        </li>
    );
}

function CreateOrganizationForm() {
    const navigate = useNavigate();
    const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateOrganizationSchema>({
        resolver: zodResolver(createOrganizationSchema),
        defaultValues: { name: '' },
    });

    const onSubmit = async (data: CreateOrganizationSchema) => {
        await organizationApi.create(data);
        await fetchCurrentUser();
        navigate('/');
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
                <Label htmlFor="organizationName">Organization name</Label>
                <Input id="organizationName" type="text" placeholder="Acme Inc." autoComplete="organization-name" className="h-11 bg-background" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                <Plus aria-hidden="true" />
                {isSubmitting ? 'Creating...' : 'Create organization'}
                {!isSubmitting && <ArrowRight aria-hidden="true" className="ml-auto" />}
            </Button>
        </form>
    );
}

export default function Onboarding() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
    const user = useAuthStore((state) => state.user);
    const [pendingToken, setPendingToken] = useState<string | null>(null);

    if (!user) return null;

    const invitations = user.invitations ?? [];
    const handleInvitation = async (invitation: Invitation, accepted: boolean) => {
        if (!invitation.token) return;

        setPendingToken(invitation.token);
        try {
            if (accepted) await invitationsApi.accept(invitation.token);
            else await invitationsApi.reject(invitation.token);

            const updatedUser = await fetchCurrentUser();
            if (accepted && updatedUser?.organizations?.length) navigate('/');
        } finally {
            setPendingToken(null);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/30 px-4 py-8 sm:px-6 sm:py-12">
            <div className="pointer-events-none absolute -left-32 -top-32 size-80 rounded-full bg-primary/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-20 size-96 rounded-full bg-primary/5 blur-3xl" />
            <Card className="relative w-full max-w-3xl border-border/70 shadow-2xl shadow-black/10">
                <OnboardingHeader firstName={user.firstName} onLogout={logout} />
                <CardContent className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
                    <section aria-labelledby="invitations-heading">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Users aria-hidden="true" className="size-4 text-primary" />
                                    <h2 id="invitations-heading" className="text-base font-semibold tracking-tight">Join a team</h2>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">Accept an invitation to collaborate with your team.</p>
                            </div>
                            {invitations.length > 0 && (
                                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                    {invitations.length} {invitations.length === 1 ? 'invite' : 'invites'}
                                </span>
                            )}
                        </div>
                        {invitations.length > 0 ? (
                            <ul className="space-y-2">
                                {invitations.map((invitation) => <InvitationItem key={invitation.id} invitation={invitation} pendingToken={pendingToken} onAction={handleInvitation} />)}
                            </ul>
                        ) : (
                            <div className="flex items-start gap-3 rounded-xl border border-dashed bg-muted/20 p-4">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
                                    <Mail aria-hidden="true" className="size-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">No pending invitations</p>
                                    <p className="mt-0.5 text-sm text-muted-foreground">You can create a workspace below, or ask a teammate to invite you.</p>
                                </div>
                            </div>
                        )}
                    </section>
                    <section aria-labelledby="create-organization-heading" className="rounded-2xl border bg-muted/20 p-5 sm:p-6">
                        <div className="mb-5 flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
                                <Building2 aria-hidden="true" className="size-5" />
                            </div>
                            <div>
                                <h2 id="create-organization-heading" className="text-base font-semibold tracking-tight">Create a workspace</h2>
                                <p className="mt-1 text-sm text-muted-foreground">Start a shared space for your team, projects, and conversations.</p>
                            </div>
                        </div>
                        <CreateOrganizationForm />
                    </section>
                </CardContent>
            </Card>
        </main>
    );
}