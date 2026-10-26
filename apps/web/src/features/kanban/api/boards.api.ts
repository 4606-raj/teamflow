import { api } from '@/shared/api/api';
import type { CreateBoardInput, UpdateBoardInput } from '@teamflow/types';
import type { AxiosResponse } from 'axios';

import type { TaskListItem } from './tasks.api';

export interface BoardWithTasks {
  id: string;
  name: string;
  position: number;
  tasks: TaskListItem[];
}

export const boardsApi = {
  list(projectId: string): Promise<AxiosResponse<BoardWithTasks[]>> {
    return api.get(`/projects/${projectId}/boards`);
  },

  create(
    projectId: string,
    data: CreateBoardInput,
  ): Promise<AxiosResponse<BoardWithTasks>> {
    return api.post(`/projects/${projectId}/boards`, data);
  },

  rename(
    boardId: string,
    data: UpdateBoardInput,
  ): Promise<AxiosResponse<Omit<BoardWithTasks, 'tasks'>>> {
    return api.patch(`/boards/${boardId}`, data);
  },

  remove(boardId: string): Promise<AxiosResponse<{ id: string }>> {
    return api.delete(`/boards/${boardId}`);
  },
};
