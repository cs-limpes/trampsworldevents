import { DateTime } from 'luxon'
import { describe, expect, it } from 'vitest'
import { AGENDA_TIMEZONE } from '../src/lib/agenda-sections'
import {
  getPlannedCoverageSchedule,
  getVisiblePlannedCoverageEvents,
  isPlannedCoverage,
} from '../src/lib/planned-coverage'
import type { PublicEvent } from '../src/types/events'

describe('planned TrampsWorld coverage', () => {
  it('detects only the canonical planned coverage status', () => {
    expect(isPlannedCoverage(event({ coverageStatus: 'planned' }))).toBe(true)
    expect(isPlannedCoverage(event({ coverageStatus: 'published' }))).toBe(false)
    expect(isPlannedCoverage(event({}))).toBe(false)
  })

  it('features remaining planned events in the current month and keeps later months collapsed', () => {
    const now = DateTime.fromISO('2026-08-20T12:00:00', { zone: AGENDA_TIMEZONE })
    const august = event({ id: 'august', start: '2026-08-29', end: '2026-08-30', coverageStatus: 'planned' })
    const september = event({ id: 'september', start: '2026-09-04', end: '2026-09-08', coverageStatus: 'planned' })
    const ordinary = event({ id: 'ordinary', start: '2026-08-25', end: '2026-08-26' })

    const schedule = getPlannedCoverageSchedule([september, ordinary, august], now)

    expect(schedule.featured.map((item) => item.id)).toEqual(['august'])
    expect(schedule.remaining.map((item) => item.id)).toEqual(['september'])
    expect(getVisiblePlannedCoverageEvents(schedule, false).map((item) => item.id)).toEqual(['august'])
    expect(getVisiblePlannedCoverageEvents(schedule, true).map((item) => item.id)).toEqual(['august', 'september'])
  })

  it('automatically advances the current-month spotlight across a month boundary', () => {
    const now = DateTime.fromISO('2026-09-01T00:05:00', { zone: AGENDA_TIMEZONE })
    const endedAugust = event({ id: 'august', start: '2026-08-29', end: '2026-08-30', coverageStatus: 'planned' })
    const september = event({ id: 'september', start: '2026-09-04', end: '2026-09-08', coverageStatus: 'planned' })
    const october = event({ id: 'october', start: '2026-10-02', end: '2026-10-04', coverageStatus: 'planned' })

    const schedule = getPlannedCoverageSchedule([endedAugust, october, september], now)

    expect(schedule.featured.map((item) => item.id)).toEqual(['september'])
    expect(schedule.remaining.map((item) => item.id)).toEqual(['october'])
  })

  it('falls back to every planned event on the next date when the current month has none', () => {
    const now = DateTime.fromISO('2026-09-29T12:00:00', { zone: AGENDA_TIMEZONE })
    const williams = event({ id: 'williams', start: '2026-10-02', end: '2026-10-04', coverageStatus: 'planned' })
    const henderson = event({ id: 'henderson', start: '2026-10-02', end: '2026-10-04', coverageStatus: 'planned' })
    const later = event({ id: 'later', start: '2026-10-08', end: '2026-10-12', coverageStatus: 'planned' })

    const schedule = getPlannedCoverageSchedule([later, henderson, williams], now)

    expect(schedule.featured.map((item) => item.id)).toEqual(['henderson', 'williams'])
    expect(schedule.remaining.map((item) => item.id)).toEqual(['later'])
  })
})

function event({ coverageStatus, ...overrides }: Partial<PublicEvent> & { coverageStatus?: PublicEvent['editorial']['coverageStatus'] }): PublicEvent {
  return {
    id: 'event',
    source: { provider: 'google-calendar', eventId: 'event' },
    title: 'Event',
    start: '2026-08-29',
    end: '2026-08-30',
    timezone: AGENDA_TIMEZONE,
    allDay: true,
    multiDay: false,
    status: 'confirmed',
    taxonomy: {
      vertical: 'unclassified',
      primaryCategory: 'other',
      tags: [],
      audience: ['unknown'],
      priceType: 'unknown',
    },
    links: {},
    editorial: {
      featured: false,
      promoted: false,
      sponsored: false,
      coverageStatus,
    },
    ...overrides,
  }
}
