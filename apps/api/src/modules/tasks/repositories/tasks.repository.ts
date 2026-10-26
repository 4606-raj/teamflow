import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UpdateTaskRequest, type CreateTaskRequest } from '@teamflow/types'
import { taskDetailSelect, taskListSelect } from '../types/tasks.types';

@Injectable()
export class TasksRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getAll() {
		return this.prisma.task.findMany({ select: taskListSelect });
	}

	findProjectId(taskId: string) {
		return this.prisma.task.findUnique({
			where: { id: taskId },
			select: { projectId: true, boards: { select: { boardId: true } } },
		});
	}

	async getOne(taskId: string) {
		return this.prisma.task.findUnique({
			where: { id: taskId },
			select: taskDetailSelect,
		});
	}

	async create(
		data: CreateTaskRequest,
		creatorId: string,
		placement: { boardId: string; position: number },
	) {
		return this.prisma.task.create({
			data: {
				ticketNumber: '0',
				title: data.title,
				description: data.description,
				dueDate: data.dueDate ?? null,
				timeLogged: data.timeLogged ?? 0,
				userId: data.userId,
				reporterId: data.reporterId ?? creatorId,
				parentId: data.parentId,
				subtasks: data.subtasks?.length
					? { connect: data.subtasks.map((id) => ({ id })) }
					: undefined,
				createdBy: creatorId,
				projectId: data.projectId,
				boards: {
					create: { boardId: placement.boardId, position: placement.position },
				},
			}
		})
	}

	async update(data: UpdateTaskRequest) {
		return this.prisma.task.update({
			where: {
				id: data.id,
			},
			data: {
				title: data.title,
				description: data.description,
				dueDate: data.dueDate ?? null,
				timeLogged: data.timeLogged,
				userId: data.userId ?? null,
				reporterId: data.reporterId,
				parentId: data.parentId ?? null,
			}
		})
	}
}