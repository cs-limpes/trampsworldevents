# TrampsWorld Events: Codex Operating Rules

## Project purpose

TrampsWorld Events is a public, mobile-first event discovery and motorsports-media website serving Arizona, California, Nevada, and New Mexico. It was cloned from the working Fresno Events application so its proven calendar, filtering, event-detail, sharing, contact, and Cloudflare infrastructure can be adapted rather than rebuilt.

Google Calendar is the initial editorial source of truth. The public site should make events easy to browse, filter, understand, and share while supporting four TrampsWorld verticals:

- HotRodTramp
- CycleTramp
- RiverTramp
- DirtTramp

The project may later connect events to TrampsWorld videos, galleries, event coverage, newsletters, and sponsorship opportunities. Those future directions are context, not automatic authorization.

## Efficient task startup

The documentation is durable reference material, not a checklist that must be reread and summarized before every task.

For ordinary implementation work:

1. Read `AGENTS.md`.
2. Read `docs/working-state.md`.
3. Read the currently relevant section of `docs/development-phases.md`.
4. Read only the additional specification sections materially relevant to the task.
5. Inspect the existing implementation in the affected area.
6. Begin work after a brief plan.

Read the full documentation set only when this is the first task in the repository, the documentation changed materially, the task explicitly requests an audit, or a genuine contradiction prevents implementation.

Do not spend most of the task restating requirements already documented.

A normal pre-implementation response should contain only the requested outcome, affected systems, any genuine blocker, and the verification that will be performed. Then implement the requested feature.

## Core scope rule

Knowledge of the full roadmap does not authorize implementation of the full roadmap.

Codex may make all reasonably necessary changes within the assigned feature slice, including components, styles, types, helpers, tests, and small supporting refactors. It must not add unrelated future systems merely because they appear in the roadmap.

Do not stop after completing an internal layer when the user requested a complete visible feature. Continue until the stated acceptance criteria are satisfied, then stop.

## Inherited application rule

This repository contains a working application inherited from Fresno Events.

Do not rebuild working calendar, event-detail, filtering, sharing, contact, or Cloudflare functionality from scratch unless the existing implementation is demonstrably unsuitable. Prefer focused adaptation over replacement.

During the initial conversion, Fresno-specific names, copy, environment variables, timezone assumptions, and taxonomy are expected technical debt. Replace them deliberately and test the result rather than performing an unreviewed global search-and-replace.

## Scope boundaries

Do not:

- invent new product features without authorization
- install dependencies for anticipated future work
- create fake functionality that appears operational
- expose secrets, API keys, calendar identifiers, or service credentials in client code
- silently change product requirements
- rewrite working code only to match personal preference
- introduce authentication, databases, payments, sponsor tooling, organizer accounts, or storage-backed submissions unless authorized
- fabricate event facts, classifications, prices, locations, images, or organizer information
- claim a feature works without testing it
- deploy, merge, or change external services unless explicitly requested

When a requested feature conflicts with the specifications, identify the conflict briefly and ask for the minimum decision needed.

## Implementation principles

Prefer the simplest implementation that satisfies the current task and preserves the documented architecture.

Use TypeScript, React with Vite, Cloudflare Workers with Static Assets, Luxon for timezone-sensitive logic already present, FullCalendar for the existing calendar view, plain CSS unless another styling system is approved, semantic HTML, accessible controls, mobile-first layouts, explicit types, and predictable loading, empty, and error states.

Avoid unnecessary dependencies and abstractions.

## Product behavior priorities

When a decision is not fully specified, prioritize:

1. Correct event dates, times, states, and locations.
2. Mobile usability.
3. Readability and accessibility.
4. Clear discovery by state and vertical.
5. Preservation of working inherited behavior.
6. Visual consistency with TrampsWorld.
7. Performance.
8. Editorial maintainability.
9. Implementation convenience.

## Geography and vertical rules

Initial supported states are Arizona (`AZ`), California (`CA`), Nevada (`NV`), and New Mexico (`NM`).

Initial supported verticals are `hotrodtramp`, `cycletramp`, `rivertramp`, and `dirttramp`.

State and vertical are separate first-class facets. Do not encode them only in titles, generic tags, or visual styling.

If state or vertical is unknown, preserve the event and use an explicit unknown or unclassified fallback. Do not force a guess.

## Timezone rules

TrampsWorld covers multiple timezones.

- `America/Phoenix` is the initial site reference timezone for site-level Today, This Weekend, and Upcoming windows.
- Timed events should preserve and display their event-local offset or IANA timezone when Google provides it.
- Do not silently convert every event time to Phoenix time.
- Date-only all-day events must remain date-only to avoid timezone drift.
- Tests must cover Arizona, Pacific, and Mountain time behavior, including daylight-saving differences.

Any change to site-level date-window behavior requires an explicit product decision.

## Source-of-truth rules

Google Calendar is the initial editorial source of truth. The Worker may normalize, classify, cache, and present event data, but it must not invent event facts.

Public source links must come from explicit event metadata or approved editorial data, not internal Google Calendar management links. Upstream descriptions must not be injected as raw HTML.

## Visual rules

The site should feel like a TrampsWorld motorsports-media product, not a generic SaaS dashboard or raw calendar embed.

Use consistent card layouts and controlled vertical-based visual treatments. Original event flyers and media may be used selectively, but they must not make browsing pages visually chaotic.

Paid, sponsored, and promoted content must be clearly disclosed.

## Completion report

At the end of a task, report only what changed, files modified, commands and tests run, results, anything incomplete, and any newly discovered issue that materially affects the project.

Do not repeat a full project audit unless requested.

Update `docs/working-state.md` when a task materially changes implementation or project status.

## Git discipline

Keep changes focused and use clear commit messages. Do not combine unrelated cleanup with requested work. Do not merge, deploy, or modify external configuration unless explicitly instructed.
