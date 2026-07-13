import { useEffect, useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import type { EventClickArg, EventContentArg, EventMountArg } from '@fullcalendar/core'
import { AGENDA_TIMEZONE } from '../lib/agenda-sections'
import { toFullCalendarEvents } from '../lib/calendar-events'
import { getEventDetailPath } from '../lib/event-detail'
import type { PublicEvent } from '../types/events'

export function EventCalendarView({ events, currentSearch }: { events: PublicEvent[]; currentSearch: string }) {
  const [calendarView, setCalendarView] = useState(getPreferredCalendarView)
  const calendarEvents = useMemo(
    () => toFullCalendarEvents(events, { getUrl: (event) => `${getEventDetailPath(event)}${currentSearch}` }),
    [currentSearch, events],
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 38rem)')
    const updateView = () => setCalendarView(mediaQuery.matches ? 'listMonth' : 'dayGridMonth')

    updateView()
    mediaQuery.addEventListener('change', updateView)

    return () => mediaQuery.removeEventListener('change', updateView)
  }, [])

  return (
    <section className="calendar-shell" aria-labelledby="calendar-heading">
      <div className="calendar-heading">
        <div>
          <h3 id="calendar-heading">Calendar</h3>
          <p>Month and list views use the same filtered events as the agenda.</p>
        </div>
        <p className="section-count">
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </p>
      </div>

      <div className="calendar-surface">
        <FullCalendar
          key={calendarView}
          plugins={[dayGridPlugin, listPlugin]}
          initialView={calendarView}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,listMonth',
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            list: 'List',
          }}
          events={calendarEvents}
          eventClick={openCalendarEvent}
          eventContent={(arg) => <CalendarEventContent arg={arg} />}
          eventDidMount={prepareCalendarEvent}
          dayMaxEventRows={3}
          displayEventEnd
          height="auto"
          listDayFormat={{ weekday: 'long', month: 'short', day: 'numeric' }}
          listDaySideFormat={false}
          moreLinkClick="popover"
          timeZone={AGENDA_TIMEZONE}
        />
      </div>
    </section>
  )
}

function getPreferredCalendarView(): 'dayGridMonth' | 'listMonth' {
  if (typeof window === 'undefined') {
    return 'dayGridMonth'
  }

  return window.matchMedia('(max-width: 38rem)').matches ? 'listMonth' : 'dayGridMonth'
}

function CalendarEventContent({ arg }: { arg: EventContentArg }) {
  const event = arg.event.extendedProps.publicEvent as PublicEvent | undefined

  if (!event) {
    return <span className="calendar-event-title">{arg.event.title}</span>
  }

  return (
    <span className="calendar-event-content">
      <span className="calendar-event-title">{event.title}</span>
    </span>
  )
}

function openCalendarEvent(arg: EventClickArg): void {
  if (!arg.event.url) {
    return
  }

  arg.jsEvent.preventDefault()
  window.location.href = arg.event.url
}

function prepareCalendarEvent({ event, el }: EventMountArg): void {
  const publicEvent = event.extendedProps.publicEvent as PublicEvent | undefined

  if (publicEvent) {
    el.setAttribute('title', publicEvent.title)
  }

  if (event.url && !(el instanceof HTMLAnchorElement)) {
    el.setAttribute('role', 'link')
    el.setAttribute('tabindex', '0')
    el.classList.add('calendar-event-clickable')
    el.addEventListener('keydown', (keyboardEvent) => {
      if (keyboardEvent.key !== 'Enter' && keyboardEvent.key !== ' ') {
        return
      }

      keyboardEvent.preventDefault()
      window.location.href = event.url
    })
  }
}
