import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { DashboardShell } from '@/shared/layouts/DashboardShell';

import { Button } from '@/shared/components/ui';

import { CreateTaskModal } from '../components/CreateTaskModal';
import { KanbanBoard } from '../components/KanbanBoard';

export function KanbanPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {projectId ? 'Project' : 'Workspace'}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              Tasks Board
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage your tasks and workflow efficiently.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            disabled={!projectId}
            title={projectId ? undefined : 'Open a project board to create tasks'}
          >
            <Plus aria-hidden="true" />
            New Tasks
          </Button>
        </section>

        <KanbanBoard />

        <CreateTaskModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          projectId={projectId}
        />
      </div>
    </DashboardShell>
  );
}
