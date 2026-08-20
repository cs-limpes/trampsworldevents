import { DateTime } from 'luxon'
import type { PublicEvent } from '../types/events'
import { AGENDA_TIMEZONE, eventOverlapsRange } from './agenda-sections'

type AnyDateTime = DateTime<boolean>

export type PlannedCoverageSchedule = {
  featured: PublicEvent[]
  remaining: PublicEvent[]
}

export function isPlannedCoverage(event: PublicEvent): boolean {
  return event.editorial.coverageStatus === 'planned'
}

export function getPlannedCoverageSchedule(
  events: PublicEvent[],
  now: AnyDateTime = DateTime.now(),
): PlannedCoverageSchedule {
  const localNow = now.setZone(AGENDA_TIMEZONE)
  const monthEnd = localNow.plus({ months: 1 }).startOf('month')
  const seen = new Set<string>()
  const upcoming = events
    .filter((event) => {
      if (seen.has(event.id) || !isPlannedCoverage(event) || !eventEndsAfter(event, localNow)) {
        return false
      }

      seen.add(event.id)
      return true
    })
    .sort(compareEventStarts)

  const currentMonth = upcoming.filter((event) => eventOverlapsRange(event, localNow, monthEnd))
  const featured = currentMonth.length > 0 ? currentMonth : getNextDateGroup(upcoming)
  const featuredIds = new Set(featured.map((event) => event.id))

  return {
    featured,
    remaining: upcoming.filter((event) => !featuredIds.has(event.id)),
  }
}

export function getVisiblePlannedCoverageEvents(
  schedule: PlannedCoverageSchedule,
  expanded: boolean,
): PublicEvent[] {
  return expanded ? [...schedule.featured, ...schedule.remaining] : schedule.featured
}

function getNextDateGroup(events: PublicEvent[]): PublicEvent[] {
  const first = events[0]

  if (!first) {
    return []
  }

  const firstDate = getEventStart(first).toISODate()
  return events.filter((event) => getEventStart(event).toISODate() === firstDate)
}

function eventEndsAfter(event: PublicEvent, now: AnyDateTime): boolean {
  return parseBoundary(event.end, event.allDay) > now
}

function compareEventStarts(a: PublicEvent, b: PublicEvent): number {
  return getEventStart(a).toMillis() - getEventStart(b).toMillis()
}

function getEventStart(event: PublicEvent): AnyDateTime {
  return parseBoundary(event.start, event.allDay)
}

function parseBoundary(value: string, allDay: boolean): AnyDateTime {
  return allDay
    ? DateTime.fromISO(value, { zone: AGENDA_TIMEZONE })
    : DateTime.fromISO(value, { setZone: true }).setZone(AGENDA_TIMEZONE)
}
