# KUL Intro Video — Higgsfield Generation Brief

Goal: a cinematic ~6s version of the opening sequence (bird → gold particles → lion) as video.
The canvas intro at `multiverse/intro/` remains the interactive web version; this video is the
cinematic master — usable as a hero/social/presentation asset or as a drop-in replacement for
the canvas intro if it outclasses it.

Pipeline: 3 keyframe stills (Jalen approves) → 2 video segments conditioned on those frames →
stitch + grade + type composite in post (ffmpeg). Aspect 16:9, 1920×1080.

Models (per higgsfield-generate skill): reference-conditioned image model (Nano Banana family)
for the stills — conditioning on OUR brand art so the bird/lion match Mark's assets exactly —
then Seedance 2.0 image-to-video with start/end frames per segment.

Reference images to attach on every still generation:
- Bird: `assets-inbox/bird-kit/transparent-bird-rest.png`, `transparent-bird-flight-wings-up.png`,
  `transparent-bird-flight-wings-down.png` (gold/black Red-billed Streamertail, twin tail streamers)
- Lion: `multiverse/assets/brand/lion-clean.png`

## Shared style block (appended to every prompt)

> Ultra-premium cinematic brand film still. Pure near-black ground (#0B0B0B) with warm metallic
> gold (#D4AF37) as the only color family. Volumetric warm light, subtle film grain, anamorphic
> depth, vast negative space. Elegant and restrained — Mercedes-Benz, not Monster Energy.
> No text, no watermark, no logos except where specified. 16:9.

## Still 1 — "The Approach" (start frame)

> A tiny gold-and-black Jamaican Doctor Bird — long twin tail streamers — flying toward camera
> out of a black void, small in frame (~10% of frame height, upper-left third), rendered as
> refined metallic-gold illustration matching the reference art (not photoreal, not cartoon).
> A faint warm glow gathers around it; the first hint of gold particle shimmer trails off the
> streamers. Stillness, distance, a single point of warm life in the dark.

## Still 2 — "The Dissolve" (middle frame)

> The same Doctor Bird large at center frame, gliding past the camera plane with confident,
> unhurried purpose. The front half of the bird is still crisp; its trailing half and twin
> streamers are dissolving into thousands of fine gold particles sweeping across the frame like
> ember dust. The particle stream is beginning to gather at frame-right into the faint
> suggestion of a lion's silhouette. Composed energy — flowing, not chaotic.

## Still 3 — "The Lion Holds" (end frame)

> A majestic gold lion head — matching the reference lion art exactly — fully formed from
> settling gold particles, centered in the upper two-thirds of frame on pure black. The last
> stray particles drift and settle around the mane like embers. No bird anywhere. The lower
> third is clean empty black (type gets composited in post). Regal, still, permanent.

POST NOTE: the wordmark + tagline ("Strength in Motion. Built on Integrity. Driven by Safety.")
are NOT generated — they get composited over the final seconds from the real vector lockup, so
brand type is pixel-perfect. Generated text is banned (models mangle letterforms).

## Video segment A (0–3s) — Seedance 2.0, start=Still 1, end=Still 2

> Locked camera with a slow subtle push-in. The distant gold bird flies from the dark toward
> and past camera with purposeful, unhurried wingbeats; a trail of warm gold particles streams
> off its twin tail streamers, growing as it approaches. Black void, volumetric warm glow,
> film grain. Confident, calm, cinematic pacing — no cuts.

## Video segment B (3–6s) — Seedance 2.0, start=Still 2, end=Still 3

> The gold particle cloud sweeps across the black frame in one graceful swirl and converges,
> resolving into a majestic gold lion head; the bird is gone. Particles settle like embers
> until the lion holds perfectly still. One continuous motion, decelerating smoothly to
> stillness — no cuts, no flicker.

## Post (ffmpeg, local)

1. Stitch A+B, trim to ~6s, fade from black (0.3s) and hold final frame 1s.
2. Subtle grade: lift blacks slightly warm, gentle vignette.
3. Composite the real vector wordmark + tagline over the final 1.5s (fade-in).
4. Export: H.264 MP4 (~2–3MB, 1080p) + WebM; poster still from the final frame.
5. Wire into `multiverse/intro/` as an optional `<video>` mode beside the canvas engine
   (reduced-motion still shows the static final frame; Skip stays).

## Gate

Stills go to Jalen for approval BEFORE any video generation is spent.
