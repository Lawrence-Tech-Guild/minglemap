# PLANS

> [!NOTE]
> This plan is a living document and should be updated after each sprint review.

## Purpose

Provide a sprint-sized delivery plan that aligns the product roadmap with concrete milestones and team execution.

## Planning assumptions

- Two-week sprints, with a short retro and a roadmap check-in at the end of each sprint.
- Early delivery favors lightweight, testable increments and validates privacy-first requirements.
- Backend and frontend can progress in parallel as long as API contracts are written down.

> [!IMPORTANT]
> Any feature that exposes attendee data must include explicit consent and visibility controls before release.

## Sprint map (MVP demo focus)

### Sprint 1: MVP foundations

- Event creation and signup flows with consent capture.
- Attendee profiles with per-event visibility toggles enforced in API.
- Public event directory UI (list, detail, signup) wired to API.
- Seed data and fixtures for the default demo event.
- Happy-path demo script drafted.

### Sprint 2: Demoable browsing + feedback loop

- Attendee browsing with search/filter (name, interests, intent).
- Feedback collection (form or survey) reachable from the demo path.
- Privacy copy refined and linked to consent language in UI.
- Basic analytics for page hits and drop-off (opt-in, anonymized).
- Demo rehearsal with feedback captured in TODO.md and docs/.

### Sprint 3: MVP polish and readiness

- Accessibility and UX polish on signup and browsing.
- Error/empty states covered for demo data and live use.
- Support artifacts: demo fixtures refreshed, runbook for demo resets.
- Security/privacy checklist for MVP reviewed and signed off.

### Sprint 4: Post-MVP beta foundation

- Expanded profile fields and consent-based interaction primitives.
- Notification preference scaffolding without automated sends.
- API contract revisions for beta scope; migration plan drafted.

## Risks and dependencies

- Privacy and consent design must stay ahead of feature work.
- Event onboarding flow is critical for usability; allocate design time.
- Data model changes should be accompanied by migrations and tests.

## Definition of done for each sprint

- Feature stories meet acceptance criteria and are covered by tests.
- API documentation updated if endpoints change.
- Demo path validated (happy path walkthrough documented and runnable).
- Open questions captured in TODO.md with owners.
