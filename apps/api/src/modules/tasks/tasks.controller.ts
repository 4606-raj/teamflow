import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { type CreateTaskRequest, taskCreateSchema, taskUpdateSchema, type UpdateTaskRequest } from '@teamflow/types'
import { ZodValidationPipe } from '../auth/zod-validation.pipe';

@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get('/')
	async getAll() {
		return this.tasksService.getAll();
	}

	@Get('/:id')
	async getOne(@Param('id') taskId: string) {
		return this.tasksService.getOne(taskId);
	}
	
	@Post('/')
	create(@Body(new ZodValidationPipe(taskCreateSchema)) data: CreateTaskRequest) {
		return this.tasksService.create(data);
	}

	@Put('/:id')
	async update(@Body(new ZodValidationPipe(taskUpdateSchema)) data: UpdateTaskRequest) {
		return this.tasksService.update(data);
	}
}
