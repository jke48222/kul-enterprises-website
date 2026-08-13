# 28. The bird animation prompt

Written 5 August 2026. A self-contained prompt for producing the opening
film from a rigged Doctor Bird model. Hand it to a Claude session along
with the input files it names. It encodes Mark's full brief, Jalen's
interpretation, and the production lessons from project-docs/27.

---

```
You are a senior 3D motion designer. Build an 8.0 second cinematic brand
opening in Blender from the input files listed below, and deliver it as a
finished mp4. Work autonomously: model nothing from scratch, verify
everything visually, and do not stop at "rendered" until the acceptance
checklist at the end passes.

INPUT FILES
1. bird-rig file: a RIGGED Doctor Bird (swallow-tail hummingbird) model.
   If it ships with baked animation clips (hover, flight, glide), those
   clips are the only acceptable source of wing motion. Never hand-key
   individual wing joints; if the rig has no usable clips, retarget a
   professionally animated bird cycle onto it instead.
2. gold-bird-reference.png: the approved look target. Metallic gold bird
   on pure black.
3. lion-mark artwork (the real KUL lion illustration) and the real KUL
   wordmark artwork. These are the brand marks. Never redraw, trace, or
   stylize them; sample them.
4. Brand constants: gold centred on #D6A145 (hue near 38, never yellow,
   never washed to white over large areas), background #050301, silent
   film, no audio track.

ART DIRECTION, NON-NEGOTIABLE
Luxury brand, cinematic, confidence through elegance, never excitement
through speed. Refined and realistic, not cartoonish. The whole bird is
premium metallic gold with no photographic colour: gold body, gold
feathers, readable dark eyes, long twin tail streamers, distinctive long
beak. Molten gold energy, never fireworks. The bird introduces the lion
and never competes with it.

THE SHOT, 480 FRAMES AT 60 FPS, CAMERA LOCKED (a slow 3 percent push
across the whole film is allowed, nothing else)
- f1-60: pure black. Nothing. Hold it.
- f55-110: a tiny gold light appears far away, like a star, and slowly
  grows as it drifts closer.
- f100-165: the light resolves: the bird MATERIALIZES out of the glow and
  its own gold dust while flying toward the viewer, so the audience
  realizes the star was the bird.
- f120-265: the approach. The bird flies facing the viewer using the
  rig's flight cycle, slow and graceful. It swerves gently once, an
  S-curve, left then back, never a straight mechanical line. Every
  downstroke sheds a small amount of gold dust that drifts and falls
  BEHIND the bird. Subtle, never a fountain.
- f265-300: the arrival. The bird decelerates into the centre of the
  frame, large (55 to 65 percent of frame height), and settles banked
  with its head in profile FACING SCREEN RIGHT, echoing the reference
  image's pose for a beat.
- f300-355: the hover. The rig's hover cycle, with a gentle breathing
  bob. During this window the bird turns smoothly from the right-facing
  profile to face the viewer dead centre. This is the moment to see
  feathers, eyes, and the beauty of the motion. Do not rush it.
- f355-378: the focus. The wings quiet to a shallow flutter. The head
  dips slightly toward the exact centre of the screen, like it has found
  nectar. Anticipation, near stillness.
- f378-390: the strike. A sudden, precise dart straight at the viewer,
  wings sweeping back along the body, the whole bird's nose leading. At
  exactly f390 the beak tip touches the exact centre axis of the screen.
  Gentle tap, not impact. Verify the contact point by measuring the
  evaluated beak-tip vertex in world space at f390, never by eye.
- f390-410: the transformation. From the tap point, a contained molten
  pulse: a soft golden flash and one thin expanding ring. The particle
  burst must be SPHERICAL (random unit directions times random radius,
  never a uniform box). The bird is absorbed into the light it released:
  it scales into the tap point and fades fast, wings first, so nothing
  lingers as ghost debris.
- f390-455: the lion. Thousands of gold points fly outward from the tap,
  spread across the screen, then settle INTO a stipple of the real lion
  artwork at screen centre. One continuous motion. The lion is never a
  fade-on.
- f438-470: the name. The real wordmark, KUL Enterprises LLC, condenses
  downward out of the falling gold, centred beneath the lion.
- f452-478: the slogan fades in quietly below the name:
  "Strength in Motion. Built on Integrity. Driven by Safety."
- f470-480: every remaining particle is gone. The final frame is only
  the lion, the name, and the slogan on black. Hold it. This frame is
  also exported as the poster.

MOTION QUALITY RULES
- Wing motion comes only from the rig's animation clips, time-scaled
  slower for grace. Blend clip speeds across beats (flight into hover
  into flutter) with continuous phase, no pops.
- The body leads every turn: pitch and bank precede translation. The
  dart pitches nose-toward-camera FIRST, then lunges.
- Enable depth of field (focus riding the bird, pulling to the lion
  plane after the tap) and motion blur sized so the dart streaks but the
  slow wingbeats stay crisp.
- Ease everything. No linear position ramps on hero moves.

PIPELINE RULES, LEARNED THE EXPENSIVE WAY
- After importing any model, run animation_data_clear() on every
  imported object before rigging or keying: imported files carry baked
  object actions that silently override your transforms.
- Setting a property that already has keyframes does nothing: delete its
  fcurves first.
- Gate every particle's render scale on frame >= birth, or particles sit
  visible before they spawn.
- Set the scene frame explicitly inside every render script.
- Measure anatomy (beak axis, head position) from evaluated world-space
  vertices, never from assumptions or thumbnails.

VERIFY BEFORE YOU CALL IT DONE
1. Render a contact sheet of every 4th frame and READ it, plus dense
   per-frame sheets across the four transitions (star-to-bird, dart and
   tap, burst onset, name reveal). Fix everything you find and re-check.
2. Run a per-frame average-luminance sweep across all frames; any jump
   over 6 units between neighbours is a pop to fix.
3. Sample gold pixels at several frames: mid-tones must sit near hue 38
   with strong saturation. Large pale-yellow or white areas fail.
4. Watch the beak-tap frame: beak tip and pulse origin must coincide.

DELIVERABLES
- 1920x1080 master render at 60fps, and a 1280x720 H.264 High yuv420p
  encode under about 2.2MB, silent, exactly 8.0 seconds, faststart.
- The final-frame poster as JPG.
- A honest summary of anything that still falls short.

ACCEPTANCE CHECKLIST
- A first-time viewer can narrate the story: black, a star, it is a
  bird, it arrives, it breathes, it notices, it strikes, gold becomes a
  lion, the name appears.
- The wings look like a living bird's, never mechanical.
- The bird is unmistakably a Doctor Bird: long twin streamers, long
  beak, elegant posture.
- Gold, never yellow. Molten, never fireworks. Confident, never rushed.
- Zero particles remain on the closing frame.
```
