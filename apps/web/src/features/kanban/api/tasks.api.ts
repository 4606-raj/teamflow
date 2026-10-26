import { api } from '@/shared/api/api';
import type {
  CreateTaskInput,
  MoveTaskInput,
  UpdateTaskInput,
} from '@teamflow/types';
import type { AxiosResponse } from 'axios';

export interface TaskListItem {
  id: string;
  ticketNumber: string;
  title: string;
  projectId: string;
  parentId: string | null;
  dueDate: string | null;
  assignee: { firstName: string | null; lastName: string | null } | null;
  _count: { subtasks: number };
}

export interface TaskDetail
  extends Omit<TaskListItem, 'assignee' | '_count'> {
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
