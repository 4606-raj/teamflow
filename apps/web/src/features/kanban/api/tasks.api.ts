import { api } from '@/shared/api/api';
import type { CreateTaskInput } from '@teamflow/types';
import type { AxiosResponse } from 'axios';

export const tasksApi = {
  create(data: CreateTaskInput): Promise<AxiosResponse<{ id: string }>> {
    return api.post('/tasks', data);
  },
};
