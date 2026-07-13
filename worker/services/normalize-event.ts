import { DateTime } from 'luxon'
import {
  EVENT_AUDIENCES,
  EVENT_CATEGORIES,
  EVENT_PRICE_TYPES,
  TRAMPSWORLD_STATES,
  TRAMPSWORLD_VERTICALS,
} from '../../src/lib/event-taxonomy'
import type {
  EventAudience,
  EventCategory,
  EventPriceType,
  EventStatus,
  PublicEvent,
  TrampsWorldState,
  TrampsWorldVertical,
} from '../../src/types/events'
import { CANONICAL_TIMEZONE, type SerializedEventRange } from '../lib/date-ranges'
import { parseBoolean, parseEventDescription, parseList, safeHttpsUrl } from '../lib/metadata'
import type { GoogleCalendarDateValue, GoogleCalendarEvent } from '../types/google-calendar'

const CATEGORY_VALUES = new Set<EventCategory>(EVENT_CATEGORIES)
const AUDIENCE_VALUES = new Set<EventAudience>(EVENT_AUDIENCES)
const PRICE_VALUES = new Set<EventPriceType>(EVENT_PRICE_TYPES)
const STATE_VALUES = new Set<TrampsWorldState>(TRAMPSWORLD_STATES)
const VERTICAL_VALUES = new Set<TrampsWorldVertical>(TRAMPSWORLD_VERTICALS)

const WEEKDAY_VALUES: Record<string, number> = {
  monday: 1,
  mondays: 1,
  mon: 1,
  tuesday: 2,
  tuesdays: 2,
  tue: 2,
  tues: 2,
  wednesday: 3,
  wednesdays: 3,
  wed: 3,
  thursday: 4,
  thursdays: 4,
  thu: 4,
  thur: 4,
  thurs: 4,
  friday: 5,
  fridays: 5,
  fri: 5,
  saturday: 6,
  saturdays: 6,
  sat: 6,
  sunday: 7,
  sundays: 7,
  sun: 7,
}

export function normalizeGoogleEvent(source: GoogleCalendarEvent): PublicEvent | null {
  const eventId = source.id ?? source.iCalUID
  const startValue = source.start?.date ?? source.start?.dateTime
  const endValue = source.end?.date ?? source.end?.dateTime

  if (!eventId || !startValue || !endValue) {
    return null
  }

  const metadata = parseEventDescription(source.description)
  const allDay = Boolean(source.start?.date)
  const status = normalizeStatus(source.status)
  const timezone = getGoogleEventTimezone(source)
  const state = normalizeState(metadata.fields.state, source.location)
  const vertical = normalizeVertical(metadata.fields.vertical)
  const category = normalizeCategory(metadata.fields.category)

  return {
    id: buildPublicEventId(eventId, source),
    source: {
      provider: 'google-calendar',
      eventId,
      recurringEventId: source.recurringEventId,
      originalStartTime: source.originalStartTime?.date ?? source.originalStartTime?.dateTime,
      htmlLink: safeHttpsUrl(source.htmlLink),
    },
    title: source.summary?.trim() || 'Untitled event',
    description: metadata.publicDescription,
    excerpt: makeExcerpt(metadata.publicDescription),
    start: startValue,
    end: endValue,
    timezone,
    allDay,
    multiDay: isMultiDay(startValue, endValue, allDay, timezone),
    status,
    venue: buildVenue(source, metadata.fields, state),
    taxonomy: {
      vertical,
      primaryCategory: category,
      tags: parseList(metadata.fields.tags),
      audience: normalizeAudience(metadata.fields.audience, metadata.publicDescription, metadata.fields.category),
      priceType: normalizePrice(metadata.fields.price, metadata.fields.price_text),
    },
    pricing: buildPricing(metadata.fields),
    organizer: buildOrganizer(metadata.fields),
    media: buildMedia(metadata.fields, vertical, category),
    links: {
      sourceUrl: safeHttpsUrl(metadata.fields.source),
      registrationUrl: safeHttpsUrl(metadata.fields.registration),
      websiteUrl: safeHttpsUrl(metadata.fields.website),
      videoUrl: safeHttpsUrl(metadata.fields.video),
      galleryUrl: safeHttpsUrl(metadata.fields.gallery),
    },
    editorial: {
      featured: parseBoolean(metadata.fields.featured) ?? false,
      promoted: parseBoolean(metadata.fields.promoted) ?? false,
      sponsored: parseBoolean(metadata.fields.sponsored) ?? false,
      sponsorName: metadata.fields.sponsor_name || undefined,
      coverageStatus: normalizeCoverageStatus(metadata.fields.coverage_status),
    },
    accessibility: metadata.fields.accessibility ? { text: metadata.fields.accessibility } : undefined,
    updatedAt: source.updated,
    createdAt: source.created,
  }
}

