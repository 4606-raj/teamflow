import { Body, Controller, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ZodValidationPipe } from '../auth/zod-validation.pipe';
import { type projectCreateInput, ProjectCreateSchema } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
	constructor(public readonly projectsService: ProjectsService) {}

	@Post('/')
	async create(@Body(new ZodValidationPipe(ProjectCreateSchema)) req: projectCreateInput) {
		console.log(req)

		return this.projectsService.create(req)
	}
}
