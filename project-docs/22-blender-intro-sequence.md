# 22. The intro sequence: Doctor Bird into lion into lockup

**Written 29 July 2026 as a build guide. Rewritten the same day, once it was
built, as a record of what exists and how to change it.**

The opening Mark asked for in his creative brief. It replaced the CSS/SVG
stand-in that used to live in `components/brand/LoadingOverlay.tsx`.

---

## 1. What exists

**The film**, rendered from `~/Desktop/kul.blend` (deliberately outside this
repo, see the safety note in section 7):

```
public/videos/kul-intro.mp4          895KB  H.264, 1280x720, 60fps, 5.00s, silent
public/videos/kul-intro.webm         1.3MB  VP9, two-pass, same frames
public/videos/kul-intro-poster.jpg   107KB  frame 290, the settled lockup
```

**The beat**, 300 frames at 60fps:

| Frames | Seconds | What happens |
|---|---|---|
| 1 to 14 | 0 to 0.23 | Fade up from black on an empty frame |
| 1 to 72 | 0 to 1.20 | The bird approaches from 34 units out, flying straight at the lens, wings beating at 5Hz. It grows from about 50px to about 240px |
| 38 to 78 | 0.63 to 1.30 | It turns from head-on to 28 degrees, which is where the long beak and the twin streamer tail become readable |
| 88 to 186 | 1.47 to 3.10 | It comes apart into gold and the gold gathers into the lion |
| 186 to 230 | 3.10 to 3.83 | The lion slides right |
| 196 to 240 | 3.27 to 4.00 | The wordmark draws itself in, far end first, finishing against the lion |
| 240 to 300 | 4.00 to 5.00 | The full lockup holds for a second |

**Verified against the brief:**

- Gold samples `#d4a044` off an exported frame against a target of `#d6a145`,
  within 2/255 on every channel
- Ground samples exactly `#050301`, the same near-black the footer uses
- No audio stream exists in either file
- The mp4 is under the 1.5MB ceiling
- Frame 220 is unmistakably the KUL lion beside the real wordmark

---

## 2. How it is made, and why not the obvious way

**The lion and the wordmark are sampled from the brand artwork, not modelled.**
`lion-mark.webp` and the lettering cropped out of `logo-white.webp` are the
actual marks. A modelled lion would be an invention wearing the client's name.

**The bird is modelled, because it has to move.** It is built from parametric
solids in `GEO-morph`: an ellipsoid body, head and neck, a tapered tube for the
decurved beak, two tapered ribbons for the streamer tail, and two swept fan
wings. It faces -X, wings span +/-Y, up is +Z. Each wing hinges on the X axis at
its own shoulder, so the wingbeat is a real rotation and reads whether the bird
is head-on or broadside. A flat cut-out was tried first and had to be thrown
away: it vanished the moment it pointed at the lens.

**The lion is a tone-weighted stipple, not an alpha fill.** `lion-mark.webp` is
a full-colour illustration whose alpha is just the outer edge of a shaggy mane.
Distributing points by alpha gives a gold blob. Points are instead placed with
probability proportional to local brightness, after an unsharp mask that pulls
the mane strands apart, and each dot's size also rides that brightness. That is
what makes the brow, eyes and muzzle read.

**The ink budget is the whole game.** The first attempt used 16,000 dots at
radius 0.012 and produced exactly the "gold smudge" the brief warns about: too
much ink, so the dots merged and the tonal structure died. The settings that
work are 30,000 dots at radius 0.006, with lion dots scaling between 0.15 and
0.70 of a bird dot. If the lion ever goes muddy again, cut the radius before
adding points.

---

## 3. The scene

| Datablock | What it is |
|---|---|
| `GEO-morph` | 30,000 points. Vertex position is the bird pose; named attributes `target` (lion), `wpivot`, `wflex`, `wside`, `stagger`, `tone`, `burst` |
| `NG-morph` | Wingbeat, turn, flight offset, then the morph to the lion |
| `GEO-word` | 11,000 points sampled from the wordmark crop; attributes `origin`, `bow`, `stag` |
| `NG-word` | The draw-in. Dot size rides progress, so a point is literally nothing before its cue |
| `NG-comp` | Render Layers into Glare into a fade-from-black mix |
| `MAT-gold-dot` | Emission, strength 1.0 |
| `CAM-intro` | Perspective, 50mm on a 36mm sensor, dollying from y -9.30 to -9.00 |

