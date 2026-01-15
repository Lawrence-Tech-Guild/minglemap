# Seed Data for Demos and Tests

> [!IMPORTANT]
> Use fictional, non-identifying data only; do not include real people, emails, or phone numbers.

## Goals

- Support Phase 1 demo flows for event signup and attendee browsing.
- Enable automated tests with deterministic fixtures.
- Provide realistic coverage for visibility and consent scenarios.

## Core entities

### Events (3)

- `Event A` (small, 25 attendees)
- `Event B` (medium, 150 attendees)
- `Event C` (large, 600 attendees)

Each event should include:

- Name, date, location
- Capacity and registration open/close window
- Organizer profile (fictional)

### Attendee profiles (per event)

- `Event A`: 25 profiles
- `Event B`: 150 profiles
- `Event C`: 600 profiles

Profile coverage mix (per event):

- 40% public
- 40% visible to attendees only
- 20% hidden

Consent coverage mix (per event):

- 60% consent on
- 40% consent off

### Signups

- Full signups for all attendees in each event.
- Include a small set of waitlisted signups for `Event C`.

### Directory activity (aggregated)

- Daily directory views for each event (7-day window).
- Daily search counts for each event (7-day window).

### Feedback submissions (optional for Sprint 2)

- 20 short survey responses per event (no free-form PII).

## Test case fixtures

- Attendee with consent off and visibility public (should be masked).
- Attendee with consent on and visibility attendees-only.
- Attendee hidden (should not appear in directory).
- Event with registration closed (should block signup).
- Event at capacity (should allow waitlist only).

## Storage format

- Provide Django fixture JSON or factory-based setup.
- Use stable IDs and deterministic timestamps.
- Keep fixture data in `apps/core/fixtures/` or a dedicated test helper.

> [!TIP]
> Load the Phase 1 demo fixture with `python manage.py loaddata seed-phase1`.

Current fixture: `apps/core/fixtures/seed-phase1.json`.

## Open questions

- Do we need locale or timezone variants for events?
- Should we include staff/admin user accounts for demo flows?
