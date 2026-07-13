# TrampsWorld Events Technical Architecture

## Architecture summary

TrampsWorld Events inherits a working single-project TypeScript application using React, Vite, Luxon, FullCalendar, Cloudflare Workers with Static Assets, a Worker API route for event data, Google Calendar as the upstream source, and Vitest.

The goal is adaptation, not reconstruction.

## Current runtime boundaries

The browser renders the UI, manages filters and URL state, requests normalized event data, and handles accessible interactions.

The Worker validates requests, fetches Google Calendar data, handles pagination, expands recurring instances, normalizes events, parses metadata, reduces descriptions to safe public text, and keeps credentials server-side.

Do not move Google credentials or authoritative normalization into client code.

## Repository shape

Retain the inherited structure unless a specific task demonstrates a need to change it:

```text
/
  AGENTS.md
  README.md
  package.json
  wrangler.jsonc
  src/
  worker/
  tests/
  docs/
```

## Conversion requirements

The initial TrampsWorld conversion should deliberately update:

- project and Worker names
- public site name and copy
- canonical and Open Graph defaults
- contact environment variable from `FRESNO_EVENTS_CONTACT_EMAIL` to `TRAMPSWORLD_EVENTS_CONTACT_EMAIL`
- calendar and deployment configuration
- state and vertical metadata
- regional timezone behavior
- visual tokens and assets
- tests containing Fresno-specific assumptions

Avoid a blind global replacement. Preserve working behavior and review each category of change.

## Google Calendar integration

Retain the existing server-side Events list integration using explicit bounds, `singleEvents=true`, `orderBy=startTime`, pagination, canceled-event handling, and all-day support.

The production TrampsWorld calendar must contain only events approved for public display.

## Public API

Retain `GET /api/events` unless a later task authorizes a route change.

The normalized response should add state and vertical without breaking current event consumers unnecessarily.

Client-side filtering remains appropriate for the currently bounded event range. Server-side filter parameters are not required merely because new facets exist.

## Timezone strategy

The inherited Fresno application assumes `America/Los_Angeles`. TrampsWorld spans multiple timezones.

Initial decision:

- use `America/Phoenix` as the site reference timezone for Today, This Weekend, and Upcoming windows
- preserve event-local offset or IANA timezone for timed event display
- preserve date-only all-day events
- do not convert all events to Phoenix time

Before production deployment, tests must cover Arizona, California, Nevada, and New Mexico across daylight-saving boundaries.

## Metadata and normalization

Extend normalization to support first-class `state` and `vertical` values.

Continue supporting the inherited delimiter format and currently recognized delimiter-free Flyer2Calendar-style metadata. Migration must not break existing calendar entries.

Descriptions must never be injected as raw upstream HTML.

## Routing and SEO

Retain stable event detail routes, canonical URLs, Open Graph metadata, structured event data, map links, Google Calendar export, `.ics`, and share controls.

Update default metadata from Fresno Events to TrampsWorld Events during conversion.

Future state, vertical, and event-series landing routes require separate authorization.

## Contact flow

Retain the inherited reader-reviewed email draft flow initially. Rename the server-side contact variable to `TRAMPSWORLD_EVENTS_CONTACT_EMAIL` during conversion.

Do not add stored submissions, moderation, spam infrastructure, or email relay merely as part of renaming the site.

## Deployment

The TrampsWorld repository must receive its own Cloudflare Worker, custom domain, production secrets, Google Calendar ID, contact variable, and deployment history.

It must not share production environment variables or a Worker name with Fresno Events.

Expected runtime values:

- `GOOGLE_CALENDAR_ID`
- `GOOGLE_CALENDAR_API_KEY`
- `GOOGLE_CALENDAR_TIMEZONE`
- `TRAMPSWORLD_EVENTS_CONTACT_EMAIL`

Do not deploy until the conversion task passes tests and a repository-wide Fresno reference audit.

## Caching and scalability

Keep the architecture simple and inexpensive. Cloudflare caching may be added or refined based on measured need. Do not introduce D1, KV, Durable Objects, queues, a search service, or a separate backend without a demonstrated requirement.

## Testing strategy

Conversion testing should include:

- unit and integration tests continue to pass
- no Fresno public copy remains except intentional migration documentation
- state and vertical parsing and fallbacks
- combined state and vertical filters
- URL-state behavior
- event-local timezone display
- site-level Phoenix date windows
- Arizona/Pacific/Mountain DST cases
- all-day and recurring events
- mobile widths
- event detail metadata
- contact variable behavior
- production build
- no secrets in client bundles or committed files

## Architectural decision rule

Prefer the solution that satisfies current requirements, preserves inherited working behavior, has fewer moving parts, is easy to test, is maintainable by one developer, and avoids irreversible coupling.
