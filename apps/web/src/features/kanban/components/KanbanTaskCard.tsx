import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { CalendarDays, CornerDownRight, ListTree } from 'lucide-react';

import { Card } from '@/shared/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/utils/cn';
import { formatDate, isPastDue } from '@/shared/utils/date';
import { getInitials } from '@/shared/utils/initials';

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
  // Tooltips would pop up mid-drag over the moving card.
  const hideTooltips = isOverlay || isDragging;
  return (
    <Card
      className={cn(
        'shrink-0 p-3 transition-shadow',
        isOverlay
          ? 'cursor-grabbing shadow-xl'
          : 'cursor-pointer active:cursor-grabbing',
        isDragging ? 'cursor-grabbing opacity-40' : undefined,
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <Tooltip disabled={hideTooltips}>
          <TooltipTrigger
            render={<span />}
            className="min-w-0 text-sm font-medium"
          >
            <span className="text-xs font-normal text-muted-foreground">
              {task.ticketNumber}
            </span>
            <span className="line-clamp-2 break-words">{task.title}</span>
          </TooltipTrigger>
          <TooltipContent>{`${task.ticketNumber} ${task.title}`}</TooltipContent>
        </Tooltip>

        <Tooltip disabled={hideTooltips}>
          <TooltipTrigger
            render={<span />}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
          >
            {getInitials(task.assigneeName)}
          </TooltipTrigger>
          <TooltipContent>{task.assigneeName ?? 'Unassigned'}</TooltipContent>
        </Tooltip>
      </div>

      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
        {task.subtaskCount > 0 && (
          <span className="flex items-center gap-1">
            <ListTree className="size-3.5" />
            Parent · {task.subtaskCount}
          </span>
        )}
        {task.isChild && (
          <span className="flex items-center gap-1">
            <CornerDownRight className="size-3.5" />
            Child
          </span>
        )}
        {task.dueDate && (
          <span
            className={cn(
              'ml-auto flex items-center gap-1',
              isPastDue(task.dueDate) ? 'text-destructive' : undefined,
            )}
          >
            <CalendarDays className="size-3.5" />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </Card>
  );
}

export const KanbanTaskCard = memo(function KanbanTaskCard({
  task,
  onOpen,
}: {
  task: KanbanTask;
  onOpen?: (taskId: string) => void;
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
      // MouseSensor needs 5px of movement to drag, so a plain click still fires.
      onClick={() => onOpen?.(task.id)}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      {...attributes}
      {...listeners}
    />
  );
});
