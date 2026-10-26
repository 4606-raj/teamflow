export interface KanbanTask {
  id: string;
  ticketNumber: string;
  title: string;
  dueDate: string | null;
  assigneeName: string | null;
  isChild: boolean;
  subtaskCount: number;
}

export interface KanbanColumnData {
  id: string;
  name: string;
  tasks: KanbanTask[];
}

export interface KanbanBoardData {
  id: string;
  columns: KanbanColumnData[];
}

export interface KanbanTaskMove {
  taskId: string;
  fromColumnId: string;
  fromIndex: number;
  toColumnId: string;
  toIndex: number;
}
