# TrampsWorld Events Design System

## Design objective

TrampsWorld Events should feel like a polished road-culture and motorsports-media guide with strong calendar functionality.

It should not resemble a raw Google Calendar embed, generic SaaS dashboard, municipal calendar, or chaotic wall of flyers.

The design should balance speed, grit, energy, readability, trust, and TrampsWorld personality.

## Brand foundation

The TrampsWorld family includes TrampsWorld, HotRodTramp, CycleTramp, RiverTramp, and DirtTramp.

Current established direction:

- TrampsWorld orange: `#ff9000`
- black: `#000000`
- white and warm neutral supporting surfaces
- bold stencil or industrial treatment for `TRAMPS`
- complementary expressive lettering for supporting words
- gauge, machine, route, road, water, and dirt motifs where appropriate

Existing TrampsWorld logos and approved assets take precedence over invented replacements. Codex must not create or declare a new permanent logo without explicit approval.

## Core principles

- Mobile first
- Fast scanning
- Strong date, state, vertical, and location hierarchy
- Controlled variety across verticals
- Calm structure around noisy event flyers
- Accessibility built into components
- Editorial clarity over decorative complexity

## Vertical visual system

Verticals should have distinct motifs while remaining part of one family.

- HotRodTramp: gauge, chrome, grille, tire, pinstripe, road markings
- CycleTramp: wheel, engine fins, handlebars, road stripe, chain or mechanical geometry
- RiverTramp: waterline, wake, buoy, propeller, lake horizon
- DirtTramp: dust, tread, desert line, checkers, trail, terrain contour
- Unclassified: neutral TrampsWorld mark or general road motif

Differences must not rely on color alone. Text labels remain visible.

## Page frame

The eventual structure may include header, primary navigation, hero or intro, search and filters, Today, This Weekend, Upcoming, Calendar, vertical browsing, state browsing, featured coverage, newsletter, sponsor placements, and footer.

Only implement regions authorized by the current task.

## Header

The header may include the approved TrampsWorld logo or temporary wordmark, Events, Calendar, vertical navigation, state access, This Weekend, Submit or Contact, and mobile navigation.

Hide controls that are not functional.

## Event cards

Recommended hierarchy:

1. vertical or category visual
2. vertical label
3. event title
4. date and time
5. venue
6. city and state
7. category
8. price or audience indicator when useful
9. coverage, featured, promoted, or sponsored disclosure when applicable

Use consistent image ratios and touch-friendly card interactions.

## Event imagery

Use original imagery when it is high quality, crops safely, has appropriate rights, and improves the placement.

Use controlled vertical or category art when no image exists, a flyer is too text-heavy, resolution is poor, or the result would create visual chaos.

Do not stretch flyers or use flyer text as the only accessible event information.

## Typography

Prefer a small type system with:

- an industrial or stencil display role where brand-appropriate
- a readable heading role
- a highly readable body role
- clear metadata numerals
- robust fallbacks

Known TrampsWorld source typography includes Stencil Std Bold, Benguiat Bk BT Bold, and Rock Salt in existing brand work. Do not assume those files are licensed or available in the application. Use approved web-safe or properly licensed alternatives when needed.

## Color tokens

```css
--brand-orange: #ff9000;
--brand-black: #000000;
--brand-white: #ffffff;

--color-background;
--color-surface;
--color-surface-raised;
--color-text;
--color-text-muted;
--color-border;
--color-accent;
--color-accent-contrast;
--color-focus;
--color-success;
--color-warning;
--color-error;
```

Component styles should use semantic tokens so later brand adjustments do not require broad rewrites.

Vertical colors, if added, must remain separate from semantic status colors.

## Controls, filters, and search

State and vertical controls should show current state clearly, support individual removal and clear-all behavior, remain keyboard accessible, persist in URL state where appropriate, and work comfortably on mobile.

Search must have an explicit label, clear behavior, and no fake production state.

## Status states

Loading, empty, filtered-empty, error, expired, canceled, and missing-image states must look intentional and explain the next useful action.

## Responsive checks

Minimum checks:

- 320px
- 375px
- 768px
- 1024px
- 1440px

No horizontal page scrolling at 320px. Controls and cards must remain readable at 200% zoom.

## Accessibility

Use visible focus, logical tab order, comfortable touch targets, semantic collections, logical heading order, appropriate icon labels, reduced-motion support, screen-reader-friendly dates, sufficient contrast, and no hover-only information.

## Approval boundaries

Codex may adapt existing components to TrampsWorld tokens, build reusable vertical visuals, improve responsive behavior, and preserve accessibility.

Codex may not invent a final logo, add paid fonts, redefine the four verticals, create sponsor styling before its task, or redesign product scope without approval.
