import { useQuery } from '@tanstack/react-query';

import { tasksApi } from '../api/tasks.api';

/** All tasks (used for parent/subtask choices). */
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getAll,
    select: (res) => res.data,
  });
}
