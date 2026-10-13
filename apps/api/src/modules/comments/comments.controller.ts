import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { type CreateCommentRequest, type UpdateCommentRequest, CreateCommentSchema, UpdateCommentSchema } from '@teamflow/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../auth/zod-validation.pipe';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get('/')
    getAll(@Param('taskId') taskId: string) {
        return this.commentsService.getAll(taskId);
    }

    @Post('/')
    create(@CurrentUser() user, @Body(new ZodValidationPipe(CreateCommentSchema)) data: CreateCommentRequest) {
        return this.commentsService.create(data, user.userId);
    }

    @Put('/:id')
    update(@CurrentUser() user, @Body(new ZodValidationPipe(UpdateCommentSchema)) data: UpdateCommentRequest) {
        return this.commentsService.update(data);
    }

    @Delete('/:id')
    delete(@Param('id') id: string) {
        return this.commentsService.delete(id);
    }
}
