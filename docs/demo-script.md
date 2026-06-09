# MingleMap Demo Script (repeatable)

This script walks through the seeded demo event from a clean checkout to collecting feedback, so you can rehearse or run live demos without ad‑hoc setup.

> [!IMPORTANT]
> Use a clean SQLite DB for demos. Run migrations, then load the demo fixture before you start the servers.

## 1) Prepare the environment

```bash
python manage.py migrate
python manage.py loaddata apps/core/fixtures/demo.json
```

> [!WARNING]
> `python manage.py flush` wipes all data. Use it only if you need a fully fresh database before reloading the fixture.

If you prefer Docker, start the stack first (`docker compose up -d`) and then run the same commands inside the `web` container.

## 2) Start the app

- Backend: `python manage.py runserver`
- Frontend: `cd frontend && npm install && npm run dev`

> [!NOTE]
> The Vite dev server defaults to http://localhost:5173 and proxies API calls to the backend at http://localhost:8000.

## 3) Demo flow (script)

1) Open the frontend and pick **“MingleMap Demo Day”** (seeded event).
2) **Sign up** as yourself (or reuse the demo host details). Check the consent box so you can browse and appear in the directory.
3) Open **Visibility + consent toggles** and show that consent is required before appearing in the directory.
4) Click **Load directory**. Point out seeded attendees and use filters:
   - Search “accessibility” → shows Bianca.
   - Filter connection intent “collaborators” → shows Carlos.
   - Note that Gus exists but is hidden because visibility is off.
5) Flip your visibility off, reload the directory, and confirm you disappear.
6) Submit **feedback** (rating optional). Show that submissions work with or without an attendance ID.

## 4) Reset between runs

If you need to reset to the seed state:

```bash
rm -f db.sqlite3
python manage.py migrate
python manage.py loaddata apps/core/fixtures/demo.json
```

This keeps IDs stable so the demo path and filters remain predictable.
