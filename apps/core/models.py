from django.db import models


class Event(models.Model):
    """Event attended by profiles."""

    title = models.CharField(max_length=255)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    location = models.CharField(max_length=255)

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return self.title


class Profile(models.Model):
    """Person attending events."""

    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    interests = models.TextField(blank=True)
    consent_level = models.CharField(max_length=50)

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return self.name


class Attendance(models.Model):
    """Profile attending an event."""

    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["event", "profile"], name="unique_attendance"
            )
        ]

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return f"{self.profile} @ {self.event}"
