# TrampsWorld Events Development Phases

## Governing rule

The roadmap is context, not authorization.

Work in complete feature slices, not microscopic internal layers.

Codex may make all supporting changes reasonably required to complete the explicitly authorized slice, but must not begin unrelated future slices.

The application remains an event-discovery product throughout all phases. No phase implicitly authorizes building the broader TrampsWorld website ecosystem.

## Phase A: Documentation and independent-repository baseline

### Goal

Establish TrampsWorld-specific guidance and confirm the cloned repository is an independent working snapshot.

### Authorized

- documentation updates
- repository and inherited-feature audit
- identification of Fresno-specific names and assumptions
- baseline test and build report

### Not authorized

- public feature changes
- deployment
- WordPress changes
- external service changes

### Completion means

- documentation reflects the centralized event-app role,
- inherited capabilities are recorded,
- scope excludes broader TrampsWorld website ownership,
- and a focused conversion plan exists.

## Phase B: TrampsWorld conversion

### Goal

Convert the inherited application into an independent TrampsWorld Events product while preserving current functionality.

### Authorized

- package, project, Worker, site, metadata, and contact renaming
- TrampsWorld Events copy and provisional branding
- replacement of Fresno-specific URLs and environment names
- independent Cloudflare-ready configuration
- state and vertical types
- state and vertical metadata parsing
- state and vertical normalization
- state and vertical display
- state and vertical filters
- durable prefiltered vertical URLs for menu links
- clear-filter behavior after arriving from a vertical site
- timezone strategy changes documented in the architecture
- test updates required by the conversion
- cleanup of obsolete Fresno assumptions

### Not authorized

- database
- authentication
- payments
- stored submissions
- sponsor sales tooling
- automated scraping
- WordPress menu edits
- WordPress site consolidation
- broad media integrations
- article, video, gallery, merchandise, or general-site systems

### Completion means

- application builds and tests pass
- current Agenda, Calendar, detail, sharing, and contact behaviors remain functional
- state and vertical filters work in Agenda and Calendar views
- prefiltered vertical URLs load the expected state
- visitors can clear the preselected vertical and browse all events
- event cards and details show city, state, and vertical when known
- unknown state and vertical remain valid fallbacks
- TrampsWorld Events copy and tokens replace public Fresno branding
- no accidental Fresno production names remain
- the app is ready for an independent Cloudflare deployment
- the app has not expanded into broader TrampsWorld website functionality

## Phase C: Independent production deployment

### Goal

Deploy TrampsWorld Events without affecting Fresno Events.

### Authorized only when explicitly requested

- new Cloudflare Worker project
- new GitHub build connection
- runtime secrets
- custom domain
- production smoke tests
- Google API configuration needed for the new calendar

### Completion means

- the TrampsWorld Events domain loads
- `/api/events` returns normalized data
- contact handoff is configured
- detail routes work directly
- prefiltered menu URLs work directly
- Fresno Events remains unaffected

## Phase D: TrampsWorld site entry links

### Goal

Replace the separate WordPress event-calendar destinations with links to the centralized event application.

### Application-repository scope

- verify durable general and prefiltered URLs
- document the intended links for each site
- verify visitors can clear inherited filters
- verify direct navigation does not depend on WordPress referrer data

### External-site scope

Updating WordPress menus is a separate explicit task outside this repository.

The event-app task must not silently edit or redesign the WordPress sites.

## Phase E: Event-specific editorial growth

Possible individually authorized slices:

- featured events
- curated weekend or road-trip event guides
- vertical event landing pages
- state event landing pages
- seasonal event collections
- event-app newsletter signup
- privacy-conscious analytics
- expired-event archive behavior
- one approved outbound related-coverage link on an event detail page

Each slice requires its own acceptance criteria.

An outbound coverage link does not authorize building or managing the underlying video, gallery, article, or media system.

## Phase F: Event submissions

Requires a new architecture decision for:

- storage
- moderation
- spam controls
- confirmation
- duplicate review
- editorial approval

No submission should auto-publish initially.

## Phase G: Event-specific sponsorship and monetization

Possible scope includes:

- promoted events
- event-app sponsor placements
- state or vertical event sponsors
- sponsored event guides
- affiliate ticket links
- venue profiles
- payment handling
- reporting

Requirements include:

- clear disclosure
- separation of editorial and paid status
- no hidden pay-to-rank behavior
- privacy review
- explicit product and technical specification

This phase does not authorize a general TrampsWorld sponsorship CRM or broader business-management system.

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

Authorize Phase B as one coherent conversion slice.

Codex should:

- inspect the existing implementation,
- adapt it rather than rebuild it,
- implement TrampsWorld Events naming,
- add state and vertical support,
- support prefiltered vertical entry URLs,
- update tests and working state,
- and stop before deployment, WordPress edits, media systems, or unrelated future features.
