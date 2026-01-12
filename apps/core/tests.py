from datetime import timedelta

import pytest
from django.db import IntegrityError
from django.utils import timezone

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
