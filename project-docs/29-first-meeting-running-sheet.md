# 29. First client meeting: the running sheet

**Written 8 August 2026** for a sixty-minute meeting, Mark and Jalen only, date not yet set.
The client's copy is `30-first-meeting-agenda.pdf`, which carries none of the notes below.

What this meeting is: the full walkthrough with his reactions captured on paper, and
kulenterprises.com pointed at the new site with quote delivery switched on before the hour
ends. What it is not: no CMS (the training is its own contracted session, scheduled at the
wrap), no money, and no mention of the rebuilt opening film. That cut stays private until
it is ready.

---

## Before the meeting, all of it

- Push main and watch the Vercel deploy go green. Pushing is shipping.
- Dry-run the whole demo path in a fresh browser window: the film plays on arrival at
  Home, search opens and "refrigerated" finds the Reefer page, the quote form walks to its
  last step, the Journey scrolls clean top to bottom. Keep the demo tab in the foreground
  the entire meeting; a backgrounded tab throttles animations and makes healthy work look
  broken.
- Check the Vercel project environment for `RESEND_API_KEY`. Doc 25 recorded it unset on
  2 August. If that has changed since, the Resend half of block three collapses to just
  the live test.
- Log into Vercel yourself and open the project's Domains settings before he is watching,
  so the screen he sees first is the right one.
- Print three things: this sheet, the agenda PDF, and the doc 19 shot list to hand him.
- Phone charged, live site loaded on it, for the mobile beat at the end of the walkthrough.

## Shape of the hour

| Clock | Block | Minutes |
|---|---|---|
| 0:00 | Open | 3 |
| 0:03 | Walkthrough, feedback on everything | 32 |
| 0:35 | Domain and delivery, live | 15 |
| 0:50 | His three sittings | 8 |
| 0:58 | Wrap | 2 |

If a block runs over, the walkthrough gives up minutes, never the domain block. The
walkthrough can finish over the phone tomorrow; the DNS cannot.

## Open, three minutes

- Where it stands in one breath: the site is live at kul-enterprises.vercel.app,
  twenty-two pages, every word of it editable, search shipped this week. Today it becomes
  reachable at his own address and starts delivering leads.
- Set the rule of the hour: every reaction gets written down, and nothing is final until
  he has seen it and said so.

## The walkthrough, thirty-two minutes

One line per stop in the capture table at the end. His words verbatim; decide later, not
in the room.

| Min | Stop | The beat |
|---|---|---|
| 4 | **Home**, fresh window | The film plays on arrival; let it run without narrating over it. Then Home slowly, top to bottom. Point out the nav gathering on scroll and the search circle taking the corner. |
| 1 | **Search** | Open it, type "refrigerated", let it find the Reefer page by itself. |
| 4 | **Services** | The image-led grid, then one service page all the way down (Reefer, or whichever he picks). Note that all seven have their own page. |
| 2 | **Safety** | The dashcam rain footage standing where a rating would be claimed. The page asks to be judged on policy and shows the conditions instead. |
| 3 | **Carrier Packet** | The record grid and the one-sentence request form. It deliberately states no turnaround; that commitment is his, in block four. |
| 2 | **Quote** | Walk the form to the end, do not submit. Say plainly: delivery switches on in twenty minutes, in this meeting. |
| 1 | **Contact** | The map and the three ways in. |
| 2 | **Drivers** | The seat that opens with truck two, recruited honestly. |
| 4 | **About** | His statement in his own words, the headshot, the film beside the miles, the imprint at the foot. |
| 6 | **The Journey** | Enter from the nav so the five acts show. He has reviewed this page more than any other; this pass is confirmation, not premiere. Do not scroll-race it. Let the pause after "We never went back." land. |
| 1 | **Road Ahead** | The one page with no imagery on purpose. |
| 2 | **Edges** | Type a wrong address for the 404. Then hand him the phone with the site loaded and let him thumb Home and one service page himself. The legal pages get a sentence, not a tour. |

## Domain and delivery, fifteen minutes

The one block that cannot slip. He owns kulenterprises.com at Squarespace and his
dispatch@ mail runs on it, so this is pointing, not purchase.

1. In Vercel: project, Settings, Domains. Add `kulenterprises.com` and
   `www.kulenterprises.com`. Copy the records the dashboard displays. Use what it shows
   today, never remembered values.
2. He logs into Squarespace, Domains, kulenterprises.com, DNS settings. Replace the
   parking-page A records with Vercel's A record; add the www CNAME.
