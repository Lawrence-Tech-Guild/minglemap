from datetime import timedelta

import pytest
from django.db import IntegrityError
from django.utils import timezone
from rest_framework.test import APIClient

from .models import Attendance, Event, Feedback, Profile

pytestmark = pytest.mark.django_db


def create_event() -> Event:
    starts_at = timezone.now()
    ends_at = starts_at + timedelta(hours=2)
    return Event.objects.create(
        title="Demo Event",
        starts_at=starts_at,
        ends_at=ends_at,
        location="Lawrence, KS",
    )


def create_profile() -> Profile:
    return Profile.objects.create(name="Ada Lovelace")


def test_attendance_defaults() -> None:
    event = create_event()
    profile = create_profile()

    attendance = Attendance.objects.create(event=event, profile=profile)

    assert attendance.visible_in_directory is False
    assert attendance.consent_to_share_profile is False
    assert attendance.consent_to_share_profile_at is None
    assert attendance.interest_areas == ""
    assert attendance.connection_intent == ""
    assert attendance.signed_up_at is not None


def test_attendance_unique_constraint() -> None:
    event = create_event()
    profile = create_profile()

    Attendance.objects.create(event=event, profile=profile)

    with pytest.raises(IntegrityError):
        Attendance.objects.create(event=event, profile=profile)


def test_event_signup_creates_attendance_and_profile_with_consent() -> None:
    event = create_event()
    client = APIClient()

    payload = {
        "profile": {
            "name": "Ada Lovelace",
            "interests": "mentorship, compilers",
        },
        "interest_areas": "open source",
        "connection_intent": "meet mentors",
        "consent_to_share_profile": True,
    }

    response = client.post(
        f"/api/events/{event.id}/signups/",
        payload,
        format="json",
    )

    assert response.status_code == 201

    attendance = Attendance.objects.get(event=event)
    assert attendance.profile.name == "Ada Lovelace"
    assert attendance.profile.interests == "mentorship, compilers"
    assert attendance.interest_areas == "open source"
    assert attendance.connection_intent == "meet mentors"
    assert attendance.consent_to_share_profile is True
    assert attendance.consent_to_share_profile_at is not None
    assert attendance.visible_in_directory is True

    data = response.json()
    assert data["event"] == event.id
    assert data["profile"] == attendance.profile_id


def test_event_signup_defaults_consent_false() -> None:
    event = create_event()
    client = APIClient()

    payload = {
        "profile": {
            "name": "Grace Hopper",
            "interests": "compilers",
        },
        "interest_areas": "foundational tech",
        "connection_intent": "meet peers",
    }

    response = client.post(
        f"/api/events/{event.id}/signups/",
        payload,
        format="json",
    )

    assert response.status_code == 201

    attendance = Attendance.objects.get(event=event)
    assert attendance.consent_to_share_profile is False
    assert attendance.consent_to_share_profile_at is None
    assert attendance.visible_in_directory is False


def test_event_signup_rejects_outside_signup_window() -> None:
    event = create_event()
    event.signup_opens_at = timezone.now() + timedelta(hours=1)
    event.save(update_fields=["signup_opens_at"])
    client = APIClient()

    payload = {
        "profile": {
            "name": "Katherine Johnson",
            "interests": "math",
        }
    }

    response = client.post(
        f"/api/events/{event.id}/signups/",
        payload,
        format="json",
    )

    assert response.status_code == 403
    assert Attendance.objects.count() == 0


