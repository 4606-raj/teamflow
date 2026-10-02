export interface KanbanTask {
  id: string;
  ticketNumber: string;
  title: string;
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
