import { describe, expect, it } from 'vitest'
import { AGENDA_TIMEZONE } from '../src/lib/agenda-sections'
import { replaceFullCalendarEvents, toFullCalendarEvents, uniqueEventsById } from '../src/lib/calendar-events'
import type { PublicEvent } from '../src/types/events'

describe('calendar events', () => {
  it('maps public events to FullCalendar inputs without changing date boundaries', () => {
    const events = [
      event({
        id: 'all-day-festival',
        title: 'All Day Festival',
        start: '2026-07-11',
        end: '2026-07-13',
        allDay: true,
        multiDay: true,
      }),
    ]

    const calendarEvents = toFullCalendarEvents(events, { getUrl: (item) => `/events/${item.id}` })

    expect(calendarEvents).toHaveLength(1)
    expect(calendarEvents[0]).toMatchObject({
      id: 'all-day-festival',
      title: 'All Day Festival',
      start: '2026-07-11',
      end: '2026-07-13',
      allDay: true,
      url: '/events/all-day-festival',
    })
    expect(calendarEvents[0].extendedProps.publicEvent).toBe(events[0])
    expect(calendarEvents[0].classNames).toContain('calendar-event-multi-day')
  })

  it('uses event-local wall time for timed FullCalendar placement', () => {
    const events = [
      event({
        id: 'winter-pacific-night',
        start: '2026-12-12T23:30:00-08:00',
        end: '2026-12-13T01:00:00-08:00',
        timezone: 'America/Los_Angeles',
      }),
    ]

    const calendarEvents = toFullCalendarEvents(events)

    expect(calendarEvents[0].start).toBe('2026-12-12T23:30:00')
    expect(calendarEvents[0].end).toBe('2026-12-13T01:00:00')
  })

  it('preserves planned coverage data and adds a calendar attendance class', () => {
    const planned = event({
      id: 'planned-stop',
      editorial: {
        featured: false,
        promoted: false,
        sponsored: false,
        coverageStatus: 'planned',
      },
    })

    const [calendarEvent] = toFullCalendarEvents([planned])

    expect(calendarEvent.extendedProps.publicEvent.editorial.coverageStatus).toBe('planned')
    expect(calendarEvent.classNames).toContain('calendar-event-planned')
  })

  it.each(['hotrodtramp', 'cycletramp', 'rivertramp', 'dirttramp', 'unclassified'] as const)(
    'adds the %s vertical styling hook',
    (vertical) => {
      const [calendarEvent] = toFullCalendarEvents([
        event({
          taxonomy: {
            vertical,
            primaryCategory: 'other',
            tags: [],
            audience: ['unknown'],
            priceType: 'unknown',
          },
        }),
      ])

      expect(calendarEvent.classNames).toContain(`calendar-vertical-${vertical}`)
    },
  )

  it('replaces FullCalendar internal events when the filtered set changes', () => {
    const storedIds = new Set(['stale-hotrod', 'stale-cycle'])
    const calendar = {
      removeAllEvents() {
        storedIds.clear()
      },
      addEventSource(inputs: Array<{ id?: string }>) {
        for (const input of inputs) {
          if (input.id) storedIds.add(input.id)
        }

        return {
          remove() {
            for (const input of inputs) {
              if (input.id) storedIds.delete(input.id)
            }
          },
        } as never
      },
    }
    const filtered = toFullCalendarEvents([event({ id: 'filtered-river' })])

    const eventSource = replaceFullCalendarEvents(calendar, filtered)

    expect([...storedIds]).toEqual(['filtered-river'])

    eventSource.remove()
    expect([...storedIds]).toEqual([])
  })


  it('deduplicates repeated section events by public event id', () => {
    const duplicate = event({ id: 'duplicate' })
    const unique = event({ id: 'unique' })

    expect(uniqueEventsById([duplicate, duplicate, unique]).map((item) => item.id)).toEqual(['duplicate', 'unique'])
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
    timezone: AGENDA_TIMEZONE,
    allDay: false,
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
    },
    ...overrides,
  }
}
