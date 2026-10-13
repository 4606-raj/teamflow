import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateTaskInput } from '@teamflow/types';

import { tasksApi } from '../api/tasks.api';

export function useUpdateTask(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<UpdateTaskInput, 'id'>) =>
      tasksApi.update(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
