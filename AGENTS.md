# AGENTS

This file is the repo-specific guide for coding agents working on MingleMap.
Follow it alongside any system or workspace policies.

## Project overview

- Backend is Django 5.x with Channels and Django REST Framework.
- Primary Django project lives in `minglemap/`; apps live in `apps/` (currently `apps/core`).
- Default settings use SQLite (`db.sqlite3`). `docker-compose.yml` provisions PostGIS and Redis, but settings do not yet consume `DATABASE_URL` or Redis env vars.
- Frontend is Vite + React in `frontend/`.
- Documentation lives in `docs/` (Sphinx) plus Markdown in the repo root.

## Repository map

- `apps/`: Django apps; add models, serializers, views, and tests here.
- `minglemap/`: Django settings, URLs, ASGI/WSGI entrypoints.
- `src/minglemap/`: Console script stub; not the Django project.
- `frontend/`: React UI (Vite, Tailwind).
- `docs/`: Sphinx docs and ideation artifacts.
- `tests/`: Top-level pytest tests.
- `scripts/`: Helper scripts (currently Figma token tooling).

## Setup and common commands

### Docker (recommended for full stack)

```bash
docker compose up -d
docker compose logs -f web
docker compose down
```

`docker compose down -v` removes database and Redis volumes.

### Local Python environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
python manage.py migrate
python manage.py runserver
```

Use `python manage.py ...` for Django management commands. The `minglemap` console script is a stub and does not run the Django server.

### Frontend (optional)

```bash
cd frontend
npm install
npm run dev
```

### Tests and formatting

```bash
pytest
ruff check .
ruff format .
pre-commit run --all-files
```

### Documentation

```bash
cd docs
make html
```

## Development conventions

- Add or update Django migrations for model changes.
- Keep API changes and serializers in `apps/core/serializers.py` unless a new app is warranted.
- Add tests in `apps/*/tests.py` or `tests/` and keep them focused on behavior.
- Prefer small, reviewable PRs; ask before large refactors or architecture shifts.
- Align Python changes with Ruff formatting and linting rules in `pyproject.toml`.

## Documentation standards (required)

When generating or updating documentation (`README.md`, `CONTRIBUTING.md`, `docs/*`, `RUNBOOK.md`):

> [!IMPORTANT]
> Human-facing documentation MUST use GitHub Markdown alert callouts where they materially improve safety, clarity, or skimmability.

### GitHub Markdown alert syntax

Use alerts only in this format:

> [!TYPE]
> Message text

Allowed types:

- NOTE
- TIP
- IMPORTANT
- WARNING
- CAUTION

Do NOT use emojis, HTML, custom admonition syntax, or nested alerts.

### When to use each alert type

> [!NOTE]
> Background context, assumptions, or clarifications for skimmers.

> [!TIP]
> Best practices, shortcuts, recommended workflows, or performance hints.

> [!IMPORTANT]
> Required steps, invariants, prerequisites, or "must do" rules.

> [!WARNING]
> Actions that can break builds, security posture, compatibility, or environments.

> [!CAUTION]
> Irreversible or destructive actions (delete data, rotate keys, migrate schema).

### Placement and structure

- Place alerts immediately before the instruction or section they apply to.
- Do NOT nest alerts inside lists or code blocks.
- Keep alert text short (1 to 3 lines). Put detail in normal prose below.

### Avoid alert inflation

> [!CAUTION]
> Overuse of alerts makes documentation worse. Use alerts only where a reader could plausibly make a costly mistake.

As a rule of thumb:

- 0 to 2 alerts per section is typical
- Prefer normal prose for non-critical info

## Modernization policy for existing docs

> [!NOTE]
> Some docs predate these standards.

When editing existing documentation:

- Apply alert syntax opportunistically where it materially improves safety or clarity.
- Do NOT refactor large sections solely to add alerts.
- Do NOT change meaning or tone unless required to correct inaccuracies.

## Documentation completion check (required)

Before finalizing doc changes:

- Destructive steps have WARNING or CAUTION callouts
- Prereqs are surfaced via IMPORTANT
- Non-obvious gotchas are surfaced via NOTE or WARNING
- Alerts are not overused
