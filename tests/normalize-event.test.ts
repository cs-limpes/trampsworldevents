import { describe, expect, it } from 'vitest'
import { normalizeGoogleEvent, normalizeGoogleEventOccurrences } from '../worker/services/normalize-event'
import type { GoogleCalendarEvent } from '../worker/types/google-calendar'

describe('normalizeGoogleEvent', () => {
  it('normalizes recurring events without exposing calendar identifiers', () => {
    const source: GoogleCalendarEvent = {
      id: 'abc123',
      summary: 'Late Night Art Market',
      description: `Public description.

---
state: CA
vertical: HotRodTramp
category: car show
audience: 21+
price: paid
featured: yes
source: https://example.com/event`,
      htmlLink: 'https://calendar.google.com/event?eid=abc123',
      start: { dateTime: '2026-07-11T22:00:00-07:00' },
      end: { dateTime: '2026-07-12T01:00:00-07:00' },
      recurringEventId: 'series-1',
      originalStartTime: { dateTime: '2026-07-11T22:00:00-07:00' },
      status: 'confirmed',
    }

    const event = normalizeGoogleEvent(source)

    expect(event).not.toBeNull()
    expect(event?.id).toContain('20260711T2200000700')
    expect(event?.source).not.toHaveProperty('calendarId')
    expect(event?.description).toBe('Public description.')
    expect(event?.venue?.state).toBe('CA')
    expect(event?.taxonomy.vertical).toBe('hotrodtramp')
    expect(event?.taxonomy.primaryCategory).toBe('car-show')
    expect(event?.taxonomy.audience).toEqual(['21-plus'])
    expect(event?.taxonomy.priceType).toBe('paid')
    expect(event?.editorial.featured).toBe(true)
    expect(event?.links.sourceUrl).toBe('https://example.com/event')
    expect(event?.source.htmlLink).toBe('https://calendar.google.com/event?eid=abc123')
    expect(event?.multiDay).toBe(true)
  })

  it('does not expose the Google Calendar htmlLink as a public source link', () => {
    const source: GoogleCalendarEvent = {
      id: 'calendar-only-link',
      summary: 'Calendar Link Only',
      htmlLink: 'https://calendar.google.com/event?eid=calendar-only-link',
      start: { dateTime: '2026-07-11T19:00:00-07:00' },
      end: { dateTime: '2026-07-11T20:00:00-07:00' },
      status: 'confirmed',
    }

    const event = normalizeGoogleEvent(source)

    expect(event?.links.sourceUrl).toBeUndefined()
    expect(event?.source.htmlLink).toBe('https://calendar.google.com/event?eid=calendar-only-link')
  })

  it('marks multi-day all-day events using exclusive end dates', () => {
    const source: GoogleCalendarEvent = {
      id: 'all-day-1',
      summary: 'Festival Weekend',
      start: { date: '2026-07-10' },
      end: { date: '2026-07-13' },
      status: 'confirmed',
    }

    const event = normalizeGoogleEvent(source)

    expect(event?.allDay).toBe(true)
    expect(event?.multiDay).toBe(true)
    expect(event?.start).toBe('2026-07-10')
    expect(event?.end).toBe('2026-07-13')
  })

  it('normalizes state, vertical, and media metadata into the public event', () => {
    const source: GoogleCalendarEvent = {
      id: 'dirt-1',
      summary: 'Desert Trail Run',
      description: `Trail ride details.

---
state: New Mexico
vertical: DirtTramp
category: off road
video: https://example.com/video
gallery: https://example.com/gallery
coverage_status: planned`,
      start: { dateTime: '2026-10-03T09:00:00-06:00', timeZone: 'America/Denver' },
      end: { dateTime: '2026-10-03T12:00:00-06:00', timeZone: 'America/Denver' },
      status: 'confirmed',
    }

    const event = normalizeGoogleEvent(source)

    expect(event?.timezone).toBe('America/Denver')
    expect(event?.venue?.state).toBe('NM')
    expect(event?.taxonomy.vertical).toBe('dirttramp')
    expect(event?.taxonomy.primaryCategory).toBe('off-road-event')
    expect(event?.media?.visualKey).toBe('dirttramp')
    expect(event?.links.videoUrl).toBe('https://example.com/video')
    expect(event?.links.galleryUrl).toBe('https://example.com/gallery')
    expect(event?.editorial.coverageStatus).toBe('planned')
  })

  it('keeps invalid state and vertical values as safe fallbacks', () => {
    const source: GoogleCalendarEvent = {
      id: 'unknown-1',
      summary: 'Unclassified Event',
      description: `Details.

---
state: Texas
vertical: SpaceTramp`,
      start: { dateTime: '2026-08-01T12:00:00-07:00' },
      end: { dateTime: '2026-08-01T14:00:00-07:00' },
      status: 'confirmed',
    }

    const event = normalizeGoogleEvent(source)

    expect(event?.venue?.state).toBe('unknown')
    expect(event?.taxonomy.vertical).toBe('unclassified')
  })

  it('expands recurring Pacific events across daylight saving changes in event-local time', () => {
    const source: GoogleCalendarEvent = {
      id: 'spring-ride',
      summary: 'Sunday Morning Ride',
      description: `Weekly ride.

Type: recurring_event
Category: motorcycle ride
Recurrence note: Sundays weekly, 9:00-10:00 AM`,
      start: { dateTime: '2026-03-01T09:00:00-08:00', timeZone: 'America/Los_Angeles' },
      end: { dateTime: '2026-03-22T10:00:00-07:00', timeZone: 'America/Los_Angeles' },
      status: 'confirmed',
    }

    const events = normalizeGoogleEventOccurrences(source)

    expect(events.map((event) => event.start)).toEqual([
      '2026-03-01T09:00:00-08:00',
      '2026-03-08T09:00:00-07:00',
      '2026-03-15T09:00:00-07:00',
      '2026-03-22T09:00:00-07:00',
    ])
    expect(events.every((event) => event.timezone === 'America/Los_Angeles')).toBe(true)
  })

  it('expands explicit weekly recurrence-note events into individual occurrences', () => {
    const source: GoogleCalendarEvent = {
      id: 'soul-medicine',
      summary: 'Wednesday Bike Night',
      description: `A weekly motorcycle meetup for riders 21+.

Type: recurring_event
Category: Bike Night
Audience: 21+
Organizer: Desert Roadhouse
Cost/tickets: $10 suggested donation
URL/contact: www.example.com
Recurrence note: Wednesdays weekly, 4:30-6:00 PM`,
      location: 'Desert Roadhouse, Phoenix, AZ',
      start: { dateTime: '2026-07-01T16:30:00-07:00' },
      end: { dateTime: '2026-07-22T18:00:00-07:00' },
      status: 'confirmed',
    }

    const events = normalizeGoogleEventOccurrences(source)

    expect(events.map((event) => event.start)).toEqual([
      '2026-07-01T16:30:00-07:00',
      '2026-07-08T16:30:00-07:00',
      '2026-07-15T16:30:00-07:00',
      '2026-07-22T16:30:00-07:00',
    ])
    expect(events.map((event) => event.end)).toEqual([
      '2026-07-01T18:00:00-07:00',
      '2026-07-08T18:00:00-07:00',
      '2026-07-15T18:00:00-07:00',
      '2026-07-22T18:00:00-07:00',
    ])
    expect(events[0]).toMatchObject({
      title: 'Wednesday Bike Night',
      multiDay: false,
      venue: { city: 'Phoenix', state: 'AZ' },
      taxonomy: {
        vertical: 'unclassified',
        primaryCategory: 'motorcycle-event',
        audience: ['21-plus'],
        priceType: 'donation',
      },
      organizer: { name: 'Desert Roadhouse' },
      links: { websiteUrl: 'https://www.example.com/' },
    })
    expect(new Set(events.map((event) => event.id)).size).toBe(events.length)
  })

  it('clips expanded recurrence-note occurrences to the requested range', () => {
    const source: GoogleCalendarEvent = {
      id: 'soul-medicine',
      summary: 'Wednesday Bike Night',
      description: `A weekly motorcycle meetup.

Type: recurring_event
Category: Bike Night
Recurrence note: Wednesdays weekly, 4:30-6:00 PM`,
      start: { dateTime: '2026-07-01T16:30:00-07:00' },
      end: { dateTime: '2026-07-29T18:00:00-07:00' },
      status: 'confirmed',
    }

    const events = normalizeGoogleEventOccurrences(source, {
      start: '2026-07-12T00:00:00-07:00',
      end: '2026-07-26T00:00:00-07:00',
      timezone: 'America/Phoenix',
    })

    expect(events.map((event) => event.start)).toEqual([
      '2026-07-15T16:30:00-07:00',
      '2026-07-22T16:30:00-07:00',
    ])
  })

  it('returns null for malformed events without usable dates', () => {
    expect(normalizeGoogleEvent({ id: 'missing-dates', summary: 'Broken event' })).toBeNull()
  })
})
