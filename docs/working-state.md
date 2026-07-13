# Current Working State

Last updated: 2026-07-13

## Repository origin

This repository is an independent snapshot cloned from the working Fresno Events application.

The copied repository begins with a new initial commit rather than preserving Fresno Events commit history. This is acceptable for the TrampsWorld sibling project.

## Product role

TrampsWorld Events will be one centrally hosted event-discovery application linked from:

- TrampsWorld.com
- HotRodTramp.com
- CycleTramp.com
- RiverTramp.com
- DirtTramp.com

The existing sites may link to the general event feed or to prefiltered vertical views.

The application replaces their separate WordPress event calendars. It does not replace the broader websites, reproduce their content, or own their eventual consolidation.

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
- date, category, city, neighborhood, audience, and price filters
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

## Current architecture

- TypeScript
- React
- Vite
- Luxon
- FullCalendar
- Cloudflare Workers with Static Assets
- Vitest

The browser calls `/api/events`.

The Worker validates the request, fetches Google Calendar, normalizes events, and returns the public schema.

## Current inherited technical debt

The repository still contains Fresno-specific assumptions, including some or all of:

- `Fresno Events` public copy
- `fresno-events` project and Worker naming
- `FRESNO_EVENTS_CONTACT_EMAIL`
- `America/Los_Angeles` as the canonical site timezone
- Fresno-centered categories and location language
- Fresno-specific default metadata and canonical assumptions
- tests and fixtures written around Fresno behavior
- provisional Fresno visual styling
- README and example-environment references that may still use Fresno names

These should be replaced deliberately during the conversion phase, not through an unreviewed global replacement.

## Current TrampsWorld decisions

- TrampsWorld Events is a standalone centralized event app.
- The WordPress sites are external entry points.
- The app does not depend on being embedded in WordPress.
- The app is responsible for event discovery and event-specific functions only.
- The app does not own TrampsWorld articles, videos, galleries, merchandise, or website consolidation.
- Initial states are Arizona, California, Nevada, and New Mexico.
- Initial verticals are HotRodTramp, CycleTramp, RiverTramp, and DirtTramp.
- State and vertical are separate first-class event facets.
- General and prefiltered URLs must be durable enough for WordPress menu links.
- Google Calendar remains the initial editorial source of truth.
- Real calendar data is preferred over fictional public fixtures.
- The existing Agenda, Calendar, filters, detail pages, sharing, and contact flow should be preserved.
- The initial configurable site reference timezone is `America/Phoenix`.
- Timed events should preserve event-local time information when available.
- All-day dates must remain date-only.
- TrampsWorld orange is `#ff9000`; black is `#000000`.
- Existing approved TrampsWorld logos and assets take precedence over invented branding.
- Public source links must come from explicit metadata, not Google Calendar internals.
- Upstream HTML must not be injected directly.
- Unknown state and vertical must remain valid fallbacks.

## Current task

The next authorized implementation should be Phase B: TrampsWorld conversion.

That slice should:

- rename public and internal Fresno-specific project identity where appropriate
- add first-class state and vertical metadata, normalization, display, and filtering
- support general and prefiltered vertical entry URLs
- allow visitors to clear preselected filters
- update the timezone strategy
- apply provisional TrampsWorld Events copy and tokens
- update tests
- preserve inherited behavior
- update this working-state file
- stop before deployment
- stop before WordPress menu changes
- stop before media, sponsor, database, account, payment, or broader website features

## Known issues to verify during conversion

- Event details only resolve events inside the loaded feed range.
- App-shell metadata currently loads the default feed to resolve event routes.
- Recurrence-note expansion supports only conservative weekly prose patterns.
- Existing city and neighborhood extraction depends on metadata and known-place logic.
- Contact flow remains a mailto handoff, not a server-side relay.
- Production caching policy may still need explicit review.
- The cloned repository has not yet been deployed independently.
- The cloned repository may still use Fresno-specific Worker and environment names.
- Prefiltered vertical links must be verified against the inherited URL-state parser.
- Timezone behavior must be tested across Arizona, Pacific, and Mountain time.

## Do not revisit without new evidence

- Google Calendar as the initial source
- server-side credentials
- safe description handling
- stable occurrence IDs
- Agenda as a primary experience
- FullCalendar as an alternate experience
- state and vertical as separate facets
- independent TrampsWorld deployment rather than sharing Fresno production configuration
- one centralized event app rather than separate event apps per vertical
- WordPress sites as external entry points rather than application dependencies
- event-only scope rather than responsibility for the full TrampsWorld ecosystem
