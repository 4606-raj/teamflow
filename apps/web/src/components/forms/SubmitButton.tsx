type SubmitButtonProps = {
  isLoading?: boolean
  children: React.ReactNode
}

export function SubmitButton({
  isLoading,
  children,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? 'Please wait...' : children}
    </button>
  )
}