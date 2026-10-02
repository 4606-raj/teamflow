import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '../api/tasks.api';

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
