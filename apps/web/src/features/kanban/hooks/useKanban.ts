import { useCallback, useState } from 'react';

import type {
  KanbanBoardData,
  KanbanTaskMove,
} from '../types/kanban.types';

const initialBoard: KanbanBoardData = {
  id: 'board-1',
  columns: [
    {
      id: 'todo',
      name: 'Todo',
      tasks: [
        {
          id: 'task-1',
          ticketNumber: 'TF-101',
          title: 'Create authentication UI',
        },
        {
          id: 'task-2',
          ticketNumber: 'TF-102',
          title: 'Create project dashboard',
        },
      ],
    },
    {
      id: 'in-progress',
      name: 'In Progress',
      tasks: [
        {
          id: 'task-3',
          ticketNumber: 'TF-103',
          title: 'Implement project API',
        },
      ],
    },
    {
      id: 'done',
      name: 'Done',
      tasks: [
        {
          id: 'task-4',
          ticketNumber: 'TF-104',
          title: 'Setup authentication',
        },
      ],
    },
  ],
};

/**
 * Board data + persistence. Local state for now; swap the internals for a
 * react-query query/mutation once the API is wired. Drag state lives in
 * useKanbanDnd, not here.
 */
export function useKanban() {
  const [board, setBoard] = useState<KanbanBoardData>(initialBoard);

  // Called once per completed drag that changed a task's column or position.
  // `board` already reflects the move (optimistic); on API failure, restore it.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const moveTask = useCallback((_move: KanbanTaskMove) => {
    // TODO: call move-task API here.
  }, []);

  return { board, setBoard, moveTask };
}
