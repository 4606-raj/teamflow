import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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

	@Post('/')
	async create(@CurrentUser() user, @Body(new ZodValidationPipe(ProjectCreateSchema)) data: projectCreateInput) {
		return this.projectsService.create(data, user.userId)
	}
}
