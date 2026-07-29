# 20. The plan to launch

**Written 28 July 2026**, from the last five session transcripts plus a check of the
working tree. Every claim below was verified against the code, not taken from the
transcripts, and several transcript items turned out to be stale. Those are marked.

---

## Where this actually stands

The site is structurally finished. Thirty-three pages build clean, every commercial route
runs on the k design system, and the copy no longer over-claims. What it cannot yet do is
earn a broker's trust, for two reasons that are not code.

**No lead has ever reached a human.** `RESEND_API_KEY` is unset, so every quote submitted
today fails and dies in a hosting log.

**No photograph on this site contains freight.** Twenty-six journey images and fourteen
service images, all landscapes. A broker looking for evidence of a working carrier finds
scenery.

The single thing most in the way is Mark. The delivery pipe, the trailer measurements, the
packet documents and the freight photography are all his, and none can be coded around.

**One more thing, and it is urgent: nineteen commits exist only on this laptop.**
`origin/multiverse` is at `0f25938`; local is at `bb0f2ad`. `main` is twenty commits behind
and is what the world sees. Every rebuild described here is currently one disk failure from
gone.

---

## Launch blockers

Only these. Everything else can ship after.

| # | What | Who | If it ships without |
|---|---|---|---|
| B0 | **Push the branch.** Nineteen unpushed commits. | Me, on your word | The work does not exist anywhere but here. |
| B1 | **One live lead proven.** Verify kulenterprises.com in Resend, set `RESEND_API_KEY` and `RESEND_FROM`, then submit a real quote and watch it arrive. | Mark, then me | Every broker enquiry errors. The forms are the whole conversion path. |
| B2 | **Freight photography.** A loaded trailer, a dock, a strapped load, Mark at the truck. | Mark, phone camera, see doc 19 | A carrier site with no picture of freight reads as a shell company. |
| B3 | **Trailer dimensions.** `content/services.json` carries nominal 53-foot values seven times, not measured. | Mark with a tape, or me deleting the blueprint block | A broker quotes against a number that is not his trailer, and the first job is a claim. |
| B4 | **MC number confirmed.** Mark's own signature reads "MC66389691 (pending)" and the eight-digit format is irregular. Published in four places. | Mark confirms, or I remove it | Publishing an unissued operating authority is misrepresentation. |
| B5 | **Packet documents.** W-9, COI, authority letter. `/carrier-packet` invites the request and has nothing to attach. | Mark | Worse than not offering it. |
| B6 | **Domain and Vercel project** in KUL's name. | Mark buys, I deploy | Nothing to launch. |
| B7 | **TinaCMS reachable in production.** Build script is `next build`; the CMS needs `build:cms` plus Tina Cloud credentials. | Me, plus Mark's account | This is what the extra $250 bought. Handing over a site he cannot edit is a contract failure. |

**Not blockers**, contrary to earlier notes: cookie consent and analytics. Launch with
`NEXT_PUBLIC_GA_ID` unset. No analytics means no consent obligation, and the cookies page
already reads conditionally. Add both together afterwards.

---

## Work I can do without Mark

Verified defects, ordered by how much they cost.

**1. The contact success screen renders the rejected typeface.**
`components/forms/FormShell.tsx:177` is `font-omnibus`, and `ContactForm.tsx` still imports
and renders `SuccessPanel`. Every broker who successfully contacts KUL sees Omnibus at the
single highest-trust moment on the site. Small.

**2. `app/error.tsx` is still entirely v2.** It imports `components/v2/GhostNumeral` and
renders its h1 as `font-omnibus text-display-l text-cream`. It was missed by the phase 4
sweep, so any runtime error drops the visitor onto the rejected design. Needs a new section
shape, since the 404 recovery list is spent.

**3. The route veil is now dead weight and can be cut.**
*This corrects the handoff.* It claimed `error.tsx`, About, Drivers and Carrier Packet all
consume `useVeilState`. Checked today: `grep -rl useVeilState app components` returns
exactly one file, `RouteVeil.tsx` itself. Nothing consumes it. Remove `RouteVeil`,
`LoadingOverlay` and `StickyMobileBar` from the layout, delete `components/v2` entirely,
drop the Omnibus font and `intro.mp4`, then strip the `k-` prefix site-wide.

**4. Three gold call-to-action buttons stack on one phone screen.** `components/k/Nav.tsx`
renders the gold pill at every width, `MenuOverlay` adds a second, and the still-mounted v2
`StickyMobileBar` adds a third in the old type system. Deleting the sticky bar in step 3
fixes it.

**5. The services flyout is mouse-only at every width.** `Nav.tsx:149` attaches
`onMouseEnter` and nothing else. No `onClick`, no `onFocus`, no `aria-expanded`. Keyboard
users, an iPad in landscape and any touch device at 1180px and above cannot reach the seven
service cards from the nav. The accessibility sweep that cleared all nineteen routes did not
cover this, because it only reads static markup. The Menu button in the same file shows the
correct pattern.

**6. The site contradicts itself about the quote form.** `/services` says "Five fields"
twice; `/quote` and the 404 say "Six fields" three times. One of them is wrong on a page
arguing that everything can be checked.

