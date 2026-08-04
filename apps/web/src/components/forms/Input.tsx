import { type FieldError, type UseFormRegisterReturn } from 'react-hook-form'

type FormInputProps = {
  label: string
  error?: FieldError
  registration: UseFormRegisterReturn
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({
  label,
  error,
  registration,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label>{label}</label>

      <input
        {...registration}
        {...props}
        className="w-full rounded border px-3 py-2"
      />

      {error && (
        <p className="text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  )
}