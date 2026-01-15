from rest_framework import serializers

from .models import Attendance, Event, Profile


class EventSerializer(serializers.ModelSerializer):
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
