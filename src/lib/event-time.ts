import { DateTime } from 'luxon'
import type { PublicEvent } from '../types/events'

type DateBadge = {
  month: string
  day: string
}

const DATE_FORMAT = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
} as const

const TIME_FORMAT = {
  hour: 'numeric',
  minute: '2-digit',
} as const

export function formatEventDateTime(event: PublicEvent): string {
  if (event.allDay) {
    return event.multiDay
      ? `${formatDateOnly(event.start)} through ${formatDateOnly(subtractOneDay(event.end))}`
      : formatDateOnly(event.start)
  }

  return `${formatEventDate(event)} at ${formatEventTime(event)}`
}

export function formatEventDate(event: PublicEvent): string {
  const dateTime = parseEventDateTime(event.start, event)
  return dateTime?.toLocaleString(DATE_FORMAT) ?? event.start
}

export function formatEventTime(event: PublicEvent): string {
  const dateTime = parseEventDateTime(event.start, event)
  return dateTime?.toLocaleString(TIME_FORMAT) ?? event.start
}

export function getDateBadge(event: PublicEvent): DateBadge {
  if (event.allDay) {
    const dateTime = parseDateOnly(event.start)

    return {
      month: dateTime?.toLocaleString({ month: 'short' }) ?? '',
      day: dateTime?.toLocaleString({ day: 'numeric' }) ?? '',
    }
  }

  const dateTime = parseEventDateTime(event.start, event)

  return {
    month: dateTime?.toLocaleString({ month: 'short' }) ?? '',
    day: dateTime?.toLocaleString({ day: 'numeric' }) ?? '',
  }
}

export function formatResponseRange(start: string, end: string): string {
  return `${formatIsoDate(start)} through ${formatIsoDate(end)}`
}

export function formatDateTimeRange(start: DateTime<boolean>, end: DateTime<boolean>): string {
  return `${formatLuxonDateTime(start)} through ${formatLuxonDateTime(end)}`
}

export function toCalendarLocalDateTime(event: PublicEvent, value: string): string {
  if (event.allDay || isDateOnly(value)) {
    return value
  }

  return parseEventDateTime(value, event)?.toFormat("yyyy-MM-dd'T'HH:mm:ss") ?? value
}

export function isDateOnly(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function parseEventDateTime(value: string, event: PublicEvent): DateTime<boolean> | undefined {
  const parsed = DateTime.fromISO(value, event.timezone ? { zone: event.timezone } : { setZone: true })
  return parsed.isValid ? parsed : undefined
}

function formatDateOnly(value: string): string {
  const dateTime = parseDateOnly(value)
  return dateTime?.toLocaleString(DATE_FORMAT) ?? value
}

function parseDateOnly(value: string): DateTime<boolean> | undefined {
  const parsed = DateTime.fromISO(value, { zone: 'UTC' })
  return parsed.isValid ? parsed : undefined
}

function formatIsoDate(value: string): string {
  if (isDateOnly(value)) {
    return formatDateOnly(value)
  }

  const parsed = DateTime.fromISO(value, { setZone: true })
  return parsed.isValid ? parsed.toLocaleString(DATE_FORMAT) : value
}

function formatLuxonDateTime(value: DateTime<boolean>): string {
  return value.toLocaleString({
    ...DATE_FORMAT,
    ...TIME_FORMAT,
  })
}

function subtractOneDay(value: string): string {
  if (!isDateOnly(value)) {
    return value
  }

  return DateTime.fromISO(value, { zone: 'UTC' }).minus({ days: 1 }).toISODate() ?? value
}
