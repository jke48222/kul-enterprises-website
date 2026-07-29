# 22. The intro sequence: Doctor Bird into lion

**Written 29 July 2026. For the next session, which starts fresh.**

This is the build guide for the opening sequence Mark asked for in his creative
brief: the Doctor Bird arriving and resolving into the KUL lion. It replaces the
CSS/SVG stand-in currently in `components/brand/LoadingOverlay.tsx`.

Everything below is written so a new chat with no memory of this project can be
handed it and start work.

---

## 0. Before you start: read this once

**Blender's own MCP documentation carries this warning, and it is not
boilerplate:**

> The MCP server will execute LLM generated code in Blender without any guards
> in place to protect your data from removal or being sent to a remote location.

What that means in practice for this job:

- The assistant can run arbitrary Python inside Blender. `bpy` can delete files,
  read anything the Blender process can read, and make network calls.
- **Work in a fresh, empty .blend file** saved somewhere disposable, not inside
  this repo and not in a folder with anything you care about.
- **Save before every render step.** Blender has no undo across a Python crash.
- Nothing in this guide needs internet access from inside Blender. If a prompt
  ever produces code that fetches a URL, stop and ask why.

Blender's suggestion is a VM. That is heavier than this job warrants, but the
"disposable folder, nothing sensitive nearby" version of the same idea is worth
keeping to.

---

## 1. Pre-flight

Checked on this machine on 29 Jul 2026:

| Requirement | Status |
|---|---|
| Blender 5.1 or newer | **Blender 5.1.1**, `/Applications/Blender.app` |
| The MCP add-on inside Blender | **installed**, `~/Library/Application Support/Blender/5.1/extensions/lab_blender_org/mcp` |
| `uv` (the bundle runs `uv run blender-mcp`) | **uv 0.11.28**, `/opt/homebrew/bin/uv` |
| The `.mcpb` installed into Claude Code | **not yet** — this is the only missing piece |

### Connecting it

The bundle is at `~/Downloads/blender-1.0.0.mcpb`. It has to be installed from
an **interactive** session; it cannot be done from inside a running task.

1. Open Blender. Preferences → Add-ons → make sure the **MCP** add-on is
   enabled and note the port it reports. Leave Blender open: the server talks to
   a *running* Blender, not to a file.
2. In an interactive `claude` terminal, run `/mcp` and install the bundle, or
   drag `blender-1.0.0.mcpb` into the client if it accepts drops.
3. Confirm before doing anything else. In the new chat, ask:
   **"List your Blender tools and tell me what the current scene contains."**
   If it cannot name the scene, the add-on is not enabled or Blender is closed.
   Fix that before prompting for geometry.

---

## 2. What we are making

A short, silent, one-shot piece of film. Not a loop.

**The beat:** a Doctor Bird flies in, and at the top of its arc it comes apart
into gold and the gold reassembles as the KUL lion mark, which holds for a beat
and then the frame goes dark.

**Why the bird at all.** Mark is Jamaican. The Doctor Bird is Jamaica's national
bird, and the Journey opens on him as a boy leaving the island. The lion is the
company. The sequence is the whole story in three seconds without a word of it,
which is the only reason it earns a place in front of the page.

**Hard numbers, from the existing implementation and Mark's brief §8.1:**

| | |
|---|---|
| Length | **2.5s maximum.** It auto-dismisses at 2.5s and it must be finished by then. |
| Aspect | 16:9 primary, plus a 9:16 crop-safe version. Keep the action inside the central square. |
| Delivery | `1280×720` H.264 mp4 **and** VP9 webm, plus a poster JPEG of the final lion frame |
| Weight | **Under 1.5MB for the mp4.** It sits in front of the page; a heavy file defeats the point. |
| Ground | Near-black `#050301` — the same value the footer uses, so it matches the site |
| Gold | `#d6a145` (lit gold, for dark grounds). Do **not** use `#a05c08`, that is the light-ground gold. |
| Sound | None. Silent, always. |

**Reference assets already in the repo** (give the new session these paths):

