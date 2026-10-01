import { z } from 'zod';

// Prisma's @default(cuid()) ids: 'c' + 24 lowercase alphanumerics. zod's built-in cuid() is
// deprecated and far looser (any 9+ char string starting with 'c').
const cuid = (message: string) => z.string().regex(/^c[a-z0-9]{24}$/, message);

export const taskCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Please provide a valid title for the task')
    .max(255, 'Task title is too long'),
  description: z
    .string()
    .trim()
    .max(5000, 'Task description is too long')
    .optional(),
  // Accepts a Date (from date pickers) or an ISO string (from JSON payloads)
  dueDate: z.coerce.date({ message: 'Please provide a valid due date' }).optional(),
  projectId: cuid('Please provide a valid project id'),
  assigneeId: cuid('Please provide a valid assignee').optional(),
  userId: cuid('Please provide a valid user id'),
  reporterId: cuid('Please provide a valid reporter').optional(),
  parentId: cuid('Please provide a valid parent task id').optional(),
  boardId: cuid('Please provide a valid board id').optional(),
  timeLogged: z.number().min(0, 'Time logged must be a positive number').optional(),
});

export type CreateTaskInput = z.input<typeof taskCreateSchema>;
export type CreateTaskRequest = z.infer<typeof taskCreateSchema>;

export const taskUpdateSchema = z.object({
  id: cuid('Please provide a valid task id'),
  title: z
    .string()
    .trim()
    .min(3, 'Please provide a valid title for the task')
    .max(255, 'Task title is too long'),
  description: z
    .string()
    .trim()
    .max(5000, 'Task description is too long')
    .optional(),
  // Accepts a Date (from date pickers) or an ISO string (from JSON payloads)
  dueDate: z.coerce.date({ message: 'Please provide a valid due date' }).optional(),
  userId: cuid('Please provide a valid user id'),
  reporterId: cuid('Please provide a valid reporter').optional(),
  parentId: cuid('Please provide a valid parent task id').optional(),
  boardId: cuid('Please provide a valid board id').optional(),
  timeLogged: z.number().min(0, 'Time logged must be a positive number').optional(),
});

export type UpdateTaskInput = z.input<typeof taskUpdateSchema>;
export type UpdateTaskRequest = z.infer<typeof taskUpdateSchema>;