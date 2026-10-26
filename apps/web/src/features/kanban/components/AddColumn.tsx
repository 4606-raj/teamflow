import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button, Input } from '@/shared/components/ui';

interface AddColumnProps {
  onAdd: (name: string) => Promise<unknown>;
  isPending?: boolean;
}

export function AddColumn({ onAdd, isPending = false }: AddColumnProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const close = () => {
    setOpen(false);
    setName('');
  };

  const submit = async () => {
    const next = name.trim();

    if (!next) return;

    try {
      await onAdd(next);
      close();
    } catch {
      // The http client already toasts the error; keep the input for editing.
    }
  };

  return (
    <div className="w-[85vw] shrink-0 sm:w-72">
      {open ? (
        <form
          className="flex flex-col gap-2 rounded-xl bg-muted/40 p-2"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <Input
            autoFocus
            value={name}
            maxLength={50}
            placeholder="Column name"
            aria-label="New column name"
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') close();
            }}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending || !name.trim()}>
              Add column
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={close}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setOpen(true)}
        >
          <Plus aria-hidden="true" />
          Add column
        </Button>
      )}
    </div>
  );
}
