import { api } from '@/shared/api/api';
import type { CreateTaskInput, UpdateTaskInput } from '@teamflow/types';
import type { AxiosResponse } from 'axios';

export interface TaskListItem {
  id: string;
  ticketNumber: string;
  title: string;
  projectId: string;
  parentId: string | null;
}

export interface TaskDetail extends TaskListItem {
  description: string | null;
  dueDate: string | null;
  timeLogged: number;
  userId: string | null;
  reporterId: string | null;
  assignee: { id: string; email: string } | null;
  reporter: { id: string; email: string } | null;
  parent: { id: string; title: string } | null;
  project: { name: string };
}

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

  create(data: CreateTaskInput): Promise<AxiosResponse<{ id: string }>> {
    return api.post('/tasks', data);
  },
};
