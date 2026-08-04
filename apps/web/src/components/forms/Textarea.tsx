import type { FieldError, UseFormRegisterReturn } from "react-hook-form"

type Props = {
  label: string
  error?: FieldError
  registration: UseFormRegisterReturn
}

export function Textarea({
  label,
  error,
  registration,
}: Props) {
  return (
    <div>
      <label>{label}</label>

      <textarea {...registration} />

      {error && (
        <p>{error.message}</p>
      )}
    </div>
  )
}