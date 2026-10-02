import { arrayMove } from '@dnd-kit/sortable';

import type {
  KanbanBoardData,
  KanbanColumnData,
} from '../types/kanban.types';

export function findColumnByTaskId(
  board: KanbanBoardData,
  taskId: string,
): KanbanColumnData | undefined {
  return board.columns.find((column) =>
    column.tasks.some((task) => task.id === taskId),
  );
}

/** Resolves an id that may be either a task id or a column id. */
export function findColumnByAnyId(
  board: KanbanBoardData,
  id: string,
): KanbanColumnData | undefined {
  return (
    findColumnByTaskId(board, id) ??
    board.columns.find((column) => column.id === id)
  );
}

export function getTaskPosition(board: KanbanBoardData, taskId: string) {
  const column = findColumnByTaskId(board, taskId);

  if (!column) {
    return null;
  }

  return {
    columnId: column.id,
    index: column.tasks.findIndex((task) => task.id === taskId),
  };
}

/**
 * Moves a task into the column of `overId` (a task or a column id).
 * Lands before the hovered task, or at the end when hovering the column itself.
 * Returns the same board reference when nothing changes.
 */
export function moveTaskAcrossColumns(
  board: KanbanBoardData,
  activeId: string,
  overId: string,
): KanbanBoardData {
  const source = findColumnByTaskId(board, activeId);
  const target = findColumnByAnyId(board, overId);

  if (!source || !target || source.id === target.id) {
    return board;
  }

  const task = source.tasks.find((t) => t.id === activeId);

  if (!task) {
    return board;
  }

  const overIndex = target.tasks.findIndex((t) => t.id === overId);
  const insertIndex = overIndex === -1 ? target.tasks.length : overIndex;

  return {
    ...board,
    columns: board.columns.map((column) => {
      if (column.id === source.id) {
        return {
          ...column,
          tasks: column.tasks.filter((t) => t.id !== activeId),
        };
      }

      if (column.id === target.id) {
        const tasks = [...column.tasks];
        tasks.splice(insertIndex, 0, task);
        return { ...column, tasks };
      }

      return column;
    }),
  };
}

/**
 * Reorders a task inside its own column. Dropping on the column itself
 * sends it to the end. Returns the same reference when nothing changes.
 */
export function reorderTaskInColumn(
  board: KanbanBoardData,
  activeId: string,
  overId: string,
): KanbanBoardData {
  const column = findColumnByTaskId(board, activeId);

  if (!column) {
    return board;
  }

  const overIsInColumn =
    overId === column.id || column.tasks.some((t) => t.id === overId);

  if (!overIsInColumn) {
    return board;
  }

  const oldIndex = column.tasks.findIndex((t) => t.id === activeId);
  const overIndex = column.tasks.findIndex((t) => t.id === overId);
  const newIndex = overIndex === -1 ? column.tasks.length - 1 : overIndex;

  if (oldIndex === -1 || oldIndex === newIndex) {
    return board;
  }

  return {
    ...board,
    columns: board.columns.map((c) =>
      c.id === column.id
        ? { ...c, tasks: arrayMove(c.tasks, oldIndex, newIndex) }
        : c,
    ),
  };
}
