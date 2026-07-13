import { DateTime } from 'luxon'
import { SITE_REFERENCE_TIMEZONE } from '../../src/lib/timezones'

export const CANONICAL_TIMEZONE = SITE_REFERENCE_TIMEZONE
const DEFAULT_LOOKAHEAD_DAYS = 370
const MAX_RANGE_DAYS = 370
type AnyDateTime = DateTime<boolean>

export type EventRange = {
  start: AnyDateTime
  end: AnyDateTime
  timezone: string
}

export type SerializedEventRange = {
  start: string
  end: string
  timezone: string
}

export type RangeValidationResult =
  | { ok: true; range: SerializedEventRange }
  | { ok: false; code: string; message: string; status: number }

export function getTodayRange(now: AnyDateTime = DateTime.now(), timezone = CANONICAL_TIMEZONE): EventRange {
  const localNow = now.setZone(timezone)
  const start = localNow.startOf('day')

  return {
    start,
    end: start.plus({ days: 1 }),
    timezone,
  }
}

export function getThisWeekendRange(now: AnyDateTime = DateTime.now(), timezone = CANONICAL_TIMEZONE): EventRange {
  const localNow = now.setZone(timezone)
  const monday = localNow.startOf('week')
  let start = monday.plus({ days: 4 }).set({ hour: 16, minute: 0, second: 0, millisecond: 0 })
  let end = start.plus({ days: 3 }).startOf('day')

  if (localNow >= end) {
    start = start.plus({ weeks: 1 })
    end = end.plus({ weeks: 1 })
  }

  return {
    start,
    end,
    timezone,
  }
}

export function getUpcomingRange(now: AnyDateTime = DateTime.now(), timezone = CANONICAL_TIMEZONE): EventRange {
  const localNow = now.setZone(timezone)
  const start = localNow
  const monthEnd = localNow.plus({ months: 1 }).startOf('month')
  const end = monthEnd.diff(start, 'days').days < 7 ? start.plus({ days: 7 }) : monthEnd

  return {
    start,
    end,
    timezone,
  }
}

export function getDefaultEventRange(now: AnyDateTime = DateTime.now(), timezone = CANONICAL_TIMEZONE): SerializedEventRange {
  const today = getTodayRange(now, timezone)

  return serializeRange({
    start: today.start,
    end: today.start.plus({ days: DEFAULT_LOOKAHEAD_DAYS }),
    timezone,
  })
}

export function validateRequestedRange(
  searchParams: URLSearchParams,
  now: AnyDateTime = DateTime.now(),
  timezone = CANONICAL_TIMEZONE,
): RangeValidationResult {
  const startParam = searchParams.get('start')
  const endParam = searchParams.get('end')

  if (!startParam && !endParam) {
    return { ok: true, range: getDefaultEventRange(now, timezone) }
  }

  if (!startParam || !endParam) {
    return {
      ok: false,
      code: 'INVALID_EVENT_RANGE',
      message: 'Both start and end are required when requesting a custom event range.',
      status: 400,
    }
  }

  const start = DateTime.fromISO(startParam, { setZone: true }).setZone(timezone)
  const end = DateTime.fromISO(endParam, { setZone: true }).setZone(timezone)

  if (!start.isValid || !end.isValid) {
    return {
      ok: false,
      code: 'INVALID_EVENT_RANGE',
      message: 'Event range dates must be valid ISO timestamps.',
      status: 400,
    }
  }

  if (end <= start) {
    return {
      ok: false,
      code: 'INVALID_EVENT_RANGE',
      message: 'Event range end must be after start.',
      status: 400,
    }
  }

  if (end.diff(start, 'days').days > MAX_RANGE_DAYS) {
    return {
      ok: false,
      code: 'EVENT_RANGE_TOO_LARGE',
      message: `Event range cannot exceed ${MAX_RANGE_DAYS} days.`,
      status: 400,
    }
  }

  return {
    ok: true,
    range: serializeRange({ start, end, timezone }),
  }
}

export function serializeRange(range: EventRange): SerializedEventRange {
  return {
    start: toIsoWithOffset(range.start, range.timezone),
    end: toIsoWithOffset(range.end, range.timezone),
    timezone: range.timezone,
  }
}

export function toIsoWithOffset(value: AnyDateTime, timezone = CANONICAL_TIMEZONE): string {
  return value.setZone(timezone).toISO({ suppressMilliseconds: true }) ?? value.toISO() ?? ''
}