export function normalizeGoogleEventOccurrences(source: GoogleCalendarEvent, range?: SerializedEventRange): PublicEvent[] {
  const event = normalizeGoogleEvent(source)

  if (!event) {
    return []
  }

  const metadata = parseEventDescription(source.description)
  const recurrence = parseWeeklyRecurrence(metadata.fields.recurrence_note)

  if (metadata.fields.type !== 'recurring_event' || !recurrence || source.recurringEventId) {
    return [event]
  }

  const timezone = getGoogleEventTimezone(source)
  const seriesStart = parseGoogleDateValue(source.start, timezone)
  const seriesEnd = parseGoogleDateValue(source.end, timezone)

  if (!seriesStart.isValid || !seriesEnd.isValid || seriesEnd <= seriesStart) {
    return [event]
  }

  const rangeStart = range ? parseRangeBoundary(range.start) : undefined
  const rangeEnd = range ? parseRangeBoundary(range.end) : undefined
  const expanded = expandWeeklyEvent(event, recurrence, seriesStart, seriesEnd, rangeStart, rangeEnd)
  return expanded.length > 0 ? expanded : [event]
}

export function comparePublicEvents(a: PublicEvent, b: PublicEvent): number {
  return eventStartMillis(a) - eventStartMillis(b)
}

function buildPublicEventId(eventId: string, source: GoogleCalendarEvent): string {
  const occurrenceStart = source.originalStartTime?.date ?? source.originalStartTime?.dateTime

  if (!source.recurringEventId || !occurrenceStart) {
    return eventId
  }

  return `${eventId}-${occurrenceStart.replace(/[^a-zA-Z0-9]/g, '')}`
}

function normalizeStatus(status?: string): EventStatus {
  if (status === 'tentative' || status === 'cancelled') {
    return status
  }

  return 'confirmed'
}

function getGoogleEventTimezone(source: GoogleCalendarEvent): string | undefined {
  return source.start?.timeZone || source.end?.timeZone || source.originalStartTime?.timeZone
}

function normalizeCategory(value?: string): EventCategory {
  const normalized = value?.trim().toLowerCase().replace(/&/g, '').replace(/[_/]+/g, '-').replace(/\s+/g, '-')

  if (normalized && CATEGORY_VALUES.has(normalized as EventCategory)) {
    return normalized as EventCategory
  }

  const searchable = value?.toLowerCase() ?? ''

  if (/\b(car|cars|auto|automotive|hot\s*rod|classic|custom)\b/.test(searchable)) return 'car-show'
  if (/\b(motorcycle|bike|biker|chopper|cycle)\b/.test(searchable)) return 'motorcycle-event'
  if (/\b(boat|boating|water|river|lake|pwc|personal watercraft|jet ski|wake)\b/.test(searchable)) {
    return 'boat-water-event'
  }
  if (/\b(off[-\s]?road|dirt|utv|atv|desert|motocross|mx|sand|trail)\b/.test(searchable)) return 'off-road-event'
  if (/\b(race|racing|drag|drift|speedway|track)\b/.test(searchable)) return 'race'
  if (/\b(rally|ride|run)\b/.test(searchable)) return 'rally-ride'
  if (/\b(meet|cruise|cruise-in|night)\b/.test(searchable)) return 'meet-cruise'
  if (/\b(festival|fiesta|fair)\b/.test(searchable)) return 'festival'
  if (/\b(expo|trade show|showcase|convention)\b/.test(searchable)) return 'expo-trade-show'
  if (/\b(swap|market|vendor)\b/.test(searchable)) return 'swap-meet-market'
  if (/\b(community|fundraiser|benefit|charity)\b/.test(searchable)) return 'community'

  return 'other'
}