```
public/images/brand/bird-silhouette.webp   420×420, alpha, the flight shape
public/images/brand/bird-gold.webp         420×420, alpha
public/images/brand/lion-mark.webp         512×512, alpha, the nav mark
public/images/brand/logo-lockup.webp       1024×867, alpha, full colour lockup
```

---

## 3. The technique, and why not the obvious one

**Do not try to morph a bird mesh into a lion mesh.** Shape keys need matching
vertex counts and topology; a bird and a lion have neither. Every attempt at a
literal mesh morph between unlike creatures looks like melting plasticine, and
on a freight carrier's front door that reads as a gimmick.

**Use a point-cloud transfer in Geometry Nodes instead.** Sample N points on the
bird silhouette, sample the same N points on the lion silhouette, and animate
each point from its bird position to its lion position. Render the points as
small emissive gold instances on black.

This is the right call for four reasons: it is robust to completely different
shapes, it *is* the "masked gold trail" language in Mark's brief expressed in
3D, it degrades gracefully (a half-finished morph still looks deliberate), and
it renders fast because there is no complex geometry or global illumination.

---

## 4. The prompts, in order

Paste these one at a time. Wait for each to finish and **look at the viewport**
before sending the next. Do not paste them all at once.

### Phase 1 — Establish the scene

```
I want to build a 2.5 second intro animation in Blender for a freight
company's website. Before any geometry, set up the scene:

- New empty scene. Delete the default cube, light and camera.
- Render engine EEVEE Next. Resolution 1280x720. 60fps. Frame range 1 to 150.
- World background pure black.
- An orthographic camera on -Y looking at the origin, orthographic scale 4,
  so the XZ plane is the screen plane.
- Colour management: view transform Standard, NOT Filmic or AgX. This is
  brand artwork on a flat black ground and a film curve will shift the gold.

Tell me what you created and confirm the render settings back to me.
```

### Phase 2 — Get the two silhouettes in as geometry

```
I have two PNG-style silhouettes with alpha, at these paths:

  /Users/jalenedusei/KUL-Enterprises-Website/public/images/brand/bird-silhouette.webp
  /Users/jalenedusei/KUL-Enterprises-Website/public/images/brand/lion-mark.webp

For each one, build a flat mesh plane on the XZ plane, 3 units wide, with the
image as an alpha texture. Name them SRC-bird and SRC-lion. Put both at the
origin, SRC-lion hidden for now.

These are only sources to sample points from, so they never need to render.
Set both to not appear in renders.
```

If Blender cannot read `.webp` as a texture, ask it to convert:
```
Convert those two webp files to PNG next to the originals using Blender's
image API, then use the PNGs.
```

### Phase 3 — The point-cloud morph

This is the one that matters. Be specific and check the result.

```
Now build the morph with Geometry Nodes on a new empty object called
GEO-morph:

1. Distribute 12000 points on SRC-bird's surface, weighted by the image alpha
   so points only land where the bird is opaque. Use a fixed seed.
2. Do the same on SRC-lion with the same count and seed, and store those
   positions as a named attribute called "target".
3. Add a Float input on the modifier called "Morph", 0 to 1.
4. Mix each point's position from its bird position toward its target
   position by Morph, but stagger it: offset each point's individual timing by
   a small random amount (about 0.25 of the total) so the cloud comes apart
   and reassembles in a wave rather than all at once.
5. Instance a small icosphere on each point, radius 0.012.
6. Emissive material, colour #d6a145, strength 6.

Set Morph to 0.5 and show me a viewport render so I can see the halfway state.
```

**Check before continuing:** at Morph 0.5 you should see a recognisable cloud in
transit, not a uniform blob. If it is a blob, the stagger in step 4 is not
working — say so and ask for the per-point offset to be driven by a random value
per point rather than a global one.

### Phase 4 — Motion

