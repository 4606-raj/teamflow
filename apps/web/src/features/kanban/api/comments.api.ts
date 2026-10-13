import { api } from '@/shared/api/api';
import type { CreateCommentInput } from '@teamflow/types';
import type { AxiosResponse } from 'axios';

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export const commentsApi = {
  create(data: CreateCommentInput): Promise<AxiosResponse<{ id: string }>> {
    return api.post('/comments', data);
  },

  getAll(taskId?: string | null): Promise<AxiosResponse<Comment[]>> {
    const params = taskId ? { taskId } : undefined;
    return api.get('/comments', { params });
  },
};