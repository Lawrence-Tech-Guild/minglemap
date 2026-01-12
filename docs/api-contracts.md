# API Contracts (Draft)

This document defines draft API contracts for Phase 1 flows.
It is intended to guide backend and frontend work until endpoints are implemented.

> [!NOTE]
> These contracts are drafts and should be updated as soon as endpoints are implemented.

## Conventions

- Base URL: `/api/`
- Requests and responses are JSON.
- Timestamps are ISO 8601 in UTC, for example `2025-05-01T18:30:00Z`.
- IDs are integers.
- Errors follow Django REST Framework defaults (field errors map to arrays; non-field errors use `detail`).

> [!IMPORTANT]
> Endpoint shapes are fixed for Phase 1: event signup uses `/api/events/{event_id}/signups/` and attendee directory uses `/api/events/{event_id}/directory/`. Avoid introducing `/api/attendances/` for client workflows during Phase 1.

## Privacy and consent

> [!IMPORTANT]
> Attendee directory responses must include only profiles that explicitly opt in with `consent_to_share_profile=true`; default is false.

- Consent timestamps are set by the server when the attendee opts in.
- Signups can be created without consent, but directory visibility requires it.

## Event signup

Create an event signup with profile details and event-specific intent.

`POST /api/events/{event_id}/signups/`

Request body:

```json
{
  "profile": {
    "name": "Ada Lovelace",
    "interests": "mentorship, compilers"
  },
  "interest_areas": "open source, mentorship",
  "connection_intent": "meet mentors or hiring managers",
  "consent_to_share_profile": true
}
```

Response body:

```json
{
  "id": 42,
  "event": 3,
  "profile": 18,
  "interest_areas": "open source, mentorship",
  "connection_intent": "meet mentors or hiring managers",
  "consent_to_share_profile": true,
  "consent_to_share_profile_at": "2025-05-01T18:30:00Z",
  "signed_up_at": "2025-05-01T18:30:00Z"
}
```

Validation rules:

- `profile.name` is required.
- `consent_to_share_profile` defaults to `false` when omitted.
- Signups are rejected if the event is outside `signup_opens_at` and `signup_closes_at` (when set).
- A profile can sign up for the same event only once.

Possible responses:

- `201` on success.
- `400` for validation errors.
- `403` if signups are closed.
- `404` if the event does not exist.
- `409` if the profile is already signed up for the event.

## Attendee directory

List consented attendee profiles for an event.

`GET /api/events/{event_id}/directory/`

Response body:

```json
[
  {
    "attendance_id": 42,
    "profile": {
      "id": 18,
      "name": "Ada Lovelace",
      "interests": "mentorship, compilers"
    },
    "connection_intent": "meet mentors or hiring managers"
  }
]
```

Possible responses:

- `200` on success.
- `403` if the requester is not signed up for the event (once auth is enforced).
- `404` if the event does not exist.
