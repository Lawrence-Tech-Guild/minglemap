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

## Sprint map (proposed)

### Sprint 0: Project alignment and groundwork

- Confirm product goals and success metrics for Phase 1.
- Validate data model for events, attendee profiles, and consent.
- Establish API contract draft and UI information architecture.
- Create initial test plan and basic CI checks for API endpoints.

### Sprint 1: Event signup + attendee profiles (Phase 1 core)

- Event creation and signup flows (admin + attendee).
- Public attendee profile fields: interests and connection intent.
- Consent gating for event-only visibility.
- Basic API endpoints with tests.
- UI: event listing, signup, and attendee directory.

### Sprint 2: Privacy-first browsing + feedback loop

- Profile visibility toggles and scoped access checks.
- Attendee browsing UI with filters and search.
- Feedback capture (short survey or form) for Phase 1 users.
- Instrumentation for usage analytics (minimal, privacy-respecting).

### Sprint 3: Phase 2 foundation

- Expanded profile fields (bio, role, company).
- Consent-based interaction primitives (request/share contact intent).
- Notification preferences scaffolding (no automated notifications yet).
- API contract revisions and migration strategy.

### Sprint 4: Phase 2 polish and readiness

- UX polish and accessibility pass for browsing.
- Security and privacy review checklist.
- Operational readiness: seed data, demo fixtures, deployment notes.

## Risks and dependencies

- Privacy and consent design must stay ahead of feature work.
- Event onboarding flow is critical for usability; allocate design time.
- Data model changes should be accompanied by migrations and tests.

## Definition of done for each sprint

- Feature stories meet acceptance criteria and are covered by tests.
- API documentation updated if endpoints change.
- Demo path validated (happy path walkthrough documented).
- Open questions captured in TODO.md with owners.
