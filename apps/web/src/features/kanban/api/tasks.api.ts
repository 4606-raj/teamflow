import { api } from '@/shared/api/api';
import type { CreateTaskInput } from '@teamflow/types';
import type { AxiosResponse } from 'axios';

export interface TaskListItem {
  id: string;
  ticketNumber: string;
  title: string;
  projectId: string;
  parentId: string | null;
}

export const tasksApi = {
  getAll(): Promise<AxiosResponse<TaskListItem[]>> {
    return api.get('/tasks');
  },

  create(data: CreateTaskInput): Promise<AxiosResponse<{ id: string }>> {
    return api.post('/tasks', data);
  },
};
