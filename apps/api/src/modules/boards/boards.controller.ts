import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
	boardCreateSchema,
	boardUpdateSchema,
	type CreateBoardRequest,
	type UpdateBoardRequest,
} from '@teamflow/types';
import { BoardsService } from './boards.service';
import { ZodValidationPipe } from '../auth/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller()
export class BoardsController {
	constructor(private readonly boardsService: BoardsService) {}

	@Get('projects/:projectId/boards')
	list(@CurrentUser() user, @Param('projectId') projectId: string) {
		return this.boardsService.list(projectId, user.userId);
	}

	@Post('projects/:projectId/boards')
	create(
		@CurrentUser() user,
		@Param('projectId') projectId: string,
		@Body(new ZodValidationPipe(boardCreateSchema)) data: CreateBoardRequest,
	) {
		return this.boardsService.create(projectId, data, user.userId);
	}

	@Patch('boards/:boardId')
	rename(
		@CurrentUser() user,
		@Param('boardId') boardId: string,
		@Body(new ZodValidationPipe(boardUpdateSchema)) data: UpdateBoardRequest,
	) {
		return this.boardsService.rename(boardId, data, user.userId);
	}

	@Delete('boards/:boardId')
	delete(@CurrentUser() user, @Param('boardId') boardId: string) {
		return this.boardsService.delete(boardId, user.userId);
	}
}
