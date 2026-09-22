import type { ReactNode } from "react"

import { cn } from "@/shared/utils/cn"
import { Label } from "@/shared/components/ui/label"

type FormFieldProps = {
  label: ReactNode
  htmlFor?: string
  error?: ReactNode
  required?: boolean
  className?: string
  children: ReactNode
}

function FormField({ label, htmlFor, error, required = false, className, children }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export { FormField }