def test_event_directory_returns_only_consented_attendees() -> None:
    event = create_event()
    viewer = create_profile()
    viewer_attendance = Attendance.objects.create(
        event=event,
        profile=viewer,
        consent_to_share_profile=True,
        consent_to_share_profile_at=timezone.now(),
        visible_in_directory=True,
    )
    profile_consented = Profile.objects.create(
        name="Hedy Lamarr",
        interests="wireless",
    )
    profile_hidden = Profile.objects.create(
        name="Radia Perlman",
        interests="networking",
    )
    attendance_consented = Attendance.objects.create(
        event=event,
        profile=profile_consented,
        consent_to_share_profile=True,
        consent_to_share_profile_at=timezone.now(),
        connection_intent="find collaborators",
        visible_in_directory=True,
    )
    Attendance.objects.create(
        event=event,
        profile=profile_hidden,
        consent_to_share_profile=False,
    )
    Attendance.objects.create(
        event=event,
        profile=Profile.objects.create(name="Joan Clarke"),
        consent_to_share_profile=True,
        consent_to_share_profile_at=timezone.now(),
        visible_in_directory=False,
    )
    client = APIClient()

    response = client.get(
        f"/api/events/{event.id}/directory/?attendance_id={viewer_attendance.id}"
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1

    entry = data[0]
    assert entry["attendance_id"] == attendance_consented.id
    assert entry["profile"]["id"] == profile_consented.id
    assert entry["profile"]["name"] == profile_consented.name
    assert entry["profile"]["interests"] == profile_consented.interests
    assert entry["connection_intent"] == attendance_consented.connection_intent


def test_event_directory_requires_consent_and_visibility() -> None:
    event = create_event()
    viewer = create_profile()
    viewer_attendance = Attendance.objects.create(
        event=event,
        profile=viewer,
    )
    client = APIClient()

    response = client.get(
        f"/api/events/{event.id}/directory/?attendance_id={viewer_attendance.id}"
    )

    assert response.status_code == 403
    assert response.json()["detail"].startswith("Consent is required")

    viewer_attendance.consent_to_share_profile = True
    viewer_attendance.consent_to_share_profile_at = timezone.now()
    viewer_attendance.save(update_fields=["consent_to_share_profile", "consent_to_share_profile_at"])

    response = client.get(
        f"/api/events/{event.id}/directory/?attendance_id={viewer_attendance.id}"
    )
    assert response.status_code == 403
    assert response.json()["detail"].startswith("Visibility is off")

    viewer_attendance.visible_in_directory = True
    viewer_attendance.save(update_fields=["visible_in_directory"])

    response = client.get(
        f"/api/events/{event.id}/directory/?attendance_id={viewer_attendance.id}"
    )
    assert response.status_code == 200


def test_event_directory_requires_signup() -> None:
    event = create_event()
    client = APIClient()

    response = client.get(f"/api/events/{event.id}/directory/")

    assert response.status_code == 403


def test_directory_visibility_toggle_updates_consent_and_visibility() -> None:
    event = create_event()
    profile = create_profile()
    attendance = Attendance.objects.create(event=event, profile=profile)
    client = APIClient()

    response = client.patch(
        f"/api/events/{event.id}/directory/visibility/",
        {
            "attendance_id": attendance.id,
            "visible_in_directory": False,
            "consent_to_share_profile": True,
        },
        format="json",
    )

    assert response.status_code == 200
    attendance.refresh_from_db()
    assert attendance.visible_in_directory is False
    assert attendance.consent_to_share_profile is True
    assert attendance.consent_to_share_profile_at is not None


def test_directory_visibility_requires_consent_to_be_visible() -> None:
    event = create_event()
    profile = create_profile()
    attendance = Attendance.objects.create(event=event, profile=profile)
    client = APIClient()

    response = client.patch(
        f"/api/events/{event.id}/directory/visibility/",
        {
            "attendance_id": attendance.id,
            "visible_in_directory": True,
        },
        format="json",
    )

    assert response.status_code == 400
    assert "Consent is required" in response.json()["detail"]


def test_directory_visibility_rejects_mismatched_event() -> None:
    event = create_event()
    other_event = Event.objects.create(
        title="Other Event",
        starts_at=timezone.now(),
        ends_at=timezone.now() + timedelta(hours=2),
        location="Remote",
    )
    attendance = Attendance.objects.create(event=other_event, profile=create_profile())
    client = APIClient()

    response = client.patch(
        f"/api/events/{event.id}/directory/visibility/",
        {"attendance_id": attendance.id, "consent_to_share_profile": True},
        format="json",
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Attendance not found for this event."


def test_event_directory_supports_search_filters() -> None:
    event = create_event()
    viewer = create_profile()
    viewer_attendance = Attendance.objects.create(
        event=event,
        profile=viewer,
        consent_to_share_profile=True,
        consent_to_share_profile_at=timezone.now(),
        visible_in_directory=True,
    )
    radio = Profile.objects.create(name="Radia Perlman", interests="networking")
    Attendance.objects.create(
        event=event,
        profile=radio,
        consent_to_share_profile=True,
        consent_to_share_profile_at=timezone.now(),
        visible_in_directory=True,
        connection_intent="mentorship",
    )
    hedy = Profile.objects.create(name="Hedy Lamarr", interests="wireless and AI")
    Attendance.objects.create(
        event=event,
        profile=hedy,
        consent_to_share_profile=True,
        consent_to_share_profile_at=timezone.now(),
        visible_in_directory=True,
        connection_intent="find collaborators",
    )
    hidden_profile = Profile.objects.create(name="Hidden Person", interests="networking")
    Attendance.objects.create(
        event=event,
        profile=hidden_profile,
        consent_to_share_profile=True,
        consent_to_share_profile_at=timezone.now(),
        visible_in_directory=False,
    )
    client = APIClient()

    response = client.get(
        f"/api/events/{event.id}/directory/",
        {"attendance_id": viewer_attendance.id, "search": "Hedy"},
    )
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["profile"]["name"] == "Hedy Lamarr"


def test_feedback_submission_for_event() -> None:
    event = create_event()
    attendee = create_profile()
    attendance = Attendance.objects.create(event=event, profile=attendee)
    client = APIClient()

    response = client.post(
        f"/api/events/{event.id}/feedback/",
        {
            "attendance": attendance.id,
            "message": "Great flow, would like better filters.",
            "rating": 4,
            "contact": "attendee@example.com",
        },
        format="json",
    )

    assert response.status_code == 201
    data = response.json()
    assert data["event"] == event.id
    assert data["attendance"] == attendance.id
    assert data["message"].startswith("Great flow")
    assert Feedback.objects.count() == 1


def test_feedback_rejects_mismatched_event_attendance() -> None:
    event = create_event()
    other_event = Event.objects.create(
        title="Other Event",
        starts_at=timezone.now(),
        ends_at=timezone.now() + timedelta(hours=2),
        location="Remote",
    )
    attendance = Attendance.objects.create(event=other_event, profile=create_profile())
    client = APIClient()

    response = client.post(
        f"/api/events/{event.id}/feedback/",
        {
            "attendance": attendance.id,
            "message": "Wrong event",
        },
        format="json",
    )

    assert response.status_code == 404
