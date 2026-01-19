from rest_framework import serializers

from .models import Attendance, Event, Feedback, Profile


class EventSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        starts_at = attrs.get("starts_at") or getattr(self.instance, "starts_at", None)
        ends_at = attrs.get("ends_at") or getattr(self.instance, "ends_at", None)
        if starts_at and ends_at and ends_at <= starts_at:
            raise serializers.ValidationError(
                {"ends_at": "Event end time must be after the start time."}
            )

        signup_opens_at = attrs.get("signup_opens_at") or getattr(
            self.instance, "signup_opens_at", None
        )
        signup_closes_at = attrs.get("signup_closes_at") or getattr(
            self.instance, "signup_closes_at", None
        )
        if signup_opens_at and signup_closes_at and signup_closes_at < signup_opens_at:
            raise serializers.ValidationError(
                {
                    "signup_closes_at": "Signup close time must be after signup open time."
                }
            )

        return attrs

    class Meta:
        model = Event
        fields = "__all__"


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = "__all__"


class ProfileSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["name", "company", "role", "bio", "interests"]


class EventSignupSerializer(serializers.Serializer):
    profile = ProfileSignupSerializer()
    interest_areas = serializers.CharField(required=False, allow_blank=True, default="")
    connection_intent = serializers.CharField(
        required=False, allow_blank=True, default=""
    )
    consent_to_share_profile = serializers.BooleanField(required=False, default=False)


class DirectoryVisibilitySerializer(serializers.Serializer):
    attendance_id = serializers.IntegerField()
    visible_in_directory = serializers.BooleanField(required=False)
    consent_to_share_profile = serializers.BooleanField(required=False)


class DirectoryProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["id", "name", "interests"]


class DirectoryEntrySerializer(serializers.ModelSerializer):
    attendance_id = serializers.IntegerField(source="id", read_only=True)
    profile = DirectoryProfileSerializer(read_only=True)

    class Meta:
        model = Attendance
        fields = ["attendance_id", "profile", "connection_intent"]


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = [
            "id",
            "event",
            "attendance",
            "rating",
            "message",
            "contact",
            "submitted_at",
        ]
        read_only_fields = ["id", "submitted_at", "event"]
