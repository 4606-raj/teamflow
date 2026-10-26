import { Prisma } from '@prisma/client';

const personSelect = {
  id: true,
  firstName: true,
  lastName: true,
  avatar: true,
} satisfies Prisma.UserSelect;

export const taskListSelect = {
  id: true,
  ticketNumber: true,
  title: true,
  projectId: true,
  parentId: true,
  dueDate: true,
  assignee: { select: personSelect },
  _count: { select: { subtasks: true } },
} satisfies Prisma.TaskSelect;

export const taskDetailSelect = {
  id: true,
  ticketNumber: true,
  title: true,
  description: true,
  dueDate: true,
  timeLogged: true,
  projectId: true,
  parentId: true,
  createdBy: true,
  assignee: { select: personSelect },
  reporter: { select: personSelect },
  parent: { select: { id: true, title: true } },
  project: { select: { name: true } },
  boards: { select: { boardId: true } },
} satisfies Prisma.TaskSelect;

export type TaskListRow = Prisma.TaskGetPayload<{
  select: typeof taskListSelect;
}>;

export type TaskDetailRow = Prisma.TaskGetPayload<{
  select: typeof taskDetailSelect;
}>;
