# TrampsWorld Events Product Specification

## Product summary

TrampsWorld Events is a polished regional motorsports and outdoor-recreation event discovery site for Arizona, California, Nevada, and New Mexico. It transforms a curated Google Calendar into a readable, searchable, filterable, and shareable public destination while also creating a foundation for TrampsWorld media coverage.

The product should feel like part event guide, part regional road-culture publication, and part gateway into TrampsWorld coverage. It must not feel like an embedded Google Calendar or generic event SaaS.

## Primary goals

The site should:

- help readers discover relevant events by date, state, location, vertical, category, audience, and price
- support quick mobile browsing for travelers, riders, drivers, boaters, and local attendees
- maintain a coherent TrampsWorld identity even when source flyers are inconsistent
- reuse the proven Fresno Events application instead of rebuilding basic calendar infrastructure
- support reliable publishing through Google Calendar and Flyer2Calendar metadata
- create stable event pages that can connect to later videos, photo galleries, Road Notes coverage, and sponsor relationships
- remain inexpensive to operate during early growth
- scale without a full rewrite if traffic and editorial activity increase

## Geographic scope

Initial states:

- Arizona
- California
- Nevada
- New Mexico

The site is regional, not city-centered. State is a required first-class browsing facet when known.

Useful location fields may include state, city, venue, region, route, lake or river, fairground, track, and online status.

## Verticals

Every event may belong to one primary TrampsWorld vertical and may have secondary tags.

- **HotRodTramp**: hot rods, rat rods, classic cars, customs, car shows, automotive culture, drag racing where editorially appropriate
- **CycleTramp**: motorcycles, rallies, rides, choppers, bike nights, motorcycle shows and culture
- **RiverTramp**: lakes, rivers, boating, personal watercraft, water recreation, boat shows and waterfront events
- **DirtTramp**: off-road, desert racing, motocross, dirt track, UTV, ATV, trucks, sand and trail events

Use `unclassified` when the source does not support a confident vertical assignment. Do not force a guess.

## Audience

Primary users include motorsports and outdoor-recreation enthusiasts, event travelers, local attendees, clubs, organizers, venues, sponsors, tourism partners, and existing TrampsWorld viewers.

Typical questions include:

- What is happening this weekend?
- What motorcycle events are coming up in Arizona?
- Show me car shows in California.
- What boating events are happening around Lake Havasu?
- Are there any dirt events next month?
- Has TrampsWorld covered this event before?

## Product voice

The voice should be useful, energetic, road-aware, direct, and polished without sounding corporate. It should reflect real enthusiasm without excessive hype or AI-flavored filler.

## Core browsing

The inherited product currently supports Agenda and Calendar views, keyword search, date windows, category, city, neighborhood, audience, and price filters.

The TrampsWorld conversion must add:

- state filtering
- vertical filtering
- regional location language appropriate to a four-state audience
- TrampsWorld branding and copy

### Today

Shows events occurring during the current site day using the documented site reference timezone.

### This Weekend

Initial definition remains Friday at 4:00 PM through Sunday at 11:59:59 PM in the site reference timezone. Multi-timezone behavior must be reviewed during conversion rather than silently inherited.

### Upcoming

The remainder of the current month, unless fewer than seven days remain, then the next seven days.

### Full Calendar

Retain the existing FullCalendar month and list experiences as an alternate browsing mode.

## Event cards

Cards should normally show:

- vertical or category visual
- event title
- date and time
- venue
- city and state
- primary vertical
- category
- price or registration status when known
- audience indicator when useful
- featured, promoted, or sponsored disclosure when applicable
- coverage indicator later, when implemented

Cards must not imply unavailable facts.

## Event detail pages

Retain the inherited event detail features:

- stable URL
- title
- date and time
- venue and location
- map link
- safe public description
- category, state, and vertical
- organizer and official links when provided
- Add to Google Calendar
- downloadable `.ics`
- copy and share controls
- structured event data

Potential later additions, each requiring authorization:

- related TrampsWorld videos
- related photo galleries
- prior-year coverage
- Road Notes references
- event-series history
- media-pass or coverage status
- sponsor modules

## Categories

Categories describe what kind of event it is. Verticals describe which TrampsWorld editorial brand owns it. These are not interchangeable.

Initial categories may include:

- Car Show
- Motorcycle Event
- Boat or Water Event
- Off-Road Event
- Race
- Rally or Ride
- Meet or Cruise
- Festival
- Expo or Trade Show
- Swap Meet or Market
- Community Event
- Other

Taxonomy should be validated against real TrampsWorld calendar inventory before being treated as final.

## State and location model

Supported state values:

- `AZ`
- `CA`
- `NV`
- `NM`
- `unknown`

Location filtering may include city, venue, region, neighborhood or district where useful, lake or river, track, online, and unknown.

Do not infer state or city from incomplete information unless a documented mapping rule supports it.

## Metadata strategy

Google Calendar descriptions may include both human-readable details and machine-readable metadata.

Preferred example:

```text
Event description.

---
state: AZ
vertical: cycletramp
category: motorcycle-event
tags: rally, ride
city: Lake Havasu City
audience: all-ages
price: unknown
featured: false
source: https://example.com/event
```

Flyer2Calendar-style blocks may also be accepted when already present. Parsing rules belong in `event-data-model.md`.

## Images and visual consistency

Browsing pages should default to a controlled TrampsWorld visual system based primarily on vertical and category. Original flyers and event images may be used selectively when quality, crop behavior, rights, and readability are appropriate.

The site must not become a wall of unrelated flyers.

## Editorial and media connections

Google Calendar is the initial source of published event facts.

Future authorized work may connect events with:

- YouTube videos and playlists
- TrampsWorld websites and galleries
- Road Notes newsletters
- event coverage archives
- photographer or videographer assignments
- sponsor and partner placements

These connections must remain editorially clear and must not silently alter event facts.

## Accessibility

Target WCAG 2.2 AA practices, including keyboard navigation, visible focus, semantic headings, meaningful links, sufficient contrast, labeled controls, non-color indicators, screen-reader-friendly dates, reduced-motion support, adequate touch targets, and no essential information contained only in images.

## Mobile behavior

Mobile is the primary layout. The site must remain usable without horizontal scrolling at narrow widths. State, vertical, date, and location controls must be easy to understand and clear.

## SEO and sharing

Retain stable event URLs, canonical URLs, Open Graph metadata, descriptive titles, structured event data when accurate, and shareable filtered URLs.

Later additions may include sitemaps, event-series landing pages, vertical landing pages, state landing pages, and graceful expired-event archives.

## Trust and disclosure

The site must avoid inventing missing facts, label paid placements, distinguish editorial feature status from sponsorship, provide official source links when available, handle cancellation status honestly, and avoid exposing private calendar data.

## Future monetization

Potential future revenue includes promoted events, newsletter sponsorships, event coverage packages, vertical sponsorships, state or regional sponsorships, advertising inventory, affiliate ticket links, venue profiles, and partner placements.

No monetization implementation is authorized without a specific product and technical task.

## Initial non-goals

The initial TrampsWorld conversion is not a ticketing platform, social network, organizer CRM, user-account system, payment processor, automated scraper, or replacement for Google Calendar editorial management.