**Modifier inputs, all keyframed:**

- `GEO-morph` `Socket_1` Morph, `Socket_2` Yaw, `Socket_3` Fly
- `GEO-morph` object `location.x` is the lion slide
- `GEO-word` `Socket_1` Reveal

The turn and the flight offset are applied **inside** the node group, upstream
of the morph, on purpose. If they were object transforms they would rotate and
fly the lion too, and the lion has to stay square to the lens at the origin.

**Common changes:**

| To change | Where |
|---|---|
| Wingbeat rate | `NG-morph`, the MULTIPLY node feeding SINE. Currently `2*pi*5.0/60` |
| Wingbeat depth | The MULTIPLY feeding it, currently 58 degrees |
| How far out the bird starts | The `Fly` keyframe at frame 1, currently y 30 |
| Lockup layout | `WORD_W`, `WORD_CX`, `LION_CX` in the wordmark build, and the `location.x` slide keyframe |
| Overall size | `CAM-intro` location y. Further back is smaller |

---

## 4. Colour management

View transform is **Standard**, not AgX, because this is flat brand artwork on
black and a film curve shifts the gold.

Two consequences that are easy to get wrong:

1. **Emission strength stays at 1.0.** Anything above 1.0 clips under Standard,
   and the gold renders pale yellow instead of `#d6a145`. The glow comes from
   the compositor, not from over-driving the shader.
2. **The emission colour is pre-compensated by 0.873.** The Glare pass adds
   light on top, so emitting the exact brand gold renders about 6 percent hot.
   Scaling the source down by what the bloom puts back lands the solid interior
   on brand. If you change the Glare strength, re-measure and re-derive that
   number rather than assuming it still holds.

Both colours are converted sRGB to linear before they go into a shader socket.

---

## 5. Blender 5.1 differences that cost time

Anything written for 4.x will mislead you here.

| Expectation | Reality in 5.1 |
|---|---|
| `BLENDER_EEVEE_NEXT` | The engine id is just `BLENDER_EEVEE` |
| `scene.node_tree` for compositing | Gone. It is `scene.compositing_node_group`, a `CompositorNodeTree` node group |
| Group Input feeds the render into that group | It does not. You still need an explicit `CompositorNodeRLayers` node. A pass-through group renders black |
| `action.fcurves` | Gone. Actions are slotted: `action.layers[].strips[].channelbag(slot).fcurves` |
| `CompositorNodeMixRGB`, `CompositorNodeMath` | Do not exist. Use `ShaderNodeMix` and `ShaderNodeMath` inside the compositor tree |
| Glare settings are node properties | They are input **sockets** now, and `Type` takes a display string such as `"Bloom"`, not an enum id |
| `ndarray.ptp()` | Removed by numpy 2. Use `np.ptp(arr)` |

---

## 6. Two bugs worth remembering

**The 180 degree object rotation.** `GEO-morph` carried `rotation_euler.z` of
180 degrees. Its world matrix was `diag(-1,-1,1)`, so flying the bird to `y=+26`
actually parked it 26 units **behind** the camera. The opening frames were
empty, then the bird ballooned across the whole frame as it punched through the
lens at frame 15, then settled. Every diagnostic said the scene was correct,
because `to_mesh()` returns **local** coordinates while the renderer places
instances in **world** space, and nothing compares the two.

The check that found it: enumerate `depsgraph.object_instances` and compare
`inst.matrix_world.translation` against the `to_mesh()` positions. They differed
by exactly a sign flip on x and y. Do that early next time. Before that, four
separate hypotheses (motion blur, Scene Time, instance scale, the compositor)
were each tested and cleared, which is the expensive way to arrive.

**Aspect normalisation on non-square sources.** The wordmark crop is 620x310.
Normalising x by image width and z by image *height* stretched the lettering to
twice its proper depth. Both axes must be divided by the same number, normally
the width, so a pixel stays square. The lion and bird sources are square, which
is why it never showed up until the wordmark.

---

## 7. Safety

Blender's own MCP documentation warns that the server executes generated code
inside Blender with no guard on your data. In practice for this job:

- The .blend lives at `~/Desktop/kul.blend`, outside this repo. Keep it that
  way, and keep nothing sensitive beside it
- Save before every render step. There is no undo across a Python crash
- Nothing here needs network access from inside Blender. If a prompt ever
  produces code that fetches a URL, stop and ask why

---

## 8. The site side

