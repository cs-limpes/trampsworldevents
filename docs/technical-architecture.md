# TrampsWorld Events Technical Architecture

## Architecture summary

TrampsWorld Events inherits a working single-project TypeScript application using:

- React
- Vite
- Luxon
- FullCalendar
- Cloudflare Workers with Static Assets
- a Worker API route for event data
- Google Calendar as the upstream event source
- Vitest

The goal is adaptation, not reconstruction.

The production application is a standalone Cloudflare-hosted event destination. External WordPress sites link to it. The application must not depend on being embedded in WordPress or sharing a WordPress runtime.

## Current runtime boundaries

The browser:

- renders the interface,
- manages filters and URL state,
- requests normalized event data,
- and handles accessible interactions.

The Worker:

- validates requests,
- fetches Google Calendar data,
- handles pagination,
- expands recurring instances,
- normalizes events,
- parses metadata,
- reduces descriptions to safe public text,
- and keeps credentials server-side.

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

## Relationship to external TrampsWorld sites

The current WordPress sites remain separate systems.

They will link to the event application through standard URLs, including prefiltered URLs such as:

```text
/?vertical=hotrodtramp
/?vertical=cycletramp
/?vertical=rivertramp
/?vertical=dirttramp
/?state=AZ
```

Requirements:

- query state must survive reload,
- browser back and forward navigation must work,
- unsupported query values must fail safely,
- menu links must not require referrer information,
- visitors must be able to clear a preselected filter,
- and the app must remain usable when visited directly.

The app may provide outbound links to TrampsWorld properties. It does not fetch or replicate their pages as part of normal event browsing.

## Conversion requirements

The initial TrampsWorld conversion should deliberately update:

- package and project names
- Worker name
- public site name and copy
- canonical and Open Graph defaults
- contact environment variable from `FRESNO_EVENTS_CONTACT_EMAIL` to `TRAMPSWORLD_EVENTS_CONTACT_EMAIL`
- calendar and deployment configuration
- state and vertical metadata
- URL filter behavior for vertical entry links
- regional timezone behavior
- visual tokens and approved assets
- tests containing Fresno-specific assumptions

Avoid a blind global replacement. Preserve working behavior and review each category of change.

## Google Calendar integration

Retain the existing server-side Events list integration using:

- explicit bounds
- `singleEvents=true`
- `orderBy=startTime`
- pagination
- canceled-event handling
- all-day support
- recurring occurrence identity

The production TrampsWorld calendar must contain only events approved for public display.

## Public API

Retain:

```text
GET /api/events
```

unless a later task authorizes a route change.

The normalized response should add state and vertical without breaking current event consumers unnecessarily.

Client-side filtering remains appropriate for the currently bounded event range. Server-side filter parameters are not required merely because new facets exist.

## Timezone strategy

The inherited Fresno application assumes `America/Los_Angeles`. TrampsWorld spans multiple timezones.

Initial decision:

- use configurable `America/Phoenix` as the site reference timezone for Today, This Weekend, and Upcoming windows,
- preserve event-local offset or IANA timezone for timed event display,
- preserve date-only all-day events,
- and do not convert all events to Phoenix time.

`GOOGLE_CALENDAR_TIMEZONE` should remain the runtime configuration point unless implementation evidence supports a more specific name.

Before production deployment, tests must cover Arizona, California, Nevada, and New Mexico across daylight-saving boundaries.

## Metadata and normalization

Extend normalization to support first-class:

- `state`
- `vertical`

Continue supporting the inherited delimiter format and currently recognized delimiter-free Flyer2Calendar-style metadata.

Migration must not break existing calendar entries.

Descriptions must never be injected as raw upstream HTML.

## Routing and SEO

Retain:

- stable event detail routes
- canonical URLs
- Open Graph metadata
- structured event data
- map links
- Google Calendar export
- `.ics`
- share controls

Update default metadata from Fresno Events to TrampsWorld Events during conversion.

Future state, vertical, and event-series landing routes require separate authorization.

## Contact flow

Retain the inherited reader-reviewed email draft flow initially.

Rename the server-side contact variable to:

```text
TRAMPSWORLD_EVENTS_CONTACT_EMAIL
```

during conversion.

Do not add stored submissions, moderation, spam infrastructure, or email relay merely as part of renaming the site.

## Deployment

The TrampsWorld repository must receive its own:

- Cloudflare Worker
- build connection
- custom domain
- production secrets
- Google Calendar ID
- contact variable
- deployment history

It must not share production environment variables or a Worker name with Fresno Events.

Expected runtime values:

```text
GOOGLE_CALENDAR_ID
GOOGLE_CALENDAR_API_KEY
GOOGLE_CALENDAR_TIMEZONE
TRAMPSWORLD_EVENTS_CONTACT_EMAIL
```

Expected production origin:

```text
https://events.trampsworld.com
```

The exact domain remains subject to deployment approval.

Do not deploy until the conversion task passes tests and a repository-wide Fresno reference audit.

## Caching and scalability

Keep the architecture simple and inexpensive.

Cloudflare caching may be added or refined based on measured need.

Do not introduce D1, KV, Durable Objects, queues, a search service, a WordPress dependency, or a separate backend without a demonstrated requirement.

## Testing strategy

Conversion testing should include:

- unit and integration tests continue to pass
- no Fresno public copy remains except intentional migration documentation
- state and vertical parsing and fallbacks
- combined state and vertical filters
- prefiltered vertical URL behavior
- clear-filter behavior after arriving from a vertical site
- URL reload and browser navigation
- event-local timezone display
- site-level Phoenix date windows
- Arizona, Pacific, and Mountain DST cases
- all-day and recurring events
- mobile widths
- event detail metadata
- contact variable behavior
- production build
- no secrets in client bundles or committed files

## Architectural decision rule

Prefer the solution that:

- satisfies current event-app requirements,
- preserves inherited working behavior,
- has fewer moving parts,
- is easy to test,
- is maintainable by one developer,
- remains independent of WordPress,
- and avoids irreversible coupling.
