import { z } from 'zod';

export const UpdateCommentSchema = z.object({
  id: z.string().cuid('Please provide a valid comment id'),
  content: z.string().trim().min(1, 'Please provide a comment content').max(2000, 'Comment content is too long'),
  taskId: z.string().cuid('Please provide a valid task id'),
});

export const CreateCommentSchema = UpdateCommentSchema.omit({ id: true });


export type CreateCommentInput = z.input<typeof CreateCommentSchema>;
export type CreateCommentRequest = z.infer<typeof CreateCommentSchema>;

export type UpdateCommentInput = z.input<typeof UpdateCommentSchema>;
export type UpdateCommentRequest = z.infer<typeof UpdateCommentSchema>;
