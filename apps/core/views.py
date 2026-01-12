from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Attendance, Event, Profile
from .serializers import (
    AttendanceSerializer,
    DirectoryEntrySerializer,
    EventSerializer,
    EventSignupSerializer,
    ProfileSerializer,
)


class ExactMatchFilterBackend(filters.BaseFilterBackend):
    """Simple exact-match filtering without external deps."""

    def filter_queryset(self, request, queryset, view):  # pragma: no cover - simple
        for field in getattr(view, "filterset_fields", []):
            value = request.query_params.get(field)
            if value is not None:
                queryset = queryset.filter(**{field: value})
        return queryset


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [ExactMatchFilterBackend]
    filterset_fields = [
        "title",
        "location",
        "starts_at",
        "ends_at",
        "estimated_attendance",
        "signup_opens_at",
        "signup_closes_at",
    ]

    @action(detail=True, methods=["post"], url_path="signups")
    def signups(self, request, pk=None):
        event = self.get_object()
        now = timezone.now()
        if event.signup_opens_at and now < event.signup_opens_at:
            return Response(
                {"detail": "Event signups are not open yet."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if event.signup_closes_at and now > event.signup_closes_at:
            return Response(
                {"detail": "Event signups are closed."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = EventSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile_data = serializer.validated_data["profile"]
        consent_to_share_profile = serializer.validated_data.get(
            "consent_to_share_profile", False
        )
        consent_to_share_profile_at = (
            timezone.now() if consent_to_share_profile else None
        )

        try:
            with transaction.atomic():
                profile = Profile.objects.create(**profile_data)
                attendance = Attendance.objects.create(
                    event=event,
                    profile=profile,
                    interest_areas=serializer.validated_data.get("interest_areas", ""),
                    connection_intent=serializer.validated_data.get(
                        "connection_intent", ""
                    ),
                    consent_to_share_profile=consent_to_share_profile,
                    consent_to_share_profile_at=consent_to_share_profile_at,
                )
        except IntegrityError:
            return Response(
                {"detail": "Profile is already signed up for this event."},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            AttendanceSerializer(attendance).data, status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=["get"], url_path="directory")
    def directory(self, request, pk=None):
        event = self.get_object()
        attendances = (
            Attendance.objects.filter(event=event, consent_to_share_profile=True)
            .select_related("profile")
            .order_by("id")
        )
        return Response(DirectoryEntrySerializer(attendances, many=True).data)


class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    filter_backends = [ExactMatchFilterBackend]
    filterset_fields = ["name", "company", "role", "interests"]


class AttendanceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    filter_backends = [ExactMatchFilterBackend]
    filterset_fields = ["event", "profile", "consent_to_share_profile"]
