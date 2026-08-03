# 25. Revision meeting one: the briefing

**Written 2 August 2026.** Everything below was verified against the running site and the
production build on this date, not carried forward from older notes. This is the working
sheet for the first revision meeting with Mark.

---

## Where the site stands

The build is finished. Thirty-two routes compile clean, every page runs on the k design
system, and the production build passes with every route prerendered.

**The Journey is complete.** All seventeen scenes of Mark's screenplay, built as one
continuous sunrise from near-black to daylight, with his own photography, his own words
verbatim, and his own field-note video. Four scenes hold the viewport (the opening, the
pause after "We never went back.", the road, and the question he stopped asking); the rest
read as ordinary flow. The page ends as a record: the full 32-plate index of his archive,
two doors into the commercial site, and his sign-off.

**Every word on the site is editable.** The Journey was the last holdout; its copy now
lives in the CMS like everything else, one field per sentence, grouped scene by scene. The
structure (colours, plate numbers, which photograph sits where) is deliberately not
editable, because it carries measured contrast and the honesty rules.

**Honesty rules held.** No stock photography anywhere. The scene about his childhood
summers is type only, because no photograph of them exists and the 2021-22 jobsite photos
would have been a lie there; they appear instead in the scene about his working life, where
they are true. The fleet instrument shows one solid mark and forty-nine empty ones, with
the second tractor drawn hollow. The fifty-by-2029 target is Mark's own stated vision from
his Blueprint.

## The demo path for the meeting

1. Home, then hover the navigation: The Journey now opens as five acts.
2. The Journey, top to bottom, unhurried. Let the pause after "We never went back." land.
3. Stop on scene 16 (the fleet measure) and scene 17 (the index). These are the two he has
   not seen in any form.
4. /admin: open "The Journey page" and edit one line live, to show he owns the words.
5. Quote form: show the flow, then say plainly that submissions do not deliver yet and why
   (the Resend key is his hour, below).

## What is needed from Mark: the same three sittings

**A. One hour at a computer (this is the launch gate).** Verify kulenterprises.com in
Resend and hand over the API key; buy the domain; a Vercel account in KUL's name; a Tina
Cloud account connected to the repo; GA4 and Search Console; start the Google Business
Profile postcard now because it takes two weeks. Until the Resend key exists, every quote
a broker submits dies in a log. This is the single thing between the site and launch.

**B. One hour with the truck and a phone.** The shot list is project-docs/19. A loaded
trailer, open rear doors, a strapped load, a dock, the tractor at an angle, the door decal,
and himself at the driver's door. These fill the seven service pages, which still
illustrate themselves with landscapes, and they are what makes a broker believe the
carrier is real. The build has been ready for these photographs longer than the
photographs have been ready for the build.

**C. Twenty minutes of decisions, on the record.**
- Confirm or withdraw the MC number (66389691 is eight digits, which does not match the
  FMCSA format; it is published in four places).
- Send the packet documents: W-9, certificate of insurance, authority letter. Confirm the
  FMCSA insurance filing is active, because the carrier packet page links straight to the
  lookup.
- Commit a packet turnaround in writing, or the page keeps stating none.
- Measured trailer dimensions, or the nominal 53-foot block comes off the service pages.
- One flag to raise, not to relitigate: his date of birth from the screenplay was left off
  scene 2 deliberately (full DOB beside a full legal name is an identity risk). Putting it
  back is his call.

## What was deliberately not built, so it does not come back

The Doctor Bird opening gate (spent on the Journey; a gate in front of a broker fights his
own rule), wheels-in-motion (tried three ways, failed, the cheap version is banned), a
testimonials section (no customers yet; the reserved empty box is the honest answer), and
stock photography to plug the freight gap.

## After his sittings

Deploy to Vercel under KUL's account with the CMS build, submit one real quote and watch
it arrive, re-run accessibility against production, and launch. Steps 1 through 6 of the
old plan (doc 20) are all done; what remains is his three sittings and the deploy.
