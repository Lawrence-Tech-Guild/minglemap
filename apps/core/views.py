from rest_framework import filters, viewsets

from .models import Attendance, Event, Profile
from .serializers import AttendanceSerializer, EventSerializer, ProfileSerializer


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
    filterset_fields = ["title", "location", "starts_at", "ends_at"]


class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    filter_backends = [ExactMatchFilterBackend]
    filterset_fields = ["name", "company", "interests", "consent_level"]


class AttendanceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    filter_backends = [ExactMatchFilterBackend]
    filterset_fields = ["event", "profile"]
