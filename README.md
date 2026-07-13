# TrampsWorld Events

A standalone, mobile-first event-discovery application for the TrampsWorld family of brands.

The application will replace the separate WordPress event calendars currently associated with TrampsWorld, HotRodTramp, CycleTramp, RiverTramp, and DirtTramp. Each site will link to this shared Cloudflare-hosted application from its Events menu.

The event app is intentionally narrow in scope. It handles event discovery, filtering, event details, sharing, calendar export, and related event-specific workflows. It does not replace or manage the broader TrampsWorld websites or their media content.

## Current status

This repository is an independent snapshot of the working Fresno Events application. The inherited application already includes:

- server-side Google Calendar retrieval
- Agenda and FullCalendar views
- event filtering and URL state
- stable event detail pages
- sharing and calendar export
- corrections and event-lead email handoff
- automated tests

The next implementation slice converts the inherited Fresno identity and taxonomy into TrampsWorld Events while preserving existing behavior.

## Documentation

Start with:

- `AGENTS.md`
- `docs/working-state.md`
- `docs/development-phases.md`

Consult these when relevant to the current task:

- `docs/product.specification.md`
- `docs/technical-architecture.md`
- `docs/event-data-model.md`
- `docs/design-system.md`

## Local setup

1. Copy `.dev.vars.example` to `.dev.vars`.
2. Set the required Google Calendar values.
3. During the TrampsWorld conversion, replace the inherited contact variable with `TRAMPSWORLD_EVENTS_CONTACT_EMAIL`.
4. Keep `.dev.vars` local. It is intentionally ignored by Git.

Expected runtime values after conversion:

```text
GOOGLE_CALENDAR_ID
GOOGLE_CALENDAR_API_KEY
GOOGLE_CALENDAR_TIMEZONE
TRAMPSWORLD_EVENTS_CONTACT_EMAIL
```

Useful commands:

```text
npm run test
npm run typecheck
npm run build
npm run dev
```

The intended production destination is a dedicated TrampsWorld Events origin such as `events.trampsworld.com`. Deployment is a separate authorized phase.
