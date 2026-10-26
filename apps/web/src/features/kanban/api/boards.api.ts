import { api } from '@/shared/api/api';
import type {
  BoardSummary,
  BoardWithTasks,
  CreateBoardInput,
  UpdateBoardInput,
} from '@teamflow/types';
import type { AxiosResponse } from 'axios';

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
  ): Promise<AxiosResponse<BoardSummary>> {
    return api.patch(`/boards/${boardId}`, data);
  },

  remove(boardId: string): Promise<AxiosResponse<{ id: string }>> {
    return api.delete(`/boards/${boardId}`);
  },
};
