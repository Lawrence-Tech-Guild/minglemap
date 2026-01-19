/// <reference types="vite/client" />
import { FormEvent, useEffect, useMemo, useState } from 'react';

type Event = {
  id: number;
  title: string;
  location: string;
  starts_at: string;
  ends_at: string;
  description?: string;
  estimated_attendance?: number | null;
  signup_opens_at?: string | null;
  signup_closes_at?: string | null;
};

type DirectoryEntry = {
  attendance_id: number;
  connection_intent: string;
  profile: { id: number; name: string; interests: string };
};

type EventVisibility = {
  consent: boolean;
  visible: boolean;
};

type EventAttendanceState = {
  attendanceId: number;
  visibility: EventVisibility;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  };
  const response = await fetch(url, { ...init, headers });
  const data = await response.json();
  if (!response.ok) {
    const detail = (data && (data.detail || data.non_field_errors)) ?? response.statusText;
    throw new Error(Array.isArray(detail) ? detail.join(', ') : detail);
  }
  return data;
}

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [attendanceId, setAttendanceId] = useState<number | null>(null);
  const [eventAttendance, setEventAttendance] = useState<Record<number, EventAttendanceState>>({});

  const [signupForm, setSignupForm] = useState({
    name: '',
    company: '',
    role: '',
    bio: '',
    interests: '',
    interestAreas: '',
    connectionIntent: '',
    consent: false,
  });
  const [eventForm, setEventForm] = useState({
    title: '',
    location: '',
    startsAt: '',
    endsAt: '',
    description: '',
    estimatedAttendance: '',
    signupOpensAt: '',
    signupClosesAt: '',
  });
  const [directoryFilters, setDirectoryFilters] = useState({
    search: '',
    interests: '',
    connectionIntent: '',
  });
  const [visibility, setVisibility] = useState<EventVisibility>({ consent: false, visible: false });
  const [directoryEntries, setDirectoryEntries] = useState<DirectoryEntry[]>([]);
  const [feedback, setFeedback] = useState({
    rating: '',
    message: '',
    contact: '',
  });
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId]
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJson<Event[]>('/api/events/');
        setEvents(data);
        if (data.length) {
          setSelectedEventId(data[0].id);
        }
      } catch (err) {
        setError((err as Error).message);
      }
    })();
  }, []);

  function resetMessages() {
    setToast(null);
    setError(null);
  }

  function toIsoDateTime(value: string) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  async function handleCreateEvent(formEvent: FormEvent) {
    formEvent.preventDefault();
    resetMessages();
    setLoading('create-event');
    try {
      const payload = {
        title: eventForm.title,
        location: eventForm.location,
        starts_at: toIsoDateTime(eventForm.startsAt),
        ends_at: toIsoDateTime(eventForm.endsAt),
        description: eventForm.description || '',
        estimated_attendance: eventForm.estimatedAttendance
          ? Number(eventForm.estimatedAttendance)
          : null,
        signup_opens_at: toIsoDateTime(eventForm.signupOpensAt),
        signup_closes_at: toIsoDateTime(eventForm.signupClosesAt),
      };
      const data = await fetchJson<Event>('/api/events/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setEvents((prev) => [data, ...prev]);
      setSelectedEventId(data.id);
      setAttendanceId(null);
      setVisibility({ consent: false, visible: false });
      setDirectoryEntries([]);
      setDirectoryFilters({ search: '', interests: '', connectionIntent: '' });
      setSignupForm((prev) => ({ ...prev, consent: false }));
      setEventForm({
        title: '',
        location: '',
        startsAt: '',
        endsAt: '',
        description: '',
        estimatedAttendance: '',
        signupOpensAt: '',
        signupClosesAt: '',
      });
      setToast('Event created. Now invite attendees to sign up.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(null);
    }
  }

  async function handleSignup(formEvent: FormEvent) {
    formEvent.preventDefault();
    resetMessages();
    if (!selectedEventId) return;
    setLoading('signup');
    try {
      const payload = {
        profile: {
          name: signupForm.name,
          company: signupForm.company,
          role: signupForm.role,
          bio: signupForm.bio,
          interests: signupForm.interests,
        },
        interest_areas: signupForm.interestAreas,
        connection_intent: signupForm.connectionIntent,
        consent_to_share_profile: signupForm.consent,
      };
      const data = await fetchJson<{
        id: number;
        consent_to_share_profile: boolean;
        visible_in_directory: boolean;
      }>(
        `/api/events/${selectedEventId}/signups/`,
        { method: 'POST', body: JSON.stringify(payload) }
      );
      const nextVisibility = {
        consent: data.consent_to_share_profile ?? signupForm.consent,
        visible: data.visible_in_directory ?? signupForm.consent,
      };
      setAttendanceId(data.id);
      setVisibility(nextVisibility);
      setEventAttendance((prev) => ({
        ...prev,
        [selectedEventId]: { attendanceId: data.id, visibility: nextVisibility },
      }));
      setToast('Signup saved. Use the directory and visibility controls below.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(null);
    }
  }

  async function loadDirectory(formEvent?: FormEvent) {
    formEvent?.preventDefault();
    resetMessages();
    if (!selectedEventId || !attendanceId) {
      setError('Sign up first to browse the directory.');
      return;
    }
    setLoading('directory');
    const params = new URLSearchParams({
      attendance_id: String(attendanceId),
    });
    if (directoryFilters.search) params.set('search', directoryFilters.search);
    if (directoryFilters.interests) params.set('interests', directoryFilters.interests);
    if (directoryFilters.connectionIntent)
      params.set('connection_intent', directoryFilters.connectionIntent);
    try {
      const data = await fetchJson<DirectoryEntry[]>(
        `/api/events/${selectedEventId}/directory/?${params.toString()}`
      );
      setDirectoryEntries(data);
      setToast(`Directory loaded (${data.length} people).`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(null);
    }
  }

  async function handleVisibility(formEvent: FormEvent) {
    formEvent.preventDefault();
    resetMessages();
    if (!selectedEventId || !attendanceId) {
      setError('Sign up first to manage visibility.');
      return;
    }
    setLoading('visibility');
    try {
      const data = await fetchJson<{
        id: number;
        consent_to_share_profile: boolean;
        visible_in_directory: boolean;
      }>(`/api/events/${selectedEventId}/directory/visibility/`, {
        method: 'PATCH',
        body: JSON.stringify({
          attendance_id: attendanceId,
          consent_to_share_profile: visibility.consent,
          visible_in_directory: visibility.visible,
        }),
      });
      const nextVisibility = {
        consent: data.consent_to_share_profile,
        visible: data.visible_in_directory,
      };
      setVisibility(nextVisibility);
      setEventAttendance((prev) => ({
        ...prev,
        [selectedEventId]: { attendanceId, visibility: nextVisibility },
      }));
      setToast('Visibility updated.');
      await loadDirectory();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(null);
    }
  }

  async function handleFeedback(formEvent: FormEvent) {
    formEvent.preventDefault();
    resetMessages();
    if (!selectedEventId) {
      setError('Select an event to leave feedback.');
      return;
    }
    setLoading('feedback');
    try {
      await fetchJson(`/api/events/${selectedEventId}/feedback/`, {
        method: 'POST',
        body: JSON.stringify({
          attendance: attendanceId ?? undefined,
          rating: feedback.rating ? Number(feedback.rating) : undefined,
          message: feedback.message,
          contact: feedback.contact,
        }),
      });
      setToast('Feedback submitted. Thank you!');
      setFeedback({ rating: '', message: '', contact: '' });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(null);
    }
  }

  const hasSignup = Boolean(attendanceId);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_900px_at_10%_-10%,rgba(242,140,75,0.25),transparent_60%),radial-gradient(1200px_900px_at_100%_0%,rgba(46,107,82,0.22),transparent_55%),linear-gradient(180deg,#f6efe5_0%,#efe4d7_60%,#f6efe5_100%)]">
      <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sand shadow-lg shadow-sun/30">
            <span className="font-display text-lg">MM</span>
          </div>
          <div>
            <p className="font-display text-xl">MingleMap MVP</p>
            <p className="text-xs text-slate">
              Demo path: event creation → signup → visibility → directory → feedback
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-white/70 px-3 py-1 text-ink shadow">Privacy-first</span>
          <span className="rounded-full bg-moss/15 px-3 py-1 text-moss shadow">Consent gated</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 pb-16">
        {(toast || error) && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm shadow ${
              error ? 'border-rose/40 bg-rose/10 text-rose' : 'border-moss/40 bg-moss/10 text-moss'
            }`}
          >
            {error || toast}
          </div>
        )}

        <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate">Step 1</p>
              <h2 className="font-display text-2xl">Create a new event</h2>
              <p className="text-sm text-slate">
                Capture the basics to generate an event for signups and the attendee directory.
              </p>
            </div>
          </div>
          <form onSubmit={handleCreateEvent} className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              required
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              placeholder="Event title"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
            />
            <input
              required
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              placeholder="Location"
              value={eventForm.location}
              onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
            />
            <input
              required
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              type="datetime-local"
              value={eventForm.startsAt}
              onChange={(e) => setEventForm({ ...eventForm, startsAt: e.target.value })}
            />
            <input
              required
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              type="datetime-local"
              value={eventForm.endsAt}
              onChange={(e) => setEventForm({ ...eventForm, endsAt: e.target.value })}
            />
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              placeholder="Estimated attendance"
              type="number"
              min="0"
              value={eventForm.estimatedAttendance}
              onChange={(e) =>
                setEventForm({ ...eventForm, estimatedAttendance: e.target.value })
              }
            />
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              placeholder="Signup opens"
              type="datetime-local"
              value={eventForm.signupOpensAt}
              onChange={(e) => setEventForm({ ...eventForm, signupOpensAt: e.target.value })}
            />
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              placeholder="Signup closes"
              type="datetime-local"
              value={eventForm.signupClosesAt}
              onChange={(e) => setEventForm({ ...eventForm, signupClosesAt: e.target.value })}
            />
            <textarea
              className="md:col-span-2 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              placeholder="Short description"
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
            />
            <button
              type="submit"
              disabled={loading === 'create-event'}
              className="md:col-span-2 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-sand shadow-lg shadow-ink/20 transition hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading === 'create-event' ? 'Creating…' : 'Create event'}
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate">Step 2</p>
              <h2 className="font-display text-2xl">Choose an event</h2>
              <p className="text-sm text-slate">This drives signups, directory lookup, and feedback routing.</p>
            </div>
            <div className="text-right text-xs text-slate">
              {selectedEvent && (
                <p>
                  {new Date(selectedEvent.starts_at).toLocaleDateString()} — {selectedEvent.location}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm sm:w-72"
              value={selectedEventId ?? ''}
              onChange={(e) => {
                const nextEventId = Number(e.target.value);
                const cached = eventAttendance[nextEventId];
                setSelectedEventId(nextEventId);
                setAttendanceId(cached?.attendanceId ?? null);
                setVisibility(cached?.visibility ?? { consent: false, visible: false });
                setSignupForm((prev) => ({
                  ...prev,
                  consent: cached?.visibility.consent ?? false,
                }));
                setDirectoryFilters({ search: '', interests: '', connectionIntent: '' });
                setDirectoryEntries([]);
              }}
            >
              <option value="" disabled>
                Select an event
              </option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            {selectedEvent?.description && (
              <p className="rounded-2xl bg-mist px-4 py-3 text-sm text-slate">{selectedEvent.description}</p>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSignup}
            className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-slate">Step 3</p>
            <h3 className="mt-2 font-display text-xl">Sign up with consent</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input
                required
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
                placeholder="Name"
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
              />
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
                placeholder="Company"
                value={signupForm.company}
                onChange={(e) => setSignupForm({ ...signupForm, company: e.target.value })}
              />
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
                placeholder="Role"
                value={signupForm.role}
                onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value })}
              />
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
                placeholder="Interests (comma separated)"
                value={signupForm.interests}
                onChange={(e) => setSignupForm({ ...signupForm, interests: e.target.value })}
              />
            </div>
            <textarea
              className="mt-4 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              placeholder="Short bio (optional)"
              value={signupForm.bio}
              onChange={(e) => setSignupForm({ ...signupForm, bio: e.target.value })}
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
                placeholder="Interest areas (internal)"
                value={signupForm.interestAreas}
                onChange={(e) => setSignupForm({ ...signupForm, interestAreas: e.target.value })}
              />
              <input
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
                placeholder="Connection intent (visible)"
                value={signupForm.connectionIntent}
                onChange={(e) => setSignupForm({ ...signupForm, connectionIntent: e.target.value })}
              />
            </div>
            <label className="mt-4 flex items-start gap-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={signupForm.consent}
                onChange={(e) => setSignupForm({ ...signupForm, consent: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-ink/20"
              />
              <span>
                I consent to share my profile with other attendees of this event. This is event-specific and can be
                changed anytime in visibility settings.
              </span>
            </label>
            <button
              type="submit"
              disabled={loading === 'signup'}
              className="mt-5 w-full rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-sand shadow-lg shadow-ink/20 transition hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading === 'signup' ? 'Submitting…' : 'Submit signup'}
            </button>
          </form>

          <form
            onSubmit={handleVisibility}
            className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-slate">Step 4</p>
            <h3 className="mt-2 font-display text-xl">Visibility + consent toggles</h3>
            <p className="mt-2 text-sm text-slate">
              These settings apply only to the selected event. Consent is required to browse or appear in this
              event's directory.
            </p>
            {!hasSignup && (
              <p className="mt-3 rounded-2xl border border-dashed border-ink/20 bg-white/60 px-4 py-3 text-xs text-slate">
                Sign up for this event to unlock visibility controls.
              </p>
            )}
            <div className="mt-4 space-y-3 text-sm">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={visibility.consent}
                  disabled={!hasSignup}
                  onChange={(e) =>
                    setVisibility((prev) => ({
                      consent: e.target.checked,
                      visible: e.target.checked ? prev.visible : false,
                    }))
                  }
                  className="h-4 w-4 rounded border-ink/20"
                />
                <span>Consent to share my profile for this event</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={visibility.visible}
                  disabled={!visibility.consent || !hasSignup}
                  onChange={(e) => setVisibility((prev) => ({ ...prev, visible: e.target.checked }))}
                  className="h-4 w-4 rounded border-ink/20"
                />
                <span>Show me in this event's attendee directory</span>
              </label>
            </div>
            <button
              type="submit"
              disabled={loading === 'visibility' || !hasSignup}
              className="mt-5 w-full rounded-2xl bg-moss px-5 py-3 text-sm font-semibold text-sand shadow-lg shadow-moss/30 transition hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading === 'visibility' ? 'Saving…' : 'Save visibility'}
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate">Step 5</p>
              <h3 className="font-display text-xl">Browse the directory</h3>
              <p className="text-sm text-slate">Search by name, interests, or connection intent.</p>
            </div>
            <button
              onClick={loadDirectory}
              disabled={loading === 'directory'}
              className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-sand shadow-lg shadow-ink/20 transition hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading === 'directory' ? 'Loading…' : 'Load directory'}
            </button>
          </div>
          <form onSubmit={loadDirectory} className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              placeholder="Search name or intent"
              value={directoryFilters.search}
              onChange={(e) => setDirectoryFilters({ ...directoryFilters, search: e.target.value })}
            />
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              placeholder="Interests filter"
              value={directoryFilters.interests}
              onChange={(e) => setDirectoryFilters({ ...directoryFilters, interests: e.target.value })}
            />
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              placeholder="Connection intent filter"
              value={directoryFilters.connectionIntent}
              onChange={(e) =>
                setDirectoryFilters({ ...directoryFilters, connectionIntent: e.target.value })
              }
            />
          </form>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {directoryEntries.map((entry) => (
              <article
                key={entry.attendance_id}
                className="rounded-2xl border border-ink/10 bg-white px-4 py-4 shadow-sm"
              >
                <p className="font-display text-lg">{entry.profile.name}</p>
                <p className="mt-1 text-sm text-slate">{entry.profile.interests || 'No interests shared'}</p>
                <p className="mt-2 text-sm text-ink">
                  <span className="font-semibold">Intent:</span> {entry.connection_intent || 'Not specified'}
                </p>
              </article>
            ))}
            {!directoryEntries.length && (
              <div className="rounded-2xl border border-dashed border-ink/15 bg-white/40 px-4 py-5 text-sm text-slate">
                No attendees yet. Load the directory after opting in.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl">
          <p className="text-xs uppercase tracking-[0.25em] text-slate">Step 6</p>
          <h3 className="mt-2 font-display text-xl">Capture feedback from the demo</h3>
          <form onSubmit={handleFeedback} className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              placeholder="Rating (1-5)"
              value={feedback.rating}
              onChange={(e) => setFeedback({ ...feedback, rating: e.target.value })}
              type="number"
              min="1"
              max="5"
            />
            <input
              className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              placeholder="Contact (optional)"
              value={feedback.contact}
              onChange={(e) => setFeedback({ ...feedback, contact: e.target.value })}
            />
            <textarea
              className="md:col-span-3 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm"
              placeholder="What worked? What should change?"
              value={feedback.message}
              onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loading === 'feedback'}
              className="md:col-span-3 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-sand shadow-lg shadow-ink/20 transition hover:-translate-y-0.5 disabled:opacity-50"
            >
      {loading === 'feedback' ? 'Submitting…' : 'Submit feedback'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
