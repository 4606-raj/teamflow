import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { type CreateCommentRequest, type UpdateCommentRequest } from '@teamflow/types';

@Injectable()
export class CommentsRepository {
	constructor(private readonly prisma: PrismaService) {}

	getAll(taskId: string) {
		return this.prisma.comment.findMany({
			where: { taskId },
			orderBy: { createdAt: 'asc' },
			select: {
				id: true,
				content: true,
				taskId: true,
				userId: true,
				createdAt: true,
				updatedAt: true,
				user: { select: { id: true, firstName: true, lastName: true } },
			},
		});
	}

	findById(id: string) {
		return this.prisma.comment.findUnique({ where: { id } });
	}

	async create(data: CreateCommentRequest, userId: string) {
		return this.prisma.comment.create({
			data: {
				content: data.content,
				taskId: data.taskId,
				userId,
			},
		});
	}

	async update(data: UpdateCommentRequest) {
		return this.prisma.comment.update({
			where: { id: data.id },
			data: { content: data.content },
		});
	}

	async delete(id: string) {
		return this.prisma.comment.delete({
			where: { id },
		});	
	}
}