# 27. Intro redesign: the gold bird commands the opening

**Written 4 August 2026, as the plan for Mark's brief of the same day. Read
doc 22 first: it is the record of how the current film is built, and every
trap it lists still applies. This doc says what changes, what stays, and in
what order the work runs.**

---

## 1. The brief, distilled

Mark supplied a reference image: a metallic gold hummingbird in flight on
pure black, broadside, head and long bill raised, far wing fanned so the
individual primaries read, near wing sweeping down and forward, and the two
long streamer tails curving away below with flared feather tips. Gold dust
drifts in the black behind it.

His asks, in order:

1. The Doctor Bird redesigned as a clean, custom gold element matching that
   reference: keep the long tail, the wing shape, the elegant flying posture;
   no photographic detail. A premium metallic-gold brand element on black.
2. The bird commands the opening. Larger, more graceful, and given enough
   time to establish its presence before the logo.
3. The handoff to the KUL logo must feel connected and intentional: a gold
   light trail, a particle transition, a silhouette transformation, a reveal.
   Not "bird disappears, logo appears."
4. The whole opening reads heritage, strength, movement, premium quality,
   inside a few seconds.

**Prerequisite:** the reference image lives only in the message thread right
now. Save it to `assets-inbox/reference/gold-bird-reference.png` so the build
can be compared against it side by side.

---

## 2. Diagnosis: why the current film misses this

The current bird is a 30,000-point gold stipple. It spends its 1.2 seconds
flying head-on at the lens, is readable in profile for roughly 0.7 seconds,
and starts dissolving at 1.47s. It is a silhouette made of dust, not a
metallic object; it is small for most of its screen time; and the dissolve
begins almost as soon as the bird becomes legible. Every one of Mark's four
asks lands on that same weakness. The mechanism he wants for the handoff, a
particle transition, is already the film's mechanism: what fails is the
bird's presence before it.

So: **act 2 stays, act 1 is rebuilt.** The lion gather, the slide right, and
the wordmark drawing itself in are sampled from the real brand artwork,
verified on brand, and untouched by this brief.

---

## 3. What stays, and may not regress

- The film approach itself: a rendered mp4, not markup. Doc 22 section 2.
- The lion and wordmark sampled from the real artwork. Directive 11: the
  mark is never redrawn.
- Ground `#050301`, gold centred on `#d6a145`, hue in the gold band, never
  yellow. Silent, no audio stream.
- One H.264 source with a full `codecs` string, nothing listed before it.
  The Safari webm trap (doc 22, memory) is settled law.
- Every guarantee in `LoadingOverlay.tsx`: home-only, once per session,
  escape hatches, the watchdog, the cap, reduced motion gets a still,
  mount after first paint, the pre-paint cover contract with `app/layout.tsx`.
- The bird appears in the opening and nowhere else on the site. The lion is
  the permanent mark.

---

## 4. The new bird

Built in `~/Desktop/kul/kul.blend` in a new collection beside the current
rig, which stays until the replacement is proven on screen.

**Geometry, clean solid surfaces, no photo texture:**

- Body: one smooth form, chest full, neck curved, head raised. No scale
  texture; the reference's feather detail is what "remove photographic
  detail" removes. The material carries the richness.
- Bill: long slender taper, raised roughly 35 degrees, following the
  reference. A small dark eye bead so the head reads at size.
- Far wing: one clean feather shape instanced 9 or 10 times along the
  shoulder arc with graded length and rotation (geometry nodes), so the
  fanned primaries read as drawn shapes, matching the reference's spread.
  Two or three overlapping covert shells at the root so the wing looks
  built, not glued on.
- Near wing: the same feather array posed sweeping down and forward.
- Tail: the signature. Two long ribbons on bezier curves, gently crossing,
  each ending in a flared vane. These lead the handoff later.
- Rig: each wing hinges at its own shoulder, the convention the current
  file already uses. Wingbeat slowed to about 2.2Hz at roughly 35 degrees
  around the glide pose: grand, not frantic. Slight body pitch response.

**Material and light, where "premium metallic" is won or lost:**

- Principled BSDF, metallic 1.0, roughness near 0.3, base colour the brand
  gold converted to linear.
- Metal is only as good as what it reflects, and the scene is a black void.
  Render with Film set to Transparent over a gold-tinted studio environment
  (or three area lights: key, rim, fill), then composite over `#050301` in
  the existing compositor group. The environment lights the metal without
  ever being seen.
- View transform stays Standard (AgX shifts the gold, doc 22 section 4).
  Glare bloom stays in the compositor. The old 0.873 emission compensation
  was derived for the dot material; re-measure the sampled interior gold on
  exported frames against `#d6a145` and re-derive whatever compensation the
  new material needs under the same bloom.
