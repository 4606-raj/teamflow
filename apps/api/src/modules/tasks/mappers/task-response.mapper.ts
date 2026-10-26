import type { TaskDetail, TaskListItem } from '@teamflow/types';
import type { TaskDetailRow, TaskListRow } from '../types/tasks.types';

export class TaskMapper {
  static toListItem(task: TaskListRow): TaskListItem {
    return {
      id: task.id,
      ticketNumber: task.ticketNumber,
      title: task.title,
      projectId: task.projectId,
      parentId: task.parentId,
      dueDate: task.dueDate?.toISOString() ?? null,
      assignee: task.assignee,
      subtaskCount: task._count.subtasks,
    };
  }

  static toListItems(tasks: TaskListRow[]): TaskListItem[] {
    return tasks.map(TaskMapper.toListItem);
  }

  static toDetail(task: TaskDetailRow): TaskDetail {
    return {
      id: task.id,
      ticketNumber: task.ticketNumber,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate?.toISOString() ?? null,
      timeLogged: task.timeLogged,
      projectId: task.projectId,
      projectName: task.project.name,
      boardId: task.boards[0]?.boardId ?? null,
      assignee: task.assignee,
      reporter: task.reporter,
      parentId: task.parentId,
      parent: task.parent,
      createdBy: task.createdBy,
    };
  }
}
