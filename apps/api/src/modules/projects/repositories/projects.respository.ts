import { PrismaService } from '@/common/prisma/prisma.service';
import { type projectCreateInput } from '../dto/create-project.dto';
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: projectCreateInput) {
		try {

			const project = this.prisma.project.create({
				data: {
					name: data.name,
					description: data.description,
					status: data.status,
					color: data.color,

					techStack: data.techStack?.length ? {
						create: data.techStack.map(technology => ({
							technology: {
								connect: {
									id: technology,
								}
							}
						})),
					} : undefined,

					tags: data.tags?.length ? {
						create: data.tags.map(tag => ({
							tag: {
								connect: {
									id: tag,
								}
							}
						})),
					} : undefined,

					members: data.members?.length ? {
						create: data.members.map(member => ({
							user: {
								connect: {
									id: member.id,
								},
							},
							role: member.role
						})),
					} : undefined,
				},

				include: {
					techStack: {
						include: {
							technology: true
						}
					}
				},
			})

			return project;
		}
		catch(e) {
			throw e;
		}
	}
}