function normalizeState(value?: string, location?: string): TrampsWorldState {
  const explicit = normalizeStateValue(value)

  if (explicit !== 'unknown') {
    return explicit
  }

  return normalizeStateValue(readLocationState(location))
}

function normalizeStateValue(value?: string): TrampsWorldState {
  const normalized = value?.trim().toLowerCase().replace(/\./g, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ')

  if (!normalized) {
    return 'unknown'
  }

  const aliases: Record<string, TrampsWorldState> = {
    arizona: 'AZ',
    az: 'AZ',
    california: 'CA',
    ca: 'CA',
    nevada: 'NV',
    nv: 'NV',
    'new mexico': 'NM',
    nm: 'NM',
    unknown: 'unknown',
  }

  const state = aliases[normalized] ?? 'unknown'
  return STATE_VALUES.has(state) ? state : 'unknown'
}

function normalizeVertical(value?: string): TrampsWorldVertical {
  const normalized = value?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '')

  if (!normalized) {
    return 'unclassified'
  }

  const aliases: Record<string, TrampsWorldVertical> = {
    hotrodtramp: 'hotrodtramp',
    hotrod: 'hotrodtramp',
    hotrods: 'hotrodtramp',
    cycletramp: 'cycletramp',
    cycle: 'cycletramp',
    motorcycle: 'cycletramp',
    motorcycles: 'cycletramp',
    rivertramp: 'rivertramp',
    river: 'rivertramp',
    boating: 'rivertramp',
    dirttramp: 'dirttramp',
    dirt: 'dirttramp',
    offroad: 'dirttramp',
    unclassified: 'unclassified',
    unknown: 'unclassified',
  }

  const vertical = aliases[normalized] ?? 'unclassified'
  return VERTICAL_VALUES.has(vertical) ? vertical : 'unclassified'
}

function normalizeAudience(value?: string, description?: string, category?: string): EventAudience[] {
  const values = parseList(value).map((item) => {
    const normalized = item.toLowerCase().trim()
    let candidate: EventAudience = 'unknown'

    if (normalized === 'all ages' || normalized === 'all-ages') candidate = 'all-ages'
    if (normalized === 'family' || normalized === 'family-friendly') candidate = 'family-friendly'
    if (normalized === 'adult' || normalized === 'adults') candidate = 'adults'
    if (normalized === '18+' || normalized === '18-plus') candidate = '18-plus'
    if (normalized === '21+' || normalized === '21-plus') candidate = '21-plus'
    if (normalized === 'youth') candidate = 'youth'

    return AUDIENCE_VALUES.has(candidate) ? candidate : 'unknown'
  })

  const unique = Array.from(new Set(values))

  if (unique.length > 0) {
    return unique
  }

  const searchable = [description, category].filter(Boolean).join(' ').toLowerCase()

  if (/\b(ages?\s*)?13\s*[-–]\s*18\b/.test(searchable) || /\bteens?\b|\byouth\b/.test(searchable)) {
    return ['youth']
  }

  if (/\b21\s*\+/.test(searchable)) {
    return ['21-plus']
  }

  if (/\b18\s*\+/.test(searchable)) {
    return ['18-plus']
  }

  if (/\bfamily\b|\bkids?\b/.test(searchable)) {
    return ['family-friendly']
  }

  return ['unknown']
}

function normalizePrice(value?: string, displayText?: string): EventPriceType {
  const normalized = value?.trim().toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-')

  if (
    normalized === 'free' ||
    normalized === 'paid' ||
    normalized === 'donation' ||
    normalized === 'registration-required'
  ) {
    return PRICE_VALUES.has(normalized) ? normalized : 'unknown'
  }

  const searchable = displayText?.toLowerCase() ?? ''

  if (/\bfree\b/.test(searchable)) {
    return 'free'
  }

  if (/\bdonation\b/.test(searchable)) {
    return 'donation'
  }

  if (/\bregister|registration|required\b/.test(searchable)) {
    return 'registration-required'
  }

  if (/\$\s*\d|\bpaid\b|\bticket\b|\bmonthly\b|\bdrop-in\b/.test(searchable)) {
    return 'paid'
  }

  return 'unknown'
}