```
Animate it:

- Frames 1-30: Morph stays 0. Move the whole cloud in from the left and
  slightly down, arriving at centre by frame 30, ease out. This is the bird
  flying in.
- Frames 30-105: Morph 0 to 1, ease in and out. This is the transformation.
- Frames 105-150: Morph holds at 1. The lion sits still.

Add a slow camera push: orthographic scale 4.2 at frame 1 to 3.9 at frame 150.
Very subtle, it should not be noticeable as a zoom.

Play it back and tell me if the timing reads as: arrival, transformation,
arrival at rest.
```

### Phase 5 — Finish

```
Add finishing, keeping it restrained:

- Bloom on the emissive points, low threshold, moderate intensity. Enough
  that the gold glows, not so much that the lion loses its edges.
- A very slight motion blur, shutter 0.4.
- Fade the whole frame from black over frames 1-12, and hold full brightness
  from there. Do not fade out at the end; the website handles that.

Render frame 130 as a still and show it to me.
```

**Check:** frame 130 is the settled lion. It has to be recognisably the KUL lion
mark. If it reads as a vague gold mass, the point count is too low or the sphere
radius too small — ask for 20000 points and radius 0.016 and re-render that one
frame before committing to the full sequence.

### Phase 6 — Render

```
Render frames 1-150 to PNG at /tmp/kul-intro/ with 32 samples.
Tell me when it is done and how long it took.
```

Then, **outside Blender**, in the repo:

```bash
ffmpeg -framerate 60 -i /tmp/kul-intro/%04d.png \
  -c:v libx264 -crf 23 -pix_fmt yuv420p -movflags +faststart \
  public/videos/kul-intro.mp4
```

```bash
ffmpeg -framerate 60 -i /tmp/kul-intro/%04d.png \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -an public/videos/kul-intro.webm
```

```bash
ffmpeg -i /tmp/kul-intro/0130.png -q:v 3 public/videos/kul-intro-poster.jpg
```

Check the mp4 is under 1.5MB. If it is not, raise `-crf` to 26 and try again
before reaching for a lower resolution.

---

## 5. Wiring it into the site

Hand the new session this, once the files exist:

```
The intro renders are now at public/videos/kul-intro.mp4, .webm and
kul-intro-poster.jpg. Rebuild components/brand/LoadingOverlay.tsx to play the
mp4 with the webm as an alternative source and the poster as its poster frame.

Keep every one of the existing guarantees, they are all load bearing:
- First visit only, gated on localStorage
- Dismissable by click, any key, or Escape
- A hard 2.5s cap that dismisses it even if the video stalls or 404s
- It renders nothing in the server HTML and mounts after first paint, so the
  hero is still what the browser measures as the page's main content
- Anyone who has asked for reduced motion sees the poster frame for about
  400ms and no video at all
- It must never be the thing that makes the page visible: if the video fails,
  the overlay goes away and the site is there

Then verify: load the page with a cleared localStorage, confirm the overlay
appears and dismisses on its own; reload and confirm it does not appear a
second time; and confirm the site still renders with JavaScript disabled.
```

---

## 6. What good looks like

You are finished when all of these are true:

- The mp4 is under 1.5MB and 2.5 seconds or shorter
- Frame 130 is unmistakably the KUL lion, not a gold smudge
- The bird is legible as a bird for at least the first half second
- The gold matches `#d6a145` when sampled off an exported frame
- The ground is `#050301`, so the overlay and the footer are the same black
- No sound track exists in the file at all
- On a second page load, nothing plays

## 7. If it goes wrong

| Symptom | Cause | Fix |
|---|---|---|
| Points land in a rectangle, not the shape | The alpha is not driving the distribution | Ask for the image alpha to be read into a density attribute explicitly, then used as the distribution weight |
| The morph is a uniform blob | No per-point timing offset | Per-point random offset, not a global one, in step 4 |
| Gold looks brown or washed out | Colour management | View transform must be Standard, not AgX |
| Render takes many minutes | Samples too high, or Cycles got selected | EEVEE Next, 32 samples |
| The lion is unreadable | Too few points, or spheres too small | 20000 points, radius 0.016 |
| Blender stops responding | A Python loop from a prompt | Force quit; the .blend is disposable, which is why it is not in the repo |
