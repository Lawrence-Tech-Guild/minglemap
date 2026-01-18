const events = [
  {
    id: 'event-1',
    title: 'MingleMap Launch Salon',
    date: 'Oct 12, 2025',
    location: 'Ferry Building, SF',
    focus: 'Founder matchmaking',
    seatsLeft: 12,
  },
  {
    id: 'event-2',
    title: 'Designers and Operators',
    date: 'Oct 28, 2025',
    location: 'Mission Bay, SF',
    focus: 'Ops-led networking',
    seatsLeft: 6,
  },
  {
    id: 'event-3',
    title: 'AI Builders Open Studio',
    date: 'Nov 7, 2025',
    location: 'SoMa, SF',
    focus: 'Hands-on demos',
    seatsLeft: 20,
  },
  {
    id: 'event-4',
    title: 'Community Stewards Night',
    date: 'Nov 19, 2025',
    location: 'Berkeley, CA',
    focus: 'Local ecosystems',
    seatsLeft: 9,
  },
];

const attendees = [
  {
    id: 'attendee-1',
    name: 'Priya N.',
    role: 'Product Lead',
    company: 'Signal Grove',
    interests: ['Accessibility', 'Community', 'Fintech'],
    intent: 'Looking to mentor',
    status: 'Event-only visibility',
  },
  {
    id: 'attendee-2',
    name: 'Andre L.',
    role: 'Founder',
    company: 'Magnetic',
    interests: ['Climate', 'Hardware', 'Policy'],
    intent: 'Seeking co-founder',
    status: 'Full profile shared',
  },
  {
    id: 'attendee-3',
    name: 'Maya R.',
    role: 'Growth',
    company: 'Openline',
    interests: ['Creator economy', 'B2B', 'Events'],
    intent: 'Hiring soon',
    status: 'Event-only visibility',
  },
  {
    id: 'attendee-4',
    name: 'Jonas K.',
    role: 'Researcher',
    company: 'Sable Labs',
    interests: ['AI safety', 'ML Ops', 'Ethics'],
    intent: 'Open to collabs',
    status: 'Full profile shared',
  },
  {
    id: 'attendee-5',
    name: 'Sasha M.',
    role: 'Community',
    company: 'Harbor Collective',
    interests: ['DEI', 'Local makers', 'Workshops'],
    intent: 'Looking to host',
    status: 'Event-only visibility',
  },
  {
    id: 'attendee-6',
    name: 'Leo C.',
    role: 'Engineer',
    company: 'Pioneer',
    interests: ['Infra', 'Dev tools', 'Open source'],
    intent: 'Open to mentor',
    status: 'Full profile shared',
  },
];

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_900px_at_10%_-10%,rgba(242,140,75,0.25),transparent_60%),radial-gradient(1200px_900px_at_100%_0%,rgba(46,107,82,0.22),transparent_55%),linear-gradient(180deg,#f6efe5_0%,#efe4d7_60%,#f6efe5_100%)]">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-sand shadow-lg shadow-sun/30">
            <span className="font-display text-lg">MM</span>
          </div>
          <div>
            <p className="font-display text-xl">MingleMap</p>
            <p className="text-sm text-slate">Sprint 1 demo surface</p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <button className="rounded-full border border-ink/15 bg-white/70 px-4 py-2 text-ink transition hover:-translate-y-0.5 hover:bg-white">
            Events
          </button>
          <button className="rounded-full border border-ink/15 bg-white/70 px-4 py-2 text-ink transition hover:-translate-y-0.5 hover:bg-white">
            Attendees
          </button>
          <button className="rounded-full bg-ink px-5 py-2 text-sand shadow-lg shadow-ink/20 transition hover:-translate-y-0.5">
            Start signup
          </button>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            <p className="text-xs uppercase tracking-[0.3em] text-slate">Phase 1 core</p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Make event matchmaking feel human again.
            </h1>
            <p className="mt-4 text-lg text-slate">
              A functional demo surface for event listing, signup, and attendee browsing with consent-first
              visibility.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full bg-ink px-6 py-3 text-sand shadow-lg shadow-ink/30 transition hover:-translate-y-0.5">
                Publish an event
              </button>
              <button className="rounded-full border border-ink/15 bg-white/80 px-6 py-3 text-ink transition hover:-translate-y-0.5 hover:bg-white">
                View directory
              </button>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Events live', value: '4', detail: 'Oct-Nov window' },
                { label: 'Attendees', value: '128', detail: 'Consent gated' },
                { label: 'Matches', value: '43', detail: 'Suggested' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-slate">{stat.label}</p>
                  <p className="mt-2 font-display text-2xl">{stat.value}</p>
                  <p className="text-sm text-slate">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-up-delay rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Next event</h2>
              <span className="rounded-full bg-rose/15 px-3 py-1 text-xs font-semibold text-rose">
                Seats closing
              </span>
            </div>
            <div className="mt-4 rounded-2xl bg-mist p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate">MingleMap Launch Salon</p>
              <p className="mt-2 font-display text-2xl">Ferry Building, SF</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate">
                <span>Oct 12, 2025</span>
                <span>•</span>
                <span>Founder matchmaking</span>
              </div>
            </div>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white px-4 py-3">
                <span>Privacy-first visibility</span>
                <span className="font-semibold text-moss">Enabled</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white px-4 py-3">
                <span>Check-in roster</span>
                <span className="font-semibold text-sun">Draft</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white px-4 py-3">
                <span>Intro queue</span>
                <span className="font-semibold text-rose">5 requests</span>
              </div>
            </div>
            <button className="mt-6 w-full rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-sand shadow-lg shadow-ink/20 transition hover:-translate-y-0.5">
              Open signup dashboard
            </button>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate">Event listing</p>
              <h2 className="mt-2 font-display text-3xl">Upcoming events</h2>
            </div>
            <button className="rounded-full border border-ink/15 bg-white/70 px-5 py-2 text-sm text-ink transition hover:-translate-y-0.5">
              Create new event
            </button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <article
                key={event.id}
                className="group rounded-3xl border border-white/80 bg-white/80 p-6 shadow-lg transition hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate">{event.date}</p>
                    <h3 className="mt-2 font-display text-2xl">{event.title}</h3>
                  </div>
                  <span className="rounded-full bg-sun/15 px-3 py-1 text-xs font-semibold text-sun">
                    {event.seatsLeft} seats left
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate">{event.location}</p>
                <p className="mt-4 text-sm text-slate">{event.focus}</p>
                <div className="mt-6 flex items-center justify-between text-sm">
                  <span className="text-slate">Signup flow ready</span>
                  <button className="rounded-full bg-ink/90 px-4 py-2 text-sand transition group-hover:bg-ink">
                    View details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-lg">
            <p className="text-xs uppercase tracking-[0.25em] text-slate">Event signup</p>
            <h2 className="mt-2 font-display text-3xl">Attendee profile intake</h2>
            <form className="mt-6 grid gap-4">
              <div>
                <label className="text-sm text-slate">Full name</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm focus:border-ink/30 focus:outline-none"
                  placeholder="Taylor James"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-slate">Role</label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm focus:border-ink/30 focus:outline-none"
                    placeholder="Founder"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate">Company</label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm focus:border-ink/30 focus:outline-none"
                    placeholder="MingleMap"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate">Interests</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm focus:border-ink/30 focus:outline-none"
                  placeholder="Community, AI builders, Partnerships"
                />
              </div>
              <div>
                <label className="text-sm text-slate">Connection intent</label>
                <select className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm shadow-sm focus:border-ink/30 focus:outline-none">
                  <option>Meet collaborators</option>
                  <option>Find mentors</option>
                  <option>Hiring</option>
                  <option>Looking to host</option>
                </select>
              </div>
              <button className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-sand shadow-lg shadow-ink/20 transition hover:-translate-y-0.5">
                Save profile and continue
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-lg">
              <p className="text-xs uppercase tracking-[0.25em] text-slate">Consent gating</p>
              <h3 className="mt-2 font-display text-2xl">Visibility controls</h3>
              <div className="mt-5 space-y-4 text-sm text-slate">
                {[
                  {
                    title: 'Event-only visibility',
                    detail: 'Your profile is visible to attendees of this event only.',
                    checked: true,
                  },
                  {
                    title: 'Share contact intent',
                    detail: 'Signal interest in introductions without sharing contact details.',
                    checked: true,
                  },
                  {
                    title: 'Full profile to hosts',
                    detail: 'Event hosts can see your role, company, and interests.',
                    checked: false,
                  },
                ].map((option) => (
                  <label key={option.title} className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3">
                    <input
                      type="checkbox"
                      defaultChecked={option.checked}
                      className="mt-1 h-4 w-4 accent-ink"
                    />
                    <span>
                      <span className="block font-semibold text-ink">{option.title}</span>
                      <span className="text-sm text-slate">{option.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-lg">
              <p className="text-xs uppercase tracking-[0.25em] text-slate">Preview</p>
              <h3 className="mt-2 font-display text-2xl">Attendee card</h3>
              <div className="mt-4 rounded-2xl border border-ink/10 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-xl">Taylor James</p>
                    <p className="text-sm text-slate">Founder · MingleMap</p>
                  </div>
                  <span className="rounded-full bg-moss/15 px-3 py-1 text-xs font-semibold text-moss">
                    Event-only
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate">
                  {['Community', 'AI builders', 'Partnerships'].map((tag) => (
                    <span key={tag} className="rounded-full bg-sand px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate">Intent: Meet collaborators</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate">Attendee directory</p>
              <h2 className="mt-2 font-display text-3xl">Browse who is coming</h2>
            </div>
            <button className="rounded-full border border-ink/15 bg-white/70 px-5 py-2 text-sm text-ink transition hover:-translate-y-0.5">
              Export roster
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <input
              className="min-w-[220px] flex-1 rounded-full border border-ink/10 bg-white px-5 py-3 text-sm shadow-sm focus:border-ink/30 focus:outline-none"
              placeholder="Search by name or interest"
            />
            <select className="rounded-full border border-ink/10 bg-white px-5 py-3 text-sm shadow-sm focus:border-ink/30 focus:outline-none">
              <option>All intents</option>
              <option>Meet collaborators</option>
              <option>Hiring</option>
              <option>Looking to mentor</option>
            </select>
            <button className="rounded-full bg-ink px-5 py-3 text-sm text-sand shadow-lg shadow-ink/20 transition hover:-translate-y-0.5">
              Apply filters
            </button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {attendees.map((attendee) => (
              <article key={attendee.id} className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl">{attendee.name}</p>
                    <p className="text-sm text-slate">
                      {attendee.role} · {attendee.company}
                    </p>
                  </div>
                  <span className="rounded-full bg-moss/15 px-3 py-1 text-xs font-semibold text-moss">
                    {attendee.intent}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate">
                  {attendee.interests.map((interest) => (
                    <span key={interest} className="rounded-full bg-sand px-3 py-1">
                      {interest}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate">
                  <span>{attendee.status}</span>
                  <button className="rounded-full border border-ink/10 bg-white px-3 py-1 text-ink">
                    Request intro
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-slate">
          <p>Demo surface for Sprint 1 UI scope.</p>
          <div className="flex items-center gap-4">
            <span>Privacy-first</span>
            <span>•</span>
            <span>Consent gated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
