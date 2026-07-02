# Higgsfield Prompt: KUL Intro Animation (Video Backup)

Backup plan for the site intro: generate the bird-to-logo transition as a video with Higgsfield image-to-video, in case we ever want a filmic version instead of the CSS build. Upload the two reference images and use the prompt below.

## Setup
- Mode: Image-to-video with start and end frames
- Start frame: crop of the Doctor Bird artwork on pure black (use `public/images/brand/doctor-bird-flight.png` composited on a #0B0B0B canvas, bird placed at the left third)
- End frame: the KUL logo lockup centered on pure black (use `public/images/brand/kul-logo-lockup.png` on #0B0B0B, with the three tagline lines beneath it in small gold capitals)
- Duration: 4 seconds. Frame rate: 30fps. Resolution: 1920x1080 (also render a 1080x1920 vertical pass if offered)
- Motion strength: low to medium. No camera movement.

## Prompt

A luxury brand intro animation on a pure black background (#0B0B0B). A golden Jamaican Doctor Bird, a streamertail hummingbird with two very long elegant tail streamers, flies in from the left side of frame in smooth side profile, wings beating gracefully at a relaxed pace, its long twin tail streamers flowing and rippling behind it like silk ribbons. As it flies, it leaves a fine trail of small glowing gold particles (#D4AF37) that drift and fade behind it, subtle and clean, never busy. The bird decelerates as it reaches the center of frame, pitches up gently, and flares its wings into a full open spread, tail streamers sweeping forward under it. On the flare, the bird dissolves upward into a soft swirl of gold particles. The particles drift down and settle, resolving into a metallic gold logo: the letters KUL in bold italic capitals with a regal lion head on the right, and the word ENTERPRISES in white capitals beneath. The logo fades in with quiet confidence and holds. Below it, three short lines of small gold capital letters fade in: STRENGTH IN MOTION. BUILT ON INTEGRITY. DRIVEN BY SAFETY. A thin horizontal gold light shine passes under the text. Everything ends at rest on black.

Style: cinematic, premium, restrained, luxury automotive commercial energy, deep blacks, metallic gold accents only, soft glow, subtle film grain, elegant easing, no flashy effects.

## Negative prompt

no camera shake, no camera movement, no zoom, no background scenery, no sky, no trees, no colors other than black white and gold, no lens flares across the whole frame, no text other than the logo and tagline, no watermark, no cartoon style, no fast strobing, no busy particle explosions

## Notes
- The bird must match the uploaded artwork: black head and back, gold and dark green iridescent body, golden wing feathers, curved gold beak, two extremely long thin tail streamers.
- The logo must match the uploaded lockup exactly. Do not restyle or redraw the letters or the lion.
- Deliver on pure black so the clip can sit over the site's #0B0B0B background seamlessly, or export with alpha if available.
- Trim so frame 1 and the final frame are both fully at rest for clean looping into the page reveal.
