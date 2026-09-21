import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from './repositories/projects.respository';
import { type projectCreateInput } from './dto/create-project.dto';
import { Prisma } from '@prisma/client';
import { ProjectMapper } from './mappers/project-response.mapper';

@Injectable()
export class ProjectsService {
	constructor(private readonly projectRepo: ProjectRepository) {}

	async getAll() {
		const data = await this.projectRepo.getAll();

		return ProjectMapper.toResponseList(data);
	}

	async create(data: projectCreateInput, userId: string) {
		try {
			const members = [
				...data.members.filter((member) => member.id !== userId),
				{id: userId, role: 'Maintainer' as const},
			];

			const project = await this.projectRepo.create({ ...data, members });

			return ProjectMapper.toResponse(project)
		} catch (error) {
			
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
				throw new NotFoundException("User or related record not found");
			}

			throw error;
		}

	}
}
