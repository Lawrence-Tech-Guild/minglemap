from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0002_remove_profile_consent_level_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="attendance",
            name="visible_in_directory",
            field=models.BooleanField(default=True),
        ),
    ]
