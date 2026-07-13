import { DateTime } from 'luxon'
import { describe, expect, it } from 'vitest'
import { AGENDA_TIMEZONE } from '../src/lib/agenda-sections'
import {
  DEFAULT_FILTERS,
  buildFilterOptions,
  filterCalendarEvents,
  filterEvents,
  getActiveFilterCount,
  getFilteredAgendaSections,
  hasActiveFilters,
  parseFilters,
  serializeFilters,
  type FilterState,
} from '../src/lib/event-filters'
import type { PublicEvent } from '../src/types/events'

describe('event filters', () => {
  it('searches normalized public fields by token', () => {
    const events = [
      event({
        id: 'cycle',
        title: 'Bike Night',
        venue: { name: 'Desert Roadhouse', city: 'Phoenix', state: 'AZ', neighborhood: 'Warehouse District', online: false },
        taxonomy: {
          vertical: 'cycletramp',
          primaryCategory: 'motorcycle-event',
          tags: ['bike night'],
          audience: ['21-plus'],
          priceType: 'paid',
        },
      }),
      event({ id: 'market', title: 'Saturday Market' }),
    ]

    expect(filterEvents(events, { ...DEFAULT_FILTERS, query: 'phoenix bike' }).map((item) => item.id)).toEqual(['cycle'])
  })

  it('combines state, vertical, category, city, audience, and price filters', () => {
    const events = [
      event({
        id: 'match',
        venue: { city: 'Lake Havasu City', state: 'AZ', online: false },
        taxonomy: {
          vertical: 'rivertramp',
          primaryCategory: 'boat-water-event',
          tags: [],
          audience: ['family-friendly'],
          priceType: 'free',
        },
      }),
      event({
        id: 'wrong-price',
        venue: { city: 'Lake Havasu City', state: 'AZ', online: false },
        taxonomy: {
          vertical: 'rivertramp',
          primaryCategory: 'boat-water-event',
          tags: [],
          audience: ['family-friendly'],
          priceType: 'paid',
        },
      }),
    ]

    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      state: 'AZ',
      vertical: 'rivertramp',
      category: 'boat-water-event',
      city: 'Lake Havasu City',
      audience: 'family-friendly',
      price: 'free',
    }

    expect(filterEvents(events, filters).map((item) => item.id)).toEqual(['match'])
  })

  it('serializes and parses URL query state', () => {
    const filters: FilterState = {
      query: 'desert ride',
      display: 'calendar',
      view: 'this-weekend',
      state: 'NV',
      vertical: 'dirttramp',
      category: 'off-road-event',
      city: 'Las Vegas',
      neighborhood: 'Speedway',
      audience: '21-plus',
      price: 'paid',
    }

    expect(parseFilters(serializeFilters(filters))).toEqual(filters)
    expect(serializeFilters(DEFAULT_FILTERS).toString()).toBe('')
    expect(parseFilters(new URLSearchParams('display=unknown'))).toEqual(DEFAULT_FILTERS)
    expect(parseFilters(new URLSearchParams('vertical=unsupported&state=TX'))).toEqual(DEFAULT_FILTERS)
  })

  it('does not count calendar display mode as an active filter', () => {
    const filters: FilterState = { ...DEFAULT_FILTERS, display: 'calendar' }

    expect(getActiveFilterCount(filters)).toBe(0)
    expect(hasActiveFilters(filters)).toBe(false)
    expect(serializeFilters(filters).toString()).toBe('display=calendar')
  })

  it('treats agenda search and date window as inactive in calendar display mode', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      display: 'calendar',
      query: 'tower music',
      view: 'this-weekend',
    }

    expect(getActiveFilterCount(filters)).toBe(0)
    expect(hasActiveFilters(filters)).toBe(false)
  })

  it('filters calendar events by facets but not agenda search or date window', () => {
    const events = [
      event({
        id: 'match',
        title: 'Boat Parade',
        start: '2026-09-01T12:00:00-07:00',
        end: '2026-09-01T13:00:00-07:00',
        venue: { city: 'Lake Havasu City', state: 'AZ', online: false },
        taxonomy: {
          vertical: 'rivertramp',
          primaryCategory: 'boat-water-event',
          tags: [],
          audience: ['all-ages'],
          priceType: 'free',
        },
      }),
      event({
        id: 'wrong-state',
        title: 'River Run',
        start: '2026-07-11T12:00:00-07:00',
        end: '2026-07-11T13:00:00-07:00',
        venue: { city: 'Laughlin', state: 'NV', online: false },
        taxonomy: {
          vertical: 'rivertramp',
          primaryCategory: 'boat-water-event',
          tags: [],
          audience: ['all-ages'],
          priceType: 'free',
        },
      }),
    ]

    const filters: FilterState = {
      ...DEFAULT_FILTERS,
      display: 'calendar',
      query: 'tower music',
      view: 'today',
      state: 'AZ',
      vertical: 'rivertramp',
      category: 'boat-water-event',
      city: 'Lake Havasu City',
    }

    expect(filterCalendarEvents(events, filters).map((item) => item.id)).toEqual(['match'])
    expect(getActiveFilterCount(filters)).toBe(4)
  })

  it('builds filter options from available event data only', () => {
    const options = buildFilterOptions([
      event({
        venue: { city: 'Tucson', state: 'AZ', neighborhood: 'Fairgrounds', online: false },
        taxonomy: {
          vertical: 'hotrodtramp',
          primaryCategory: 'car-show',
          tags: [],
          audience: ['all-ages'],
          priceType: 'free',
        },
      }),
    ])

    expect(options).toMatchObject({
      states: ['AZ', 'CA', 'NV', 'NM', 'unknown'],
      verticals: ['hotrodtramp', 'cycletramp', 'rivertramp', 'dirttramp', 'unclassified'],
      categories: ['car-show'],
      cities: ['Tucson'],
      neighborhoods: ['Fairgrounds'],
      audiences: ['all-ages'],
      prices: ['free'],
    })
  })

  it('returns only the selected date-window section when a date filter is active', () => {
    const now = DateTime.fromISO('2026-07-11T10:00:00', { zone: AGENDA_TIMEZONE })
    const sections = getFilteredAgendaSections(
      [
        event({
          id: 'festival',
          start: '2026-07-10',
          end: '2026-07-13',
          allDay: true,
          multiDay: true,
        }),
      ],
      'this-weekend',
      now,
    )

    expect(sections).toHaveLength(1)
    expect(sections[0].title).toBe('This Weekend')
    expect(sections[0].events.map((item) => item.id)).toEqual(['festival'])
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
