import * as React from "react"
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table"
import { Markdown } from "@tiptap/markdown"
import { Placeholder } from "@tiptap/extensions"
import {
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Table as TableIcon,
  Trash2,
  Undo2,
} from "lucide-react"
import { cn } from "cn"

import { Button } from "@/shared/components/ui/button"

type MarkdownEditorProps = {
  id?: string
  /** Markdown source. */
  value?: string
  onChange: (markdown: string) => void
  placeholder?: string
  className?: string
  "aria-invalid"?: boolean
}

type ToolbarButtonProps = {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}

function ToolbarButton({ label, active, disabled, onClick, children }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon-sm"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the editor selection while clicking toolbar buttons.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

function ToolbarDivider() {
  return <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
}

function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      h1: editor.isActive("heading", { level: 1 }),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      strike: editor.isActive("strike"),
      code: editor.isActive("code"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      blockquote: editor.isActive("blockquote"),
      codeBlock: editor.isActive("codeBlock"),
      inTable: editor.isActive("table"),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  })
  const chain = () => editor.chain().focus()

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-input p-1.5">
      <ToolbarButton label="Heading 1" active={state.h1} onClick={() => chain().toggleHeading({ level: 1 }).run()}>
        <Heading1 />
      </ToolbarButton>
      <ToolbarButton label="Heading 2" active={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
        <Heading2 />
      </ToolbarButton>
      <ToolbarButton label="Heading 3" active={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
        <Heading3 />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton label="Bold" active={state.bold} onClick={() => chain().toggleBold().run()}>
        <Bold />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={state.italic} onClick={() => chain().toggleItalic().run()}>
        <Italic />
      </ToolbarButton>
      <ToolbarButton label="Strikethrough" active={state.strike} onClick={() => chain().toggleStrike().run()}>
        <Strikethrough />
      </ToolbarButton>
      <ToolbarButton label="Inline code" active={state.code} onClick={() => chain().toggleCode().run()}>
        <Code />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton label="Bullet list" active={state.bulletList} onClick={() => chain().toggleBulletList().run()}>
        <List />
      </ToolbarButton>
      <ToolbarButton label="Numbered list" active={state.orderedList} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrdered />
      </ToolbarButton>
      <ToolbarButton label="Quote" active={state.blockquote} onClick={() => chain().toggleBlockquote().run()}>
        <Quote />
      </ToolbarButton>
      <ToolbarButton label="Code block" active={state.codeBlock} onClick={() => chain().toggleCodeBlock().run()}>
        <Code2 />
      </ToolbarButton>
      <ToolbarButton label="Divider" onClick={() => chain().setHorizontalRule().run()}>
        <Minus />
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        label="Insert table"
        disabled={state.inTable}
        onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        <TableIcon />
      </ToolbarButton>
      {state.inTable && (
        <>
          <ToolbarButton label="Add row below" onClick={() => chain().addRowAfter().run()}>
            <span className="text-xs font-medium">+Row</span>
          </ToolbarButton>
          <ToolbarButton label="Add column after" onClick={() => chain().addColumnAfter().run()}>
            <span className="text-xs font-medium">+Col</span>
          </ToolbarButton>
          <ToolbarButton label="Delete row" onClick={() => chain().deleteRow().run()}>
            <span className="text-xs font-medium">−Row</span>
          </ToolbarButton>
          <ToolbarButton label="Delete column" onClick={() => chain().deleteColumn().run()}>
            <span className="text-xs font-medium">−Col</span>
          </ToolbarButton>
          <ToolbarButton label="Delete table" onClick={() => chain().deleteTable().run()}>
            <Trash2 />
          </ToolbarButton>
        </>
      )}
      <div className="ml-auto flex items-center gap-0.5">
        <ToolbarButton label="Undo" disabled={!state.canUndo} onClick={() => chain().undo().run()}>
          <Undo2 />
        </ToolbarButton>
        <ToolbarButton label="Redo" disabled={!state.canRedo} onClick={() => chain().redo().run()}>
          <Redo2 />
        </ToolbarButton>
      </div>
    </div>
  )
}

function MarkdownEditor({
  id,
  value = "",
  onChange,
  placeholder = "Write something...",
  className,
  "aria-invalid": ariaInvalid,
}: MarkdownEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Markdown,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    contentType: "markdown",
    editorProps: {
      attributes: { ...(id ? { id } : {}), class: "md-editor-content" },
    },
    onUpdate: ({ editor }) => onChange(editor.getMarkdown()),
  })

  // Keep the editor in sync when the form value is changed from outside (e.g. reset()).
  React.useEffect(() => {
    if (editor && value !== editor.getMarkdown()) {
      editor.commands.setContent(value, { contentType: "markdown", emitUpdate: false })
    }
  }, [editor, value])

  return (
    <div
      data-slot="markdown-editor"
      aria-invalid={ariaInvalid}
      className={cn(
        "flex max-h-[55vh] w-full flex-col overflow-hidden rounded-xl border border-input bg-input/30 transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 aria-invalid:border-destructive",
        className
      )}
    >
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} className="flex min-h-0 flex-1 flex-col overflow-y-auto" />
    </div>
  )
}

export { MarkdownEditor }
