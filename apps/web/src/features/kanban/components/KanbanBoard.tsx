import { useCallback, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import { useBoardActions } from '../hooks/useBoards';
import { useKanban } from '../hooks/useKanban';
import { useKanbanDnd } from '../hooks/useKanbanDnd';

import { AddColumn } from './AddColumn';
import { KanbanColumn } from './KanbanColumn';
import { CreateTaskModal } from './CreateTaskModal';
import { KanbanTaskCardView } from './KanbanTaskCard';

export function KanbanBoard({ projectId }: { projectId?: string }) {
  const { board, setBoard, moveTask, isLoading, isError } =
    useKanban(projectId);

  const { create, rename, remove } = useBoardActions(projectId);
  const { mutate: renameBoard } = rename;
  const { mutate: removeBoard } = remove;

  const handleRename = useCallback(
    (boardId: string, name: string) => renameBoard({ boardId, name }),
    [renameBoard],
  );

  const handleDelete = useCallback(
    (boardId: string) => {
      if (window.confirm('Delete this column? It must be empty.')) {
        removeBoard(boardId);
      }
    },
    [removeBoard],
  );

  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const { sensors, collisionDetection, announcements, activeTask, handlers } =
    useKanbanDnd({ board, setBoard, onMoveTask: moveTask });

  if (!projectId) {
    return (
      <p className="text-sm text-muted-foreground">
        Open a project to see its board.
      </p>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading board…</p>;
  }

  if (isError) {
    return <p className="text-sm text-destructive">Failed to load the board.</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={{ announcements }}
      {...handlers}
    >
      <div className="flex h-[calc(100dvh-14rem)] min-h-96 snap-x snap-mandatory gap-4 overflow-x-auto sm:snap-none">
        {board.columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onOpenTask={setOpenTaskId}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}

        <AddColumn onAdd={create.mutateAsync} isPending={create.isPending} />
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
