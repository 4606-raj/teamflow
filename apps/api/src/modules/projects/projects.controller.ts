import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ZodValidationPipe } from '../auth/zod-validation.pipe';
import { type projectCreateInput, ProjectCreateSchema } from './dto/create-project.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
	constructor(public readonly projectsService: ProjectsService) {}

	@Get('/')
	async getAll() {
		return this.projectsService.getAll()
	}

	@Get('/:projectId')
	async getOne(@Param('projectId') projectId: string) {
		return this.projectsService.getOne(projectId)
	}

	@Post('/')
	async create(@CurrentUser() user, @Body(new ZodValidationPipe(ProjectCreateSchema)) data: projectCreateInput) {
		return this.projectsService.create(data, user.userId)
	}

	@Put('/:projectId')
	async update(@Param('projectId') projectId: string, @Body(new ZodValidationPipe(ProjectCreateSchema)) data: projectCreateInput) {
		return this.projectsService.update(projectId, data)
	}
}
