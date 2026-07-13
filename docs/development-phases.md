# TrampsWorld Events Development Phases

## Governing rule

The roadmap is context, not authorization. Work in complete feature slices, not microscopic internal layers.

Codex may make all supporting changes reasonably required to complete the explicitly authorized slice, but must not begin unrelated future slices.

## Phase A: Documentation and independent-repository baseline

Goal: establish TrampsWorld-specific guidance and confirm the cloned repository is an independent working snapshot.

Authorized:

- documentation updates
- repository and inherited-feature audit
- identification of Fresno-specific names and assumptions
- baseline test and build report

Not authorized:

- public feature changes
- deployment
- external service changes

Completion means the documentation reflects TrampsWorld, inherited capabilities are recorded, and a focused conversion plan exists.

## Phase B: TrampsWorld conversion

Goal: convert the inherited application into an independent TrampsWorld Events product while preserving current functionality.

Authorized:

- project, Worker, site, metadata, and contact renaming
- TrampsWorld copy and provisional branding
- replacement of Fresno-specific URLs and environment names
- independent Cloudflare-ready configuration
- state and vertical types, metadata parsing, normalization, display, and filters
- timezone strategy changes documented in the architecture
- test updates required by the conversion
- cleanup of obsolete Fresno assumptions

Not authorized:

- database
- authentication
- payments
- stored submissions
- sponsor sales tooling
- automated scraping
- broad media integrations beyond fields needed for future compatibility

Completion means:

- application builds and tests pass
- current agenda, Calendar, detail, sharing, and contact behaviors remain functional
- state and vertical filters work in Agenda and Calendar views
- event cards and details show city/state and vertical when known
- unknown state and vertical remain valid fallbacks
- TrampsWorld copy and tokens replace public Fresno branding
- no accidental Fresno production names remain
- the app is ready for an independent Cloudflare deployment

## Phase C: Independent production deployment

Goal: deploy TrampsWorld Events without affecting Fresno Events.

Authorized only when explicitly requested:

- new Cloudflare Worker project
- new build connection
- runtime secrets
- custom domain
- production smoke tests
- Google API configuration needed for the new calendar

Completion means the TrampsWorld domain loads, `/api/events` returns normalized data, contact handoff is configured, detail routes work directly, and Fresno remains unaffected.

## Phase D: Media connections

Possible individually authorized slices:

- related YouTube videos
- related playlists
- event galleries
- prior-year coverage
- Road Notes references
- event-series pages
- coverage status

Each slice requires metadata rules, UI placement, fallbacks, and tests.

## Phase E: Editorial growth

Possible individually authorized slices:

- featured events
- curated weekend or road-trip guides
- vertical landing pages
- state landing pages
- seasonal collections
- newsletter signup
- privacy-conscious analytics
- expired-event archive behavior

## Phase F: Event submissions

Requires a new architecture decision for storage, moderation, spam controls, confirmation, duplicate review, and editorial approval. No submission should auto-publish initially.

## Phase G: Sponsorship and monetization

Possible scope includes promoted events, sponsor placements, vertical sponsors, state or regional sponsors, newsletter sponsorships, coverage packages, advertising inventory, payment handling, and reporting.

Requirements include clear disclosure, separation of editorial and paid status, no hidden pay-to-rank behavior, privacy review, and an explicit technical specification.

## Required task shape

Each implementation task should state:

1. authorized phase or feature slice
2. exact user-visible outcome
3. main areas in scope
4. explicit exclusions
5. acceptance criteria
6. tests required
7. instruction to stop after completion

Normal tasks should not instruct Codex to reread and summarize every document.

## Recommended first implementation task

Authorize Phase B as one coherent conversion slice. Codex should inspect the existing implementation, adapt it rather than rebuild it, implement TrampsWorld naming plus state and vertical support, update tests and working state, and stop before deployment or future media features.
