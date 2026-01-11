from django.core.management import BaseCommand, call_command


class Command(BaseCommand):
    """Load seed data for development."""

    def handle(self, *args, **options):
        call_command("loaddata", "seed")

