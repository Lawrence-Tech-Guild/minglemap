from django.db import IntegrityError, transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Attendance, Event, Feedback, Profile
from .serializers import (
    AttendanceSerializer,
    DirectoryEntrySerializer,
    DirectoryVisibilitySerializer,
    EventSerializer,
    EventSignupSerializer,
    FeedbackSerializer,
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
                    visible_in_directory=consent_to_share_profile,
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
        attendance_id = request.query_params.get("attendance_id")
        if not attendance_id:
            return Response(
                {"detail": "Sign up is required to view the directory."},
                status=status.HTTP_403_FORBIDDEN,
            )
        try:
            attendance_id_int = int(attendance_id)
        except ValueError:
            return Response(
                {"detail": "Attendance id must be an integer."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            viewer_attendance = Attendance.objects.get(
                event=event, id=attendance_id_int
            )
        except Attendance.DoesNotExist:
            return Response(
                {"detail": "Sign up is required to view the directory."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if not viewer_attendance.consent_to_share_profile:
            return Response(
                {
                    "detail": "Consent is required to view the directory. Update visibility to opt in."
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        if not viewer_attendance.visible_in_directory:
            return Response(
                {
                    "detail": "Visibility is off for this event. Enable visibility to browse attendees."
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        attendances = (
            Attendance.objects.filter(
                event=event,
                consent_to_share_profile=True,
                visible_in_directory=True,
            )
            .select_related("profile")
            .exclude(id=viewer_attendance.id)
            .order_by("id")
        )
        search = request.query_params.get("search")
        if search:
            attendances = attendances.filter(
                Q(profile__name__icontains=search)
                | Q(profile__interests__icontains=search)
                | Q(connection_intent__icontains=search)
            )
        interests = request.query_params.get("interests")
        if interests:
            attendances = attendances.filter(profile__interests__icontains=interests)
        connection_intent = request.query_params.get("connection_intent")
        if connection_intent:
            attendances = attendances.filter(
                connection_intent__icontains=connection_intent
            )
        return Response(DirectoryEntrySerializer(attendances, many=True).data)

    @action(detail=True, methods=["patch"], url_path="directory/visibility")
    def directory_visibility(self, request, pk=None):
        event = self.get_object()
        serializer = DirectoryVisibilitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attendance_id = serializer.validated_data["attendance_id"]

        try:
            attendance = Attendance.objects.get(event=event, id=attendance_id)
        except Attendance.DoesNotExist:
            return Response(
                {"detail": "Attendance not found for this event."},
                status=status.HTTP_404_NOT_FOUND,
            )

        update_fields = []
        new_consent = serializer.validated_data.get(
            "consent_to_share_profile", attendance.consent_to_share_profile
        )
        new_visibility = serializer.validated_data.get(
            "visible_in_directory", attendance.visible_in_directory
        )
        if new_visibility and not new_consent:
            return Response(
                {
                    "detail": "Consent is required to appear in the directory. Enable consent first."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if "visible_in_directory" in serializer.validated_data:
            attendance.visible_in_directory = serializer.validated_data[
                "visible_in_directory"
            ]
            update_fields.append("visible_in_directory")
        if "consent_to_share_profile" in serializer.validated_data:
            consent_to_share_profile = serializer.validated_data[
                "consent_to_share_profile"
            ]
            attendance.consent_to_share_profile = consent_to_share_profile
            attendance.consent_to_share_profile_at = (
                timezone.now() if consent_to_share_profile else None
            )
            if consent_to_share_profile is False:
                attendance.visible_in_directory = False
                update_fields.append("visible_in_directory")
            update_fields.extend(
                ["consent_to_share_profile", "consent_to_share_profile_at"]
            )

        if not update_fields:
            return Response(
                {"detail": "No visibility updates provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        attendance.save(update_fields=update_fields)
        return Response(AttendanceSerializer(attendance).data)

    @action(detail=True, methods=["post"], url_path="feedback")
    def feedback(self, request, pk=None):
        event = self.get_object()
        serializer = FeedbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attendance = serializer.validated_data.get("attendance")
        if attendance and attendance.event_id != event.id:
            return Response(
                {"detail": "Attendance not found for this event."},
                status=status.HTTP_404_NOT_FOUND,
            )
        feedback = Feedback.objects.create(
            event=event,
            attendance=attendance,
            rating=serializer.validated_data.get("rating"),
            message=serializer.validated_data["message"],
            contact=serializer.validated_data.get("contact", ""),
        )
        return Response(FeedbackSerializer(feedback).data, status=status.HTTP_201_CREATED)


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