3. **Touch nothing else. His email lives on this domain.** MX records and existing TXT
   records do not get edited, moved, or cleaned up, no matter how untidy the list looks.
4. While still in the same DNS screen: Resend. He creates the account himself with
   dispatch@kulenterprises.com (his account, not yours), adds kulenterprises.com as a
   sending domain, and the records Resend lists go in beside the others. Same rule as
   step 3: add only.
5. Resend API key into the Vercel project environment as `RESEND_API_KEY`, plus
   `RESEND_FROM` on the verified domain. Redeploy.
6. The live test, the money moment of the hour: submit a real quote from the site and
   watch it arrive in dispatch@ while he is looking at his own inbox. No lead has ever
   reached a human before this one.
7. If propagation or verification lags, do not stall the meeting. Recheck at the wrap and
   finish remotely the same day.

**After the meeting, same day, yours:** change `content/site.json` url to the new address
the moment it actually serves (that field names where the site is served from today,
never where it is going), push, then run the og:image check from the domain playbook; it
must answer `200 image/jpeg`. Also confirm /admin still logs in from the new domain in
Tina Cloud's site settings before the training session.

**If he raises the agreement's NameCheap wording:** the promise was the domain in his
name, and it already is, at Squarespace. A registrar transfer now means about a week of
limbo and recreating his email records by hand, for no functional gain. Recommend leaving
it. If he wants the letter of it, offer a post-launch transfer with an MX inventory taken
first.

## His three sittings, eight minutes

**A. The remaining hour at a computer.** Launch needs none of it; ask for it the same
week. GA4 property, Search Console, and the Google Business Profile postcard, which
starts a two-week clock and should be requested today, not after launch.

**B. The hour with the truck and a phone.** Hand him the printed doc 19 shot list. The
seven service pages still illustrate themselves with landscapes, and freight photography
is what makes a broker believe the carrier is real. Ask him to text photos as they
happen, not to save them up for a perfect batch.

**C. Decisions on record.** Write his answers on this sheet:

- MC number. The site publishes 66389691 in four places; his own signature once read
  "pending" and the eight-digit format is irregular. Confirmed as printed, corrected, or
  it comes off.
- Packet documents: W-9, certificate of insurance, authority letter, emailed to you. And
  is the FMCSA insurance filing active? The carrier packet page links straight to the
  lookup.
- A packet turnaround he will commit to in writing, or the page keeps stating none.
- Measured trailer dimensions, or the nominal 53-foot block comes off the service pages.
- One flag, raised once, his call, then closed: his date of birth stays off Journey
  scene 2 unless he says otherwise. A full birth date beside a full legal name is an
  identity risk. Do not relitigate it.

## Wrap, two minutes

- Schedule the sixty-minute editing training. Nothing CMS was shown today on purpose;
  that session is where he learns to change his own words.
- Read the punch list back to him with owners on each line.
- The launch line: "The address is live today. The site launches when the photographs and
  the packet documents exist. That schedule is yours."

## If he asks

- **When do we launch?** The launch line above, verbatim.
- **Can it do portals, tracking, payments?** Phase two, after launch, scoped separately.
  Price nothing in this meeting.
- **Why is another artist credited on About?** The 3D bird in the opening film is
  licensed artwork and the credit is a condition of the license. Everything on the site
  is either his or licensed, which is the site's whole argument.
- **Notes on the opening film?** Capture them like any other line in the table. The
  rebuilt cut exists and stays unmentioned until it is ready to be seen.

## Do not reopen

He removed these or they were ruled out with reasons. Do not offer them back, and if he
asks, the reason is on record: the Journey route thread; the field-note film;
testimonials before customers exist (the reserved box is the honest answer); stock
photography anywhere; wheels-in-motion by generative video; the ghosted wordmark behind
the rig; a bigger lion in the menu panel; any redrawn or simplified lion mark; em dashes
in anything he reads.

## Capture table

| # | Stop | His words | Action | Priority |
|---|---|---|---|---|
| 1 | Film + Home | | | |
| 2 | Search | | | |
| 3 | Services grid | | | |
| 4 | Service page | | | |
| 5 | Safety | | | |
| 6 | Carrier Packet | | | |
| 7 | Quote | | | |
| 8 | Contact | | | |
| 9 | Drivers | | | |
| 10 | About | | | |
| 11 | The Journey | | | |
| 12 | Road Ahead | | | |
| 13 | 404 / edges | | | |
| 14 | Mobile pass | | | |
| 15 | | | | |
| 16 | | | | |
