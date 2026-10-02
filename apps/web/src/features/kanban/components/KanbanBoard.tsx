import { DndContext, DragOverlay } from '@dnd-kit/core';

import { useKanban } from '../hooks/useKanban';
import { useKanbanDnd } from '../hooks/useKanbanDnd';

import { KanbanColumn } from './KanbanColumn';
import { KanbanTaskCardView } from './KanbanTaskCard';

export function KanbanBoard() {
  const { board, setBoard, moveTask } = useKanban();

  const { sensors, collisionDetection, announcements, activeTask, handlers } =
    useKanbanDnd({ board, setBoard, onMoveTask: moveTask });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={{ announcements }}
      {...handlers}
    >
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:snap-none">
        {board.columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <KanbanTaskCardView task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