- EEVEE first (the engine id is `BLENDER_EEVEE` in 5.1). If the gold reads
  flat, Cycles is the fallback; the scene is small enough to afford it.

---

## 5. The new beat

Target length 6.5 seconds, 390 frames at 60fps. The bird gets 3.4 seconds of
uncontested screen time against today's 1.4.

| Frames | Seconds | What happens |
|---|---|---|
| 1 to 16 | 0 to 0.27 | Fade up from black, faint gold dust drifting |
| 10 to 130 | 0.17 to 2.17 | The bird glides in broadside from the lower left, already large, slow powerful wingbeats, and settles just left of centre at about 55 percent of frame height |
| 130 to 205 | 2.17 to 3.42 | The establishing hold: a slow hover bob, a slight bank toward the lens, one specular sweep travelling across the gold |
| 205 to 285 | 3.42 to 4.75 | The handoff. The streamer tails unravel into gold points first, and the dissolve runs forward through the body to the head. The points stream along one arc, reading as a single comet of gold, and condense into the lion at centre |
| 285 to 320 | 4.75 to 5.33 | The lion slides right |
| 300 to 345 | 5.00 to 5.75 | The wordmark draws itself in, far end first |
| 345 to 390 | 5.75 to 6.50 | The full lockup holds |

The entry is broadside, not head-on. Head-on is why the current bird is
small for most of its life; the reference pose is a profile pose, and
profile is where the bill, the fanned wing and the streamers all read.

**Handoff mechanics.** The dissolve gradient (position along the body, tail
to head) drives two things at once: a shader clip that erodes the solid bird
with an emissive edge at the front, and the birth time of points sampled
from the deformed bird surface at that same frontier, so the points begin
exactly where the surface is breaking. The points travel a curve-guided arc
to the lion's target positions rather than a straight lerp. The existing
lion stipple pipeline (`target`, `tone`, the ink-budget rules in doc 22
section 2) is reused as the destination. If the erosion edge looks cheap, a
bloom spike at the swap frame is the honest cover, and it is one keyframe.

---

## 6. Encoding, and the codecs string moves with it

Render a 1080p60 master. Encode H.264 High, yuv420p, silent:

- 1080p60 is level 4.2: the `<source>` type becomes
  `video/mp4; codecs="avc1.64002A"`. **The string in `LoadingOverlay.tsx`
  must be updated to match the actual encode**, or Safari will honestly
  refuse a file it could have played.
- Ship 1080p if it lands at or under about 2.0MB at visually clean quality.
  Otherwise ship 720p (level 3.2, `avc1.640020`, the current string) at a
  better bitrate than today's file.
- Verify with ffprobe: codec, level, dimensions, duration, and that no
  audio stream exists.
- Re-export `kul-intro-poster.jpg` from the new closing frame. It is also
  the reduced-motion still and the autoplay-refusal fallback.

---

## 7. The site-side renumbering chain

The film's length is written into a web of constants that were derived
together and must be re-derived together (all in `LoadingOverlay.tsx`
unless noted):

| Constant | Today | With a 6.5s film |
|---|---|---|
| `CAP_MS` | 5000 | 6500. Must be at least the film's length |
| `EXIT_MS` | 500 | Unchanged, matched to `RouteTransition` |
| `PLAY_DEADLINE_MS` | 4000 | Unchanged; it measures startup, not length |
| `CEILING_MS` | 7500 | 9000, keeping today's 2.5s slack over the cap |
| Cover failsafe in `app/layout.tsx` | 8000 | 9500, staying 500 above the ceiling |

Every comment that promises a duration gets re-read against the new numbers;
that list going stale is exactly the failure the `CAP_MS` comment documents.

**One correction that ships with this regardless: the cookies page lies.**
`content/legal/cookies.json` still tells visitors the `kul-intro-seen` flag
is local storage that never expires and survives the tab. Since 2 August it
is sessionStorage, cleared when the tab closes, and a new tab replays the
film. The body copy and the accuracy-contract comment in
`app/cookies/page.tsx` both get corrected to say session storage, per tab,
gone when the tab closes. (There is also a stray space before a comma in
that body text.)

No new CMS fields: the opening has no readable text. If Mark ever wants the
tagline back, it returns as a Tina field per the standing rule.

---

## 8. Verification, in this order

1. **Stills before motion.** Render the key frames (entry, hold, mid-
   dissolve, trail, lion, lockup) and montage them beside the reference.
   Jalen eyeballs before any 390-frame render is paid for.
2. Sample the gold hex off exported frames: interior tones in the
   `#d6a145` band, hue near 38, never yellow.
3. Playblast the motion before final render; check the wingbeat reads
   graceful at speed and the trail reads as one gesture.
4. ffprobe the encode as in section 6.
5. Browser, per the playbook: fresh tab, `document.visibilityState`
   visible, sessionStorage cleared, watch the full play on desktop and at
   375px. Reduced motion gets the new poster. Kill the dev server before
   any `next build`.
