import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectRepository } from './repositories/projects.respository';

@Module({
	imports: [],
	controllers: [ProjectsController],
	providers: [ProjectsService, ProjectRepository],
	exports: [ProjectsService],
})
export class ProjectsModule {}
