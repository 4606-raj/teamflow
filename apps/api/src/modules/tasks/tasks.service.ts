import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import { UpdateTaskRequest, type CreateTaskRequest, type MoveTaskRequest } from '@teamflow/types'
import { BoardsService } from '../boards/boards.service';

@Injectable()
export class TasksService {
	constructor(
		private readonly tasksRepo: TasksRepository,
		private readonly boardsService: BoardsService,
	) {}

	async getAll() {
		return this.tasksRepo.getAll();
	}

	async getOne(taskId: string) {
		return this.tasksRepo.getOne(taskId);
	}
	
	async create(data: CreateTaskRequest, creatorId: string) {
		const placement = await this.boardsService.resolvePlacementForNewTask(
			data.projectId,
			creatorId,
			data.boardId,
		);

		return this.tasksRepo.create(data, creatorId, placement);
	}

	async update(data: UpdateTaskRequest) {
		return this.tasksRepo.update(data);
	}

	async move(taskId: string, data: MoveTaskRequest, userId: string) {
		const task = await this.tasksRepo.findProjectId(taskId);

		// Same 404 for a missing task and a task in a project the user can't see.
		if (!task) {
			throw new NotFoundException('Task not found');
		}

		return this.boardsService.moveTask(taskId, task.projectId, data, userId);
	}
}
