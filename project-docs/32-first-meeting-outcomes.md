# 32 · First client meeting: outcomes and punch list

Meeting held on or shortly before August 9, 2026. Mark walked the live site
against the running sheet (doc 29). These are Jalen's raw notes, followed by
what each one actually means against the codebase, verified by grep before
anything here was written down.

## Raw notes, verbatim

> Can use other pictures for services
> Background for drivers video playing behind like 404 any of the other videos make sure words can be seen
> MC number not registered until first truck bought
> Still waiting on carrier packet docs
> Take him and sister picture off homepage and anything that could show diversity, etc.
> Change bottom part out and the journey is self contained. Put the lion logo in place of it and below it put Strength in Motion, etc. slogan and incorporate some pictures of jamaica (river, etc.)
> Fix about info to match his email
> After click journey icon, screen turns into a documentary movie. Start with photo, then go through it. His stepmom will create an actual video to give to me. Press esc or space bar to leave. Index you can click to get to section of video.
> Delete the "Alabama home region" etc. titles on the map
> Ask akilah about singing for the journey video
> Take out one number, answered by one driver from everywhere. and anything else on the website that mentions one driver, answered by driver, stuff like that,
> After he gets 5 trucks, he'll get his broker license and get into management for all transportation types
> Master banking law and accounting law

## Priority zero: the MC number

The site publishes MC 66389691 and the meeting establishes the MC is not
registered until the first truck is bought. The site is live. Publishing an
unregistered MC on a carrier site is exactly the exposure doc 24 and the full
audit flagged, and the v3 research (doc 17) documents why a wrong authority
number reads as the chameleon-carrier fraud profile to brokers. This comes off
before anything cosmetic happens.

The number ships from `content/site.json` (`"mc"`) through the `{mc}` token and
`site.mc`. Every surface, verified by grep:

- Token uses: home meta + hero credentials, about meta + authority section,
  contact hours lines, safety meta + decal alt + facts table, quote trust
  strip, carrier-packet meta + document table, faq.json item, all three legal
  pages (legal-notices, privacy-policy, terms-conditions).
- Code uses: `components/k/Footer.tsx`, `components/k/MenuOverlay.tsx`,
  `components/k/NavPanels.tsx`, `components/k/ServiceSpecs.tsx`,
  `app/layout.tsx` (meta description and the schema.org PropertyValue).

Treatment: USDOT stays (nothing in the meeting touched it). MC lines come out
or collapse to USDOT-only until registration is real. The carrier-packet
document table row becomes "issued at registration" language rather than a
number. Keep the `mc` field in site.json empty rather than deleting the field,
so restoring it at truck one is a one-line CMS edit.

## The punch list, mapped

**1. One-driver copy sweep (site-wide).** Remove everything that frames the
company as one man answering one phone. Confirmed shipping instances:

