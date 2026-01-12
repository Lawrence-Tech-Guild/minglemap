# Event Signup + Attendee Directory Wireframes (Phase 1)

> [!NOTE]
> These wireframes are low-fidelity layouts for structure and content only.

## Event signup (desktop)

+------------------------------------------------------------------+
| Event signup                                                     |
| Event: MingleMap Launch Meetup | Wed, May 22, 6-9pm               |
| Location: Hall B               | Signup window: Open             |
+------------------------------------------------------------------+
| Your name *                    [______________________________]  |
| Interests                      [______________________________]  |
| Interest areas                 [______________________________]  |
| Connection intent              [______________________________]  |
|                                                                  |
| [ ] Share my profile in attendee directory (opt-in)              |
|     You can change this later in the directory.                  |
|                                                                  |
| [Submit signup]                                                  |
+------------------------------------------------------------------+

Notes:
- Required field is marked with *.
- Interest areas power filtering in the directory.
- Consent is optional and defaults to off.

## Event signup (mobile)

+------------------------------+
| Event signup                 |
| MingleMap Launch Meetup      |
| Wed, May 22, 6-9pm            |
| Hall B                       |
+------------------------------+
| Name *                       |
| [__________________________] |
| Interests                    |
| [__________________________] |
| Interest areas               |
| [__________________________] |
| Connection intent            |
| [__________________________] |
| [ ] Share my profile         |
| [Submit signup]              |
+------------------------------+

## Signup success / closed state

Success:
+---------------------------------------------+
| You are signed up!                          |
| We will show your profile only if you opt-in|
| [Go to attendee directory]                  |
+---------------------------------------------+

Closed:
+---------------------------------------------+
| Signups are closed for this event.          |
| Contact the host for help.                  |
| [Back to event details]                     |
+---------------------------------------------+

## Field mapping to API

| UI field | Request JSON |
| --- | --- |
| Name | profile.name |
| Interests | profile.interests |
| Interest areas | interest_areas |
| Connection intent | connection_intent |
| Share my profile | consent_to_share_profile |

> [!IMPORTANT]
> The attendee directory must only show profiles with consent_to_share_profile=true, and should be blocked for users who are not signed up.

## Attendee directory (desktop)

+------------------------------------------------------------------+
| Attendee directory                                               |
| Search [__________________]  Filters [Interest area v] [Intent v]|
| Your visibility: ON [toggle]                                     |
+------------------------------------------------------------------+
| Ada Lovelace                                                     |
| Interests: mentorship, compilers                                 |
| Intent: meet mentors or hiring managers          [View profile]  |
|------------------------------------------------------------------|
| Grace Hopper                                                     |
| Interests: leadership, systems                                   |
| Intent: find collaborators                       [View profile]  |
+------------------------------------------------------------------+

Empty state:
+--------------------------------------------------------------+
| No matches yet. Try removing filters.                        |
+--------------------------------------------------------------+

## Attendee profile (mobile)

+------------------------------+
| Ada Lovelace                 |
| Interests                    |
| mentorship, compilers        |
| Connection intent            |
| meet mentors or hiring mgrs  |
| [Back to list]               |
+------------------------------+