**7. Motion is missing from the three pages a broker sees first.** Home, Services and the
service detail pages contain zero `variant=` and zero `RuleDraw`, while About, Drivers,
Carrier Packet and Road Ahead all use them. Mark asked for motion "throughout the entire
site".

**8. Housekeeping.** Bump `next` off 15.5.19 (eight advisories, non-major fix available, and
it matters because `dangerouslyAllowSVG` is on). Move `tinacms` to devDependencies. Convert
the fourteen service JPEGs to webp. Delete the orphaned truck renders nothing references.

---

## Work that needs Mark

Three sittings.

**A. One hour at a computer.** Resend domain verification and API key. Buy the domain.
Vercel account in KUL's name. Tina Cloud account connected to the repo. GA4 and Search
Console. Start Google Business Profile verification first, because the postcard takes about
two weeks.

**B. One hour with the truck and a phone.** Everything in `project-docs/19`. Tape-measure
the trailer. Photograph a loaded trailer, open rear doors, a strapped load, a dock, the
tractor at an angle, the door decal, and himself at the driver's door. These fill the seven
service pages and Journey scene 15, which has no photograph at all.

**C. Twenty minutes of decisions, by email.** Confirm or withdraw the MC number. Send the
packet PDFs. Decide on the generated assets: the footer plate, the hero film and the truck
renders are all AI-generated, on a site whose argument is that everything is verifiable. My
recommendation is to replace the footer plate with the embroidery mark already used below
`lg`, and to keep the hero film until there is an exterior shot of the real rig, because it
is the only place the livery appears at size.

---

## What to deliberately not do

- **Do not build the Doctor Bird opening sequence.** Its single permitted appearance is
  already spent on Journey chapter 03, and a gate in front of a broker who wants a rate
  fights Mark's own rule that Services, Safety, Quote and Contact must be reachable fast.
  Kill it as a deliverable and tell Mark, rather than leaving it as silent debt.
- **Do not attempt wheels-in-motion again.** Tried and failed three ways, and the cheap
  version is forbidden outright: never rotate a photo of a wheel in place.
- **Do not restore the seventeen-scene Journey.** The home page was corrected from
  "Seventeen scenes" to "Six chapters" precisely because the film does not exist. The
  transcripts disagree here and six chapters wins, because it is what the page holds.
  Republish the plan to match the site, not the site to match the plan.
- **Do not invent social proof.** No testimonials, no logo wall, no safety rating. The
  reserved empty box is the honest answer and Mark asked for it.
- **Do not re-add stock photography to close the freight gap.** A stock photo of somebody
  else's trailer, on a page arguing for verifiability, is the worst available fix. The gap
  stays visible until Mark shoots it.
- **Do not rename the routes to Mark's eight chapter names.** Conventional naming serves the
  broker path and search. The emotional names belong as headings inside pages, not as URLs.
- **Do not claim fidelity to a reference nobody has seen.** Several Mobbin IDs cited in the
  plan were never downloaded and do not exist.
- **Do not reuse a spent section archetype.** About twenty shapes are consumed across
  nineteen routes and the inventory is undocumented. Write it down first.

**Two laws, settled so nobody relitigates them.** Paper-first stands for any new page:
artboard, then code. For reconciling already-shipped code, the code leads and the artboard is
drawn after and labelled as such, which is what Carrier Packet did.
`components/k/LegalPage.tsx` serving five content pages is a sanctioned exception to
archetype-used-once; it licenses nothing on the commercial spine.

---

## The sequence

Send Mark sittings A, B and C today, before any code. DNS propagation and the Business
Profile postcard are the long poles, and everything below fits inside their latency.

1. **Push the branch.** Then write the archetype inventory.
2. **Clear the v2 tail.** `error.tsx` artboard and rebuild. `FormShell` and `ContactForm`
   off Omnibus. Ends when no `font-omnibus` survives outside the Tailwind config.
3. **Cut the veil.** Remove the three v2 mounts, delete `components/v2`, drop the Omnibus
   font and `intro.mp4`, strip the `k-` prefix. Ends on a clean production build.
4. **Motion and nav.** Variants across Home, Services and service detail. Keyboard and touch
   on the services flyout. Verified at 390, 768, 1024, 1180 and 1440.
5. **Truth and tidiness.** Six-fields fix. Dependency bumps. Service images to webp.
6. **Paper reconciliation.** Nav and Services artboards redrawn to match what shipped.
7. **Mark's assets land.** Photographs, measured dimensions, packet PDFs, MC decision.
8. **Infrastructure.** Vercel, domain, `build:cms`, env vars. Then the one thing that
   matters: submit a real quote and watch it arrive.
9. **Launch.** Deploy, re-run accessibility against production, zoom to 200 and 400 percent,
   one real-device check for scroll lock and safe-area padding that emulators never exercise.

**The honest summary for Mark:** steps 1 through 6 are roughly a week of my work and none of
it needs him. Step 7 is entirely him, and it is the step that decides whether brokers believe
the site. The build has been ready for his photographs longer than his photographs have been
ready for the build.
