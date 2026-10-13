import { useQuery } from '@tanstack/react-query';

import { tasksApi } from '../api/tasks.api';

export function useTask(taskId: string | null) {
  return useQuery({
    queryKey: ['tasks', taskId],
    queryFn: () => tasksApi.getOne(taskId as string),
    select: (res) => res.data,
    enabled: !!taskId,
  });
}
