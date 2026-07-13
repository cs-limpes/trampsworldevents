# Current Working State

Last updated: 2026-07-13

## Repository origin

This repository is an independent snapshot cloned from the working Fresno Events application. The copied repository begins with a new initial commit rather than preserving Fresno Events commit history. This is acceptable for the TrampsWorld sibling project.

## Implemented and inherited

The application already includes:

- server-side Google Calendar retrieval through a Cloudflare Worker
- bounded long-range event loading
- recurring instance expansion
- conservative Flyer2Calendar-style recurrence-note expansion
- canceled-event exclusion
- all-day and multi-day handling
- safe plain-text descriptions
- structured and delimiter-free metadata parsing
- stable normalized occurrence IDs
- responsive Agenda view
- Today, This Weekend, and Upcoming sections
- keyword search
- date, state, vertical, category, city, neighborhood, audience, and price filters
- active filter chips and clear-all behavior
- URL query state
- FullCalendar month and list views
- event detail pages
- map, source, registration, and website links when provided
- Add to Google Calendar
- `.ics` download
- copy and share controls
- structured event data and Open Graph support
- corrections and event-lead contact handoff
- automated tests covering normalization, metadata, date ranges, filters, calendar mapping, details, recurrence, and contact behavior

## Phase B conversion completed

The Phase B TrampsWorld conversion has been implemented in the application code.

Completed changes include:

- public site identity changed to TrampsWorld Events
- package and Worker names changed to `trampsworld-events`
- default metadata, Open Graph, structured export identity, README, and `.dev.vars.example` updated
- contact environment variable changed to `TRAMPSWORLD_EVENTS_CONTACT_EMAIL`
- supported states added as first-class normalized values: `AZ`, `CA`, `NV`, `NM`, and `unknown`
- supported verticals added as first-class normalized values: `hotrodtramp`, `cycletramp`, `rivertramp`, `dirttramp`, and `unclassified`
- state and vertical added to metadata parsing, normalization, API events, filters, URL query state, active chips, event cards, event details, calendar styling, and tests
- `America/Phoenix` is now the default site reference timezone for site windows and Worker range defaults
- timed events preserve source IANA timezone or fixed offset for event-local display where available
- all-day events remain date-only
- provisional TrampsWorld orange and black design tokens and vertical visual treatments are applied

## Current architecture

- TypeScript
- React
- Vite
- Luxon
- FullCalendar
- Cloudflare Workers with Static Assets
- Vitest

The browser calls `/api/events`. The Worker validates the request, fetches Google Calendar, normalizes events, and returns the public schema.

## Current inherited technical debt

Known public Fresno production identity has been removed from application code, tests, package metadata, Worker config, and setup examples. Remaining Fresno references are intentional migration/history references in project documentation.

## Current TrampsWorld decisions

- Initial states: Arizona, California, Nevada, and New Mexico.
- Initial verticals: HotRodTramp, CycleTramp, RiverTramp, and DirtTramp.
- State and vertical are separate first-class event facets.
- Google Calendar remains the initial editorial source of truth.
- Real calendar data is preferred over fictional public fixtures.
- The existing Agenda, Calendar, filters, detail pages, sharing, and contact flow should be preserved.
- The initial site reference timezone is `America/Phoenix`.
- Timed events should preserve event-local time information when available.
- All-day dates must remain date-only.
- TrampsWorld orange is `#ff9000`; black is `#000000`.
- Existing approved TrampsWorld logos and assets take precedence over invented branding.
- Public source links must come from explicit metadata, not Google Calendar internals.
- Upstream HTML must not be injected directly.
- Unknown state and vertical must remain valid fallbacks.

## Current task

Phase B: TrampsWorld conversion is complete in the repository.

Do not deploy or begin Phase C unless explicitly authorized.

## Known issues to verify during conversion

- Event details only resolve events inside the loaded feed range.
- App-shell metadata currently loads the default feed to resolve event routes.
- Recurrence-note expansion supports only conservative weekly prose patterns.
- City and neighborhood extraction depends on metadata and conservative explicit-location parsing.
- Contact flow remains a mailto handoff, not a server-side relay.
- Production caching policy may still need explicit review.
- The cloned repository has not yet been deployed independently.
- Live Google Calendar and Cloudflare integration were not tested during Phase B verification.
- In-app browser localhost smoke testing was blocked by the browser URL policy; automated tests cover the filter, URL-state, detail, contact, timezone, all-day, recurrence, and calendar mapping behavior.

## Do not revisit without new evidence

- Google Calendar as the initial source
- server-side credentials
- safe description handling
- stable occurrence IDs
- Agenda as a primary experience
- FullCalendar as an alternate experience
- state and vertical as separate facets
- independent TrampsWorld deployment rather than sharing Fresno production configuration
