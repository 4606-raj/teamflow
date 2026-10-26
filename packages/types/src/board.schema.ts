import { z } from 'zod';

// Every new project starts with these boards (Kanban columns), in this order.
export const DEFAULT_BOARD_NAMES = ['Todo', 'In Progress', 'Blocked', 'Done'] as const;

export const MAX_BOARDS_PER_PROJECT = 20;

export const boardCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please provide a board name')
    .max(50, 'Board name is too long'),
});

export const boardUpdateSchema = boardCreateSchema;

export type CreateBoardInput = z.input<typeof boardCreateSchema>;
export type CreateBoardRequest = z.infer<typeof boardCreateSchema>;

export type UpdateBoardInput = z.input<typeof boardUpdateSchema>;
export type UpdateBoardRequest = z.infer<typeof boardUpdateSchema>;
