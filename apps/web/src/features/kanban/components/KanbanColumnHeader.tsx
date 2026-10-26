import { useState } from 'react';
import { Ellipsis } from 'lucide-react';

import { Button } from '@/shared/components/ui';
import { Input } from '@/shared/components/ui';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';

interface KanbanColumnHeaderProps {
  name: string;
  taskCount: number;
  onRename?: (name: string) => void;
  onDelete?: () => void;
}

export function KanbanColumnHeader({
  name,
  taskCount,
  onRename,
  onDelete,
}: KanbanColumnHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const startEditing = () => {
    setMenuOpen(false);
    setDraft(name);
    setEditing(true);
  };

  const commit = () => {
    const next = draft.trim();
    setEditing(false);

    if (next && next !== name) {
      onRename?.(next);
    }
  };

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 px-1">
      {editing ? (
        <Input
          autoFocus
          value={draft}
          maxLength={50}
          aria-label="Column name"
          className="h-7 text-sm"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit();
            if (event.key === 'Escape') setEditing(false);
          }}
        />
      ) : (
        <h3 className="min-w-0 truncate text-sm font-semibold">{name}</h3>
      )}

      <div className="flex shrink-0 items-center gap-1">
        <span className="text-xs text-muted-foreground">{taskCount}</span>

        {(onRename || onDelete) && (
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger
              aria-label={`${name} column options`}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Ellipsis className="size-4" aria-hidden="true" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-36 gap-1 p-1">
              {onRename && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={startEditing}
                >
                  Rename
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-destructive"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                >
                  Delete
                </Button>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
