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
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

export const moveTaskMutationKey = ['moveTask'] as const;

/**
 * Persists a drag-and-drop move. The board already shows the move (drag
 * state), so this only reconciles: on failure the boards are refetched to
 * undo it, and a refetch after the last in-flight move syncs with the server.
 */
export function useMoveTask(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: moveTaskMutationKey,
    mutationFn: ({ taskId, boardId, position }: {
      taskId: string;
      boardId: string;
      position: number;
    }) => tasksApi.move(taskId, { boardId, position }),
    onMutate: () =>
      // A stale in-flight fetch must not overwrite the optimistic board.
      queryClient.cancelQueries({ queryKey: ['boards', projectId] }),
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: moveTaskMutationKey }) <= 1) {
        queryClient.invalidateQueries({ queryKey: ['boards', projectId] });
      }
    },
  });
}
