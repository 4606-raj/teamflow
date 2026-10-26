import { api } from '@/shared/api/api';
import type {
  CreateTaskInput,
  MoveTaskInput,
  TaskDetail,
  TaskListItem,
  UpdateTaskInput,
} from '@teamflow/types';
import type { AxiosResponse } from 'axios';

export const tasksApi = {
  getAll(): Promise<AxiosResponse<TaskListItem[]>> {
    return api.get('/tasks');
  },

  getOne(id: string): Promise<AxiosResponse<TaskDetail>> {
    return api.get(`/tasks/${id}`);
  },

  update(
    id: string,
    data: Omit<UpdateTaskInput, 'id'>,
  ): Promise<AxiosResponse<{ id: string }>> {
    return api.put(`/tasks/${id}`, { ...data, id });
  },

  move(
    id: string,
    data: MoveTaskInput,
  ): Promise<AxiosResponse<{ id: string; boardId: string; position: number }>> {
    return api.put(`/tasks/${id}/move`, data);
  },

  create(data: CreateTaskInput): Promise<AxiosResponse<{ id: string }>> {
    return api.post('/tasks', data);
  },
};
