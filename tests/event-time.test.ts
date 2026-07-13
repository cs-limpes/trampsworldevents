import { describe, expect, it } from 'vitest'
import { formatEventDateTime, getDateBadge, toCalendarLocalDateTime } from '../src/lib/event-time'
import type { PublicEvent } from '../src/types/events'

describe('event time formatting', () => {
  it('keeps Arizona timed events in Phoenix time year-round', () => {
    expect(
      formatEventDateTime(
        event({
          start: '2026-12-12T10:00:00-07:00',
          end: '2026-12-12T12:00:00-07:00',
          timezone: 'America/Phoenix',
          venue: { city: 'Phoenix', state: 'AZ', online: false },
        }),
      ),
    ).toBe('Dec 12, 2026 at 10:00 AM')
  })

  it('keeps California and Nevada daylight-saving offsets local to Pacific events', () => {
    const california = event({
      start: '2026-07-11T20:00:00-07:00',
      end: '2026-07-11T22:00:00-07:00',
      timezone: 'America/Los_Angeles',
      venue: { city: 'Bakersfield', state: 'CA', online: false },
    })
    const nevada = event({
      start: '2026-12-12T23:30:00-08:00',
      end: '2026-12-13T01:00:00-08:00',
      timezone: 'America/Los_Angeles',
      venue: { city: 'Las Vegas', state: 'NV', online: false },
    })

    expect(formatEventDateTime(california)).toBe('Jul 11, 2026 at 8:00 PM')
    expect(formatEventDateTime(nevada)).toBe('Dec 12, 2026 at 11:30 PM')
    expect(toCalendarLocalDateTime(nevada, nevada.start)).toBe('2026-12-12T23:30:00')
  })

  it('keeps New Mexico events in Mountain Time', () => {
    expect(
      formatEventDateTime(
        event({
          start: '2026-12-12T18:00:00-07:00',
          end: '2026-12-12T21:00:00-07:00',
          timezone: 'America/Denver',
          venue: { city: 'Albuquerque', state: 'NM', online: false },
        }),
      ),
    ).toBe('Dec 12, 2026 at 6:00 PM')
  })

  it('preserves date-only all-day and multi-day events without timezone drift', () => {
    const allDay = event({ start: '2026-07-11', end: '2026-07-12', allDay: true })
    const multiDay = event({ start: '2026-07-10', end: '2026-07-13', allDay: true, multiDay: true })

    expect(formatEventDateTime(allDay)).toBe('Jul 11, 2026')
    expect(formatEventDateTime(multiDay)).toBe('Jul 10, 2026 through Jul 12, 2026')
    expect(getDateBadge(allDay)).toEqual({ month: 'Jul', day: '11' })
  })
})

function event(overrides: Partial<PublicEvent> = {}): PublicEvent {
  return {
    id: 'event',
    source: {
      provider: 'google-calendar',
      eventId: 'event',
    },
    title: 'Event',
    start: '2026-07-11T12:00:00-07:00',
    end: '2026-07-11T13:00:00-07:00',
    timezone: 'America/Phoenix',
    allDay: false,
    multiDay: false,
    status: 'confirmed',
    venue: {
      state: 'unknown',
      online: false,
    },
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
    },
    ...overrides,
  }
}
