# TrampsWorld Events Data Model

## Purpose

This document defines the normalized public event model and the structured metadata expected from Google Calendar descriptions. It extends the inherited Fresno Events model with first-class state and vertical fields.

## Normalized event type

```ts
export type TrampsWorldState = 'AZ' | 'CA' | 'NV' | 'NM' | 'unknown'

export type TrampsWorldVertical =
  | 'hotrodtramp'
  | 'cycletramp'
  | 'rivertramp'
  | 'dirttramp'
  | 'unclassified'

export type PublicEvent = {
  id: string
  source: {
    provider: 'google-calendar'
    calendarId?: string
    eventId: string
    recurringEventId?: string
    originalStartTime?: string
  }

  title: string
  slug?: string
  description?: string
  excerpt?: string

  start: string
  end: string
  timezone?: string
  allDay: boolean
  multiDay: boolean
  status: 'confirmed' | 'tentative' | 'cancelled'

  venue?: {
    name?: string
    address?: string
    city?: string
    state: TrampsWorldState
    region?: string
    neighborhood?: string
    mapUrl?: string
    online: boolean
  }

  taxonomy: {
    vertical: TrampsWorldVertical
    primaryCategory: EventCategory
    tags: string[]
    audience: EventAudience[]
    priceType: EventPriceType
  }

  pricing?: {
    displayText?: string
    minimum?: number
    maximum?: number
    currency?: 'USD'
    ticketUrl?: string
  }

  organizer?: {
    name?: string
    url?: string
  }

  media?: {
    imageUrl?: string
    imageAlt?: string
    flyerUrl?: string
    visualKey: string
  }

  links: {
    sourceUrl?: string
    registrationUrl?: string
    websiteUrl?: string
    videoUrl?: string
    galleryUrl?: string
  }

  editorial: {
    featured: boolean
    promoted: boolean
    sponsored: boolean
    sponsorName?: string
    coverageStatus?: 'none' | 'planned' | 'published'
  }

  accessibility?: {
    text?: string
  }

  updatedAt?: string
  createdAt?: string
}
```

The implementation may evolve, but state and vertical must remain separate first-class values.

## Identifiers

The public ID must identify an individual occurrence. Recurring events should combine source identity with original occurrence start. Titles are not authoritative identifiers.

## States

Accepted values:

- `AZ`
- `CA`
- `NV`
- `NM`
- `unknown`

Normalize full state names to their abbreviations. Invalid or missing values become `unknown`. Do not guess solely from a calendar name.

## Verticals

Accepted values:

- `hotrodtramp`
- `cycletramp`
- `rivertramp`
- `dirttramp`
- `unclassified`

Vertical assignment should come from explicit metadata or a documented conservative classification rule. Ambiguous events remain `unclassified`.

## Categories

Proposed values:

```ts
export type EventCategory =
  | 'car-show'
  | 'motorcycle-event'
  | 'boat-water-event'
  | 'off-road-event'
  | 'race'
  | 'rally-ride'
  | 'meet-cruise'
  | 'festival'
  | 'expo-trade-show'
  | 'swap-meet-market'
  | 'community'
  | 'other'
```

Unknown values normalize to `other`.

## Audience and price

Retain the inherited audience and price behavior unless a later task changes it. Missing price is `unknown`, never automatically free. Registration required does not imply paid.

## Description metadata

Preferred delimiter format:

```text
Public description.

---
state: AZ
vertical: cycletramp
category: motorcycle-event
tags: rally, ride
city: Lake Havasu City
venue: Example Venue
audience: all-ages
price: unknown
featured: false
promoted: false
sponsored: false
source: https://example.com/event
video: https://youtube.com/example
gallery: https://example.com/gallery
```

Existing delimiter-free Flyer2Calendar metadata may continue to be parsed when recognized. Migration should not break currently working feeds.

## Allowed metadata keys

Initial keys include:

- `state`
- `vertical`
- `category`
- `tags`
- `city`
- `region`
- `neighborhood`
- `venue`
- `address`
- `online`
- `audience`
- `price`
- `price_text`
- `ticket_url`
- `featured`
- `promoted`
- `sponsored`
- `sponsor_name`
- `image`
- `image_alt`
- `flyer`
- `source`
- `registration`
- `website`
- `organizer`
- `organizer_url`
- `accessibility`
- `video`
- `gallery`
- `coverage_status`

Unknown keys should be ignored and optionally logged in development.

## Parsing rules

- keys are case-insensitive and normalized to lowercase
- surrounding whitespace is trimmed
- duplicate scalar keys use the last valid value and may warn in development
- comma-separated lists are trimmed and deduplicated
- booleans accept `true`, `false`, `yes`, and `no`
- public URLs should use HTTPS unless an explicit exception is approved
- parser failures must not prevent an otherwise valid event from displaying
- raw metadata must never be shown publicly
- state and vertical remain unknown when confidence is insufficient

## Fallbacks

- missing state: `unknown`
- missing vertical: `unclassified`
- missing category: `other`
- missing image: use vertical or category art
- missing description: omit it
- missing venue: show available city and state only when present
- missing price: `unknown`
- missing audience: `unknown`

## Dates and timezones

Timed events should preserve source offsets or IANA timezone information. All-day event dates remain date-only and use an exclusive end date.

The site reference timezone may be `America/Phoenix`, but event-local display must not silently convert all event times to Phoenix time.

Tests must cover:

- Arizona events year-round
- California and Nevada daylight-saving behavior
- New Mexico Mountain Time behavior
- recurring events crossing DST boundaries
- all-day events without timezone drift
- multi-day events spanning local midnight

## Duplicate and cancellation behavior

Collapse only exact source occurrence duplicates automatically. Similar titles and times are not enough to delete an event. Canceled events should not appear as active.

## Test fixtures

Include fixtures for each state, each vertical, unknown state, unclassified vertical, timed, all-day, multi-day, recurring, modified, canceled, free, paid, unknown price, missing venue, missing image, long title, flyer, online event, featured event, sponsored event, and events with related video or gallery metadata.
