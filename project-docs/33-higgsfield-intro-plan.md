# 33. The Higgsfield opening: working guide

Slimmed 12 Aug 2026 to what remains. The film is produced by hand in
Higgsfield's Cinema Studio 3.5 (Seedance 2.0 inside). Spec: the 20-panel
storyboard + Mark's email. Gold #D6A145 family, never yellow; ground
#050301; silent; molten, never fireworks. The strike is HEAD-ON at the
viewer (decided 12 Aug, overriding the profile panels 13-15). Every clip
runs BETWEEN two approved keyframes; adjacent clips share a frame.

## Status

| Piece | State |
|---|---|
| star.png (V1 start) | DONE, authored, in keyframes/ |
| kf-approach (V1 mid-ref) | Captured; full-res drop pending |
| kf-arrive (V1 end, V2 start) | Captured; full-res drop pending |
| kf-face (V2 end, V3 start) | Captured; full-res drop pending |
| kf-tap (V3 end, V4 start) | RAW frame is the anchor (recomposition CANCELLED: V4 was generated from it, so V3 must end on the same image). Jalen still drops `kf-tap-raw.png` so Claude can measure the spark for the ripple overlay |
| kf-pulse (V4 ref) | Captured; full-res drop pending |
| kf-lion (V4 end) | Captured; full-res drop pending |
| end-card.png (finale + poster) | Composited version DONE (in keyframes/); optional all-gold generated version still open, prompt below |
| kf-spread (V4 ref, optional) | Only if V4's first take misses the vortex |
| V4 takes 1+2 | REJECTED IN MOTION (13 Aug): take 1's head cleaves in two mid-dissolve and its lion fades up under the vortex; take 2 ignites inside the face (headless torso frames) and its burst is 1.5s of static wallpaper that ends as a crown on the lion. Root cause: one clip asked to do three semantic replacements; diffusion replaces by morphing. Both kept in assets-inbox/higgsfield/ as salvage donors |
| V4a ignition | SALVAGE, free: take 2 held to ~0.62s (face still dignified; by 0.78s it melts), then Claude's 3-4 frame white-gold flash ramp + ripple overlay completes the whiteout. `v4a-hold-end.png` extracted as the cut-point reference |
| V4b condensation | ONE new generation (~36 at 4s): start = `v4b-start.png` (take 1's clean vortex at 2.65s, extracted), end = kf-lion. Prompt below. Optional vortex interlude first: take 1's 2.55-2.78s, whiteout both sides |
| THE FILM | SHIPPED 13 Aug (v2 cut): Jalen generated the clips and cut the film in Final Cut Pro (master: ~/Movies/kul-intro.mp4, 15.93s 1080p30, finale = the lockup materialising from the gold). Claude COMPOSITED THE TAGLINE into the encode (ArchivoBlack, brand gold ramps, first phrase brighter, fades in at 12.9s; the FCP master does not carry it, so any re-encode must repeat the overlay: tagline-overlay.png + the ffmpeg call live in the session scratchpad, recipe below), encoded **1080p CRF22 H.264 High L4.0** (9.26MB, codecs `avc1.640028`; the first 720p pass was judged too soft), swapped film + poster (poster carries the tagline), re-derived CAP 15950 / CEILING 18500 / layout failsafe 19000, and made the exit THE FILM'S FINAL TWO SECONDS: a 2000ms linear opacity crossfade starting at CAP minus EXIT, completing as the film ends. **TWO CUTS SINCE 13 Aug:** the client also cut a portrait version
(`~/Movies/mobile-intro.mp4`, 720x1280, 24fps, 15.79s), encoded the same
way to `public/videos/kul-intro-mobile.mp4` (3.2MB) with its own THREE-LINE
tagline overlay (`tagline_mobile.py`; one line will not fit 720px) and its
own poster. The player picks the cut once at mount from
`(max-aspect-ratio: 1/1)` and keys the `<video>` on that choice; a `media`
attribute on a second `<source>` does NOT work (browsers dropped it).
Fit per cut, as media queries so rotation re-evaluates for free: cover
inside 3/2..2/1 for landscape and 1/2..3/4 for portrait, contain outside,
because the closing lockup spans ~90% of frame width and the tagline sits
near the bottom edge. Typical phones (0.46) therefore letterbox; that is
deliberate, and **GROUND is now #000000, not #050301**, because both cuts
measure true black at every corner and the old near-black made the bands
visibly lighter than the picture. app/layout.tsx's pre-paint cover matches.
Three earlier 13-Aug polish notes: the video element carries NO poster attribute (the poster was the closing card and flashed the ENDING at first paint; the ground's black covers preload, the reduced-motion still keeps the lockup image, and the autoplay-refusal path now switches to that still), the skip control is the bare glyph (ring removed; keyboard focus gets a gold ring), and `-level:v 4.0` must be forced on encodes (x264 otherwise stamps L5.0, which older phones reject). Verified live: no end-card flash at open, tagline on screen, crossfade hands to the homepage, console clean. Re-encode recipe: overlay tagline PNG with fade=t=in:st=12.9:d=0.8:alpha=1, libx264 preset slow crf 22 -profile:v high -level:v 4.0 yuv420p +faststart -an at source 1080p |
| THE FILM, v3 polish | SHIPPED LOCALLY 3 Sep 2026 for Mark's two 13 Aug notes, built by Claude from the FCP masters (no re-cut in Final Cut): (1) the frontal hold, master frames 217-241 (7.23-8.03s), runs 40 frames instead of 25: Topaz on Higgsfield (`topaz_video`, `frame_interpolation` {model apo-8, fps 60, slowmo 1}, 3 credits per clip) doubled the frames and `build.py` picks 38 of them on an S-curve (slope 1.30 at the edges, 0.70 mid-hold, strictly increasing so nothing repeats) between the two untouched anchor frames; (2) the burst peak is softened by a ramped `eq` grade (brightness -0.09, contrast -12%, saturation +8%, in over 8.35-8.47s, out by 8.97s) and the vortex 9.0-11.0s is eased faster (1.25x / 1.7x / 1.25x) with `minterpolate` (scd=none, or it duplicates frames on fast particles) so it runs ~1.4s; the lockup forming and the tagline tail are untouched. Assembled as an exact PNG sequence, encoded CRF20 (mobile 21) High L4.0 with explicit BT.709 conversion and tags (a PNG round trip drops them). Result: 471 frames 15.70s 10.4MB and 374 frames 15.583s 3.3MB; every seam measured (frame-to-frame change sits inside the film's natural motion; no repeated frames except the source's own 24-to-30 pulldown cadence, which is unchanged). Constants CAP 15700 / CEILING 18250 / layout failsafe 18750. Tooling, Topaz clips and the Aug 13 files live in `assets-inbox/higgsfield/v3-polish/`. |
| Post + site integration | Claude, after clips land |

All full-res downloads go to `assets-inbox/higgsfield/keyframes/` under
the names above. Remaining spend at 1080p: ~180 clean for the four clips,
plus ~25 calibration, plus retries; images are 2 each.

## Fixed settings, every clip

Camera style Classic Static; light scheme Contre-jour; colour grading
Naturalistic Clean; genre Drama; audio OFF; prompt enhancement OFF (and
never let Mr. Higgs rewrite a prompt); language English; 16:9; 1080p
finals, 720p only for the calibration run. Read the credit price on the
Generate button every time (~9/s at 1080p, ~4.5/s at 720p); a big premium
means a wrong setting. Generate clips SEQUENTIALLY, one retry per clip,
then change something instead of re-rolling.

**STYLE BLOCK (tail of every prompt):** Premium metallic gold on a pure
black void. Rich deep gold, molten and luxurious, never yellow, never
washed out to white. Fine drifting gold dust. Cinematic rim light.
Refined, elegant, unhurried, luxury-brand aesthetic.

## Remaining stills

**End card, all-gold generated (optional).** Attach the real
`public/images/brand/logo-lockup.webp`. Never say logo/recreate/watermark
(IP filter). Escalation: Nano Banana Pro, then Flux Kontext, then GPT
Image 2; zero-credit path is the existing gold sample + tagline
composited by Claude.

> Turn this image into a luxurious polished-gold version of itself. Keep
> everything exactly where it is and exactly as it reads, changing only
> material and colour: every element becomes rich polished metallic gold
> with a subtle brushed texture and soft warm reflections, on a pure
> black background. Deep gold, molten and luxurious, never yellow.
> Cinematic studio lighting, elegant, premium.

**kf-spread (only if needed).**

> Thousands of tiny gold particles drifting across a deep black void in
> one slow elegant spiral current, denser toward a softly glowing centre,
> fine molten-gold dust with a few delicate curling filaments of light,
> no recognisable shapes, refined and luxurious. + STYLE BLOCK

## The clips

Every clip: start + end frame per the status table, plus
`gold-bird-reference.png` / @GoldBird attached. Once V1 is approved,
attach it as a video reference on V2-V4 so grain and gold stay
consistent.

**Calibration first: run V2 at 720p 5s (~25).** It answers identity hold,
gold hue, motion grace and end-frame adherence before 1080p money. A
calibration take is never the final take; re-runs are new takes.

**V1. 6s, ~54.** star.png to kf-arrive; kf-approach attached as extra ref.

> The distant point of golden light drifts slowly closer and resolves
> into @GoldBird materialising out of the glow and its own gold dust,
> flying toward the camera in slow motion. Slow graceful wingbeats; each
> downstroke sheds a few tiny gold sparkles that drift and fall behind
> it. The bird grows larger, banks through one gentle S-curve, then
> decelerates and settles large in frame, broadside, facing right. Very
> slow push-in. + STYLE BLOCK

**V2. 5s, ~45.** kf-arrive to kf-face.

> @GoldBird hovers in place with slow graceful wingbeats and a gentle
> breathing bob, fine gold dust drifting off each stroke. It calmly
> turns from its right-facing profile to face the camera head-on, wings
> spreading into a symmetrical raised V, twin tail streamers swaying
> softly beneath it. + STYLE BLOCK

**V3. 4s, ~36.** kf-face to kf-tap; v3-midref.png (the lunge reject)
attached as extra ref.

> @GoldBird grows almost still, wings quieting to a shallow flutter,
> gaze fixed on the viewer. A brief poised pause. Then it darts straight
> toward the camera with sudden hummingbird speed, wings sweeping back
> along its body, beak leading, growing large as it closes the distance,
> and the tip of its beak gently touches an unseen glass surface at the
> exact centre of the frame with a tiny molten-gold spark. A precise,
> delicate tap, never an impact. Controlled, elegant, confident.
> + STYLE BLOCK

**V4b. 4s, ~36.** `v4b-start.png` (take 1's clean vortex frame) to
kf-lion. Its ONLY job is condensation; the ignition is salvaged take-2
footage plus Claude's flash ramp, and the seam is a whiteout cut.

> The swirling cloud of golden dust slowly drifts inward and condenses.
> Out of the settling gold, the form of a majestic lion with a full mane
> gathers and solidifies, facing the camera, particles landing softly
> onto its mane and shoulders like dust coming to rest. As it completes,
> the light calms, the last particles settle and fade, and the lion
> holds still, fully formed on the black void, nothing left radiating
> around it. Slow, refined, luxurious molten gold, never fireworks.
> Locked camera. + STYLE BLOCK

Accept per clip: same bird as the anchors, gold never yellow or blown to
white, motion calm and alive (a good-but-quick take is retimed in the
edit, not re-rolled), first and last second near the anchors (small drift
is absorbed by the cut). V4b only: the lion forms FROM the settling
gold, never fades on, and the last second is CALM: no filaments or burst
still radiating around the finished lion, particles at rest.

## Post and integration

THE CUT IS JALEN'S, IN FINAL CUT PRO (12 Aug). Claude supplies built
elements into `assets-inbox/higgsfield/fcp/` and takes the finished cut
back as a ProRes export for the delivery encode and the site swap. Cut
target ~11s storyboard-faithful (black 1s, star grow 1s, V1 trim ~3.2s,
V2 ~1.8s, V3 ~1.1s, V4 ~1.9s, crossfade to end card + hold ~1.2s); an
8.0s tight trim is the free alternative; Mark picks at rough cut.

- `pre-black-to-star.mov`: DONE. ProRes 422 10-bit 1080p24 (the takes'
  native rate; FCP project is 1080p/24), 3.0s (1.2s
  black, 1.0s ignition, 0.8s live hold; every hold frame equals star.png
  = V1's first frame, so the cut into V1 lands anywhere from 2.2s on).
  Claude re-renders at the timeline's fps on request.
- Tap ripple + contact spark: Claude renders a ProRes 4444 alpha overlay
  for the V3/V4 seam, centred at (960, 540), igniting into V4's pulse
  (pending; sized once kf-tap.png exists). The engine cannot draw
  "touching the camera", so the contact lives in motion + this overlay.
- Grade in FCP: black floor at or below #050301, gold mid-tones near hue
  38, the pulse the only luminance jump. Claude sweeps the export for
  pops and hue drift before encoding.
- Delivery (Claude, from the ProRes export): 1080p archive + shipping
  1280x720 H.264 High yuv420p faststart ≤ ~2.2MB, silent. The `<source>`
  codecs string in LoadingOverlay must match the actual encode
  (currently avc1.640020). One mp4 source, never a webm.
- Swap `public/videos/kul-intro.mp4` + `kul-intro-poster.jpg` (poster =
  final frame). Constants: CAP_MS = film length, CEILING_MS = CAP +
  2500, app/layout.tsx pre-paint failsafe = CEILING + 500. Rewrite the
  LoadingOverlay header prose (it describes the old film) and the "five
  seconds of film" cap comment. Baked tagline must equal the CMS
  {tagline} value.
- Verify on a FRESH tab: Chrome, real Safari, phone-width letterbox;
  poster under throttling; skip, Escape, reduced-motion, deep-link
  bypass. Storyboard side-by-side sheet (one screenshot per panel) goes
  to Mark.

## Traps already paid for

- IP filter: logo/recreate/watermark wording flags even our own mark;
  phrase as recoloring the attached image.
- Surface invention: any ripple-on-glass ask becomes a pond or ceiling;
  keep contact out of stills.
- Near-miss takes: an edit-instruction pass ("tilt the beak into the
  lens, contact point equal space above and below, nothing else
  changes") is cheaper than a fresh roll, but geometry re-aims often
  fail; two attempts max.
- prompt_language defaults Chinese under the hood; keep English set.
- Motion is not reproducible across runs: drafts calibrate prompts, not
  takes.
- One clip, one job: a semantic replacement (bird becomes energy becomes
  lion) inside a single generation is performed by MORPHING: heads
  cleave, torsos go headless, the old subject lingers. Give each clip
  one transformation at most and hide the joins in whiteouts or cuts.
