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
      <div className="mx-auto w-full max-w-8xl space-y-4 p-4 sm:p-6">
        <section className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Tasks Board
            </h1>
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

        <KanbanBoard projectId={projectId} />

        <CreateTaskModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          projectId={projectId}
        />
      </div>
    </DashboardShell>
  );
}
