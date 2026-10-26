import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import { UpdateTaskRequest, type CreateTaskRequest, type MoveTaskRequest } from '@teamflow/types'
import { BoardsService } from '../boards/boards.service';
import { TaskMapper } from './mappers/task-response.mapper';

@Injectable()
export class TasksService {
	constructor(
		private readonly tasksRepo: TasksRepository,
		private readonly boardsService: BoardsService,
	) {}

	async getAll() {
		return TaskMapper.toListItems(await this.tasksRepo.getAll());
	}

	async getOne(taskId: string) {
		const task = await this.tasksRepo.getOne(taskId);

		if (!task) {
			throw new NotFoundException('Task not found');
		}

		return TaskMapper.toDetail(task);
	}
	
	async create(data: CreateTaskRequest, creatorId: string) {
		const placement = await this.boardsService.resolvePlacementForNewTask(
			data.projectId,
			creatorId,
			data.boardId,
		);

		return this.tasksRepo.create(data, creatorId, placement);
	}

	async update(data: UpdateTaskRequest, userId: string) {
		if (data.boardId) {
			const task = await this.tasksRepo.findProjectId(data.id);

			if (!task) {
				throw new NotFoundException('Task not found');
			}

			// Only move when the board actually changes, otherwise a plain edit would reorder the task.
			if (!task.boards.some((b) => b.boardId === data.boardId)) {
				// Position past the end: moveTask clamps it to the last slot of the target board.
				await this.move(data.id, { boardId: data.boardId, position: Number.MAX_SAFE_INTEGER }, userId);
			}
		}

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
