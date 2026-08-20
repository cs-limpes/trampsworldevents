import { describe, expect, it } from 'vitest'
import { parseBoolean, parseEventDescription, parseList, safeHttpsUrl } from '../worker/lib/metadata'

describe('metadata parser', () => {
  it('separates public description from metadata', () => {
    const parsed = parseEventDescription(`Join us <strong>downtown</strong>.

---
category: music
state: Arizona
vertical: CycleTramp
tags: live music, local, live music
price: paid
unknown_key: ignored`)

    expect(parsed.publicDescription).toBe('Join us downtown.')
    expect(parsed.fields.category).toBe('music')
    expect(parsed.fields.state).toBe('Arizona')
    expect(parsed.fields.vertical).toBe('CycleTramp')
    expect(parseList(parsed.fields.tags)).toEqual(['live music', 'local'])
    expect(parsed.fields.price).toBe('paid')
    expect(parsed.fields.unknown_key).toBeUndefined()
    expect(parsed.warnings).toContain('Ignoring unknown metadata key: unknown_key')
  })

  it('accepts documented boolean forms', () => {
    expect(parseBoolean('yes')).toBe(true)
    expect(parseBoolean('false')).toBe(false)
    expect(parseBoolean('sometimes')).toBeUndefined()
  })

  it('extracts delimiter-free calendar metadata from recognized key lines', () => {
    const parsed = parseEventDescription(`A weekly heart-centered experience.

Type: recurring_event
Category: Youth Teen Program
Organizer: The Vibe Tribe
Cost/tickets: $22 DROP-IN
URL/contact: www.TheVibeTribe.tv
Recurrence note: Wednesdays weekly, 4:30-6:00 PM

Reviewed ambiguity notes:
No specific year or end date for recurrence provided.`)

    expect(parsed.publicDescription).toBe('A weekly heart-centered experience.')
    expect(parsed.fields.type).toBe('recurring_event')
    expect(parsed.fields.category).toBe('Youth Teen Program')
    expect(parsed.fields.organizer).toBe('The Vibe Tribe')
    expect(parsed.fields.price_text).toBe('$22 DROP-IN')
    expect(parsed.fields.website).toBe('www.TheVibeTribe.tv')
    expect(parsed.fields.recurrence_note).toBe('Wednesdays weekly, 4:30-6:00 PM')
    expect(parsed.publicDescription).not.toContain('Reviewed ambiguity notes')
  })

  it('combines legacy metadata before a delimiter with new metadata after it', () => {
    const parsed = parseEventDescription(`Annual motorcycle event with live music.

Type: event
Category: Motorcycle Event
Organizer: River Riders M/C
Cost/tickets: Event entry fee: $35

Reviewed ambiguity notes:
The exact end time was not stated.

---
coverage_status: planned`)

    expect(parsed.publicDescription).toBe('Annual motorcycle event with live music.')
    expect(parsed.fields.type).toBe('event')
    expect(parsed.fields.category).toBe('Motorcycle Event')
    expect(parsed.fields.organizer).toBe('River Riders M/C')
    expect(parsed.fields.price_text).toBe('Event entry fee: $35')
    expect(parsed.fields.coverage_status).toBe('planned')
    expect(parsed.publicDescription).not.toContain('Reviewed ambiguity notes')
  })

  it('only accepts https urls', () => {
    expect(safeHttpsUrl('https://example.com/path')).toBe('https://example.com/path')
    expect(safeHttpsUrl('www.example.com/path')).toBe('https://www.example.com/path')
    expect(safeHttpsUrl('http://example.com/path')).toBeUndefined()
    expect(safeHttpsUrl('not-a-url')).toBeUndefined()
  })
})
