# TrampsWorld Events Product Specification

## Product summary

TrampsWorld Events is a centralized event-discovery application for the TrampsWorld family of brands. It transforms a curated Google Calendar into a readable, searchable, filterable, and shareable public events destination for Arizona, California, Nevada, and New Mexico.

The application replaces separate WordPress event calendars with one shared destination. TrampsWorld.com and the vertical sites may link to the general event feed or to prefiltered views.

The product should feel like a focused TrampsWorld event guide. It must not feel like an embedded Google Calendar, generic event SaaS, or a replacement for the broader TrampsWorld websites.

## Role in the TrampsWorld ecosystem

The current and future TrampsWorld websites remain separate from this application.

Expected entry points include:

```text
TrampsWorld.com Events -> events.trampsworld.com
HotRodTramp.com Events -> events.trampsworld.com/?vertical=hotrodtramp
CycleTramp.com Events -> events.trampsworld.com/?vertical=cycletramp
RiverTramp.com Events -> events.trampsworld.com/?vertical=rivertramp
DirtTramp.com Events -> events.trampsworld.com/?vertical=dirttramp
```

The application:

- receives visitors from those sites,
- preserves preselected filters in the URL,
- allows visitors to clear filters and browse all TrampsWorld events,
- may provide simple outbound links back to relevant TrampsWorld properties,
- and remains operational independently of WordPress.

The application does not:

- host or manage TrampsWorld articles, videos, galleries, merchandise, or general pages,
- consolidate the WordPress sites,
- reproduce each site's full navigation or content,
- act as the universal TrampsWorld CMS,
- or become responsible for the entire TrampsWorld business ecosystem.

## Primary goals

The site should:

- help readers discover events by date, state, location, vertical, category, audience, and price,
- support fast mobile browsing for riders, drivers, boaters, off-road audiences, travelers, and local attendees,
- provide durable prefiltered URLs for menu links from each TrampsWorld site,
- maintain a coherent TrampsWorld identity even when source flyers are inconsistent,
- reuse the proven Fresno Events application instead of rebuilding basic calendar infrastructure,
- support reliable publishing through Google Calendar and Flyer2Calendar metadata,
- preserve accurate event-local dates and times across multiple timezones,
- remain inexpensive to operate,
- and scale without a full rewrite if traffic increases.

## Geographic scope

Initial states:

- Arizona
- California
- Nevada
- New Mexico

The site is regional, not city-centered. State is a first-class browsing facet when known.

Useful location fields may include:

- state
- city
- venue
- region
- neighborhood or district
- route
- lake or river
- fairground
- track
- online status

## Verticals

Every event may belong to one primary TrampsWorld vertical and may have secondary tags.

- **HotRodTramp**: hot rods, rat rods, classic cars, customs, car shows, automotive culture, and appropriate road or drag-racing events
- **CycleTramp**: motorcycles, rallies, rides, choppers, bike nights, motorcycle shows, and motorcycle culture
- **RiverTramp**: lakes, rivers, boating, personal watercraft, water recreation, boat shows, and waterfront events
- **DirtTramp**: off-road, desert racing, motocross, dirt track, UTV, ATV, trucks, sand, and trail events

Use `unclassified` when the source does not support a confident vertical assignment. Do not force a guess.

Categories describe the type of event. Verticals describe the TrampsWorld audience or editorial lane. They are separate values.

## Audience

Primary users include:

- motorsports and outdoor-recreation enthusiasts
- event travelers
- local attendees
- clubs and organizers
- venues
- existing TrampsWorld viewers
- visitors arriving from one of the vertical sites

Typical questions include:

- What is happening this weekend?
- What motorcycle events are coming up in Arizona?
- Show me car shows in California.
- What boating events are happening around Lake Havasu?
- Are there any dirt events next month?
- What events are happening near me or near my trip route?

## Product voice

The voice should be useful, energetic, road-aware, direct, and polished without sounding corporate.

