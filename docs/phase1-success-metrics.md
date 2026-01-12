# Phase 1 Success Metrics

This document defines draft success metrics for the Phase 1 pilot (event-specific connection book).
It is intended to support a go/no-go decision for Phase 2 and centers on usage targets and feedback volume.

> [!IMPORTANT]
> Confirm these targets with event organizers before the pilot and adjust for event size.

> [!NOTE]
> These targets assume a single pilot event with 30-100 attendees and a 7-day post-event feedback window.

## Scope

Phase 1 features covered:
- Event signup with interest areas.
- Attendee profiles visible only to opt-in attendees of the same event.
- Directory browsing without automated notifications.

## Measurement window

- Pre-event window: from signup open until event start.
- Event window: during the event.
- Post-event window: up to 7 days after the event.

## Data collection principles

> [!IMPORTANT]
> Measure usage at the event level only and avoid per-profile view logs or personal identifiers in analytics exports.

- Use aggregate counts for signups, opt-ins, profile completion, and directory usage.
- Keep survey responses anonymized unless participants explicitly opt in to follow-up.

## Draft targets

| Metric | Target | How to measure |
| --- | --- | --- |
| Signup rate | >= 25% of estimated attendees | Signups divided by estimated attendance |
| Consent opt-in rate | >= 70% of signups | Opt-in profiles divided by signups |
| Profile completion rate | >= 80% of signups | Required fields present |
| Directory usage | >= 50% of signups view directory | Unique directory viewers divided by signups |
| Feedback response rate | >= 20% of signups or >= 10 responses | Survey responses |
| "Would use again" | >= 70% positive | Survey question |

## Survey prompts (draft)

- Would you use this at another event? (5-point scale)
- Did the directory help you find someone relevant? (Yes/No)
- What stopped you from using it more? (Free text)
- What is the single most important improvement? (Free text)

## Go/no-go rubric (draft)

- Go: meet at least 4 of 6 quantitative targets, including "Would use again" >= 70%, with no unresolved privacy or consent complaints.
- Iterate: meet 2-3 targets or receive feedback pointing to fixable onboarding or directory friction.
- No-go: signup rate < 15%, consent opt-in < 50%, or any consent breach during the pilot.

## Open decisions

- Final event size estimate to calibrate absolute targets.
- Which survey tool and delivery method will be used.
- Whether any profile view tracking beyond aggregate directory usage is warranted.
