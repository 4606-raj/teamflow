const DURATION_UNITS = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
  y: 365 * 24 * 60 * 60 * 1000,
} as const;

export function durationToMilliseconds(duration: string | undefined): number {
  const match = duration?.trim().match(/^(\d+)\s*(s|m|h|d|w|y)$/i);

  if (!match) {
    throw new Error('Duration must be formatted like 1y or 30d');
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase() as keyof typeof DURATION_UNITS;

  return value * DURATION_UNITS[unit];
}