It should reflect real enthusiasm without excessive hype or AI-flavored filler.

Copy should remain concise on scanning surfaces.

## Core browsing

The inherited product currently supports:

- Agenda view
- Calendar view
- keyword search
- date windows
- category filters
- city filters
- neighborhood filters
- audience filters
- price filters
- active filter chips
- clear-all behavior
- URL query state

The TrampsWorld conversion must add:

- state filtering
- vertical filtering
- regional location language
- TrampsWorld branding and copy
- durable prefiltered entry URLs for the family sites

### Today

Shows events occurring during the current site day using the documented configurable site reference timezone.

### This Weekend

Initial definition:

- Friday at 4:00 PM through Sunday at 11:59:59 PM
- calculated in the site reference timezone

Multi-timezone behavior must be explicitly tested during conversion rather than silently inherited.

### Upcoming

The remainder of the current month, unless fewer than seven days remain, then the next seven days.

### Full Calendar

Retain the existing FullCalendar month and list experiences as an alternate browsing mode.

### Prefiltered entry behavior

A URL such as `/?vertical=cycletramp` must:

- open with CycleTramp selected,
- display only matching events until the filter is cleared,
- retain the filter on reload,
- support browser back and forward navigation,
- remain shareable and bookmarkable,
- and allow the visitor to clear the filter and browse all events.

The same principles apply to state and other supported URL filters.

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

A later, separately authorized feature may display a simple outbound link to relevant TrampsWorld coverage for that event. The event app would only display the approved link. It would not host, index, manage, or synchronize the underlying media system.

## Categories

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

Taxonomy should be validated against real calendar inventory before being treated as final.

## State and location model

Supported state values:

- `AZ`
- `CA`
- `NV`
- `NM`
- `unknown`

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

Browsing pages should default to a controlled TrampsWorld visual system based primarily on vertical and category.

Original flyers and event images may be used selectively when quality, crop behavior, rights, and readability are appropriate.

The site must not become a wall of unrelated flyers.

## Corrections and event leads

The inherited reader-reviewed email draft flow may remain as an early correction and event-lead mechanism.

It does not store submissions, automatically publish events, create organizer accounts, or operate as a moderation system.

Any stored submission workflow requires a separate architecture decision.

## Accessibility

Target WCAG 2.2 AA practices, including:

- keyboard navigation
- visible focus
- semantic headings
- meaningful links
- sufficient contrast
- labeled controls
- non-color indicators
- screen-reader-friendly dates
- reduced-motion support
- adequate touch targets
- no essential information contained only in images

## Mobile behavior

Mobile is the primary layout.

The site must remain usable without horizontal scrolling at narrow widths.

State, vertical, date, and location controls must be easy to understand, apply, and clear.

## SEO and sharing

Retain:

- stable event URLs
- canonical URLs
- Open Graph metadata
- descriptive page titles
- structured event data when accurate
- shareable filtered URLs

Later event-specific additions may include:

- sitemap
- state landing pages
- vertical landing pages
- event-series landing pages
- graceful expired-event handling

## Trust and disclosure

The site must:

- avoid inventing missing facts,
- label paid event placements,
- distinguish editorial feature status from sponsorship,
- provide official source links when available,
- handle cancellation status honestly,
- and avoid exposing private calendar data.

## Future event-specific monetization

Potential future revenue may include:

- promoted event placements
- event-app sponsorship placements
- sponsored event guides
- affiliate ticket links
- venue profiles
- event submission upgrades

No monetization implementation is authorized without a specific product and technical task.

## Explicit non-goals

TrampsWorld Events is not:

- the main TrampsWorld website
- a replacement for HotRodTramp, CycleTramp, RiverTramp, or DirtTramp
- the project responsible for consolidating those websites
- a video platform
- a gallery platform
- an article or newsletter publishing system
- a merchandise or membership system
- a ticketing platform
- a social network
- an organizer CRM
- a user-account system
- a payment processor
- an automated scraper
- a replacement for Google Calendar editorial management
