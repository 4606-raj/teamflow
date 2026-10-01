import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UpdateTaskRequest, type CreateTaskRequest } from '@teamflow/types'

@Injectable()
export class TasksRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getAll() {
		return this.prisma.task.findMany({
			select: {
				id: true,
				ticketNumber: true,
				title: true,
				dueDate: true,
				timeLogged: true,
				userId: true,
				reporterId: true,
				parentId: true,
				createdBy: true,
				projectId: true,
			}
		});
	}

	async getOne(taskId: string) {
		return this.prisma.task.findUnique({
			where: {
				id: taskId,
			},
			select: {
				id: true,
				ticketNumber: true,
				title: true,
				description: true,
				dueDate: true,
				timeLogged: true,
				userId: true,
				reporterId: true,
				parentId: true,
				createdBy: true,
				projectId: true,
				assignee: {
					select: {
						id: true,
						email: true,
					}
				},
				reporter: {
					select: {
						id: true,
						email: true,
					}
				},
				parent: {
					select: {
						id: true,
						title: true,
					}
				},
				project: {
					select: {
						name: true,
					}
				}
			}
		})
	}
	
	async create(data: CreateTaskRequest) {
		return this.prisma.task.create({
			data: {
				ticketNumber: '0',
				title: data.title,
				description: data.description,
				dueDate: data.dueDate ?? null,
				timeLogged: data.timeLogged ?? 0,
				userId: data.userId,
				reporterId: data.reporterId,
				parentId: data.parentId,
				createdBy: 'cmufwdyk40000mc9wmvtxqxnr',
				projectId: data.projectId,
			}
		})
	}

	async update(data: UpdateTaskRequest) {
		return this.prisma.task.update({
			where: {
				id: data.id,
			},
			data: {
				ticketNumber: '0',
				title: data.title,
				description: data.description,
				dueDate: data.dueDate ?? null,
				timeLogged: data.timeLogged ?? 0,
				userId: data.userId,
				reporterId: data.reporterId,
				parentId: data.parentId,
			}
		})
	}
}