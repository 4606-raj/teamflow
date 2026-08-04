type FormButtonProps = {
  isLoading?: boolean
  children: React.ReactNode
}

export function Button({
  isLoading,
  children,
}: FormButtonProps) {
  return (
    <button
      type="button"
      disabled={isLoading}
    >
      {isLoading ? 'Please wait...' : children}
    </button>
  )
}