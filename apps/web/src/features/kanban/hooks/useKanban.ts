import { useCallback, useMemo, useState } from 'react';

import type { BoardWithTasks } from '../api/boards.api';
import { useBoards } from './useBoards';
import { useMoveTask } from './useTasks';
import type {
  KanbanBoardData,
  KanbanTaskMove,
} from '../types/kanban.types';

function buildBoard(
  boards: BoardWithTasks[] | undefined,
  projectId?: string,
): KanbanBoardData {
  return {
    id: projectId ?? 'no-project',
    columns: (boards ?? []).map((board) => ({
      id: board.id,
      name: board.name,
      tasks: board.tasks.map((t) => ({
        id: t.id,
        ticketNumber: t.ticketNumber,
        title: t.title,
        dueDate: t.dueDate,
        assigneeName: t.assignee
          ? [t.assignee.firstName, t.assignee.lastName].filter(Boolean).join(' ') || null
          : null,
        isChild: !!t.parentId,
        subtaskCount: t._count.subtasks,
      })),
    })),
  };
}

/**
 * Board data + persistence. Columns and their tasks come from the boards API;
 * moves are sent to the API on drop. Drag state lives in useKanbanDnd, not here.
 */
export function useKanban(projectId?: string) {
  const { data: boards, isLoading, isError } = useBoards(projectId);
  const [local, setLocal] = useState<{
    boards: BoardWithTasks[] | undefined;
    projectId?: string;
    board: KanbanBoardData;
  } | null>(null);

  // Memoized so card props keep their identity between renders; a fresh
  // board every render would defeat memo() on every card during a drag.
  const sourceBoard = useMemo(
    () => buildBoard(boards, projectId),
    [boards, projectId],
  );

  const sourceChanged =
    !local || local.boards !== boards || local.projectId !== projectId;

  // Rebuild from server data whenever it (or the project) changes; drags
  // after that update `local` until the next refetch.
  const board: KanbanBoardData = sourceChanged
    ? sourceBoard
    : local.board;

  const setBoard = useCallback(
    (next: KanbanBoardData | ((prev: KanbanBoardData) => KanbanBoardData)) => {
      setLocal((prev) => {
        const base = prev && !sourceChanged ? prev.board : board;
        return {
          boards,
          projectId,
          board: typeof next === 'function' ? next(base) : next,
        };
      });
    },
    [boards, projectId, sourceChanged, board],
  );

  const { mutate: persistMove } = useMoveTask(projectId);

  // Called once per completed drag that changed a task's column or position.
  // `board` already reflects the move (optimistic); a failed request refetches
  // the boards, which resets it to the server state.
  const moveTask = useCallback(
    (move: KanbanTaskMove) =>
      persistMove({
        taskId: move.taskId,
        boardId: move.toColumnId,
        position: move.toIndex,
      }),
    [persistMove],
  );

  return { board, setBoard, moveTask, isLoading, isError };
}
