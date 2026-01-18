from django.db import migrations, models


def hide_nonconsented(apps, schema_editor):
    Attendance = apps.get_model("core", "Attendance")
    Attendance.objects.filter(consent_to_share_profile=False).update(
        visible_in_directory=False
    )


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0003_attendance_visible_in_directory"),
    ]

    operations = [
        migrations.AlterField(
            model_name="attendance",
            name="visible_in_directory",
            field=models.BooleanField(default=False),
        ),
        migrations.RunPython(hide_nonconsented, migrations.RunPython.noop),
    ]
