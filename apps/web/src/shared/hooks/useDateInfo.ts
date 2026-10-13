import { useMemo } from 'react'
import { elapsedSince, formatDate, type DateInput, type TimeUnit } from '@/shared/utils/date'

export function useDateInfo(
  value: DateInput,
  unit: TimeUnit = 'days',
  options: { withTime?: boolean; to?: DateInput } = {},
) {
  const { withTime = false, to } = options
  return useMemo(
    () => ({
      label: formatDate(value, withTime),
      elapsed: elapsedSince(value, unit, to),
    }),
    [value, unit, withTime, to],
  )
}
