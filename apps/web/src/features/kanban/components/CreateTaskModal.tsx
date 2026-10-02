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

import { useCreateTask } from '../hooks/useCreateTask';
import { useProjectMembers } from '../hooks/useProjectMembers';

// The modal collects these; the project id comes from the route.
// userId is the assignee (Task.userId in the schema); reporterId defaults to the current user.
const formSchema = taskCreateSchema.pick({
  title: true,
  description: true,
  dueDate: true,
  userId: true,
  reporterId: true,
});
type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

export function CreateTaskModal({ open, onOpenChange, projectId }: CreateTaskModalProps) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const createTask = useCreateTask();
  const { options: userOptions, isLoading: usersLoading } = useProjectMembers(projectId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', description: '', userId: undefined, reporterId: currentUserId },
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const onSubmit = async (values: FormOutput) => {
    if (!projectId) {
      toast.error('Open a project board to create a task.');
      return;
    }

    try {
      await createTask.mutateAsync({
        ...values,
        description: values.description || undefined,
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
          <DialogTitle>New task</DialogTitle>
          <DialogDescription>Add a task to this project's board.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col gap-5" noValidate>
          <FormField label="Title" htmlFor="task-title" error={errors.title?.message} required>
            <Input
              id="task-title"
              placeholder="What needs to be done?"
              className="h-11"
              aria-invalid={Boolean(errors.title)}
              {...register('title')}
            />
          </FormField>

          <FormField label="Description" htmlFor="task-description" error={errors.description?.message} className="flex min-h-0 flex-1 flex-col">
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <MarkdownEditor
                  id="task-description"
                  className="max-h-none min-h-0 flex-1"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  placeholder="Add more detail (optional)"
                  aria-invalid={Boolean(errors.description)}
                />
              )}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-3">
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTask.isPending}>
              {createTask.isPending ? 'Creating...' : 'Create task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
