import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { type CreateCommentRequest, type UpdateCommentRequest } from '@teamflow/types';

@Injectable()
export class CommentsRepository {
	constructor(private readonly prisma: PrismaService) {}

	getAll() {
		return this.prisma.comment.findMany();
	}
	
	async create(data: CreateCommentRequest, userId: string) {
		return this.prisma.comment.create({
			data: {
				content: data.content,
				taskId: data.taskId,
				userId,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});
	}

	async update(data: UpdateCommentRequest) {
		return this.prisma.comment.update({
			where: { id: data.id },
			data: { content: data.content, updatedAt: new Date() },
		});
	}

	async delete(id: string) {
		return this.prisma.comment.delete({
			where: { id },
		});	
	}
}