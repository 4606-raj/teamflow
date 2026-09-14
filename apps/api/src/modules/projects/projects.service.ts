import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from './repositories/projects.respository';
import { type projectCreateInput } from './dto/create-project.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
	constructor(private readonly projectRepo: ProjectRepository) {}

	async create(data: projectCreateInput) {
		try {
			return await this.projectRepo.create(data);
		} catch (error) {
			
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
				throw new NotFoundException("User or related record not found");
			}

			throw error;
		}

	}
}
