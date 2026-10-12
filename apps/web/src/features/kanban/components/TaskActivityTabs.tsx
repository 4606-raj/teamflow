import { useState } from 'react';

import { Button, FormField, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from '@/shared/components/ui';

import { dummyActivity, dummyComments, type DummyComment } from '../data/taskModal.dummy';

import { CreateCommentSchema } from '@teamflow/types';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import { useForm } from 'react-hook-form';

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

const formSchema = CreateCommentSchema.pick({ content: true });

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

export function TaskActivityTabs() {
  const [comments, setComments] = useState<DummyComment[]>(dummyComments);
  const [draft, setDraft] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: '' },
  });

  const addComment = () => {
    const body = draft.trim();
    if (!body) return;
    setComments((current) => [...current, { id: `c-${Date.now()}`, author: 'You', createdAt: 'Just now', body }]);
    setDraft('');
  };

  return (
    <Tabs defaultValue="comments" className="gap-4">
      <TabsList variant="line" className="w-full justify-start border-b">
        <TabsTrigger value="comments" className="flex-none px-3">
          Comments ({comments.length})
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex-none px-3">
          Activity
        </TabsTrigger>
      </TabsList>

      <form onSubmit={handleSubmit((data) => console.log('submit', data))}>
        <TabsContent value="comments" className="space-y-4">
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="flex gap-3">
                <Avatar name={comment.author} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{comment.author}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{comment.createdAt}</span>
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{comment.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="space-y-2">
              <FormField label="Description" htmlFor="task-description" error={errors.content?.message}>
                <Textarea
                  id="task-description"
                  placeholder="Write a comment..."
                  className="min-h-20"
                  aria-invalid={Boolean(errors.content)}
                  {...register('content')}
                />
              </FormField>
            <div className="flex justify-end">
              <Button type="button" size="sm" onClick={addComment} disabled={!draft.trim()}>
                Comment
              </Button>
            </div>
          </div>
        </TabsContent>
      </form>

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
