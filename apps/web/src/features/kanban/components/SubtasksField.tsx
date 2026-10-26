import { X } from 'lucide-react';

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui';

import type { TaskListItem } from '@teamflow/types';

interface SubtasksFieldProps {
  id?: string;
  tasks: TaskListItem[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function SubtasksField({ id, tasks, value, onChange }: SubtasksFieldProps) {
  const selected = value
    .map((taskId) => tasks.find((task) => task.id === taskId))
    .filter((task): task is TaskListItem => Boolean(task));
  const available = tasks
    .filter((task) => !value.includes(task.id))
    .map((task) => ({ value: task.id, label: `${task.ticketNumber} · ${task.title}` }));

  return (
    <div className="space-y-3">
      <Select
        items={available}
        // Always empty: picking an option moves it into the table below.
        value={null}
        onValueChange={(taskId) => taskId && onChange([...value, taskId])}
      >
        <SelectTrigger id={id} className="w-full data-[size=default]:h-11" disabled={available.length === 0}>
          <SelectValue placeholder={available.length ? 'Add a subtask' : 'No more tasks to add'} />
        </SelectTrigger>
        <SelectContent>
          {available.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selected.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border/70">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Ticket</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {selected.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="text-xs text-muted-foreground">{task.ticketNumber}</TableCell>
                  <TableCell className="truncate">{task.title}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Remove ${task.ticketNumber}`}
                      onClick={() => onChange(value.filter((taskId) => taskId !== task.id))}
                    >
                      <X aria-hidden="true" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
