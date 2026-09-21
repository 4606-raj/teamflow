import { api } from '@/shared/api/api';
import { type CreateProjectRequest, type Project } from '@teamflow/types';
import { type AxiosResponse } from 'axios';

export const projectApi = {
	create(data: CreateProjectRequest): Promise<AxiosResponse<Project>> {
		return api.post('/projects', data);
	},

	list(): Promise<AxiosResponse<Project[]>> {
		return api.get('/projects');
	}
}