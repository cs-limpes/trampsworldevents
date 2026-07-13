# TrampsWorld Events: Codex Operating Rules

## Project purpose

TrampsWorld Events is a standalone, centrally hosted event-discovery application for the TrampsWorld family of brands.

The existing TrampsWorld, HotRodTramp, CycleTramp, RiverTramp, and DirtTramp WordPress sites will link to this application from their Events menu items. Those sites may link to the general event feed or to a prefiltered vertical view.

The application replaces separate WordPress event calendars with one shared, filterable destination. It is responsible for event discovery and event-specific functionality only. It does not replace, manage, consolidate, or reproduce the broader TrampsWorld websites, media systems, galleries, articles, videos, merchandise, or business operations.

Google Calendar is the initial editorial source of truth. The public application should make events easy to browse, filter, understand, and share across four TrampsWorld verticals:

- HotRodTramp
- CycleTramp
- RiverTramp
- DirtTramp

## Efficient task startup

The documentation is durable reference material, not a checklist that must be reread and summarized before every task.

For ordinary implementation work:

1. Read `AGENTS.md`.
2. Read `docs/working-state.md`.
3. Read the currently relevant section of `docs/development-phases.md`.
4. Read only the additional specification sections materially relevant to the task.
5. Inspect the existing implementation in the affected area.
6. Begin work after a brief plan.

Read the full documentation set only when:

- this is the first task in the repository,
- the documentation changed materially,
- the task explicitly requests an audit,
- or a genuine contradiction prevents implementation.

Do not spend most of the task restating requirements already documented.

A normal pre-implementation response should contain only:

- the requested outcome,
- the affected systems or files,
- any genuine blocker,
- and the verification that will be performed.

Then implement the requested feature.

## Core scope rule

Knowledge of the full roadmap does not authorize implementation of the full roadmap.

Codex may make all reasonably necessary changes within the assigned feature slice, including components, styles, types, helpers, tests, and small supporting refactors. It must not add unrelated future systems merely because they appear in the roadmap.

Do not stop after completing an internal layer when the user requested a complete visible feature. Continue until the stated acceptance criteria are satisfied, then stop.

## Inherited application rule

This repository contains a working application inherited from Fresno Events.

Do not rebuild working calendar, event-detail, filtering, sharing, contact, or Cloudflare functionality from scratch unless the existing implementation is demonstrably unsuitable. Prefer focused adaptation over replacement.

During the initial conversion, Fresno-specific names, copy, environment variables, timezone assumptions, location rules, categories, and visual tokens are expected technical debt. Replace them deliberately and test the result rather than performing an unreviewed global search-and-replace.

## Relationship to TrampsWorld websites

The WordPress sites are external entry points. The event application must not depend on being embedded inside WordPress.

Expected entry patterns include:

```text
https://events.trampsworld.com/
https://events.trampsworld.com/?vertical=hotrodtramp
https://events.trampsworld.com/?vertical=cycletramp
https://events.trampsworld.com/?vertical=rivertramp
https://events.trampsworld.com/?vertical=dirttramp
```

URL filter state must remain durable enough for menu links, bookmarks, sharing, browser navigation, and future site consolidation.

The application may link back to relevant TrampsWorld properties. It must not ingest or reproduce those sites merely to create a unified appearance.

## Scope boundaries

Do not:

- expand the application into a general TrampsWorld website or CMS,
- recreate articles, videos, galleries, merchandise, membership, or broader media publishing,
- take responsibility for consolidating the WordPress sites,
- invent new product features without authorization,
- install dependencies for anticipated future work,
- create fake functionality that appears operational,
- expose secrets, API keys, calendar identifiers, or service credentials in client code,
- silently change product requirements,
- rewrite working code only to match personal preference,
- introduce authentication, databases, payments, sponsor tooling, organizer accounts, or storage-backed submissions unless authorized,
- fabricate event facts, classifications, prices, locations, images, or organizer information,
- claim a feature works without testing it,
- deploy, merge, edit WordPress menus, or change external services unless explicitly requested.

When a requested feature conflicts with the specifications, identify the conflict briefly and ask for the minimum decision needed.

## Implementation principles

Prefer the simplest implementation that satisfies the current task and preserves the documented architecture.

Use:

- TypeScript
- React with Vite
- Cloudflare Workers with Static Assets
- Luxon for existing timezone-sensitive logic
- FullCalendar for the existing calendar view
- plain CSS unless another styling system is approved
- semantic HTML
- accessible controls
- mobile-first layouts
- explicit types
- predictable loading, empty, and error states

Avoid unnecessary dependencies and abstractions.

## Product behavior priorities

When a decision is not fully specified, prioritize:

1. Correct event dates, times, states, and locations.
2. Mobile usability.
3. Readability and accessibility.
4. Clear discovery by state and vertical.
5. Preservation of working inherited behavior.
6. Durable prefiltered URLs for the TrampsWorld sites.
7. Visual consistency with TrampsWorld.
8. Performance.
9. Editorial maintainability.
10. Implementation convenience.

## Geography and vertical rules

Initial supported states are Arizona (`AZ`), California (`CA`), Nevada (`NV`), and New Mexico (`NM`).

Initial supported verticals are:

- `hotrodtramp`
- `cycletramp`
- `rivertramp`
- `dirttramp`

State and vertical are separate first-class facets. Do not encode them only in titles, generic tags, source-site identity, or visual styling.

If state or vertical is unknown, preserve the event and use an explicit unknown or unclassified fallback. Do not force a guess.

## Timezone rules

TrampsWorld covers multiple timezones.

- `America/Phoenix` is the initial configurable site reference timezone for site-level Today, This Weekend, and Upcoming windows.
- Timed events should preserve and display their event-local offset or IANA timezone when Google provides it.
- Do not silently convert every event time to Phoenix time.
- Date-only all-day events must remain date-only to avoid timezone drift.
- Tests must cover Arizona, Pacific, and Mountain time behavior, including daylight-saving differences.

Any change to site-level date-window behavior requires an explicit product decision.

## Source-of-truth rules

Google Calendar is the initial editorial source of truth.

The Worker may normalize, classify, cache, and present event data, but it must not invent event facts.

Public source links must come from explicit event metadata or approved editorial data, not internal Google Calendar management links.

Upstream descriptions must not be injected as raw HTML.

## Visual rules

The application should feel like a focused TrampsWorld event guide, not a generic SaaS dashboard, raw calendar embed, or replacement for the full TrampsWorld websites.

Use consistent card layouts and controlled vertical-based visual treatments. Original event flyers may be used selectively, but they must not make browsing pages visually chaotic.

Paid, sponsored, and promoted event placements must be clearly disclosed.

## Completion report

At the end of a task, report only:

- what changed,
- files modified,
- commands and tests run,
- results,
- anything incomplete,
- and any newly discovered issue that materially affects the project.

Do not repeat a full project audit unless requested.

Update `docs/working-state.md` when a task materially changes implementation or project status.

## Git discipline

Keep changes focused and use clear commit messages.

Do not combine unrelated cleanup with requested work.

Do not merge, deploy, edit external sites, or modify external configuration unless explicitly instructed.
