import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, X } from "lucide-react"

import { cn } from "@/shared/utils/cn"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"

export type MultiSelectOption = {
  label: string
  value: string
}

type MultiSelectProps = {
  options: MultiSelectOption[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  id?: string
  disabled?: boolean
  "aria-invalid"?: boolean
  className?: string
}

function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select options",
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  id,
  disabled = false,
  "aria-invalid": ariaInvalid = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedOptions = options.filter((option) => value.includes(option.value))
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  )

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open])

  const toggleOption = (optionValue: string) => {
    onValueChange(
      value.includes(optionValue)
        ? value.filter((currentValue) => currentValue !== optionValue)
        : [...value, optionValue],
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        id={id}
        type="button"
        variant="outline"
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "h-auto min-h-9 w-full justify-between gap-2 rounded-xl py-2 text-left",
          ariaInvalid ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20" : undefined,
          className,
        )}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        <span className="flex min-w-0 flex-1 flex-wrap gap-1">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <span key={option.value} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs">
                {option.label}
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${option.label}`}
                  className="cursor-pointer rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={(event) => {
                    event.stopPropagation()
                    toggleOption(option.value)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      event.stopPropagation()
                      toggleOption(option.value)
                    }
                  }}
                >
                  <X className="size-3" />
                </span>
              </span>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open ? "rotate-180" : undefined)} />
      </Button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-56 overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-md">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="mb-1 flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          />
          <div role="listbox" aria-multiselectable="true" className="max-h-52 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const selected = value.includes(option.value)

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
                    onClick={() => toggleOption(option.value)}
                  >
                    <Checkbox checked={selected} tabIndex={-1} aria-hidden="true" />
                    <span className="flex-1">{option.label}</span>
                    {selected && <Check className="size-4 text-primary" />}
                  </button>
                )
              })
            ) : (
              <p className="px-2 py-3 text-sm text-muted-foreground">{emptyMessage}</p>
            )}
          </div>
          {selectedOptions.length > 0 && (
            <button
              type="button"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-1 w-full")}
              onClick={() => onValueChange([])}
            >
              Clear selections
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export { MultiSelect }
