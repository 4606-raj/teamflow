interface KanbanColumnHeaderProps {
  name: string;
  taskCount: number;
}

export function KanbanColumnHeader({
  name,
  taskCount,
}: KanbanColumnHeaderProps) {
  return (
    <div className="flex items-center justify-between px-1">
      <h3 className="text-sm font-semibold">{name}</h3>
      <span className="text-xs text-muted-foreground">{taskCount}</span>
    </div>
  );
}
