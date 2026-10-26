import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { boardsApi } from '../api/boards.api';

export const boardsKey = (projectId?: string) => ['boards', projectId] as const;

export function useBoards(projectId?: string) {
  return useQuery({
    queryKey: boardsKey(projectId),
    queryFn: () => boardsApi.list(projectId as string),
    select: (res) => res.data,
    enabled: !!projectId,
  });
}

/** Add / rename / delete boards (columns) of a project. */
export function useBoardActions(projectId?: string) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: boardsKey(projectId) });

  const create = useMutation({
    mutationFn: (name: string) => boardsApi.create(projectId as string, { name }),
    onSuccess: invalidate,
  });

  const rename = useMutation({
    mutationFn: ({ boardId, name }: { boardId: string; name: string }) =>
      boardsApi.rename(boardId, { name }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (boardId: string) => boardsApi.remove(boardId),
    onSuccess: invalidate,
  });

  return { create, rename, remove };
}
