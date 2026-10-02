import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/utils/cn';

import type { KanbanTask } from '../types/kanban.types';

interface KanbanTaskCardViewProps
  extends Omit<React.ComponentProps<typeof Card>, 'children'> {
  task: KanbanTask;
  isOverlay?: boolean;
  isDragging?: boolean;
}

/** Presentational card, used by the sortable item and the drag overlay. */
export function KanbanTaskCardView({
  task,
  isOverlay = false,
  isDragging = false,
  className,
  ...props
}: KanbanTaskCardViewProps) {
  return (
    <Card
      className={cn(
        'p-3 transition-shadow',
        isOverlay
          ? 'cursor-grabbing shadow-xl'
          : 'cursor-grab active:cursor-grabbing',
        isDragging ? 'opacity-40' : undefined,
        className,
      )}
      {...props}
    >
      <div className="text-xs text-muted-foreground">{task.ticketNumber}</div>
      <div className="mt-1 text-sm font-medium">{task.title}</div>
    </Card>
  );
}

export const KanbanTaskCard = memo(function KanbanTaskCard({
  task,
}: {
  task: KanbanTask;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  return (
    <KanbanTaskCardView
      ref={setNodeRef}
      task={task}
      isDragging={isDragging}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      {...attributes}
      {...listeners}
    />
  );
});
