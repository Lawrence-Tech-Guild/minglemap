from django.contrib import admin

from .models import Attendance, Event, Profile

admin.site.register(Event)
admin.site.register(Profile)
admin.site.register(Attendance)
