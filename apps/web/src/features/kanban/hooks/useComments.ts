import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments.api';

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useGetComments(taskId?: string | null) {

  return useQuery({
    queryKey: ['comments', 'taskId'],
    queryFn: () => commentsApi.getAll(taskId),
    select: data => data.data
  });
}