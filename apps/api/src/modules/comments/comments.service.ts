import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './repositories/comments.repository';
import { type CreateCommentRequest, type UpdateCommentRequest } from '@teamflow/types';

@Injectable()
export class CommentsService {
    constructor(private readonly commentsRepo: CommentsRepository) {}

    getAll() {
        // This is a placeholder for the actual implementation
        return this.commentsRepo.getAll();
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