function normalizeCoverageStatus(value?: string): PublicEvent['editorial']['coverageStatus'] {
  const normalized = value?.trim().toLowerCase().replace(/[_\s]+/g, '-')

  if (normalized === 'none' || normalized === 'planned' || normalized === 'published') {
    return normalized
  }

  return undefined
}

function readLocationState(location?: string): string | undefined {
  if (!location) {
    return undefined
  }

  return location
    .split(',')
    .map((part) => part.trim())
    .find((part) => normalizeStateValue(part) !== 'unknown')
}

function readLocationCity(location?: string): string | undefined {
  if (!location) {
    return undefined
  }

  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  const stateIndex = parts.findIndex((part) => normalizeStateValue(part) !== 'unknown')

  if (stateIndex <= 0) {
    return undefined
  }

  return parts[stateIndex - 1]
}

function buildVenue(
  source: GoogleCalendarEvent,
  fields: Record<string, string>,
  state: TrampsWorldState,
): PublicEvent['venue'] {
  const online = parseBoolean(fields.online) ?? false
  const name = fields.venue || undefined
  const address = fields.address || source.location || undefined
  const city = fields.city || readLocationCity(source.location) || undefined
  const region = fields.region || undefined
  const neighborhood = fields.neighborhood || undefined

  return {
    name,
    address,
    city,
    state,
    region,
    neighborhood,
    online,
  }
}

function buildPricing(fields: Record<string, string>): PublicEvent['pricing'] {
  const displayText = fields.price_text || undefined
  const ticketUrl = safeHttpsUrl(fields.ticket_url)

  if (!displayText && !ticketUrl) {
    return undefined
  }

  return {
    displayText,
    ticketUrl,
    currency: 'USD',
  }
}

function buildOrganizer(fields: Record<string, string>): PublicEvent['organizer'] {
  const name = fields.organizer || undefined
  const url = safeHttpsUrl(fields.organizer_url)

  if (!name && !url) {
    return undefined
  }

  return {
    name,
    url,
  }
}

function buildMedia(
  fields: Record<string, string>,
  vertical: TrampsWorldVertical,
  category: EventCategory,
): PublicEvent['media'] {
  const imageUrl = safeHttpsUrl(fields.image)
  const flyerUrl = safeHttpsUrl(fields.flyer)

  return {
    imageUrl,
    imageAlt: fields.image_alt || undefined,
    flyerUrl,
    visualKey: vertical === 'unclassified' ? category : vertical,
  }
}

type WeeklyRecurrence = {
  weekday: number
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
}

function parseWeeklyRecurrence(note?: string): WeeklyRecurrence | undefined {
  const normalized = note?.toLowerCase()

  if (!normalized || !normalized.includes('weekly')) {
    return undefined
  }

  const weekday = Object.entries(WEEKDAY_VALUES).find(([name]) => normalized.includes(name))?.[1]
  const timeMatch = normalized.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*[-–]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i)

  if (!weekday || !timeMatch) {
    return undefined
  }

  const endMeridiem = timeMatch[6]
  const startMeridiem = timeMatch[3] || endMeridiem
  const start = toTwentyFourHour(Number(timeMatch[1]), Number(timeMatch[2] ?? 0), startMeridiem)
  const end = toTwentyFourHour(Number(timeMatch[4]), Number(timeMatch[5] ?? 0), endMeridiem)

  if (!start || !end) {
    return undefined
  }

  return {
    weekday,
    startHour: start.hour,
    startMinute: start.minute,
    endHour: end.hour,
    endMinute: end.minute,
  }
}

function toTwentyFourHour(
  hour: number,
  minute: number,
  meridiem: string,
): { hour: number; minute: number } | undefined {
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
    return undefined
  }

  const normalizedHour = meridiem === 'am' ? hour % 12 : (hour % 12) + 12
  return { hour: normalizedHour, minute }
}

