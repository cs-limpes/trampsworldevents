# TrampsWorld Events

An independent mobile-first event discovery website for TrampsWorld readers across Arizona, California, Nevada, and New Mexico.

The application is adapted from an inherited event-calendar implementation and keeps the agenda, calendar, detail, sharing, and contact flows.

Start with:

- `AGENTS.md`
- `docs/product.specification.md`
- `docs/technical-architecture.md`
- `docs/event-data-model.md`
- `docs/design-system.md`
- `docs/development-phases.md`

## Local setup

1. Copy `.dev.vars.example` to `.dev.vars`.
2. Set `GOOGLE_CALENDAR_ID`, `GOOGLE_CALENDAR_API_KEY`, and `TRAMPSWORLD_EVENTS_CONTACT_EMAIL` in `.dev.vars`.
3. Keep `.dev.vars` local. It is intentionally ignored by git.

Useful commands:

- `npm run test`
- `npm run typecheck`
- `npm run build`
- `npm run dev`
