import { useCallback, useState } from 'react';

import type { TaskListItem } from '../api/tasks.api';
import { useTasks } from './useTasks';
import type {
  KanbanBoardData,
  KanbanTaskMove,
} from '../types/kanban.types';

// Tasks have no status/board assignment in the API yet, so every top-level
// task lands in the first column until a move-task endpoint exists.
const emptyColumns = (): KanbanBoardData['columns'] => [
  { id: 'todo', name: 'Todo', tasks: [] },
  { id: 'in-progress', name: 'In Progress', tasks: [] },
  { id: 'done', name: 'Done', tasks: [] },
];

function buildBoard(
  tasks: TaskListItem[] | undefined,
  projectId?: string,
): KanbanBoardData {
  const columns = emptyColumns();
  columns[0].tasks = (tasks ?? [])
    .filter((t) => !t.parentId && (!projectId || t.projectId === projectId))
    .map(({ id, ticketNumber, title }) => ({ id, ticketNumber, title }));
  return { id: 'board-1', columns };
}

/**
 * Board data + persistence. Tasks come from the tasks API; column moves are
 * local only for now. Drag state lives in useKanbanDnd, not here.
 */
export function useKanban(projectId?: string) {
  const { data: tasks, isLoading, isError } = useTasks();
  const [local, setLocal] = useState<{
    tasks: TaskListItem[] | undefined;
    projectId?: string;
    board: KanbanBoardData;
  } | null>(null);

  const sourceChanged =
    !local || local.tasks !== tasks || local.projectId !== projectId;

  // Rebuild from server data whenever it (or the project) changes; drags
  // after that update `local` until the next refetch.
  const board: KanbanBoardData = sourceChanged
    ? buildBoard(tasks, projectId)
    : local.board;

  const setBoard = useCallback(
    (next: KanbanBoardData | ((prev: KanbanBoardData) => KanbanBoardData)) => {
      setLocal((prev) => {
        const base = prev && !sourceChanged ? prev.board : board;
        return {
          tasks,
          projectId,
          board: typeof next === 'function' ? next(base) : next,
        };
      });
    },
    [tasks, projectId, sourceChanged, board],
  );

  // Called once per completed drag that changed a task's column or position.
  // `board` already reflects the move (optimistic); on API failure, restore it.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const moveTask = useCallback((_move: KanbanTaskMove) => {
    // TODO: call move-task API here.
  }, []);

  return { board, setBoard, moveTask, isLoading, isError };
}
