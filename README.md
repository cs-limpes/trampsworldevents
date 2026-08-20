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

## Planned TrampsWorld attendance

Google Calendar remains the editorial source of truth. To mark an event that TrampsWorld plans to attend or cover, add this line to the metadata portion of its Google Calendar description:

```text
coverage_status: planned
```

For the preferred metadata format, place it after the `---` delimiter. If the description already contains a metadata section, add the line alongside the existing fields rather than adding another delimiter.

Only events marked `planned` appear in the “Where We're Headed Next” schedule and receive the Scamp attendance badge. Use `none` when attendance is not planned and `published` only after TrampsWorld coverage has been published. See `docs/event-data-model.md` for the complete metadata convention.