- `content/pages/home.json` — statement section ("You will always be talking
  to the driver." + the Mark-is-dispatch body) and the hero lede's "dispatched
  by the person driving".
- `content/pages/about.json` — "One number, answered by the driver."
- `content/pages/contact.json` — meta "answered by the driver" and heading
  "One number, and it is answered."
- `content/pages/safety.json` — "One phone number reaches the person driving
  the truck, around the clock."
- `content/pages/road-ahead.json` — "Dispatch stays one phone number, answered
  by somebody who has driven the lane."
- `content/pages/services-index.json` — "one phone number throughout."
- `content/services.json` — "One dispatch line, answered by the driver" and
  "run by a driver who knows the docks" in the regional entry.
- `content/search.json` — empty-state "call {phone} and ask the driver."

Replacement direction: dispatch as a function, not a person. Reachable, 24/7,
knows the load. Nothing that promises who picks up. The Journey narrative is
exempt: it is Mark's own history, self-contained by his instruction, and "one
truck" as past fact is the story, not a service claim. Judgment call parked
below: the hero H1 "Every mile. Owner driven."

**2. Homepage bottom swap.** The `journey` section of home.json (teaser +
childhood photo + "Begin the journey") comes out entirely. In its place: the
lion mark (`public/images/brand/lion-mark.webp`, the rebuilt shipping mark,
subject to the doc-22 ground rules), the tagline from site.json ("Strength in
Motion. Built on Integrity. Driven by Safety.", already tokenized as
{tagline}/taglineLines), and Jamaica imagery. In-repo candidates with no
people: `gal-river-rocks.webp` (the river, literally what he asked for) and
`s02b-caribbean-water.webp`. `gal-waterfall-figure.webp` is excluded, it has a
figure in it. The lion is the natural click-through to /journey ("after click
journey icon"), so the Journey entry survives the teaser's removal. New
section copy gets CMS fields per the Tina-everywhere rule.

**3. Him-and-sister photo, and people imagery generally.** The only people
photo on the homepage is the journey teaser's `s02-jamaica-childhood.webp`
(alt names Mark and his sister), so item 2 removes it as a side effect. The
photo legitimately remains inside the Journey (Scene 2 and the Scene 17
contact sheet), which he declared self-contained. Sitewide people imagery
still shipping after the swap: Mark's portraits and film on About, the
jobsite photos in Journey scene 9, everything else inside the Journey.
Whether "anything that could show diversity" reaches into About is not
decidable from the notes; confirm with Mark before touching About imagery.

**4. Drivers page video background.** Like the 404: `HeroVideo`
(components/k/HeroVideo) with the name + poster + "-720" convention, any of
the dashcam set (dash-daylight / dash-night / dash-rain, plus kul-hero and
kul-intro exist). Drivers currently has no video and runs the warm light
colourway, so this is a real hero redesign, not a prop change. His one hard
constraint: the words stay readable. Use a measured scrim, same discipline as
the Journey's. Wire the choice of file through a CMS field like the 404
already does (`hero.video`). Safari: mp4 fallback rules per the WebM trap
memory.

**5. Map hover titles.** `components/k/ServiceMap.tsx` renders a live readout
above the map: state name + "· home region" on hover/focus. Delete the visible
readout. Keep the announcement for keyboard users as sr-only if possible, the
aria-live region exists for them. The two-letter state codes drawn on the map
itself were not named and stay. The phrase "home region" also appears in body
copy on about.json, drivers.json and the map's "Everywhere else" panel; he
pointed at the map titles, not the phrase, so body copy stands unless he says
otherwise.

**6. Journey as documentary.** What he described is mostly what shipped: click
in, photo-first, moves through the story. Buildable now: Esc to leave (no
keydown handling exists in the journey code today), and the five-act index
clickable to jump. Space-to-leave conflicts with space-scrolls-the-page; hold
that for the real video player, where space conventionally pauses. Blocked:
the actual video from his stepmom. When it arrives it becomes the Journey's
film mode with act-level chapters, Esc/space to exit, index to seek. Akilah
possibly singing on it (Jalen's follow-up, not a site task).

**7. Services photos.** Permission granted to use non-Mark pictures for
services. Nothing mandatory. Option unlocked where his own photos are weakest.
The photography inventory (memory + doc 19) governs what is actually his.

**8. About vs his email.** About was rebuilt August 5 from his emailed
statement, and the meeting still says "fix about info to match his email."
Either he has not seen the deploy, or a detail still reads wrong to him, or
there is a newer email. Needs the email or a specific from Mark. Standing
guard: the three deliberate corrections in that statement must not be
reverted in the name of matching.

**9. Carrier packet docs.** Still owed by Mark (W-9, COI, authority letter).
Page stands as built. No action.

## Not website work

- Akilah, singing for the journey video: Jalen asks her.
- Five trucks, then broker license, then management across transport types:
  background for future road-ahead copy, publish nothing until real.
- "Master banking law and accounting law": Mark's own note to himself.

## Open decisions

1. Hero H1 "Every mile. Owner driven." Owner-driven ethos vs one-driver
   signal. His spirit in this meeting was stop-signaling-small. Jalen decides
   or asks Mark.
2. Jamaica imagery: the two in-repo candidates, or fresh licensed shots, or
   photos from Mark. (His family may have real ones, which always beat stock
   here.)
3. Does the people-imagery instruction reach About? Ask Mark before acting.

## Executed, August 9 (addendum)

Jalen answered the open questions the same day and the whole wave shipped to
main, which auto-deploys. Decisions taken in execution:

- The hero H1 counted as one-driver signaling and became "Every mile. On
  schedule." (241px at the 36px floor, measured; the wrap note in
  home-view.tsx has the figures.)
- Replacement copy is direct and neutral throughout: dispatch is a function
  that answers around the clock, never a person who drives. Road Ahead was
  retitled "Fifty tractors by 2029" and its 1-truck 1-driver tiles came out,
  as did the SAFER-style Power units and Drivers rows on the packet page and
  both form success messages that named Mark or the second truck.
- The Drivers film is dash-daylight, in colour: rain belongs to the 404 and
  night to Safety, and Mark's conditions were "not the 404's clip" and "not
  black and white". Scrim stops were set by measurement against the poster
  frame: 3.36:1 on the h1, 5.38:1 on the lede, 6.95:1 on the body, all in
  full k-on-dark after the usual soft grey measured 2.52:1.
- The Journey teardown was total: seventeen scene components, the spine, the
  journey half of globals.css, the five-sleeve nav panel and the screenplay
  content all came out. /journey is now a fullscreen player: dash-night as
  the placeholder reel, Esc and space to leave (space defers to a focused
  control, where it is the activation key), and a four-entry placeholder
  index that seeks the playhead. All of it CMS-wired for the real film.
- The homepage close uses gal-river-rocks and s02b-caribbean-water (the
  sanctioned originals; waterfall-figure was excluded for the figure in it),
  the lion mark blended multiply onto the warm ground, and the lion links to
  /journey as the "journey icon".
- The carrier packet grew a download per document row, driven by a CMS file
  field that ships empty; watermarked placeholder PDFs live in public/packet
  which is gitignored, so they can never deploy.
- About was rebuilt document-first: his email's titles at display size in
  his order, the opening stripped to type (the Maersk purpose-as-hero move),
  the six commitments numbered, and the Ground / Air / Maritime modes of his
  vision set as a row. Every word verbatim; the three standing corrections
  held.

Still owed by Mark, unchanged: the stepmom's film (drops into the player via
the CMS), the packet documents (drop into public/packet plus one CMS field
each), and word on whether the rebuilt About now matches what he meant by
his email.

## Standing rules this meeting created

- No copy anywhere that frames KUL as one driver answering one phone.
- No MC number on the site until the MC is registered (first truck).
- The Journey is the sanctioned home of personal and family imagery; the
  commercial pages stay people-neutral.
- The homepage closes on brand (lion, tagline, Jamaica), not on the Journey
  teaser.