6. iOS Simulator probes the codec registry for the new codecs string
   (`mediaCapabilities.decodingInfo`); remember the simulator cannot decode
   video, so it proves support claims only, never playback.
7. Push, then watch it once on the live URL and once on a real phone.
   A new tab replays it, which is also how Mark should be told to view it.

---

## 9. Order of work

- **Gate 0, before any build session:** the reference image saved to
  `assets-inbox/reference/gold-bird-reference.png`; Blender open with
  `~/Desktop/kul/kul.blend` loaded and the MCP add-on connected. (Blender
  was not running when this plan was written.)
- **A.** Model and shade the new bird in a fresh collection. Keep the old
  rig until the new act 1 is proven.
- **B.** Stills montage against the reference. Jalen's nod is the gate to
  motion work.
- **C.** Choreograph act 1 and the handoff; retime act 2's triggers to the
  new frame numbers; playblast.
- **D.** Final render, encode, poster, measurements.
- **E.** Site wiring: constants, codecs string, comments, the cookies
  correction.
- **F.** Verify per section 8, commit on main per conventions, push, check
  live, then send Mark the link.
- **G.** Update doc 22 (or append its delta here) so the record matches the
  film again.

Blender safety from doc 22 section 7 holds: the .blend stays outside the
repo, save before every render step, and nothing in this job needs network
access from inside Blender.

---

## 10. Held decisions

- **6.5 seconds total** is the proposal for "within only a few seconds":
  3.4s of bird, 1.3s of handoff, 1.8s of logo. If Mark wants it tighter,
  the hold and the lockup give back half a second between them without
  touching the structure.
- **The bird still becomes the lion.** His brief lists a particle
  transition as an acceptable handoff and the lion remains the permanent
  mark; the bird-appears-once rule stands unchanged.

---

## Addendum, 5 August 2026: what was actually built

Mark expanded the brief the evening of 4 August into a nine-beat storyboard,
and the film that shipped follows it beat for beat in eight seconds at 60fps
(480 frames):

| Beat | Frames | What happens |
|---|---|---|
| Black | 1 to 50 | Nothing but the ground colour |
| First light | 50 to 165 | A tiny gold star grows and becomes the bird |
| Arrival | 120 to 268 | Slow, graceful wingbeats; each downstroke sheds a little gold dust |
| Hover | 268 to 352 | The bird rears upright at centre front and breathes |
| Focus | 352 to 374 | Its attention turns to the exact centre of the screen |
| Strike | 375 to 390 | A sudden dart; the bill tip lands exactly on the screen's centre axis |
| Pulse | 388 to 410 | A contained molten flash and one thin expanding ring; the bird dissolves into the light |
| Lion | 390 to 455 | The 30,000 points burst outward from the tap and settle into the lion, centred, no slide |
| Name | 438 to 480 | The wordmark draws in beneath the lion, the tagline fades in under it |

**The hero bird** is built on "Swallow-tailed Hummingbird" by Rodrigo Gelmi
(Sketchfab, Creative Commons Attribution), refinished entirely in the
verified brand gold with its own normal maps for feather relief, wings split
at measured shoulder seams onto hinge empties, and the credit added to the
About imprint. Two generative detours are recorded for honesty: Hyper3D
Rodin (free tier) delivered texture-dependent geometry that died in clean
gold, and Meshy 6 delivered a fine static sculpt whose baked pose could not
fly. The Sketchfab model beat both because its quality lives in geometry and
it was made to be reposed.

**Traps that cost time, so they are written down:**

- A Sketchfab FBX carries its own baked object animation. It silently
  overrides every transform you set (the bird rendered at 1 percent scale
  for an hour of debugging). `animation_data_clear()` on every imported
  part before rigging.
- Setting `location` on an object that already has location keyframes does
  nothing at render time. Delete the fcurves first (the wordmark).
- The BlenderMCP addon socket is single-flight: parallel MCP calls wedge
  its JSON stream and every later call times out until the server is
  stopped and started inside Blender.
- Geometry-node particle systems need an explicit born-gate on scale;
  `max(frame - birth, 0)` alone leaves every particle visible at rest
  before its birth frame.
- Blender 5.1 refuses this FBX's embedded light; wrap
  `io_scene_fbx.import_fbx.blen_read_light` and hand back a dummy lamp.

**The film pipeline** on the site side: CAP_MS 8000, CEILING_MS 10500, the
pre-paint cover failsafe 11000, codecs string re-derived from the actual
encode. Reduced motion still gets the poster (now the closing lion, name
and tagline frame). Section 7's cookies correction shipped. Doc 22 remains
the record of the point-morph mechanics that survive inside NG-burst; its
beat table and scene inventory are superseded by this addendum.
