import { useCallback, useEffect, useRef, useState } from 'react';
import {
  closestCenter,
  closestCorners,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import type {
  KanbanBoardData,
  KanbanTaskMove,
} from '../types/kanban.types';
import {
  findColumnByAnyId,
  findColumnByTaskId,
  getTaskPosition,
  moveTaskAcrossColumns,
  reorderTaskInColumn,
} from '../utils/board';

interface UseKanbanDndOptions {
  board: KanbanBoardData;
  setBoard: React.Dispatch<React.SetStateAction<KanbanBoardData>>;
  onMoveTask: (move: KanbanTaskMove) => void;
}

export function useKanbanDnd({
  board,
  setBoard,
  onMoveTask,
}: UseKanbanDndOptions) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Always-current board for handlers/collision detection, and the board as
  // it was when the drag started (to revert on cancel and to diff on drop).
  const boardRef = useRef(board);
  const snapshotRef = useRef<KanbanBoardData | null>(null);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Pointer position decides the column; inside it, the nearest card decides
  // the slot. Falls back to corners for keyboard dragging (no pointer).
  const collisionDetection = useCallback<CollisionDetection>((args) => {
    const pointerHits = pointerWithin(args);

    if (pointerHits.length === 0) {
      return closestCorners(args);
    }

    const current = boardRef.current;
    const taskHit = pointerHits.find((hit) =>
      findColumnByTaskId(current, String(hit.id)),
    );

    if (taskHit) {
      return [taskHit];
    }

    // Pointer is over a column but not over a card (gap / empty space).
    const column = current.columns.find(
      (c) => c.id === String(pointerHits[0].id),
    );

    if (!column || column.tasks.length === 0) {
      return pointerHits.slice(0, 1);
    }

    const taskIds = new Set(column.tasks.map((t) => t.id));
    const closest = closestCenter({
      ...args,
      droppableContainers: args.droppableContainers.filter((container) =>
        taskIds.has(String(container.id)),
      ),
    });

    return closest.length > 0 ? closest : pointerHits.slice(0, 1);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    snapshotRef.current = boardRef.current;
    setActiveTaskId(String(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    setBoard((current) => moveTaskAcrossColumns(current, activeId, overId));
  };

  const resetDrag = () => {
    snapshotRef.current = null;
    setActiveTaskId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const snapshot = snapshotRef.current;

    if (!over || !snapshot) {
      // Dropped outside any column: undo the live preview.
      if (snapshot) {
        setBoard(snapshot);
      }
      resetDrag();
      return;
    }

    const activeId = String(active.id);
    const finalBoard = reorderTaskInColumn(
      boardRef.current,
      activeId,
      String(over.id),
    );

    setBoard(finalBoard);

    const from = getTaskPosition(snapshot, activeId);
    const to = getTaskPosition(finalBoard, activeId);

    if (
      from &&
      to &&
      (from.columnId !== to.columnId || from.index !== to.index)
    ) {
      onMoveTask({
        taskId: activeId,
        fromColumnId: from.columnId,
        fromIndex: from.index,
        toColumnId: to.columnId,
        toIndex: to.index,
      });
    }

    resetDrag();
  };

  const handleDragCancel = () => {
    if (snapshotRef.current) {
      setBoard(snapshotRef.current);
    }
    resetDrag();
  };

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${taskLabel(boardRef.current, String(active.id))}.`,
    onDragOver: ({ active, over }) =>
      over
        ? `${taskLabel(boardRef.current, String(active.id))} is over ${columnLabel(boardRef.current, String(over.id))}.`
        : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? `${taskLabel(boardRef.current, String(active.id))} was dropped in ${columnLabel(boardRef.current, String(over.id))}.`
        : `${taskLabel(boardRef.current, String(active.id))} was dropped.`,
    onDragCancel: ({ active }) =>
      `Move cancelled. ${taskLabel(snapshotRef.current ?? boardRef.current, String(active.id))} returned to its column.`,
  };

  const activeTask = activeTaskId
    ? board.columns
        .flatMap((column) => column.tasks)
        .find((task) => task.id === activeTaskId) ?? null
    : null;

  return {
    sensors,
    collisionDetection,
    announcements,
    activeTask,
    handlers: {
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDragEnd: handleDragEnd,
      onDragCancel: handleDragCancel,
    },
  };
}

function taskLabel(board: KanbanBoardData, taskId: string) {
  const task = board.columns
    .flatMap((column) => column.tasks)
    .find((t) => t.id === taskId);

  return task ? `${task.ticketNumber} ${task.title}` : 'task';
}

function columnLabel(board: KanbanBoardData, id: string) {
  return `column ${findColumnByAnyId(board, id)?.name ?? ''}`.trim();
}
