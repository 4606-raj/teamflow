import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/utils/cn';

import { KanbanColumnHeader } from './KanbanColumnHeader';
import { KanbanTaskCard } from './KanbanTaskCard';

import type { KanbanColumnData } from '../types/kanban.types';

interface KanbanColumnProps {
  column: KanbanColumnData;
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const isEmpty = column.tasks.length === 0;

  return (
    <div className="flex w-[85vw] shrink-0 snap-start flex-col gap-3 sm:w-80">
      <KanbanColumnHeader
        name={column.name}
        taskCount={column.tasks.length}
      />

      <Card
        ref={setNodeRef}
        className={cn(
          'flex min-h-32 flex-1 flex-col gap-2 bg-muted/40 p-2 transition-colors',
          isOver ? 'bg-muted/70' : undefined,
        )}
      >
        <SortableContext
          items={column.tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <KanbanTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {isEmpty && (
          <div
            className={cn(
              'flex min-h-24 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground',
              isOver ? 'border-primary/50 bg-primary/5' : undefined,
            )}
          >
            {isOver ? 'Drop task here' : 'No tasks'}
          </div>
        )}
      </Card>
    </div>
  );
}