function expandWeeklyEvent(
  event: PublicEvent,
  recurrence: WeeklyRecurrence,
  seriesStart: DateTime<boolean>,
  seriesEnd: DateTime<boolean>,
  rangeStart?: DateTime<boolean>,
  rangeEnd?: DateTime<boolean>,
): PublicEvent[] {
  const occurrences: PublicEvent[] = []
  let cursor = seriesStart.startOf('day')

  while (cursor.weekday !== recurrence.weekday) {
    cursor = cursor.plus({ days: 1 })
  }

  while (cursor < seriesEnd) {
    let occurrenceStart = cursor.set({
      hour: recurrence.startHour,
      minute: recurrence.startMinute,
      second: 0,
      millisecond: 0,
    })

    if (occurrenceStart < seriesStart) {
      cursor = cursor.plus({ weeks: 1 })
      continue
    }

    let occurrenceEnd = cursor.set({
      hour: recurrence.endHour,
      minute: recurrence.endMinute,
      second: 0,
      millisecond: 0,
    })

    if (occurrenceEnd <= occurrenceStart) {
      occurrenceEnd = occurrenceEnd.plus({ days: 1 })
    }

    if (occurrenceStart >= seriesEnd) {
      break
    }

    if ((!rangeStart || occurrenceEnd > rangeStart) && (!rangeEnd || occurrenceStart < rangeEnd)) {
      const start = toIso(occurrenceStart)
      const end = toIso(occurrenceEnd)

      occurrences.push({
        ...event,
        id: `${event.source.eventId}-${start.replace(/[^a-zA-Z0-9]/g, '')}`,
        source: {
          ...event.source,
          recurringEventId: event.source.eventId,
          originalStartTime: start,
        },
        start,
        end,
        allDay: false,
        multiDay: occurrenceStart.toISODate() !== occurrenceEnd.toISODate(),
      })
    }

    cursor = cursor.plus({ weeks: 1 })
  }

  return occurrences
}

function toIso(value: DateTime<boolean>): string {
  return value.toISO({ suppressMilliseconds: true }) ?? value.toISO() ?? ''
}

function parseRangeBoundary(value: string): DateTime<boolean> | undefined {
  const parsed = DateTime.fromISO(value, { setZone: true })
  return parsed.isValid ? parsed : undefined
}

function makeExcerpt(description?: string): string | undefined {
  if (!description) {
    return undefined
  }

  const singleLine = description.replace(/\s+/g, ' ').trim()
  return singleLine.length > 180 ? `${singleLine.slice(0, 177)}...` : singleLine
}

function isMultiDay(start: string, end: string, allDay: boolean, timezone?: string): boolean {
  if (allDay) {
    const startDate = DateTime.fromISO(start, { zone: CANONICAL_TIMEZONE })
    const endDate = DateTime.fromISO(end, { zone: CANONICAL_TIMEZONE })
    return endDate.diff(startDate, 'days').days > 1
  }

  const startDateTime = parseDateTimeWithZone(start, timezone)
  const endDateTime = parseDateTimeWithZone(end, timezone)

  return startDateTime.toISODate() !== endDateTime.toISODate()
}

function eventStartMillis(event: PublicEvent): number {
  const start = event.allDay
    ? DateTime.fromISO(event.start, { zone: CANONICAL_TIMEZONE })
    : parseDateTimeWithZone(event.start, event.timezone)

  return start.toMillis()
}

function parseGoogleDateValue(value: GoogleCalendarDateValue | undefined, timezone?: string): DateTime<boolean> {
  const dateValue = value?.dateTime ?? value?.date ?? ''
  return parseDateTimeWithZone(dateValue, value?.timeZone ?? timezone)
}

function parseDateTimeWithZone(value: string, timezone?: string): DateTime<boolean> {
  const parsed = DateTime.fromISO(value, timezone ? { zone: timezone } : { setZone: true })
  return parsed.isValid ? parsed : DateTime.invalid('Invalid event date')
}
