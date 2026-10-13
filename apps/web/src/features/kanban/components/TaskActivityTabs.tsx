import { Button, FormField, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from '@/shared/components/ui';
import { formatDate } from '@/shared/utils/date';

import { dummyActivity } from '../data/taskModal.dummy';

import { CreateCommentSchema } from '@teamflow/types';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateComment, useGetComments } from '../hooks/useComments';

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium"
    >
      {initials(name)}
    </span>
  );
}

const formSchema = CreateCommentSchema.pick({ content: true, taskId: true });

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

export function TaskActivityTabs({ taskId }: { taskId: string | null }) {

  const { data: commentsData } = useGetComments(taskId ?? null);
  
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      content: '',
      taskId: taskId ?? '',
     },
  });
  const { mutate: createComment } = useCreateComment();

  const addComment = (data: FormOutput) => {
    createComment(data, { onSuccess: () => resetField('content') });
  }
  
  return (
    <Tabs defaultValue="comments" className="gap-4">
      <TabsList variant="line" className="w-full justify-start border-b">
        <TabsTrigger value="comments" className="flex-none px-3">
          Comments ({commentsData?.length})
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex-none px-3">
          Activity
        </TabsTrigger>
      </TabsList>

      <TabsContent value="comments" className="space-y-4">
        <div className="space-y-4">
          <ul className="space-y-4">
            {commentsData?.map((comment) => (
              <li key={comment.id} className="flex gap-3">
                <Avatar name={`${comment.user.firstName} ${comment.user.lastName}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{comment.user.firstName} {comment.user.lastName}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{formatDate(comment.createdAt, true)}</span>
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{comment.content}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="space-y-2">
              <FormField label="Comment" htmlFor="comment-content" error={errors.content?.message}>
                <Textarea
                  id="comment-content"
                  placeholder="Write a comment..."
                  className="min-h-20"
                  aria-invalid={Boolean(errors.content)}
                  {...register('content')}
                />
              </FormField>
            <div className="flex justify-end">
              <Button type="button" size="sm" onClick={handleSubmit(addComment)}>
                Comment
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="activity">
        <ol className="space-y-4 border-l pl-5">
          {dummyActivity.map((item) => (
            <li key={item.id} className="relative">
              <span aria-hidden="true" className="absolute top-1.5 -left-[25px] size-2 rounded-full bg-muted-foreground/60" />
              <p className="text-sm">
                <span className="font-medium">{item.actor}</span> {item.action}
              </p>
              <p className="text-xs text-muted-foreground">{item.createdAt}</p>
            </li>
          ))}
        </ol>
      </TabsContent>
    </Tabs>
  );
}
