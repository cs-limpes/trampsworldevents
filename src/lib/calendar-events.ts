import type { EventInput } from '@fullcalendar/core'
import type { PublicEvent } from '../types/events'
import { toCalendarLocalDateTime } from './event-time'

export type TrampsWorldCalendarEventInput = EventInput & {
  extendedProps: {
    publicEvent: PublicEvent
  }
}

export function uniqueEventsById(events: PublicEvent[]): PublicEvent[] {
  const seen = new Set<string>()

  return events.filter((event) => {
    if (seen.has(event.id)) {
      return false
    }

    seen.add(event.id)
    return true
  })
}

export function toFullCalendarEvents(
  events: PublicEvent[],
  options: { getUrl?: (event: PublicEvent) => string } = {},
): TrampsWorldCalendarEventInput[] {
  return uniqueEventsById(events).map((event) => ({
    id: event.id,
    title: event.title,
    start: toCalendarLocalDateTime(event, event.start),
    end: toCalendarLocalDateTime(event, event.end),
    allDay: event.allDay,
    url: options.getUrl?.(event),
    classNames: [
      'calendar-event-source',
      `calendar-vertical-${event.taxonomy.vertical}`,
      `calendar-category-${event.taxonomy.primaryCategory}`,
      event.multiDay ? 'calendar-event-multi-day' : '',
      event.status === 'cancelled' ? 'calendar-event-cancelled' : '',
    ].filter(Boolean),
    extendedProps: {
      publicEvent: event,
    },
  }))
}
