from datetime import timedelta

import pytest
from django.db import IntegrityError
from django.utils import timezone
from rest_framework.test import APIClient

from .models import Attendance, Event, Profile

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
    )
    Attendance.objects.create(
        event=event,
        profile=profile_hidden,
        consent_to_share_profile=False,
    )
    client = APIClient()

    response = client.get(f"/api/events/{event.id}/directory/")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1

    entry = data[0]
    assert entry["attendance_id"] == attendance_consented.id
    assert entry["profile"]["id"] == profile_consented.id
    assert entry["profile"]["name"] == profile_consented.name
    assert entry["profile"]["interests"] == profile_consented.interests
    assert entry["connection_intent"] == attendance_consented.connection_intent
