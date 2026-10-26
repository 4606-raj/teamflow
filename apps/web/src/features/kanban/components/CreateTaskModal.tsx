import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { taskCreateSchema } from '@teamflow/types';

import {
  Button,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  MarkdownEditor,
} from '@/shared/components/ui';
import { useAuthStore } from '@/features/auth/stores/auth.store';

import { SubtasksField } from './SubtasksField';
import { TaskActivityTabs } from './TaskActivityTabs';
import { useTasks, useTask, useUpdateTask, useCreateTask } from '../hooks/useTasks';
import { useProjectMembers } from '../hooks/useProjectMembers';
import { useBoards } from '../hooks/useBoards';

// The modal collects these; the project id comes from the route.
// userId is the assignee (Task.userId in the schema); reporterId defaults to the current user.
const formSchema = taskCreateSchema.pick({
  title: true,
  description: true,
  dueDate: true,
  userId: true,
  reporterId: true,
  parentId: true,
  subtasks: true,
  boardId: true,
});
type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const NO_PARENT = 'none';

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  /** When set, the modal edits this task instead of creating one. */
  taskId?: string;
}

export function CreateTaskModal({ open, onOpenChange, projectId: projectIdProp, taskId }: CreateTaskModalProps) {
  const isEdit = !!taskId;
  const { data: task, isLoading: taskLoading, isError: taskError } = useTask(taskId ?? null);
  const projectId = task?.projectId ?? projectIdProp;
  const currentUserId = useAuthStore((state) => state.user?.id);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask(taskId ?? '');
  const isPending = createTask.isPending || updateTask.isPending;
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { options: userOptions, isLoading: usersLoading } = useProjectMembers(projectId);
  const statusOptions = useBoards(projectId)?.data?.map((board) => ({ value: board.id, label: board.name })) ?? [];

  const editValues = useMemo<FormInput | undefined>(
    () =>
      task && {
        title: task.title,
        description: task.description ?? '',
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        userId: task.assignee?.id,
        reporterId: task.reporter?.id,
        parentId: task.parentId ?? undefined,
        boardId: task.boardId ?? undefined,
      },
    [task],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    values: editValues,
    defaultValues: { title: '', description: '', userId: undefined, reporterId: currentUserId },
  });

  const parentOptions = [
    { value: NO_PARENT, label: 'No parent' },
    ...tasks.map((task) => ({ value: task.id, label: `${task.ticketNumber} · ${task.title}` })),
  ];

  const parentId = watch('parentId');

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      reset();
    }
    onOpenChange(next);
  };

  const onSubmit = async (values: FormOutput) => {
    if (isEdit) {
      try {
        // Subtasks aren't editable here (hidden field), so they stay undefined.
        await updateTask.mutateAsync(values);
        toast.success('Task updated');
        handleOpenChange(false);
      } catch {
        toast.error('Could not update the task. Please try again.');
      }
      return;
    }

    if (!projectId) {
      toast.error('Open a project board to create a task.');
      return;
    }

    try {
      await createTask.mutateAsync({
        ...values,
        description: values.description || undefined,
        subtasks: values.subtasks?.length ? values.subtasks : undefined,
        projectId,
      });
      toast.success('Task created');
      handleOpenChange(false);
    } catch {
      toast.error('Could not create the task. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-[90dvh] flex-col gap-5 sm:max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>{isEdit ? (task ? `${task.ticketNumber} · Edit task` : 'Edit task') : 'New task'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the details of this task.' : "Add a task to this project's board."}
          </DialogDescription>
        </DialogHeader>

        {taskError && <p className="text-sm text-destructive">Failed to load task.</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col gap-5" noValidate>
          <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_18rem] lg:overflow-hidden">
            <div className="space-y-5 lg:-m-1 lg:overflow-y-auto lg:p-1">
              <FormField label="Title" htmlFor="task-title" error={errors.title?.message} required>
                <Input
                  id="task-title"
                  placeholder="What needs to be done?"
                  className="h-11"
                  aria-invalid={Boolean(errors.title)}
                  {...register('title')}
                />
              </FormField>

              <FormField label="Description" htmlFor="task-description" error={errors.description?.message}>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <MarkdownEditor
                      id="task-description"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      placeholder="Add more detail (optional)"
                      aria-invalid={Boolean(errors.description)}
                    />
                  )}
                />
              </FormField>

              {!isEdit && (
              <FormField label="Subtasks" htmlFor="task-subtasks">
                <Controller
                  control={control}
                  name="subtasks"
                  render={({ field }) => (
                    <SubtasksField
                      id="task-subtasks"
                      tasks={tasks.filter((task) => task.id !== parentId)}
                      value={field.value ?? []}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FormField>
              )}

              <TaskActivityTabs taskId={taskId ?? null} />
            </div>

            <aside className="space-y-5 lg:-m-1 lg:overflow-y-auto lg:border-l lg:p-1 lg:pl-6">
              <FormField label="Assignee" htmlFor="task-assignee" error={errors.userId?.message}>
                <Controller
                  control={control}
                  name="userId"
                  render={({ field }) => (
                    <Select items={userOptions} value={field.value || null} onValueChange={(value) => field.onChange(value ?? undefined)}>
                      <SelectTrigger id="task-assignee" className="w-full data-[size=default]:h-11" aria-invalid={Boolean(errors.userId)}>
                        <SelectValue placeholder={usersLoading ? 'Loading...' : 'Unassigned'} />
                      </SelectTrigger>
                      <SelectContent>
                        {userOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Reporter" htmlFor="task-reporter" error={errors.reporterId?.message}>
                <Controller
                  control={control}
                  name="reporterId"
                  render={({ field }) => (
                    <Select items={userOptions} value={field.value || null} onValueChange={(value) => field.onChange(value ?? undefined)}>
                      <SelectTrigger id="task-reporter" className="w-full data-[size=default]:h-11" aria-invalid={Boolean(errors.reporterId)}>
                        <SelectValue placeholder={usersLoading ? 'Loading...' : 'Select reporter'} />
                      </SelectTrigger>
                      <SelectContent>
                        {userOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Status" htmlFor="task-status" error={errors.boardId?.message}>
                <Controller
                  control={control}
                  name="boardId"
                  render={({ field }) => (
                    <Select items={statusOptions} value={field.value || null} onValueChange={(value) => field.onChange(value ?? undefined)}>
                      <SelectTrigger id="task-status" className="w-full data-[size=default]:h-11" aria-invalid={Boolean(errors.boardId)}>
                        <SelectValue placeholder={usersLoading ? 'Loading...' : 'Select status'} />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Due date" htmlFor="task-due-date" error={errors.dueDate?.message}>
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field }) => (
                    <DatePicker
                      id="task-due-date"
                      value={field.value as Date | undefined}
                      onChange={field.onChange} 
                      aria-invalid={Boolean(errors.dueDate)}
                    />
                  )}
                />
              </FormField>

              <FormField label="Parent task" htmlFor="task-parent" error={errors.parentId?.message}>
                <Controller
                  control={control}
                  name="parentId"
                  render={({ field }) => (
                    <Select
                      items={parentOptions}
                      value={field.value ?? NO_PARENT}
                      onValueChange={(value) => field.onChange(value && value !== NO_PARENT ? value : undefined)}
                    >
                      <SelectTrigger id="task-parent" className="w-full data-[size=default]:h-11">
                        <SelectValue placeholder={tasksLoading ? 'Loading...' : 'No parent'} />
                      </SelectTrigger>
                      <SelectContent>
                        {parentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </aside>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || (isEdit && taskLoading)}>
              {isEdit ? (isPending ? 'Saving...' : 'Save changes') : isPending ? 'Creating...' : 'Create task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
