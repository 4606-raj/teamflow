import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './repositories/comments.repository';
import { type CreateCommentRequest, type UpdateCommentRequest } from '@teamflow/types';

@Injectable()
export class CommentsService {
    constructor(private readonly commentsRepo: CommentsRepository) {}

    getAll(taskId: string) {
        return this.commentsRepo.getAll(taskId);
    }
    
    create(data: CreateCommentRequest, userId: string) {
        return this.commentsRepo.create(data, userId);
    }

    update(data: UpdateCommentRequest) {
        return this.commentsRepo.update(data);
    }

    delete(id: string) {
        return this.commentsRepo.delete(id);
    }
}
