import * as React from "react"
import { format } from "date-fns"
import { CalendarDays, X } from "lucide-react"
import { cn } from "cn"

import { Calendar } from "@/shared/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"

type DatePickerProps = {
  id?: string
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  "aria-invalid"?: boolean
}

function DatePicker({
  id,
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  className,
  disabled,
  "aria-invalid": ariaInvalid,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        {/* The whole field is the trigger, not just the icon. */}
        <PopoverTrigger
          id={id}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(
            "flex h-11 w-full cursor-pointer items-center gap-2 rounded-4xl border border-input bg-input/30 px-4 text-left text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
            !value && "text-muted-foreground",
            value && "pr-10",
            className
          )}
        >
          <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate">{value ? format(value, "MM/dd/yyyy") : placeholder}</span>
        </PopoverTrigger>
        {value && !disabled && (
          <button
            type="button"
            aria-label="Clear date"
            onClick={() => onChange(undefined)}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors cursor-pointer hover:text-foreground"
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        )}
      </div>
      <PopoverContent align="start" className="w-auto p-3">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
