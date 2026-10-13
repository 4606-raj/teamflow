import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '../api/tasks.api';
import type { UpdateTaskInput } from '../../../../../../packages/types/dist/tasks.schema';

/** All tasks (used for parent/subtask choices). */
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getAll,
    select: (res) => res.data,
  });
}

export function useTask(taskId: string | null) {
  return useQuery({
    queryKey: ['tasks', taskId],
    queryFn: () => tasksApi.getOne(taskId as string),
    select: (res) => res.data,
    enabled: !!taskId,
  });
}

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

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}