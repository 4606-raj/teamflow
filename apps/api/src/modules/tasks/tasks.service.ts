import { Injectable } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import { UpdateTaskRequest, type CreateTaskRequest } from '@teamflow/types'

@Injectable()
export class TasksService {
	constructor(private readonly tasksRepo: TasksRepository) {}

	async getAll() {
		return this.tasksRepo.getAll();
	}

	async getOne(taskId: string) {
		l(taskId)
		return this.tasksRepo.getOne(taskId);
	}
	
	async create(data: CreateTaskRequest) {
		return this.tasksRepo.create(data);
	}

	async update(data: UpdateTaskRequest) {
		return this.tasksRepo.update(data);
	}
}
