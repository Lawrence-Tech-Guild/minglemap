from django.db import models
from django.utils import timezone


class Event(models.Model):
    """Event attended by profiles."""

    title = models.CharField(max_length=255)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    estimated_attendance = models.PositiveIntegerField(null=True, blank=True)
    signup_opens_at = models.DateTimeField(null=True, blank=True)
    signup_closes_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return self.title


class Profile(models.Model):
    """Person attending events."""

    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True)
    role = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    interests = models.TextField(blank=True)

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return self.name


class Attendance(models.Model):
    """Profile attending an event."""

    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    interest_areas = models.TextField(blank=True)
    connection_intent = models.TextField(blank=True)
    consent_to_share_profile = models.BooleanField(default=False)
    consent_to_share_profile_at = models.DateTimeField(null=True, blank=True)
    signed_up_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["event", "profile"], name="unique_attendance"
            )
        ]

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return f"{self.profile} @ {self.event}"
