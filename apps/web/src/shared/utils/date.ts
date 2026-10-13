import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isValid,
  parseISO,
} from 'date-fns'

export type TimeUnit = 'minutes' | 'hours' | 'days'
export type DateInput = string | Date | null | undefined

const diffByUnit: Record<TimeUnit, (later: Date, earlier: Date) => number> = {
  minutes: differenceInMinutes,
  hours: differenceInHours,
  days: differenceInDays,
}

function toDate(value: DateInput): Date | null {
  if (!value) return null
  const date = typeof value === 'string' ? parseISO(value) : value
  return isValid(date) ? date : null
}

/**
 * "2026-01-01T10:00:00Z" -> "01 Jan, 2026", or "01 Jan, 2026 02:30 PM" with `withTime`.
 * Returns '' for missing or invalid input.
 */
export function formatDate(value: DateInput, withTime = false): string {
  const date = toDate(value)
  if (!date) return ''
  return format(date, withTime ? 'hh:mm a | dd MMM, yyyy' : 'dd MMM, yyyy')
}

/**
 * Whole units elapsed from `from` to `to` (defaults to now), floored and clamped at 0.
 * Returns null when either date is missing or invalid.
 */
export function elapsedSince(
  from: DateInput,
  unit: TimeUnit,
  to: DateInput = new Date(),
): number | null {
  const start = toDate(from)
  const end = toDate(to)
  if (!start || !end) return null
  return Math.max(0, diffByUnit[unit](end, start))
}
