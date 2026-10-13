import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import { useKanban } from '../hooks/useKanban';
import { useKanbanDnd } from '../hooks/useKanbanDnd';

import { KanbanColumn } from './KanbanColumn';
import { CreateTaskModal } from './CreateTaskModal';
import { KanbanTaskCardView } from './KanbanTaskCard';

export function KanbanBoard({ projectId }: { projectId?: string }) {
  const { board, setBoard, moveTask, isLoading, isError } =
    useKanban(projectId);

  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const { sensors, collisionDetection, announcements, activeTask, handlers } =
    useKanbanDnd({ board, setBoard, onMoveTask: moveTask });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading tasks…</p>;
  }

  if (isError) {
    return <p className="text-sm text-destructive">Failed to load tasks.</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={{ announcements }}
      {...handlers}
    >
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:snap-none">
        {board.columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onOpenTask={setOpenTaskId}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <KanbanTaskCardView task={activeTask} isOverlay /> : null}
      </DragOverlay>

      {openTaskId && (
        <CreateTaskModal
          key={openTaskId}
          open
          onOpenChange={(open) => {
            if (!open) setOpenTaskId(null);
          }}
          taskId={openTaskId}
        />
      )}
    </DndContext>
  );
}
