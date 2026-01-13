# Minimal Analytics and Telemetry Plan

> [!IMPORTANT]
> Collect only aggregated, non-identifying product usage signals and avoid storing raw personal data.

## Goals

- Validate Phase 1 success metrics without tracking individuals.
- Detect high-level product friction (drop-offs, error spikes).
- Measure adoption by event and time window, not by person.

## Principles

- Data minimization by default; add fields only when they answer a specific question.
- Prefer on-demand counting in the database over new telemetry when possible.
- Use coarse timestamps (day-level) where feasible.
- Respect visibility and consent; never log hidden profile fields.

> [!WARNING]
> Do not log emails, names, phone numbers, profile text, or free-form user input in analytics events.

## Metrics to capture (Phase 1)

- Event signups per event per day.
- Directory page views per event per day.
- Directory searches per event per day (search count only, no query text).
- Profile visibility toggles per event per day.
- Consent changes per event per day (on/off counts only).
- Error rate by endpoint and status code (no request bodies).

## Event schema (minimal)

Fields to include for any analytics event:

- `event_name` (string, controlled vocabulary)
- `event_id` (UUID or integer)
- `event_date` (YYYY-MM-DD)
- `count` (integer)
- `source` ("web", "admin", optional)

Do not include IP address, user agent, or any user identifier.

## Storage and retention

- Store aggregates in a dedicated table or roll-up view.
- Retain raw server logs for standard operational purposes only.
- Retain analytics aggregates for 180 days unless required otherwise.

> [!NOTE]
> If error analytics need more detail, store request metadata in standard logs and keep it out of analytics tables.

## Access and governance

- Limit write access to the application service account.
- Limit read access to the core team; publish only aggregated dashboards.
- Document any new metric or field before adding it.

## Implementation outline

- Add a lightweight aggregator for daily counts (e.g., management command or scheduled task).
- Populate counts from existing tables for signups and visibility/consent toggles.
- Increment directory view/search counters in-app with in-memory buffering where possible.
- Track errors by endpoint and status code via middleware.

## Open questions

- Which dashboards are needed for Phase 1 reviews?
- Is 180-day retention sufficient for reporting cadence?
- Do we need a separate dashboard for organizer vs. admin views?