`components/brand/LoadingOverlay.tsx` plays the film. Every guarantee that was
in the CSS version is still there and still load bearing:

- First visit in a visitor's life, gated on `localStorage`
- Escape, any key, a click, a tap, or the Skip button ends it immediately
- A hard cap dismisses it whether the film plays, stalls, or never arrives
- It renders nothing on the server and mounts after first paint, so the hero is
  still what the browser measures as the page's main content
- Reduced motion gets the poster frame for 400ms and no film at all
- If the video 404s or autoplay is refused, the overlay leaves rather than
  holding a black screen

**The cap is now 5000ms.** It was 2500 when the film ended on the bare lion,
then 3750 when the lockup arrived, and it is 5000 now the piece runs slower and
holds the finished lockup for a second. It has to be at least the length of the
film or the cap cuts the ending off. Every escape hatch above is unchanged, so
the visitor who does not want to watch still pays nothing.

**The overlay uses `object-contain`, not `object-cover`.** The closing lockup is
3.38 world units wide against a frame 6.59 wide, which is wider than the centre
square, so a 9:16 centre-crop would clip it. Contain shows the whole frame on
any shape of screen and letterboxes in `#050301`, which is the film's own
ground, so the join is invisible.

**There is a pre-paint cover, and it is not CSS.** Mounting after first paint
protects the LCP measurement but costs a visible flash of the homepage before
the film appears. A blocking script at the top of `<body>` in `app/layout.tsx`
checks the same storage flag and, for a first-time visitor only, appends a
fixed `#050301` div at z-index 99. The overlay sits at 100 and clears the cover
as its exit fade **starts**, so the fade reveals the site instead of fading to
black and snapping.

It carries inline styles rather than a class on purpose. A stylesheet is a
second thing that has to arrive and compile before it can hide anything, which
is the exact race this exists to win. (It was first written as a CSS rule in
`globals.css` and the rule never reached the browser, because two dev servers
were sharing `.next` in this folder. Inline styles removed the dependency
entirely.) It also removes itself after 8 seconds, so a bundle that fails to
load cannot leave a black sheet over a working site.

**Skip is a glyph, not a word.** The standard skip-to-end symbol, in a 44px
circular target, with an `sr-only` "Skip intro" so the accessible name survives.

**It leaves upward, the way the panel between pages does.** The exit is a 500ms
`-translate-y-full` on the route transition's own curve, matched to the `OUT` in
`RouteTransition.tsx`. The opening and the cut between pages are the same
gesture and should read as one. Reduced motion keeps the old opacity exit.

### The black screen, and why the cover caused it

Reported once the cover shipped: the intro triggered and showed nothing but
black for its whole length.

The overlay used to start at `opacity-0` and only become visible when a
`requestAnimationFrame` callback flipped an `entered` flag, so it could fade in.
That was survivable before, because a frame that never came just left the page
showing. It is fatal underneath an opaque cover: no frame, no overlay, and the
cover holds a black screen until the cap fires. Browsers stop issuing frames to
a tab nobody is looking at, which is the same trap `RouteTransition.tsx` already
documents at length about using `setTimeout` rather than rAF for its push.

**The fix:** there is no entrance animation at all. The overlay paints opaque on
its first frame. There was never anything to fade in from, because the cover
underneath is already the film's own ground colour.

**And a watchdog**, because the cover makes every "no frames are arriving" path
into a black screen. If the film has not started moving within 1500ms and the
tab is genuinely visible, the overlay leaves and gives the visitor the site. A
skipped opening is far cheaper than four seconds of nothing. Hidden tabs are
exempt: browsers stall media there deliberately and nobody is watching.

---

## 9. Still open

- The Skip glyph was designed here rather than picked from Mobbin: that MCP
  server needs authorising and was not connected. Worth a second look against
  the reference set
- The tagline that used to sit under the lion was removed, because the film now
  ends on the full lockup and an HTML line over the top competed with it. If
  Mark wants it back it is a small block in the overlay
- Nobody has watched this on a real phone yet. The film has never been caught
  mid-play in an automated screenshot either: the preview tab reports itself
  hidden between calls, which pauses `requestAnimationFrame` and therefore the
  mount, and each round trip outlasts the film. What was verified instead is
  every part separately: assets serve 200, the mp4 decodes at 1280x720 for
  5.00s, autoplay resolves, the browser picks the webm, the gate flag gets set,
  the cover covers, and the page is intact afterwards
