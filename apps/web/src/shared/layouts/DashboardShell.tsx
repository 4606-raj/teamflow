import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Bell,
    BriefcaseBusiness,
    CheckSquare,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Menu,
    Search,
    Settings,
    Users,
    X,
} from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import type { User } from '@teamflow/types';

const navigation = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'My tasks', href: '/tasks', icon: CheckSquare },
    { label: 'Projects', href: '/projects', icon: BriefcaseBusiness },
    { label: 'Team', href: '/team', icon: Users },
];

function UserAvatar({ user }: { user: User }) {
    const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}` || user.email[0].toUpperCase();

    return (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {initials.toUpperCase()}
        </div>
    );
}

function Sidebar({ user, onLogout, onClose }: { user: User; onLogout: () => void; onClose?: () => void }) {
    const organization = user.organizations?.[0] ?? null;

    return (
        <aside className="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
            <div className="flex h-16 items-center justify-between border-b px-5">
                <NavLink to="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <CheckSquare aria-hidden="true" className="size-4" />
                    </span>
                    Teamflow
                </NavLink>
                {onClose && (
                    <Button type="button" variant="ghost" size="icon-sm" className="lg:hidden" onClick={onClose} aria-label="Close menu">
                        <X aria-hidden="true" />
                    </Button>
                )}
            </div>

            <div className="border-b p-3">
                <button type="button" className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent">
                    <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary/10 text-xs font-semibold text-sidebar-primary">
                        {organization?.name?.slice(0, 1).toUpperCase() ?? 'T'}
                    </div>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{organization?.name ?? 'Personal workspace'}</span>
                    <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                </button>
            </div>

            <nav aria-label="Main navigation" className="flex-1 space-y-1 p-3">
                <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workspace</p>
                {navigation.map(({ label, href, icon: Icon }) => (
                    <NavLink
                        key={href}
                        to={href}
                        onClick={onClose}
                        className={({ isActive }) => cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                            isActive
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                : 'text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-foreground',
                        )}
                    >
                        <Icon aria-hidden="true" className="size-4" />
                        {label}
                    </NavLink>
                ))}
                <p className="px-3 pb-2 pt-7 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Manage</p>
                <NavLink
                    to="/settings"
                    onClick={onClose}
                    className={({ isActive }) => cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-foreground',
                    )}
                >
                    <Settings aria-hidden="true" className="size-4" />
                    Settings
                </NavLink>
            </nav>

            <div className="border-t p-3">
                <div className="flex items-center gap-3 rounded-lg p-2">
                    <UserAvatar user={user} />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{user.firstName || user.email}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={onLogout} aria-label="Log out">
                        <LogOut aria-hidden="true" />
                    </Button>
                </div>
            </div>
        </aside>
    );
}

function Header({ user, onMenuClick }: { user: User; onMenuClick: () => void }) {
    return (
        <header className="flex h-16 items-center gap-3 border-b bg-background px-4 sm:px-6">
            <Button type="button" variant="ghost" size="icon-sm" className="lg:hidden" onClick={onMenuClick} aria-label="Open menu">
                <Menu aria-hidden="true" />
            </Button>
            <div className="relative hidden max-w-sm flex-1 sm:block">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input aria-label="Search" placeholder="Search anything..." className="h-9 bg-muted/30 pl-9" />
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Notifications">
                    <Bell aria-hidden="true" />
                </Button>
                <div className="hidden items-center gap-2 border-l pl-3 sm:flex">
                    <UserAvatar user={user} />
                    <span className="max-w-32 truncate text-sm font-medium">{user.firstName || user.email}</span>
                </div>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer className="border-t px-6 py-4 text-center text-xs text-muted-foreground sm:text-left">
            <span>© {new Date().getFullYear()} Teamflow</span>
            <span className="mx-2">·</span>
            <span>Built for better collaboration</span>
        </footer>
    );
}

export function DashboardShell({ user, onLogout, children }: { user: User; onLogout: () => void; children: ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-muted/20">
            <div className="hidden lg:block">
                <Sidebar user={user} onLogout={onLogout} />
            </div>
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setIsMenuOpen(false)} aria-hidden="true" />
            )}
            <div className={cn('fixed inset-y-0 left-0 z-50 transition-transform lg:hidden', isMenuOpen ? 'translate-x-0' : '-translate-x-full')}>
                <Sidebar user={user} onLogout={onLogout} onClose={() => setIsMenuOpen(false)} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
                <Header user={user} onMenuClick={() => setIsMenuOpen(true)} />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </div>
    );
}
