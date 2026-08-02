# The Journey — scene specs (v2 rebuild)

Produced 30 Jul 2026 by a 17-agent research pass, one agent per scene, each
sourcing its own motion reference from Mobbin in an assigned lane so no two
scenes borrow the same mechanic. Reviewed by a coherence critic; see
24-journey-coherence-review.md for the collisions and fixes that pass found.

THE TWO CONSTANTS, which every scene inherits and none may override:
the light arc (each section paints a gradient from its own stop to the next,
so the whole page is one continuous sunrise in pure CSS), and the archival
furniture (scene number, time stamp, plate number, always Archivo 11px).

---

## Scene 01 — Every Road Has a Beginning

**Reference:** Artlist — https://mobbin.com/screens/09a09bcc-30f0-4c97-8841-5b7f158bb59c

- **Take:** Type sits DIRECTLY on the moving frame with no card, no panel, no scrim rectangle, and no rounded video container. The footage is graded down hard enough that a single weight of light serif holds full contrast anywhere in the frame, so the headline reads as a title burned into the film rather than a caption laid over a background. Also worth taking: the frame is full-bleed to all four edges, so the browser window becomes the screen.
- **Leave:** Everything centred, the button, the logo wall, the sub-deck. Artlist is a hero selling a product in one viewport; this is the first card of a documentary that runs for sixteen more scenes. Drop the centre axis for a left rail, drop the CTA entirely, and drop the single flat type size for a scale that funnels.

**Why it differs from every other scene:** It is the only scene in the seventeen where the frame itself opens rather than the content arriving into a fixed frame, the only one running full-bleed motion with no photographic plate and therefore no PL. number, and the only one whose entrance fires on load instead of on scroll into view.

### Layout
Section is 260vh tall (190vh at <=768px). Inside it one .stage: position:sticky; top:0; height:100svh; overflow:hidden. Never animate that height.

Layer stack, bottom to top, all position:absolute inset:0 except where noted:
L0 ground #08090a, inherited from the light-arc root. The scene sets no background.
L1 video dash-night, object-fit:cover, object-position 50% 55% desktop / 50% 62% mobile, filter: brightness(0.42) saturate(0.85).
L2 flat veil rgba(8,9,10,0.55).
L3 the iris: a 300vmax square, left:50% top:50%, margin -150vmax, transform-origin centre, background: radial-gradient(circle closest-side, rgba(8,9,10,0) 0%, rgba(8,9,10,0) 46%, rgba(8,9,10,0.86) 64%, #08090a 82%). Scaling this element is the only thing that opens the frame.
L4 static vignette: radial-gradient(closest-corner, transparent 40%, rgba(8,9,10,0.72) 100%).
L5 grain: 180px tiling SVG feTurbulence, opacity 0.035, mix-blend-mode:overlay, no animation.
L6 type column. L7 furniture. L8 scroll cue.

TYPE COLUMN at 1440: left rail 96px, block bottom-anchored with its last baseline 152px from the stage bottom, max-width 1248px. Reading order top to bottom:
  "Every company has a story." / "Ours began long before the first truck." / "It began with character." — three separate lines, 26px, line-height 38px, max-width 30ch.
  56px gap.
  "Every road has a beginning." — 92px, line-height 0.98, one line (measures ~1140px, clears the column).
  12px gap.
  "This is mine." — 92px, same metrics. A 2px x 0.9em #D6A145 hairline sits in the gutter 24px left of its cap, aligned to the cap height, and marks the one line where Mark speaks about himself. It is the only gold fill in the scene.

FURNITURE at 40px inset (20px mobile): top-left "SC. 01", top-right "03:41". No plate number. This scene carries no photograph, and the standing rule it sets for the other sixteen is that PL. NN belongs to the 26 stills only. Motion never gets a plate.

SCROLL CUE bottom-centre, 48px from the bottom edge: a 1px x 40px rule at rgba(252,252,252,0.22) with a 4px #D6A145 dot on it. Wrapped in <a href="#scene-02">, so it is the page's first tab stop and actually goes somewhere.

AT 375: rail 20px, preamble 17px/26px, both display lines 38px/1.02 with the display block capped at 300px so "Every road has a beginning." wraps to two lines and "This is mine." holds one. Block bottom-anchored at 120px so it clears the cue. Furniture unchanged at 11px. 720p video variant only, preload="metadata".

### Motion
The frame opens like a camera aperture. This is the oldest opening device in cinema and it is the literal argument of the words: the scene starts as a single pool of headlight in near-black and widens until the whole road is visible. Nothing else on the page does this, and nothing else is allowed to.

Scroll progress p = 0 when the section top meets the viewport top, 1 when its bottom meets the viewport bottom. Driven by CSS animation-timeline: scroll() where supported; otherwise one rAF-throttled scroll listener writes a single --p on the section, registered via @property { syntax:"<number>"; initial-value:1; inherits:true }. Note the initial value is 1, meaning fully open. A stalled or absent script leaves the scene finished, not blank.

  Iris (L3), transform: scale() only.
    p 0.00  scale(0.10)  core reads ~200px across at 1440, a headlight pool
    p 0.34  scale(0.86)  cubic-bezier(0.4, 0, 0.2, 1) into this stop
    p 0.62  scale(2.60)  cubic-bezier(0.4, 0, 0.2, 1), gradient now off-screen, frame fully clear
    p 1.00  scale(3.40)  linear, keeps the edge out of shot as scene 2 arrives
  Video (L1), transform: scale() only. 1.14 at p 0 settling to 1.00 at p 0.55, linear. The frame stops breathing at the same moment it finishes opening.
  Type column, p 0.68 to 1.00: translateY 0 to -64px, opacity 1.00 to 0.55. It recedes, it never blanks, and 0.55 is chosen because that is still 5.1:1.
  Scroll cue: opacity 1 to 0 across p 0.00 to 0.12. Its dot loops translateY 0 to 22px, 2400ms, cubic-bezier(0.65, 0, 0.35, 1), infinite.

ENTRANCE. Scene 1 is above the fold, so there is no IntersectionObserver and no JS gate anywhere in the entrance path. Five plain CSS animations fire on load: `line-settle 760ms cubic-bezier(0.16, 1, 0.3, 1) both`, keyframes from { transform: translateY(18px); opacity: 0.55 } to { transform: none; opacity: 1 }. Delays 0 / 140 / 280 ms for the preamble, then a deliberate hole, then 560 / 780 ms for the two display lines, so the couplet lands as its own beat after the setup. The start state is 0.55 opacity and 18px low, not invisible. If every animation on the page stalls, all five lines are still legible at 5.1:1 and only slightly out of position.

Only transform and opacity animate. No width, height, top, left, filter or background-position is ever tweened.

### Interaction
Deliberately almost none. A title card that responds to the pointer is a title card that stopped being a title card. There is exactly one real affordance: the scroll cue is a genuine <a href="#scene-02">, the first tab stop on the site, with a 2px #D6A145 focus ring at 3px offset, and :focus-visible forces its opacity back to 1 regardless of scroll position so a keyboard user can always see where they are. No hover states, no parallax-on-mousemove, no click-to-unmute. The video is muted, looped and has no audio path at all in this scene.

### Typography
Two faces, never mixed inside a line.

MARK, Newsreader variable:
  Preamble, the three setup lines: font-variation-settings 'opsz' 18, 'wght' 300. 26px / 38px, letter-spacing 0.005em. opsz 18 rather than 72 so the serifs thicken and hold at small size.
  Display, "Every road has a beginning." and "This is mine.": 'opsz' 72, 'wght' 300. 92px / 0.98, letter-spacing -0.022em. Weight 300 and not 200 is a deliberate optical compensation: a 200 hairline serif at 92px on near-black blooms and loses stem, so it reads lighter than it measures. 300 on this ground looks like 200 on white.
  Both display lines share a weight. The couplet is one utterance and splitting its weight would editorialise Mark's own writing.

THE SITE, Archivo:
  Furniture "SC. 01" and "03:41": 500, 11px, letter-spacing 0.1em, uppercase, #FCFCFC at 0.62.
  Nothing else on this scene is set in Archivo. There is no eyebrow, no kicker, no button label.

Mobile: preamble 17px / 26px with 'opsz' 14; display 38px / 1.02, 'opsz' 40, letter-spacing -0.015em.

### Contrast
The ground under the type is not flat #08090a, it is graded footage, so every ratio below is measured against the WORST case: the brightest pixel in dash-night (a headlight core sampling ~#E8E2D4 raw) after brightness(0.42) and the rgba(8,9,10,0.55) veil, which composites to #302F2E, relative luminance 0.0286.

  #FCFCFC body and display type on #302F2E worst case: 12.9:1. On the flat ground where most of the type actually sits: 19.4:1.
  #FCFCFC at the 0.55 entrance floor (blends to #A0A09F) on #302F2E: 5.1:1. This is why the entrance bottoms out at 0.55 and not 0. It passes AA even if the animation never runs.
  #FCFCFC at the 0.55 scroll-exit floor: same 5.1:1.
  #D6A145 hairline on #302F2E: 5.75:1. It is a 2px rule, not text, but it clears AA for normal text anyway.
  Furniture, #FCFCFC at 0.62 (blends to #AEAEAD) on #302F2E: 5.95:1 at 11px. Passes AA for normal text at the worst pixel in the frame.
  Focus ring #D6A145 on #302F2E: 5.75:1, above the 3:1 non-text minimum.

### Reduced motion
A complete scene, not a stripped one. Under prefers-reduced-motion: reduce:

  The <video> is not rendered at all. In its place, the same file's first frame ships as a static image, full-bleed, same object-position, same brightness(0.42) and same veil. The reader still gets the night road.
  The iris renders at its finished state, scale(3.40), so the frame is fully open from the first paint. Its scroll animation is not declared.
  All five lines paint at translateY 0 and opacity 1 immediately. line-settle is not declared, so the 0.55 start value never exists.
  The gold hairline, both display lines, the preamble, "SC. 01" and "03:41" are all present at full contrast in their final positions.
  The scroll cue renders as the static rule with the dot resting at its top. It remains a working link.
  The type does not recede on scroll. The scene simply scrolls away.

Nothing is missing, nothing is dimmed, and nothing waits for anything.

### Assets
- dash-night

### Risk
Two ways this goes wrong. First, a 300vmax radial gradient scaled 34x over near-black will band visibly on 8-bit panels, which reads as a rendering bug rather than a grade. The L5 grain layer at 0.035 overlay is not decoration, it is the dither that kills the banding, and it must be present before this ships. Second and larger: "dark video with big type on it" is the single most templated hero on the web, and done carelessly this becomes a stock-footage SaaS page. Three things keep it off that road, and none are optional: the type is left-rail rather than centred, it runs a 26px-to-92px scale that funnels from "every company" down to "this is mine" instead of one flat display size, and it carries archival furniture instead of a button. If a CTA ever gets added to this scene, all three defences collapse at once and it becomes the reference it borrowed from.

---

## Scene 02 — Jamaica

**Reference:** Intercom (Response Time, Vol. 27) — https://mobbin.com/sites/sections/63faa1de-53d7-46f1-80e6-7ef18aeba0b6

- **Take:** A single portrait photograph physically set INSIDE the display type: the plate sits in the middle of the setting and the words break around it rather than sitting beside it in a two-column arrangement. The type owns the full measure and the picture is an interruption in it, not a partner to it. That is the exact mechanic I am building, but expressed as a real editorial float (shape-outside) at 58px instead of a hand-placed cutout, so the three sentences genuinely run around the print.
- **Leave:** Everything else. The acid-pink flood, the symmetrical dead-centre placement, the all-caps grotesque nameplate, the magazine-cover jokiness, and the studio cutout on a colour field. Ours is a damaged 1980s family snapshot with a magenta light leak, presented as an archival plate on near-black, hairline mount, zero radius, no scrim, no crop, and nothing ever typeset on top of it.

**Why it differs from every other scene:** It is the only scene in the seventeen where display type physically wraps a floated photographic plate, and the only one that spends 56vh of scroll on a completely empty frame and then refuses to animate its most important sentence at all.

### Layout
DESKTOP (>=1280px, measured at 1440x900). Scene total height 388vh in four blocks: A sticky stage track 200vh, B pause 40vh (empty), C "alone" panel 92vh, D lesson 56vh. Grid: 12 cols, 80px outer margins, 24px gutters, content block capped at 1200px and left-aligned to x=80px (at 1440 the measure is 1280px, so the block sits 80..1280).

BLOCK A holds a position:sticky, top:0, height:100vh stage. Inside it, one wrapper .k-s02-group containing the figure and the type as a single rigid unit. The figure is float:left with shape-outside:inset(0) and shape-margin:56px, margin-right:56px, and it is the FIRST child of the text flow, so the three sentences physically wrap it. Plate geometry: height = clamp(0px, 64vh, 620px), width = height * 0.6724 (verified from the file: 1291x1920, portrait, NOT landscape as the asset brief states). At 1440x900 that is 576px tall x 387px wide. Mount: 1px solid rgba(252,252,252,0.14), border-radius 0, overflow hidden, no inner padding, print bleeds to the mount edge. Right-hand channel at 1280 viewport = 1120 - 387 - 56 = 677px; at 1440 = 1200 - 387 - 56 = 757px. This is deliberate: "I was born in Jamaica." sets to roughly 587px at 58px Newsreader, so it lands as ONE unbroken line tucked directly against the right edge of the photograph. Sentence 2 (46 chars) breaks into one channel line plus one full-measure line below the plate; sentence 3 (56 chars) takes two channel lines. Vertical: the group is centred in the stage, plate top at 18vh.

Furniture: "02" Archivo 11px top-left at 48/48 inset; "04:12" top-right at 48/48; plate line 20px below the plate bottom, left-aligned to the plate left edge, two lines at 11px/1.6 - "PL. 01" then "MARK AND HIS SISTER. JAMAICA." Plate numbering is global and sequential across the document; if scene 1 carries a photograph this becomes PL. 02.

BLOCK B: 40vh, completely empty. No element, no rule, no mark. Only the viewport-fixed furniture and the site's scroll indicator remain visible.

BLOCK C: 92vh, display:grid, align-items:center. One line, "We never went back.", left edge at x=80px, the SAME left margin as the three sentences above. It does not centre and it does not get its own alignment system: it is unmistakably the fourth sentence, in the same voice, in the same position, and the only things that changed are that it is bigger and the screen is otherwise empty.

BLOCK D: 56vh. "LESSON" label, 20px gap, then the aphorism at max-width 640px, left edge x=80px.

1280-1439px: identical, block width = viewport - 160.

1024-1279px: the float is abandoned (the right channel would fall under 560px and the display type would rag badly). Stacked: sentence 1 at 42px, then the plate at 420x625 left-aligned in the measure with its plate line, then sentences 2 and 3 at 42px. Same order, same meaning.

MOBILE (375). Margins 24px, measure 327px. No sticky, no stage, everything in normal flow. Order: sentence 1 (30px/1.28) -> 40px gap -> plate at 327x486 (full measure) -> 16px -> plate line -> 56px -> sentence 2 -> 40px -> sentence 3 -> 52vh of empty margin -> "We never went back." at 40px/1.1, left at 24px, in a 76vh panel -> lesson. The plate deliberately sits after sentence 1: you are shown the place, and only then told you left it. The photograph interrupts the run of sentences instead of the run of type, which is the same lane honestly re-expressed for a 327px measure.

### Motion
Driver contract first, because it is what keeps this legal: the scroll driver ONLY ever writes CSS custom properties and only ever adds classes. Every property has a safe fallback baked into the stylesheet, e.g. .k-s02-figure { opacity: var(--k-s02-po, 1) } and .k-s02-figure img { transform: scale(var(--k-s02-ps, 1)) }. If the script never runs, --k-s02-po is undefined, resolves to 1, and the scene is fully visible. The sentence reveals use the inverted-arming pattern: sentences are opacity 1 in the stylesheet; on its first rAF the driver adds .is-armed to the section, and only .is-armed .k-s02-say { opacity: .30; transform: translate3d(0,12px,0) } applies. No element in this scene has an animation as its only route to being visible.

Stage progress p = clamp(-trackRect.top / (trackHeight - 100vh), 0, 1), i.e. p spans the 100vh of sticky travel inside the 200vh track. Read in rAF from a cached scrollY, one write pass, transform and opacity only.

p 0.00 -> 0.18, THE PRINT ARRIVES. The mount hairline is at full opacity from p=0, drawn empty. --k-s02-po scrubs 0 -> 1 and --k-s02-ps scrubs 1.06 -> 1.00 on the inner <img> (mount has overflow:hidden, so the frame itself never moves a pixel). Linear, no easing: on a scrubbed value the reader's own thumb is the easing curve. Eighteen percent of the stage, roughly 36vh of scroll, spent on one photograph coming up in the mount and nothing else on screen. That stillness is the scene's opening statement.

p 0.22 / 0.36 / 0.50, THE SENTENCES ARE SPOKEN. The driver adds .is-said to sentence 1, 2, 3 at those thresholds. Each is a CSS transition, not a scrub: 520ms cubic-bezier(0.22,0.61,0.36,1), opacity .30 -> 1 and translate3d(0,12px,0) -> translate3d(0,0,0). 28vh of scroll separates each from the next, so they land one at a time, at the pace of a man deciding to say the next part. The classes are added once and never removed: scrolling back up does not un-say them. A memory does not un-remember.

p 0.62 -> 0.86, THE GROUP LEAVES AS ONE. .k-s02-group scrubs translate3d(0,0,0) -> translate3d(0,-30vh,0), linear. Overlapping, p 0.74 -> 0.92 scrubs its opacity 1 -> 0. The photograph and the words leave together, rigidly, because they are one artefact: the print and the account of it are the same object and neither survives the other.

p 0.92 -> 1.00 plus BLOCK B, THE PAUSE. Combined 16vh + 40vh = 56vh of completely empty frame. Nothing enters it, nothing leaves it, nothing moves in it. This is the "(long pause)" in Mark's script, scored as scroll distance instead of as a typographic device. It is the only place in the entire seventeen-scene document where the reader travels more than half a screen through nothing. Additionally, a request to the light-arc owner: hold the ground flat at #0a0c0e for the whole of scene 2 including the pause, and let the first perceptible lightening of the sunrise begin at the top of scene 3. The sunrise stops while the pause runs. That is the one place the global system is asked to mean something local.

BLOCK C, THE HARD CUT. "We never went back." has NO motion of any kind, at any scroll position, in any motion preference. No fade, no rise, no scrub, no transition, no observer. It is in normal document flow at opacity 1 and it becomes visible by the reader scrolling, exactly the way a printed page becomes visible. Zero JavaScript touches it. Every other element in this scene was given a slow, considerate arrival; this sentence is given none, because it is the sentence that arrived without any. That is the whole motion argument of the scene and it is made by taking motion away.

BLOCK D is likewise entirely static. Adding a reveal to the lesson after a hard cut would undercut the cut.

Never animated anywhere here: width, height, top, left, filter, background-position. Only transform and opacity.

### Interaction
None, deliberately, and this is a decision rather than an omission. In a document where other scenes carry hover states, a click-to-play field note and a dashcam loop, scene 2 is the one you can only look at. The photograph has no hover treatment, no lightbox, no tilt, no parallax and no caption disclosure. Any of those would turn the most important image on the site into a toy, and Mark's rule 3 forbids the reader being played with.

What the scene owes instead is a proper accessibility contract. The figure is a real <figure> with a real <figcaption> carrying the visible plate line, so the caption is machine-readable and not a decorative absolute. alt text: "Mark Brown as a small boy in a rust-coloured shirt and trousers, standing beside his older sister in a pale yellow dress with a maroon sash, in front of a frangipani bush in Jamaica in the early 1980s." The three sentences, the alone line and the lesson are ordinary block-level text in source order, so the whole scene reads correctly with the stylesheet off and with the script off. The sticky stage introduces no focusable elements, so keyboard users tab straight past the scene without a trap. Image loading is eager with fetchpriority="high": this is scene 2, near the top, and it must never lazy-load in front of the reader.

### Typography
Three-sentence setting (Mark): Newsreader, weight 300, font-variation-settings "opsz" 48, 58px / line-height 1.20 (69.6px) / letter-spacing -0.012em, colour #FCFCFC. Non-breaking spaces forced between the final two words of each sentence and between "born in" and "Jamaica." so the float channel can never orphan a word. text-wrap: pretty.

"We never went back." (Mark): Newsreader, weight 400, "opsz" 72, 108px / line-height 1.00 / letter-spacing -0.025em, #FCFCFC. Drops to 88px below 1280px viewport (the line measures roughly 943px at 108px and would touch the margin at 1024), 40px at mobile.

Lesson body (Mark, but a different register of his voice, aphorism rather than recollection, so it takes the italic): Newsreader, weight 300, italic, "opsz" 28, 30px / line-height 1.50, max-width 640px, #FCFCFC at 0.86 alpha. Mobile 22px / 1.5.

Lesson label (the site): Archivo 500, 11px, 0.1em tracking, uppercase, #D6A145. Reads "LESSON".

Furniture (the site): Archivo 500, 11px, 0.1em tracking, uppercase, #FCFCFC at 0.62 alpha. Scene number "02", timestamp "04:12", plate block "PL. 01" over "MARK AND HIS SISTER. JAMAICA." at 11px/1.6.

The registers never touch: the man's words are Newsreader and nothing else in this scene is, the institution's words are Archivo and nothing else in this scene is. There is no line anywhere in scene 2 that mixes them, including inside the lesson, where the Archivo label sits on its own line 20px above the Newsreader aphorism rather than running into it.

### Contrast
Ground is #0a0c0e throughout (relative luminance 0.00359). Verified ratios, computed against that exact ground, not against black:
- #FCFCFC at 100% (three sentences, "We never went back.") = 19.10:1. AAA.
- #FCFCFC at 86% alpha composited over the ground (lesson body, 30px) = 13.9:1. AAA.
- #FCFCFC at 62% alpha composited over the ground (all 11px furniture: scene number, timestamp, plate number, plate caption) = 7.56:1. AAA at small size. 62% is the hard floor: 38% alpha, which is the tempting value for archival furniture, composites to only 3.47:1 and fails AA at 11px. Do not go below 0.62 for any text in this scene.
- #D6A145 at 100% (the LESSON label only) = 8.44:1. AAA at small size. Gold appears nowhere else in the scene and is never used as a fill.
- The transient 0.30-alpha pre-state on an un-said sentence measures roughly 2.1:1 and is therefore NOT a readable state. It is legal only because it exists solely while .is-armed is present, lasts under 520ms, and can never be the resting state: with JavaScript off, .is-armed is never applied and all three sentences render at 19.10:1.
No scrim is needed anywhere. There is a standing rule for this scene: no text is ever set on top of the photograph, at any breakpoint, in any state. The type wraps the plate, it never crosses it. That removes the scrim question entirely and it protects the image.

### Reduced motion
Under prefers-reduced-motion: reduce the driver never initialises at all (the media query is checked before attaching, and a change listener tears it down if the user flips the setting mid-session), so .is-armed is never applied and no custom property is ever written.

The result is a complete editorial spread, not a degraded one. .k-s02-stage-track goes height:auto, .k-s02-stage goes position:static with height:auto and 96px block padding. The photograph renders at opacity 1, scale 1, in its hairline mount, still floated with shape-outside so the three sentences still physically wrap it, still with "I was born in Jamaica." tucked into the channel beside the print. All three sentences are at full opacity with no transform and transition:none. The group never translates. The 40vh pause block survives unchanged, because a static gap is spacing rather than motion, so the long silence before "We never went back." is preserved exactly. Blocks C and D were already fully static for every reader, so they are byte-identical.

Everything the reduced-motion reader loses is pacing. They lose nothing of the layout, the wrap, the silence, the hard cut or a single word. The scene's argument survives intact because the argument was made in typography and in empty space, not in tweens.

### Assets
- s02-jamaica-childhood.webp

### Risk
Two real ones.

First and largest: the 56vh pause reads as a broken page, an unloaded section or a CSS failure rather than as a scored silence. Mitigation is that the frame is never actually blank. The viewport-fixed furniture (scene number 02, timestamp 04:12) and the site's scroll-progress indicator persist through the entire pause, so the reader is looking at a held, empty archival frame with a working chrome around it, not at a hole. Do not be tempted to soften it with a gold rule, a dot, a ghosted word or a scroll cue; every one of those explains the joke and destroys it. If the client reads it as broken in review, the correct fix is to shorten the pause to 44vh, never to fill it.

Second: shape-outside wrapping at 58px produces ugly rags and orphans between roughly 1024 and 1279px, where the right channel drops under 560px. Mitigation is hard: the float layout only exists at >=1280px, and 1024-1279 gets the stacked arrangement, plus forced non-breaking spaces before each sentence's final word. Test at exactly 1280x700 (channel 761px), 1280x900 (677px) and 1920x1200 (plate capped at 620px tall, channel 700px); all three clear the 587px that "I was born in Jamaica." needs.

One content flag that needs a client answer before build: I have specified the plate caption as "MARK AND HIS SISTER. JAMAICA." with no date, rather than "EARLY 1980s". His date of birth is deliberately omitted from this scene for identity-risk reasons, and a dated plate on a photograph of him as a small child lets a reader infer that birth year to within a year or two. The dateless caption is the safe default. Do not add the decade back without an explicit instruction.

Finally, a correction to the asset brief that the developer needs: s02-jamaica-childhood.webp is 1291x1920, portrait, aspect 0.6724. The brief states all 26 photographs are landscape. Every dimension above is derived from the real file. And the print ships exactly as supplied, magenta light leak and warm cast intact, with no retouching of any kind: the damage is evidence, and the faces are never to be generatively altered.

---

## Scene 03 — Learning the Value of Work

**Reference:** Freshman — https://mobbin.com/sites/sections/7715758c-5482-4a9a-9aed-f8e0bf60d30e

- **Take:** A vertical stack of five small thumbnails pinned to the left of one larger active frame, with a text column on the far right, all on a near-black ground, each row tagged with a record number in the outer margin and separated by hairlines. Three things are worth stealing exactly: (1) the rail is a fixed ledger, not a scroller, so the whole set is visible at once and the eye reads it as an inventory rather than a carousel; (2) the active frame is the widest element but not full-bleed, so the black ground still frames it and the composition stays archival; (3) the record number lives outside the content, in the margin, which is precisely how our scene number and plate numbers already behave.
- **Leave:** Freshman's rail is a click-driven showreel picker with hover-scrub video, and every row is a separate project with a title and a body paragraph, which is a portfolio index. We are not indexing anything. Drop the hover-scrub, the per-row titles, the dashed rules, and the red accent entirely. Also drop the idea that the thumbnails are alternatives to each other: in Freshman they are five views of one job, here they are three separate summers, so the rail must accumulate rather than swap.

**Why it differs from every other scene:** It is the only scene on the page built as an accumulating ledger: a rail that fills and never empties, where the picture deliberately stops changing a third of the way in and the rest of the scene is one still photograph and text.

### Layout
DESKTOP 1440. Ground #0d0f11 inherited, no local background. Page gutters 80px, content width 1280.

Furniture row at the section's top edge, y = section top + 64px, Inter 11px/500/0.1em/uppercase, #FCFCFC at 55%: "03" at x=80, "04:41" right-aligned to x=1360. Nothing else in this row; the shared furniture component owns it.

Three columns, all flush to a single top line at y = section top + 200px:
- RAIL, x=80, width 96. A fixed vertical ledger of four tiles, 16px gaps, no overflow, no scroll: tile A jobsite-fixtures 96x72, tile B jobsite-install 96x72, tile C jobsite-bay 96x72, tile D mark-fieldnote 96x170. Rail total height 434px. Tiles are square-cornered, borderless, no captions. Under the rail, 16px below, one Inter 11px/0.1em/uppercase label at #FCFCFC 55% reading "SCROLL-LINKED".
- ACTIVE FRAME, x=216, 600x450. The camera's native 4:3, uncropped. 16px below its bottom edge, aligned to x=216, the plate number of whatever is currently in the frame: Inter 11px/0.1em/uppercase, #FCFCFC 55%, "PL. 07" / "PL. 08" / "PL. 09". No text is ever placed on top of a photograph in this scene.
- COPY COLUMN, x=912, width 448. Runs 2272px tall. Vertical rhythm, top to bottom: 200px lead-in; "America was different."; 120; "Everything moved faster."; 120; "Everything felt unfamiliar."; 200; "While most kids spent their summers playing..." (wraps to 2 lines, 72px); 40; "Mine were spent on construction sites." (2 lines, 72px); 240; then the TRIPLET BLOCK, "Every school break..." / 28 / "Every holiday..." / 28 / "Every vacation...", block height 164px; 200; "I worked alongside my father." (2 lines); 240; "Work isn't something to avoid."; 32; "It's something to take pride in."; 320px tail.

The triplet block carries two extra marks. To its left at x=888 (24px off the copy column) a 1px vertical hairline in #D6A145 spanning exactly the block's 164px. To the left of each of its three lines, at x=856, a counter in Inter 11px/500/0.1em: "01", "02", "03".

The rail + frame + plate number form one block, 480px tall, made sticky: position:sticky; top: calc(50vh - 240px). The copy column scrolls past it. No pinning library, no scroll-jacking, no scroll hijack of any kind.

LESSON, after the sticky releases: 96px of space, then a 96px-wide 1px rule in #D6A145 at x=216, then 24px, then the label "LESSON" in Inter 11px/0.1em/uppercase #D6A145, then 24px, then "Character is often built long before opportunity arrives." set at x=216 across a 720px measure. 200px of tail before the next scene.

MOBILE 375. Gutters 20px, content 335. Furniture row unchanged in size and content: "03" at x=20, "04:41" right to x=355. The composition inverts to one column. The frame goes above the rail and the two travel together as a sticky unit, position:sticky; top:72px, total height 341px: frame 335x251 (4:3), 12px gap, then the rail turned horizontal beneath it, left-aligned, tiles A/B/C at 68x51 and tile D at 44x78, 10px gaps, total 278px wide; the active plate number sits right-aligned on the rail's bottom baseline at x=355. Copy column runs full 335 below. Gaps scale to 0.55 of desktop: 120→66, 200→110, 240→132, 40→24, 28→16, 32→18. Triplet hairline moves into the gutter at x=8, height 122px; counters sit above each triplet line rather than beside it, 6px clear. LESSON runs the full 335 measure.

### Motion
The scene has exactly one idea in motion: the active frame is a metronome that beats three times and then stops for good.

STATE MACHINE. Four photograph slots, A jobsite-fixtures, B jobsite-install, C jobsite-bay, D mark-fieldnote. Ownership is deliberate and sparse: line 6 "Every school break..." owns A, line 7 "Every holiday..." owns B, line 8 "Every vacation..." owns C. No other line owns a photograph. D is owned by nobody and is click-only.

Through lines 1 to 5 the frame holds A and every tile in the rail sits unlit. The rail being dark while Mark describes arriving in America is the whole setup: the summers have not started. Then line 6 lights tile A and cuts the frame to A. Line 7 lights tile B, A STAYS LIT, and the frame cuts to B. Line 8 lights tile C, A and B stay lit, frame cuts to C. From line 9 to the end of the scene nothing in the media block changes again: three tiles lit, C in the frame, held still under "I worked alongside my father", "Work isn't something to avoid", "It's something to take pride in", and the lesson. The rail accumulates and never empties, and the picture stops changing on purpose. Three separate summers become one continuous fact, and the last third of the scene is a still photograph and text.

THE BEAT IS BUILT INTO THE LAYOUT, NOT INTO A TIMER. Every gap in the copy column is 120 to 240px. The triplet's internal gaps are 28px. At an ordinary reading scroll of roughly 600px/s the three cuts therefore land about 210ms apart after eight seconds of nothing moving. The rhythm is spacing. The animation only makes it audible.

THE CUT. Zero-duration. transition: opacity 0s on the stacked frame images; no crossfade, no dissolve, no Ken Burns. A school break ends and the next one starts; there is nothing between them. What sells it is a shutter: a 1px absolutely-positioned outline div inset 0 on the frame, border 1px solid #D6A145, default opacity 0, animated 0 → 1 over 90ms linear then 1 → 0 over 420ms cubic-bezier(0.22, 1, 0.36, 1). Opacity only. It is an outline flashing, not a border colour changing, specifically so the rule against animating anything but transform and opacity holds literally.

THE TILE LIGHTING. On promotion a tile goes from opacity 0.40 / filter brightness(0.55) to opacity 1 / brightness(1) over 320ms cubic-bezier(0.22, 1, 0.36, 1), and simultaneously transform: scale(0.94) → scale(1) over the same 320ms. Its resting CSS state is scale(1) opacity 1; the dimming is what JS applies, so a stalled animation leaves a lit tile, never a missing one. filter is paint-only and does not touch layout.

THE TRIPLET HAIRLINE. The 1px gold rule beside the triplet fills top to bottom by transform: scaleY(0) → scaleY(1), transform-origin: top, driven directly off scroll progress across the triplet block, not off a duration. It is a progress bar for three summers filling in real time as you read them. It reaches full exactly as "Every vacation..." goes active.

THE COPY. Three opacity states, all of them legible: unreached #FCFCFC at 55%, active at 100%, passed at 70%. Transition opacity 400ms cubic-bezier(0.4, 0, 0.2, 1). Nothing ever animates in from invisible. The CSS default for every line in the file is opacity 1; on mount, and only if prefers-reduced-motion is not set, JS adds .is-armed to the copy column, which is what introduces the 55% and 70% states. If the script never runs, or throws, every word sits at full white.

TRIGGER. One IntersectionObserver, threshold 0, rootMargin "-52% 0px -48% 0px", which is a zero-height band at 52% of the viewport. A line goes active when its centre crosses that band travelling up. The observer tracks the highest index reached so scrolling back up re-lights correctly and never re-fires a cut that has already happened. Promotion is monotonic: scrolling back above line 6 does not un-light tile A. A worked summer does not un-happen.

VISIBILITY GUARD. The frame contains three stacked <img> elements. Their CSS default is all three at opacity 1, so with no JS the topmost, jobsite-bay, is a real visible photograph. .is-armed switches them to per-slot opacity with A at 1. There is no state in this scene, at any point, in which the frame is empty.

Nothing in this scene animates width, height, top, or left. The sticky block is a plain position:sticky. There is no audio unless the reader clicks the field note.

### Interaction
The rail is a real control, not decoration. It is a role="group" of four <button>s with roving tabindex; Left/Right arrows move between tiles, Home/End jump to the ends, Enter/Space activates. Focus ring 2px #D6A145, offset 3px, never suppressed.

Clicking tile A, B or C promotes that photograph to the frame immediately (same hard cut, same shutter flash) and sets a session lock that suspends scroll-driven promotion for the rest of the visit, so the scene does not fight a reader who wants to look at something. The Inter 11px label under the rail flips from "SCROLL-LINKED" to "MANUAL". That label is the only status text in the scene and it is written in the register of an archive card, not an app.

Hover on a dim tile raises it to opacity 0.70 over 160ms and does nothing else. Hover NEVER promotes. A promotion is a beat and a beat should not fire because a mouse passed over.

Clicking tile D opens mark-fieldnote.mp4 in a native <dialog>, 405x720 (9:16), centred, backdrop #0d0f11 at 82%. The video element carries controls, playsinline, preload="metadata" and a poster frame; it has no autoplay attribute anywhere. The click that opens the dialog also calls .play(), which is a genuine user gesture, so the audio is allowed and the reader asked for it. Above the video, Inter 11px/0.1em/uppercase #FCFCFC: "FIELD NOTE · 2022 · 0:17 · SOUND". It has no plate number, because it is not a plate. Esc, a backdrop click, or the 32x32 close button at the dialog's top right all dismiss it and pause the video. Focus is trapped while open and returns to tile D on close. On mobile the dialog is min(335px, 100vw - 40px) wide with max-height 78vh and object-fit: contain.

There is no lightbox on the three photographs, no arrows, no dots, no next/prev, no counter, no zoom. Deliberately.

### Typography
MARK'S VOICE, Newsreader throughout, never for anything the site says.

Narration lines 1-5 and 9-11 ("America was different." through "It's something to take pride in."): Newsreader 300, font-optical-sizing on with opsz 36, 28px / 36px line-height, letter-spacing -0.012em, colour #FCFCFC. 28px across the 448px column gives roughly a 33-character measure, which is a documentary caption column, subordinate to the photograph on purpose. This is scene 3 of 17 and it is not the emotional peak; scene 2 is.

Triplet lines 6-8 ("Every school break..." / "Every holiday..." / "Every vacation..."): Newsreader 400, opsz 36, 28px / 36px, letter-spacing +0.02em. Same size as the narration, one weight step heavier and slightly opened. They read as a ledger entry rather than a sentence, and because the size does not change, the triplet stands out purely by rhythm and spacing, which is the point.

LESSON ("Character is often built long before opportunity arrives."): Newsreader 200, opsz 60, 44px / 54px, letter-spacing -0.02em, across a 720px measure. The lightest weight in the scene at the largest size, which is how a conclusion should sound after eleven declaratives. Mobile 30px / 38px.

THE SITE'S VOICE, Inter, 11px, 500, 0.1em tracking, uppercase, in every instance without exception: the scene number "03", the time stamp "04:41", the plate numbers "PL. 07" / "PL. 08" / "PL. 09", the triplet counters "01" "02" "03", the rail status label "SCROLL-LINKED" / "MANUAL", the word "LESSON", and the field note's "FIELD NOTE · 2022 · 0:17 · SOUND". Nothing at 11px is ever set in Newsreader and nothing at 28px or above is ever set in Inter. The man and the institution never share a face.

Plate numbers should be renumbered to continue the site's running sequence; 07/08/09 assumes scene 2 spent 01-06.

### Contrast
Ground is #0d0f11 (relative luminance 0.00468). No text in this scene is ever placed over a photograph, so there is no scrim anywhere in the scene and every ratio below is measured against the flat ground.

#FCFCFC at 100% → 18.72:1. Active narration line, active triplet line, LESSON, all dialog labels.
#FCFCFC at 70% (composites to #B5B5B5) → 9.36:1. Passed narration lines.
#FCFCFC at 55% (composites to #919191) → 6.09:1. Furniture row "03" and "04:41", plate numbers, "SCROLL-LINKED" / "MANUAL".
#FCFCFC at 52% (composites to #8A8A8A) → 5.57:1. Inactive triplet counters. 52% is not arbitrary: the AA floor for 11px text on this ground works out at 45% opacity, so 52% is the dimmest any label is allowed to go and it still clears 4.5:1 with margin.
#D6A145 at 100% → 8.27:1. Active triplet counters, the "LESSON" label, the 96px rule, the triplet hairline, the focus ring, the shutter flash. Gold passes AA for normal text on this ground, so the counters are legible and not merely decorative.

Every text state in the scene, including the dimmest unreached one, clears 4.5:1. There is no state in which any word is below AA, which is why the dimming is a reading aid rather than a reveal.

### Reduced motion
Gate the entire script on matchMedia('(prefers-reduced-motion: reduce)').matches === false. If it is set, .is-armed is never added and the observer never attaches. What remains is a complete section, not a degraded one:

- All eleven narration lines and the lesson sit at #FCFCFC 100%, 18.72:1. No line is ever dimmed, because the dimming was the only thing the script did to them.
- position:sticky is removed from the media block; it sits in normal flow at the top of the section.
- The single active frame is replaced by a static contact sheet of all three photographs, which is the honest static equivalent of a rail that accumulates: at 1440, three frames of 405x304 in a row across the 1280 content width with 32px gaps, each with its own plate number "PL. 07" / "PL. 08" / "PL. 09" in Inter 11px at #FCFCFC 55% sixteen px beneath it. At 375 the same three stack vertically at 335x251 with 16px gaps. The rail itself is not rendered in this mode; the contact sheet is the rail.
- The triplet's gold hairline is rendered at scaleY(1), full 164px, no fill.
- The triplet's 28px internal spacing against the surrounding 200-240px gaps is untouched, so the rhythm of "Every school break / Every holiday / Every vacation" still lands typographically. This is the reason the rhythm was put in the layout rather than in the animation.
- The field note tile is still rendered, still a button, and still opens the dialog. The dialog transitions opacity only, 0ms, no translate. The video is user-initiated in every mode, so nothing about it changes.
- The shutter flash and the tile scale never fire.

The only thing lost is the metronome. Every word, every photograph, every plate number and the lesson are all present and readable.

### Assets
- jobsite-fixtures
- jobsite-install
- jobsite-bay
- mark-fieldnote.mp4

### Risk
The obvious failure is that a thumbnail rail beside a big frame reads as an e-commerce product gallery, which is exactly the template the client is afraid of. Five specific mitigations, all of them things a developer must not add back: no arrows, no dots, no next/prev, no counter, no lightbox on the photographs; the rail has no overflow and no scroll, it is a fixed ledger of four sized to its contents; tiles are square-cornered, borderless and unrounded and signal state by dimming rather than by an outline, so the only outline in the scene is the gold shutter flash; the frame keeps the camera's native 4:3 rather than a cropped marketing 16:9; and the plate numbers plus the "SCROLL-LINKED / MANUAL" label put the whole thing in an archival register rather than a commercial one. Above all, the rail accumulates instead of swapping, which no product gallery does.

The second risk is the photographs themselves. jobsite-fixtures, jobsite-install and jobsite-bay are 4032x3024 phone frames shot as a work record in 2021-22, not composed images, and a 600px frame is generous enough to expose a weak one. Mitigation: hold them at 600px rather than going full-bleed, and if any single frame is genuinely poor, demote it to the rail only and let its triplet line promote the strongest of the other two a second time. The scene survives on two distinct photographs because the rhythm lives in the spacing, not in the image count.

Third, a build-order note: none of the four assets exist on disk yet. /public/images/journey/ currently holds only the 26 windscreen photographs, and /public/videos/ has no mark-fieldnote.mp4. The three jobsite images need 1200x900 and 192x144 webp derivatives before this scene can be built, and the field note needs a poster frame extracted. Nothing here should be substituted from the existing 26 photographs; a windscreen shot standing in for a construction site would be a lie about Mark's childhood, which is worse than shipping the scene late.

---

## Scene 04 — Seeing the World Differently

**Reference:** Microsoft AI — https://mobbin.com/sites/sections/888899c3-9380-4d03-a1d4-749aff1a1433

- **Take:** The stack of short serif lines in which the non-current lines stay fully legible rather than hidden, and the current line is distinguished by a lift in ink weight and opacity rather than by an entrance. Nothing arrives; something is simply attended to. That is exactly the difference between a slide deck reveal and a person reading their own thought back. I also take its refusal to box, card, number or icon any of the lines: the only structure is the vertical interval between them.
- **Leave:** The cream ground (my ground is fixed at #101216 and I never choose it). The paired right-hand column that restates each value in a longer sentence, which on our page would mean explaining Mark's writing back to the reader, and Mark's rule against exaggeration makes that unacceptable. The decorative connector swoosh. And its driver: Microsoft's active line advances on a uniform stepped index, evenly spaced, which reads as a carousel. Mine is driven by the reader's own scroll position against deliberately uneven vertical gaps, so the tempo belongs to the reader and the rhythm belongs to the layout.

**Why it differs from every other scene:** It is the only scene of the seventeen whose reveal interval is authored as uneven whitespace rather than as uniform timing, so the pause that carries its meaning survives intact even with all motion switched off.

### Layout
DESKTOP 1440. Section padding: 160px top, 200px bottom. Page margin 112px. Two zones: a marginalia column at x=112 (168px clear) and a single measure column for Mark's words running x=280 to x=1328 (1048px). Nothing is centred; the whole scene hangs off one left edge, like a page of notes.

Furniture, static (not sticky), at the section's top-left, x=112, y=160 from section top: "SCENE 04" on the first line, "04:12" on the second, 8px apart. Archivo 11px, 0.1em tracking, uppercase, #FCFCFC at 62%. Present at full opacity from first paint, never animated.

The stack. Five lines of Mark's writing, each its own single line of type, left edge x=280, each set to fit its measure without wrapping (longest is 56 characters, 930px at 36px, 118px of slack). Baseline-to-baseline gaps are deliberately unequal and are the entire design:
  L1 "I wasn't satisfied with simply being told how things were."  first baseline at y=296 from section top
  L1 to L2 132px    ("...why they worked the way they did.")   a pair, delivered quickly
  L2 to L3 196px    ("Questions became part of the journey.")
  L3 to L4 420px    THE PAUSE. A screen-third of empty ground.
  L4 to L5 108px    the tightest gap on the page
  L5 to LESSON 340px
Under each line, 28px below its baseline, a 1px gold rule (#D6A145 at 70%) starting at x=280 and running right. Lengths grow: L1 128px, L2 272px, L3 448px, L4 664px, L5 calc(100vw - 280px) so it leaves the frame entirely. Each question opens more road than the last; the fifth has no end on this page.

LESSON. "Every road begins with a question." Newsreader 48px, one line, left edge x=280. An Archivo 11px 0.1em uppercase label "LESSON" in #D6A145 sits in the margin at x=112 aligned to the lesson's first baseline. Its gold mark is not an underline: a 24px stub at x=240, vertically centred on the lesson's x-height, hanging in the gutter to the left of the first word. A beginning mark, not a conclusion.

PLATE. 200px below the lesson baseline, at x=280: s04-dawn-road-mist at 336px wide (189px at 16:9). Deliberately small and subordinate; a photograph presented as a photograph, not as wallpaper, never tinted or blurred. "PL. 04" in Archivo 11px 0.1em uppercase #FCFCFC 62%, 16px below the plate, left-aligned to it.

MOBILE 375. Margin 24px, measure 327px full width. Furniture becomes one horizontal row at the section top: "SCENE 04" flush left, "04:12" flush right, same 11px treatment, with a 1px #FCFCFC-at-14% hairline 20px beneath and 24px of air below that. Section padding 88px top, 112px bottom. Lines drop to 26px / line-height 1.34; every sentence still holds one line except L1 and L2, which are permitted to run to two lines with a 0.34em hanging indent on the second. Gaps compress but keep their ratio: 76 / 108 / 260 / 64 / 200. Rules: 56, 112, 176, 248, calc(100vw - 24px). Lesson 28px; its 24px stub moves from the gutter to sit 16px directly above the lesson's first baseline. Plate goes full measure, 327 x 184.

### Motion
The governing idea: there is no timed cascade in this scene. The interval between reveals is set by the reader's scroll speed against the uneven gaps in the layout. Scroll fast and lines 1 and 2 fire 90ms apart; stall and they are three seconds apart. The layout encodes the rhythm, the reader supplies the tempo. That is why it reads as thinking and not as a slide.

ARMING (this is how the visible-by-default rule is honoured). Every element's static CSS is its FINAL state: opacity 1, transform none, rules at scaleX(1). On mount, in the same tick it attaches the IntersectionObserver, JS sets data-armed="true" on the stack, and only then does `.stack[data-armed] .line { opacity: .52 }` / `{ transform: scaleX(0) }` take effect. No JS, failed JS, or JS that dies before arming leaves every word at 18.3:1 and every rule fully drawn. JS that dies after arming leaves them at 5.55:1, still AA at any size. There is no state in which a word is invisible.

ACTIVATION. Per-line IntersectionObserver with rootMargin set so the trigger line sits at 62% viewport height (72% on mobile). When a line's own first baseline crosses it, that line gets .is-lit and the observer unobserves it. Activation is ONE-WAY and additive: nothing ever dims again. By the lesson all five lines are burning at once, which is what "a lifetime of learning" should look like.

THE LIFT. opacity .52 to 1 and transform translateX(0) to translateX(-6px), both 420ms, cubic-bezier(0.22, 0.61, 0.36, 1). The line steps six pixels LEFT, out of the block and into the margin: the editorial gesture of pulling a sentence out to be looked at. Transform and opacity only. No blur, no weight change, no variable-axis animation (Newsreader's opsz is set per size at rest and never animated, because that repaints).

THE RULE DRAW. Begins 240ms after its line's lift starts. transform: scaleX(0) to scaleX(1), transform-origin 0 50%, timing-function LINEAR, and the duration is not fixed: every rule draws at a constant physical velocity of 1100px per second. So L1 takes 116ms, L2 247ms, L3 407ms, L4 604ms, and L5 takes 1055ms and is still travelling toward the edge of the screen while you are reading it. Constant velocity is the whole point; a longer thought takes longer to draw.

THE PAUSE, AND THE ONE THING THAT CROSSES IT. The 420px gap between "Questions became part of the journey" and "Curiosity doesn't always give you immediate answers" is empty ground and must stay empty. It is not dead, because L3's rule does not stop where the others do: a 1px gold continuation at 40% opacity extends from its end and its translateX is bound directly to scroll progress across the gap, 0 to 128px, via a CSS custom property written in a rAF-throttled scroll handler (animation-timeline: view() where supported, JS as the fallback path). The question travels with you through the silence and stops the instant line 4 lights. Compositor-only, no layout.

THE PLATE. opacity .55 to 1, translateY(12px) to 0, 700ms, cubic-bezier(0.16, 1, 0.3, 1), animation-fill-mode: backwards over a static rule of opacity 1 / translate none.

No springs, no overshoot, no bounce anywhere in this scene. It is thinking, not performing.

### Interaction
One, and it is optional enhancement rather than a requirement. Under `@media (hover: hover) and (pointer: fine)` only, hovering any of the five lines lights it immediately using the identical 420ms lift, as if the reader had scrolled to it. Because activation is one-way and additive, hovering line 2 after line 4 has fired leaves both burning: two thoughts held at once, which is the correct behaviour for this scene rather than a bug. There is no reverse state and no hover-off transition.

Deliberately NOT added: tabindex on the lines. They are prose, not controls, and six artificial tab stops would make the scene worse for keyboard and screen-reader users to buy a pointer flourish. The markup is an ordered list of five plain elements plus the lesson, all in the DOM in reading order, all text always present, no aria-hidden, no live regions, no ARIA at all. A screen reader gets the complete scene as five sentences and a lesson, with no awareness that any of this exists. Touch devices get scroll activation only and lose nothing.

### Typography
MARK. All six of his sentences are Newsreader. The five stack lines: 36px, line-height 1.35, wght 340, opsz 36, letter-spacing -0.005em, colour #FCFCFC. 36px rather than 48px is a deliberate choice: it is the largest size at which the longest sentence, "I wasn't satisfied with simply being told how things were." (56 characters, approx 930px), still holds a single line inside the 1048px measure. One sentence, one line, no exceptions, because the rhythm dies the moment one statement wraps and another does not.

The LESSON is also Mark, so also Newsreader, but set apart by weight and scale rather than by case or colour: 48px, wght 500, opsz 48, letter-spacing -0.01em, #FCFCFC. No italic, no small caps, no quotation marks anywhere in the scene. Newsreader's optical size axis is set to match the rendered size at rest in both cases and is never animated.

THE SITE. Everything the institution says is Archivo, 11px, 0.1em tracking, uppercase, and nothing else: "SCENE 04", "04:12", "PL. 04", and the single word "LESSON". Four strings, one style, one size. The word LESSON is the only Archivo in gold (#D6A145 at 100%, on ground = 5.9:1); the other three are #FCFCFC at 62%.

Font-synthesis: none. No faux weights. The two families never appear in the same line box.

MOBILE. Stack lines 26px / 1.34, lesson 28px, furniture stays at 11px / 0.1em exactly as on desktop, per the invariant.

### Contrast
Ground for every ratio below is the inherited #101216 (relative luminance approx 0.0053). Nothing in this scene sits on a scrim; there is no scrim, because there is no full-bleed image.

Mark's lines, lit (#FCFCFC at opacity 1): 18.3:1. Passes AAA.
Mark's lines, armed but not yet lit (#FCFCFC at 52%, composites to approx #8B8B8C): 5.55:1. Passes AA at ANY size, not merely at large size. 52% was chosen over the more dramatic 38% (which measures 3.51:1 and would only have scraped AA-large) precisely so that no sentence of Mark's is ever below normal-text AA at any moment of the scroll, including a stalled one.
Lesson, 48px, lit: 18.3:1. Armed: 5.55:1.
Furniture "SCENE 04", "04:12", "PL. 04" (#FCFCFC at 62%, composites to approx #A2A2A3): 7.47:1. Set a step brighter than the dimmed body text specifically because at 11px it is small text and must clear 4.5:1 with room.
"LESSON" label (#D6A145 at 100% on #101216): 5.9:1. Passes AA at 11px.
Gold rules (#D6A145 at 70%, composites to approx #9A7637): 4.55:1. These are 1px graphical objects requiring 3:1 under WCAG 1.4.11 and clear it comfortably.
L3's scroll-linked continuation hairline (#D6A145 at 40%, composites to approx #5F4B29): 2.29:1, which is BELOW 3:1 and I am flagging it rather than hiding it. It is exempt because it is purely decorative and carries no information: the fact that line 3 has a rule is already fully conveyed by the 448px 70% rule it grows out of, and no reader needs to perceive the continuation to understand anything. If a reviewer disagrees, raise it to 62% (approx 3.9:1) with no loss to the idea.
The mobile hairline divider under the furniture row (#FCFCFC at 14%) is decorative separation only, duplicating information already given by whitespace.

### Reduced motion
Under `prefers-reduced-motion: reduce` the stack is simply never armed, and that single decision produces a complete scene rather than a degraded one, because this scene's rhythm was authored into the whitespace and not into the timing.

All five of Mark's lines and the lesson render at #FCFCFC, opacity 1, 18.3:1, no translate, exactly as they end up for every other reader. All five gold rules render statically at their final lengths, 128 / 272 / 448 / 664 / off-frame, so the growth from a short first question to a fifth that leaves the page is fully legible as a still image. L3's continuation renders as a static 128px extension at its end. The plate and PL. 04 render at full opacity in place. The hover affordance is inert.

The 132 / 196 / 420 / 108 / 340 gaps are untouched, so the long silence before "Curiosity doesn't always give you immediate answers" and the tight gap before "Sometimes it gives you a lifetime of learning" are both still there and still doing their work. A reduced-motion reader gets the entire argument of the scene, including its pacing. What they lose is only the constant-velocity draw and the travelling dot. Nothing is hidden, nothing is summarised, nothing is replaced with a fallback.

### Assets
- s04-dawn-road-mist

### Risk
The likeliest failure is that the 420px of empty ground between lines 3 and 4 reads as a broken image, a failed lazy-load, or a spacing bug rather than as a held breath. A reader who thinks the page is broken has been let down by the joke, not moved by it. Mitigation is that the gap is never wholly inert: L3's gold continuation is travelling right the entire way across it under direct scroll control, so there is always exactly one moving thing confirming the page is alive and responding, and the furniture at the section's top-left never leaves the composition. On mobile the gap is cut to 260px because a 420px void on a 812px-tall viewport is a full third of the screen and crosses from restraint into apparent error.

Second risk, smaller: the five growing hairlines could be misread as a progress bar or a bar chart, which would be a cheap look. Mitigation is that they are 1px, have no caps, ticks, labels, or container, do not share a common right terminus to measure against, and the fifth one leaves the frame entirely so there is no maximum to read them as a fraction of.

---

## Scene 05 — The Beginning of Independence

**Reference:** Faculty Department — https://mobbin.com/sites/sections/59838174-70f1-4a04-9985-8541f4e69473

- **Take:** A hard, unbroken vertical seam sitting on the exact page midline, with a quiet editorial type column on one side and a full-bleed photographic panel on the other, and the two sides advancing at visibly different rates on scroll so the seam reads as a shear between two independent surfaces rather than as a border between two boxes. Crucially Faculty never puts matching content on both sides: the halves are different in kind, not different in value. That is the exact property this scene needs to keep the good/bad pair from becoming a comparison.
- **Leave:** Faculty's seam is permanent and navigational. It is a directory, so it carries UI chrome: nav links, captions, pagination dots sitting on the photograph. All of that is dropped. Here the seam has to be narrative and temporary, it opens, it is crossed, it closes again. The palette is also inverted: Faculty is cream and daylight, this scene sits at near-black #14141a and the photograph has to be pulled down to meet it.

**Why it differs from every other scene:** It is the only scene in which the page's own composition is the subject: the layout itself divides down the centre and then rejoins, so the reader watches independence happen to the geometry rather than being told about it, and the gold hairline that splits the screen is literally the painted centre line of the road in the photograph beside it.

### Layout
DESKTOP 1440x900. Sticky viewport 100vh inside a 420vh scroll track. Ground #14141a inherited, never set locally. The whole scene is organised around one axis: x = 720px, dead centre. PHASE A (single column): one measure, max-width 780px, centred on the axis, x 330 to 1110. First baseline y = 336px. PHASE B: "This was mine." breaks the centring, set left-aligned starting at x = 330 (the same left edge as Phase A, so it reads as a reply inside the frame it was given), baseline y = 468px. PHASE C onward the page is two panels. LEFT panel x 0 to 720: type column x 120 to 600, 480px measure, so 120px of dark air always stands between the last letter and the seam, the words never touch the line. RIGHT panel x 720 to 1440: photograph 720 x 100vh, object-fit cover, object-position tuned (start at 46% 62%) so the painted centre stripe of the two-lane road lands within 4px of the panel's LEFT edge, which means the road's centre line and the page's seam are the same line. Left edge of the photo is crisp because it IS the seam; top, bottom and right edges feather out with a two-layer mask-image, mask-composite: intersect, linear-gradient(to bottom, transparent 0, #000 12%, #000 84%, transparent 100%) and linear-gradient(to right, #000 0, #000 78%, transparent 100%), so it emerges from the dark rather than sitting on it as a rectangle. PHASE D's sentence is the only element allowed to straddle: max-width 900px centred on the axis, x 270 to 1170, 450px of it lying over the photo. PHASE E: "Some were good." right-aligned to x = 600; "Some weren't." left-aligned to x = 840. Identical 120px offset from the seam on each side, identical type spec, different vertical positions. PHASE F returns to one measure, max-width 900px centred on the axis, first baseline y = 468px, landing on exactly the baseline "This was mine." used. Lesson block centred on the axis at y = 760px, max-width 520px, with a 24px gold rule stub above it, the last surviving fragment of the seam. FURNITURE: scene number and stamp top-left / top-right at 40px inset; "PL. 05" bottom-left of the photo panel, 24px in from x=720 and 32px up from the bottom, so it labels the plate, not the page. MOBILE 375x812, gutters 24px. A 187px half is unreadable, so the seam transposes to horizontal. Photo becomes a full-bleed band, y 0 to 46vh (366px). The 1px gold hairline is that band's bottom edge, run full width. All type lives below it, y 46vh to 100vh. Phase E stacks: "Some were good." and "Some weren't." left-aligned at x = 24, 28px apart. Lesson at the foot, full measure.

### Motion
The mechanic is the meaning: the page is one column while someone else is deciding, it splits into two independent surfaces while he is finding out who he is, and it closes back into one column when he claims both halves. Scroll progress p is 0 to 1 across the 420vh track and is exposed as a single CSS custom property --p. Scrubbed motion is LINEAR throughout (eased scrubbing fights the finger); only the two one-shot events are eased. Transform and opacity only, no exceptions. p 0.00-0.18 STILLNESS: nothing moves. One column, one sentence. Deliberately inert, because nothing is his yet. p 0.18-0.30 THE SEAM: "This was mine." arrives, and on the same trigger a 1px hairline in #D6A145 at 34% opacity is drawn down x=720 from y 0 to y 100vh, scaleY 0 to 1, transform-origin top, 520ms cubic-bezier(0.22, 1, 0.36, 1), one-shot, not scrubbed. This is the entire accent budget for the scene. p 0.30-0.50 THE SHEAR: the halves separate in opposite directions and at deliberately unequal rates. Left panel translateY +14vh to -6vh (20vh of travel). Right panel translateY -10vh to +8vh (18vh). The 2vh mismatch is intentional: matched travel reads as a table, mismatched travel reads as two things going their own way. p 0.50-0.62 THE CROSSING SENTENCE: "It was about finding out who I was." holds still, centred on the axis, letting the gold hairline pass behind it. It is the one element that ignores the division. Both panels slow to 30% of their rate underneath it. p 0.62-0.82 THE PASS: "Some were good." rises on the left, translateY +12vh to -12vh. "Some weren't." falls on the right, translateY -12vh to +12vh. At exactly p = 0.72 their baselines are level and the gold hairline goes 0.34 to 1.0 to 0.34 opacity over 240ms ease-in-out, one-shot. That flash is the only moment the two are equal, and it is over in a quarter second. They are the same size, same weight, same colour, same distance from the seam. The site refuses to rank them. p 0.82-1.00 THE CLOSE: the panels translateX toward each other, left 0 to +3.5vw, right 0 to -3.5vw, scrubbed. At p = 0.90 the hairline retracts, scaleY 1 to 0, transform-origin BOTTOM, 480ms cubic-bezier(0.16, 1, 0.3, 1), draining out the opposite end from the one it was drawn from. "But every one of them belonged to me." sets full measure on the axis, landing on the same baseline "This was mine." occupied 300vh earlier. MOBILE: same five beats, transposed. Hairline draws scaleX 0 to 1, transform-origin left, same 520ms. Photo band drifts translateY 0 to -6vh while the type block drifts translateY -4vh to +4vh, still opposite, still a shear along the seam. The pass moves to the axis that has room: "Some were good." translateX -18px to +18px, "Some weren't." +18px to -18px, crossing at p = 0.72 with the same gold flash. IMPLEMENTATION: prefer native CSS scroll-driven animation (animation-timeline: scroll()) so there is no JS in the critical path at all. Where unsupported, a rAF-throttled IntersectionObserver writes --p and does nothing else. --p is declared in CSS with a default of 1, so if the JS layer never runs the scene renders in its finished, fully readable configuration rather than blank.

### Interaction
One, quiet, and honest. The photograph is a focusable figure (tabindex="0"). On hover or :focus-visible it lifts from filter: brightness(0.42) saturate(0.85) contrast(1.06) to brightness(0.58) saturate(0.92) contrast(1.04) over 480ms cubic-bezier(0.33, 1, 0.68, 1), and its plate number "PL. 05" goes from 62% to 100% opacity over the same curve. Touch: a 200ms tap toggles the same state, no navigation, no overlay. Nothing is revealed that we do not actually know about the photograph, no invented location or date caption. That is the whole interaction. The scene is about a decision nobody else gets to make, so the reader is not asked to click anything: the only thing they can do is look harder at one half, which is the point. Everything else in the scene is scroll and stillness.

### Typography
MARK'S WORDS, all Newsreader, all #FCFCFC. Phase A "Every life reaches a moment when someone else stops making the decisions.": Newsreader 300, opsz 40, 52px / 1.18, tracking -0.015em, breaking to three lines. Phase B "This was mine.": Newsreader 500, opsz 60, 88px / 1.0, tracking -0.02em, one line, the largest and heaviest type in the scene. Phase C "Leaving home wasn't just about finding a place to live.": Newsreader 300, opsz 32, 36px / 1.34, tracking -0.005em, 480px measure. Phase D "It was about finding out who I was.": Newsreader 300, opsz 48, 64px / 1.15, tracking -0.01em. Phase E "Some were good." and "Some weren't.": both Newsreader 400, opsz 48, 56px / 1.0, tracking -0.01em, byte-for-byte identical specs, no italic on either, no colour difference, no weight difference. Phase F "But every one of them belonged to me.": Newsreader 400, opsz 60, 72px / 1.1, tracking -0.02em. Lesson "Growth begins the moment excuses end.": Newsreader 500, opsz 24, 26px / 1.4, tracking 0, 520px measure. It is Mark's writing, so it stays serif even though it sits inside site furniture. THE SITE'S WORDS, all Archivo (Inter as the metric fallback), all 11px, 0.1em tracking, uppercase, weight 500, #FCFCFC at 62% opacity: "SCENE 05", the time-of-day stamp, "PL. 05", and the word "LESSON" above the lesson line. Nothing in Archivo exceeds 11px anywhere in this scene, and nothing in Newsreader is ever set in uppercase. MOBILE sizes: Phase A 28px / 1.25, Phase B 40px, Phase C 21px / 1.4, Phase D 30px, Phase E 32px, Phase F 34px, lesson 19px / 1.45, furniture stays 11px.

### Contrast
#FCFCFC on the #14141a ground: 17.9:1 (all of Phases A, B, C, F and the lesson sit here). #FCFCFC on the photograph at brightness(0.42), worst case being the brightest sky region which lands near #545A60 after filtering: 6.8:1, which clears AA for normal text and AAA for the 56px and 64px sizes actually used there. That is the floor with no scrim at all, so the scene is already safe before mitigation. With mitigation: "Some weren't." carries a scrim that travels with it under the same transform, linear-gradient(90deg, rgba(20,20,26,0.86) 0%, rgba(20,20,26,0.62) 60%, rgba(20,20,26,0) 100%), 520 x 120px, giving 14.9:1. Phase D's straddling sentence carries a 220px-tall band scrim across x 720 to 1440 only, linear-gradient(180deg, transparent, rgba(20,20,26,0.80) 22%, rgba(20,20,26,0.80) 78%, transparent), giving 13.8:1. Furniture at #FCFCFC 62% over #14141a composites to roughly #A4A4A6: 7.4:1, clearing AA at 11px with headroom. The #D6A145 hairline on #14141a is 7.9:1; it carries no text and no meaning that is lost if unseen, but it passes anyway. Nothing in the scene relies on the gold to be legible. When the photograph is lifted to brightness(0.58) on hover, the unscrimmed worst case falls to roughly 4.9:1, still above 4.5:1, and both scrimmed cases stay above 11:1.

### Reduced motion
A complete, composed, static scene, not a stripped one. The sticky track collapses to normal document flow, 1180px tall at 1440 and a single stacked column at 375. The seam is drawn full height at x = 720, 1px, #D6A145 at 34%, permanent. Left half holds Phases A, B, C and F stacked with 48px of space between them, all at final position and full opacity. Right half holds the photograph at brightness(0.48), a touch brighter than the moving version because it no longer has motion to help it read, with "PL. 05" in place. Phase D's sentence sits across the seam with its band scrim. The crossing is not lost, it is made permanent: "Some were good." and "Some weren't." are set on the SAME baseline, level across the seam, which is the exact configuration the animated version only holds for 240ms. The one frame that motion touches in passing becomes the resting state, so the static reader gets the scene's thesis handed to them directly rather than implied by movement. The hover lift on the photograph still works (it is a filter transition, capped at 200ms under reduced motion). No opacity below 1 on any text, ever, in this mode.

### Assets
- hero-two-lane-centred

### Risk
The obvious failure is that a centre seam with a short phrase on each side is one bad decision away from a before/after comparison slab, the exact thing the director's note forbids. Four things hold it back, and all four are load-bearing: the pair share one identical type spec so neither can read as the preferred option; their vertical travel is deliberately unequal so they never sit in a shared row except for 240ms; there are no labels, ticks, crosses, colours or rules other than the single hairline; and the scene resolves back into one column, which a comparison never does. If any of those are dropped in build, the scene becomes a pricing table about morality. The second risk is the road-stripe alignment: if the painted line cannot be landed within about 6px of the panel's left edge at both 1440 and 1920, the rhyme reads as an accident rather than an intention and does more harm than good. Measure it once, hardcode object-position, and if it will not sit, abandon the rhyme and crop to the road's shoulder instead. The scene still works, it just loses a grace note. If hero-two-lane-centred turns out to be spent as a hero elsewhere, s07-pines-road substitutes and the alignment method is unchanged. Third risk: at #14141a a photograph pulled down to brightness(0.42) can read as a rendering fault rather than a choice. The feathered top, bottom and right edges are what sell it as an intentional emergence from the dark, so they are not optional polish.

---

## Scene 06 — Choosing a Greater Challenge

**Reference:** Faculty Department — https://mobbin.com/sites/sections/59838174-70f1-4a04-9985-8541f4e69473

- **Take:** The hard vertical split: a left column of quiet editorial type that scrolls at its own pace against a right-hand media panel that is pinned to the viewport and changes its contents in place rather than scrolling away. Critically, the media panel carries its own small caption line INSIDE the panel's own real estate, so the media is treated as a plate in a record rather than as decoration. That caption-attached-to-pinned-media pattern is the entire borrow.
- **Leave:** The dot pagination indicators (they advertise a control and invite clicking; scene 6 offers the reader nothing to do, on purpose). The cream ground and the warm lifestyle photography. The edge-to-edge bleed of the media panel: my plate must be a bounded, framed object with ground visible around it, because an unexposed plate only reads as unexposed if you can see its edges.

**Why it differs from every other scene:** It is the only scene where the media well is deliberately, visibly EMPTY for a third of its duration and says in plain type that no photograph exists, and the only scene whose central mechanic is a drawn line that later turns out to have been a real horizon all along.

### Layout
DESKTOP 1440. One <section> 320vh tall. 12-col grid, 72px outer margins, 24px gutters, content width 1296. Archival furniture pinned at the section's own top-left, 72px from left / 40px from section top: "SCENE 06" and, 8px under it, "04:12". LEFT (cols 1-5, 528px wide) is the plate column: position:sticky, top:0, height:100vh, contents flex-centred so the plate's vertical centre lands at 46vh. The plate itself is 528 x 352 (3:2), no fill, 1px hairline border rgba(252,252,252,0.16), ground visible through it. Flush above it, 14px gap: "PL. 06". Flush below it, 16px gap: a caption box of fixed 2-line height (32px) holding three absolutely-positioned captions stacked in the same place so nothing ever reflows. RIGHT (cols 7-12, 636px) is Mark's column, 320vh of normal flow, max text measure 560px. Line tops measured from section top: L1 34vh, L2 82vh, L3 132vh, L4 192vh, L5 192vh+56px, L6 244vh. L3 (the question) is the one element that breaks the grid: it hangs 24px LEFT of the column's left edge into the gutter. LESSON block at 288vh, released from the pin, spanning cols 1-12: a 64px x 1px gold rule at 0.5 alpha, 20px gap, the label "LESSON", 20px gap, the sentence at max-width 720px. MOBILE 375. Single column, 24px margins, content width 327. Sticky is dropped entirely (a 100vh pin plus 26px serif on a 375 screen leaves no room to read). The plate becomes an inline 327 x 218 element placed between L3 and L4, running the same three states in one pass as it crosses the viewport. Furniture becomes one line, "SCENE 06   04:12", 24px in from the top-left. Natural flow height, roughly 210vh. L3 does not hang (there is no gutter); it is separated instead by 40px of air above and below.

### Motion
The meaning first: there is no photograph of a young man deciding to enlist, so the plate beside the words is EMPTY for the first third of the scene and says so. What changes inside it is not a photo swap, it is a line being drawn in the dark and only afterwards turning out to have been a real horizon. That is "I wanted structure" and "comfort replaced with commitment", built as geometry. All scrubbing is CSS scroll-driven (animation-timeline), so the scroll position IS the clock and no animation can stall. THE PLATE, driven by animation-timeline: view(block) on the 320vh section, all ranges in `contain` units. (1) GOLD RULE: a 1px-tall, 100%-wide element, #D6A145, at exactly 50% of the frame height, transform-origin left, transform scaleX(0) to scaleX(1) over contain 0% to contain 34%, easing LINEAR with no ease-out at all, because a commitment is not eased. (2) PHOTOGRAPH: s06-wide-horizon fades in over contain 40% to contain 74%, opacity 0 to 1 with transform scale(1.04) to scale(1), cubic-bezier(.22,.61,.36,1). object-fit:cover, object-position:center 53%. The crop math: a 4:3 source in a 3:2 frame shows 50% of the source height; centring on 53% shows source y 28% to 78%, which lands the real ridgeline at exactly 50% of the frame, dead on the gold rule. The line he drew turns out to be the horizon. (3) RULE DIMS: opacity 1 to 0.35 over contain 62% to 78%, and it stays, sitting on the ridge. (4) CAPTIONS cross-fade in the fixed box: caption I "NO PHOTOGRAPH EXISTS OF THIS DECISION" fades out contain 26-32%; caption II "A LINE DRAWN BEFORE THERE WAS ANYTHING TO SEE" in contain 30-36% and out contain 56-62%; caption III "PHOTOGRAPH BY MARK BROWN" in contain 60-66%. THE WORDS, each line animation-timeline: view(). L1, L2, L4, L6: @keyframes from {opacity:.32; transform:translateY(20px)} to {opacity:1; transform:none}, linear, animation-range entry 6% cover 34%. L5 uses entry 12% cover 40% so the pair "I wanted structure. / I wanted to be challenged." arrives as two separate thoughts roughly 180ms apart at normal scroll speed rather than as one block. L3, the question, arrives differently from everything else on the page: opacity only, .38 to 1, NO translate, over a long entry 0% cover 48%. A question does not step forward, it is simply already there and gets clearer. Only transform and opacity are animated anywhere in this scene. No parallax, no autoplay, no audio.

### Interaction
None. No hover state, no click target, no drag, no control of any kind. This is deliberate and it is the point: the one scene where the reader is offered nothing to do, because the scene is about a man deciding alone with nobody to consult. The plate looks like it should be clickable and is not. The only input the scene accepts is scroll. Keyboard users pass straight through with no focus stop, which is correct because there is nothing to focus.

### Typography
MARK (Newsreader only). L1 "Independence gave me freedom." and L2 "But freedom also brought a question." — Newsreader roman, opsz 32, weight 300, 34px/1.42, letter-spacing 0.005em, rgba(252,252,252,0.78). L3 "What kind of man did I want to become?" — Newsreader ITALIC, opsz 48, weight 300, 56px/1.22, letter-spacing -0.01em, solid #FCFCFC. It is the only italic and the only 56px in the scene. L4 "I wanted structure." and L5 "I wanted to be challenged." — Newsreader roman, opsz 32, weight 500, 34px/1.32, solid #FCFCFC, 56px apart. The weight jump from 300 to 500 against the identical 34px size is the whole argument: the answers are heavier than the questions that produced them. L6 "That's what led me to the United States Air Force." — back to opsz 32, weight 300, 34px/1.42, rgba(252,252,252,0.78). Stated flat, at the quietest weight in the scene, never enlarged. Per the director's note this is service, not a trophy; the sentence that names the Air Force is the least emphatic sentence on screen. LESSON "Character grows when comfort is replaced with commitment." — Newsreader roman, opsz 28, weight 300, 30px/1.5, letter-spacing 0.005em, #FCFCFC, max-width 720px. SITE (Archivo/Inter only, all 11px, 0.1em tracking, uppercase). "SCENE 06", "04:12", "PL. 06", all three plate captions: rgba(252,252,252,0.55). The single word "LESSON": #D6A145. No face is ever mixed inside a line. Mobile sizes: L1/L2/L6 24px/1.5, L3 34px/1.25, L4/L5 24px weight 500 at 36px apart, lesson 21px/1.55, furniture stays 11px.

### Contrast
Ground #17181f, relative luminance 0.00990. #FCFCFC solid (L3, L4, L5, lesson body) = 17.5:1. rgba(252,252,252,0.78) over ground, composites to sRGB 201.6/201.8/203.4 = 10.7:1 (L1, L2, L6, all 34px, far above the 3:1 large-text floor and above the 4.5:1 body floor). rgba(252,252,252,0.55) composites to sRGB 149.0/149.4/152.6 = 5.9:1, used only for the 11px furniture and the plate captions, clears the 4.5:1 small-text floor. #D6A145 gold on ground = 7.6:1, used for the word "LESSON" at 11px and for the 1px rule, both clear. NO TEXT IS EVER SET OVER THE PHOTOGRAPH. The plate captions sit outside the frame on bare ground, so no scrim is needed anywhere in this scene and none is used. Mid-animation states are also safe: the lowest opacity any word reaches is 0.32 of #FCFCFC, which composites to roughly 3.5:1, and it only occupies the first fraction of a scroll-driven range at 34px+ where 3:1 is the requirement; every line settles at its full ratio and, in every fallback path, starts there.

### Reduced motion
Two fallback paths, both COMPLETE rather than degraded. (a) prefers-reduced-motion: reduce. The left column drops position:sticky for position:static, so the scene becomes a plain two-column article: the plate sits at the top of column one, Mark's six lines run down column two, lesson underneath. The plate renders in its END state from first paint — photograph at opacity 1, gold rule at scaleX(1) and opacity 0.35 sitting on the ridge, caption III "PHOTOGRAPH BY MARK BROWN" visible, captions I and II display:none. Every one of Mark's lines is opacity 1, transform none. Nothing pins, nothing scrubs, nothing moves. All seven sentences and the lesson are fully readable in a single static screenshot. (b) No animation-timeline support (older browsers). Identical end state for the plate and identical full opacity for every line, but position:sticky is retained, because sticky is layout and not animation. The scene reads as a pinned photograph beside six sentences, which is a good section in its own right. The base stylesheet has every element at opacity 1 with no transform; the animations are additive and live only inside `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`. Nothing in this scene has an invisible start state that only an animation can undo. Accessibility: all three captions carry aria-hidden="true"; the real accessible caption is one visually-hidden figcaption reading "No photograph exists of this decision. The photograph shown is a road view taken by Mark Brown." The img carries that same alt text.

### Assets
- s06-wide-horizon.webp

### Risk
The real risk is the photograph itself: s06-wide-horizon is a bright daylight-blue 4:3 frame, and dropping it unmodified into a #17181f pre-dawn ground would punch a daylight hole straight through the light arc, which is the one thing that must never break. Mitigation: the plate carries a FIXED, un-animated filter of brightness(0.42) saturate(0.55) contrast(1.05). This is defensible rather than a cheat, because the light in that frame is already raking and low, catching only the ridge crest while the near forest sits in deep shadow; darkening it reads as first light on a ridge, which is what it is, not as a fake sunrise. If at 0.42 the image muds out, raise it to 0.50 and stop there. Do NOT add a colour tint, a gradient overlay, or a duotone to fix it, because that turns an archive photograph into a graphic and this whole site rests on the photographs being real. The second risk is that three empty-plate captions in sequence tip from severe into arch, and the scene starts making a point about itself instead of about Mark. Mitigation: the captions are 11px, 0.55 alpha, and sit outside the frame like plate marks in a book; if any of them starts reading as a caption with a personality, cut caption II and hold caption I straight through to caption III.

---

## Scene 07 — Forged Through Discipline

**Reference:** KODE Immersive — https://mobbin.com/sites/sections/d2552c1b-4584-44c1-99d7-d73071d0edb0

- **Take:** Enormous display type force-justified so that EVERY line lands exactly on both margins, with word-spacing stretched to whatever it takes. The type is the entire composition: no image, no card, no container, no decoration. The eye reads a perfectly rigid rectangle of text whose interior spacing is wildly irregular. That contradiction (rigid outer shape, variable inner content) is precisely the definition of discipline and it is the whole reason this reference belongs to this scene and not to another.
- **Leave:** KODE sets a heavy slab/didone in near-black on white with an orange accent and runs its nav straight through the type so the words collide with the chrome. All of that is wrong here. KUL needs the opposite: a LIGHT optical-72 Newsreader on the dark #1f2025 ground, furniture kept strictly outside the text column, no accent inside the type. KODE also holds one uniform size across every line, which is the single thing I invert: my size varies line by line and the measure is what stays constant.

**Why it differs from every other scene:** It is the only scene in the seventeen whose composition is built by varying the TYPE SIZE line by line to hold one unmoving measure, and the only one whose scale ladder deliberately ends smaller than it began.

### Layout
THE GOVERNING LAW: one fixed measure, 1120px wide, and every line of Mark's writing is set at whatever font-size makes it fill that measure exactly. The words change size; the column edges never move. Eight units, stacked, each one line (except F).

AT 1440x900. Page gutters 5vw (72px). Text column: width min(1120px, 84vw), centred, so left edge x=160, right edge x=1280. Column gets container-type: inline-size. Section padding-block: 22vh top / 26vh bottom. Natural height approx 1730px (about 1.9 screens). NOT pinned, NOT sticky. Steady deliberate pacing means the reader passes through it, not stares at it.

Unit sizes (Newsreader, derived as 2240/charcount, then verified: each unit's UNJUSTIFIED width must measure between 92% and 100% of 1120px at 1440 — adjust the px value until it does, then justification closes the last few percent):
  A "Some lessons can only be learned"        32ch  70px   wght 200  opsz 70
  B "through discipline."                     19ch  118px  wght 200  opsz 72
  C "It demanded consistency."                24ch  93px   wght 250  opsz 72
  D "Accountability."                         15ch  149px  wght 250  opsz 72
  E "Commitment."                             11ch  204px  wght 300  opsz 72
  F "Every day became another opportunity / to become a little stronger / than the day before."   34px  wght 400  opsz 34
  G "Discipline doesn't change who you are."  38ch  59px   wght 500  opsz 59
  H "It reveals who you're willing to become." 40ch 56px   wght 600  opsz 56
(A/B is one sentence in the brief, broken at the screenplay's own break. That is a line break, not a copy edit.)

Read the size column: 70, 118, 93, 149, 204, then 34, then 59, 56. It climbs to a monumental 204px on the single word "Commitment.", collapses to a small dense block for the description of doing it every day, and settles at 56px. THE SCENE ENDS SMALLER THAN IT BEGAN. That is "quiet confidence, never celebration" expressed as a number, not as a mood. Weight runs the other way: the biggest words are the lightest (200-300), the smallest are the firmest (500-600). Size is the claim; weight is the proof.

Justification: A, B, C, G, H use text-align: justify + text-align-last: justify. D and E are single words so justification cannot act on them: split them into per-letter spans in a display:flex; justify-content: space-between row, giving a mathematically exact edge-to-edge fill and a carved-inscription look. Put the real word on aria-label of the parent and aria-hidden="true" on every letter span so screen readers say "Accountability." not "A c c o u n t a b i l i t y."

F is the one deliberate exception. It sits in a 560px half-column indented to start at x=720 (the measure's midpoint), justified within that half so its RIGHT edge still lands on 1280. The law "every line touches the right margin" survives intact; the left margin is broken exactly once, by the smallest and most numerous type on the page. The daily grind is set as a margin note, subordinate to the statements it produced.

Vertical gaps between units: 6vh, 6vh, 6vh, 6vh, then 10vh before F, 8vh before G, 4vh before H.

THE LESSON. 24px below H sits the gold hairline's final parked position, then the Archivo eyebrow "LESSON" (11px / 0.1em / uppercase / #D6A145), then "Excellence is rarely built in a single moment. It's built one decision at a time." in Newsreader 26px, wght 400, opsz 26, line-height 1.5, max-width 620px, FLUSH LEFT AND RAGGED RIGHT. It is the only text in the scene permitted to end where it naturally ends. The discipline has produced something and no longer needs enforcing.

FURNITURE, outside the column, in the gutters: "07" at x=72, y=64 from section top. Time stamp "04:41" right-aligned to x=1368, same baseline. Bottom-left, 64px above section end: "NO PLATE". There is no photograph and the archive says so in the plate slot rather than leaving a hole. Not a joke, standard archival practice, and it keeps the furniture rhythm unbroken across all 17 scenes.

AT 375px. The fill-the-measure rule is abandoned rather than fudged: it would drive F to 9px. Column becomes 84vw (315px), justification OFF everywhere (justified 19px serif on a 315px measure is all rivers), everything flush left ragged right. Explicit mobile size table, ladder preserved: A 25px, B 41px, C 33px, D 52px, E 71px, F 19px, G 22px, H 21px, lesson 18px. D and E drop the per-letter flex and set normally. F goes full width, no indent. Gaps compress to 4vh / 4vh / 4vh / 4vh / 7vh / 5vh / 3vh. Gutters 24px, furniture stays in place at 11px. The 71px-over-19px contrast still carries the whole ladder on a phone.

### Motion
The meaning is carried by things that CANNOT break: the size ladder and the weight ladder are static CSS, present in the first paint, legible in a screenshot with zero scrolling. Motion only adds a reading rhythm on top.

1) THE ARRIVAL RAMP (pure CSS, no JS, reversible for free).
Each of the eight units carries a scroll-driven opacity ramp, guarded so it cannot ever be the only route to visibility:

@supports (animation-timeline: view()) {
  .k7-unit {
    animation: k7-arrive linear both;
    animation-timeline: view(block);
    animation-range: cover 0% cover 40%;
  }
}
@keyframes k7-arrive { from { opacity: .55 } to { opacity: 1 } }

Outside that @supports block there is no animation and opacity is 1. Base state in the stylesheet is opacity: 1.
Numbers: cover spans 100vh + element height, so for a 70px unit at 900vh that is 970px of scroll; 40% of it is 388px, and the ramp completes when the unit's top edge has risen to 512px = 57vh. Every unit therefore reaches full strength as it crosses the 57vh reading line, and sits at 0.55 (5.56:1, fully readable, never invisible) before it gets there. fill-mode: both makes elements above the line hold 1 and below hold .55, correct in both scroll directions with zero state to desynchronise.
F's three lines are authored as three separate display:block children each with its own view() timeline, so they stagger naturally by their own 51px line height, roughly 190ms apart at a normal reading scroll. The list of daily requirements assembles one item at a time because a person remembers them one at a time.

2) THE RATCHET (the one thing that means something).
A single 1px hairline, full measure wide, #D6A145 at 0.9 alpha, sits 20px above the cap line of the active unit. It tracks the unit currently crossing 60vh. It moves ONLY by transform: translate3d(0, var(--k7-step-y), 0), and --k7-step-y is only ever assigned one of nine precomputed values (the eight unit offsets plus the lesson offset, measured once on mount and on resize).

transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);

Because the variable can only hold one of nine fixed numbers, the rule is physically incapable of moving continuously. The page scrolls smoothly; this one element refuses to. It steps. Same increment every time, regardless of how fast or how erratically you scroll. If you flick past four units it does not smear into one long slide: when the index jumps by more than 1 it walks the intermediates on setTimeout at 90ms apart, capped at 6 intermediates, so a hard flick reads as tick-tick-tick-tick and a jump to the end takes at most 540ms. Scrolling back up steps back by exactly the same distance.
That is the argument of the scene made mechanical. Discipline is the same measured step, taken at the same size, no matter what kind of day it is.
Detection: nine IntersectionObservers, one per anchor, rootMargin '-60% 0px -39% 0px' (a 1vh band at 60vh), threshold 0. Cheap, no scroll handler, no rAF loop.
The rule never changes width, opacity, or colour. Only translateY. Nothing in this scene animates width, height, top, or left.

3) THE COUNTER. Archivo 11px / 0.1em / uppercase, flush to the right end of the rule, moving with it. textContent swapped in the same frame the transform is committed: "STEP 01 / 08" through "STEP 08 / 08". No animation, no tween, no fade. It is a discrete readout of a discrete thing. It never says "COMPLETE" — that would be a celebration and this scene does not celebrate.

4) PROGRESSIVE ENHANCEMENT. The rule ships in the HTML already parked at its final position under H with no transition and no inline transform. If the JS never runs, it is exactly where the static composition wants it. The JS only ever converts it from correct-and-still to correct-and-stepping.

### Interaction
Deliberately almost nothing, and that restraint is the point: discipline is not a thing you click.

The one affordance: hovering any of the eight units snaps the gold rule to that unit immediately (the JS sets transition-duration: 0ms for pointer-driven moves) and updates the counter. On mouseleave the rule returns to the scroll-derived index with the normal 220ms step. Following your own reading position with the cursor is a real reading behaviour, and the rule quietly obeying it makes the reader feel the mechanism is listening. It conveys no information that is not already on screen, so nothing is lost without a pointer, and nothing keyboard- or touch-only is required to compensate. Disabled entirely under prefers-reduced-motion and under (hover: none).

No keyboard interaction and no focusable elements. This is prose; making eight paragraphs tabbable to manufacture "engagement" would be worse for a keyboard or screen reader user than leaving them as the well-structured text they are. Reading order is A through H then LESSON, exactly as authored, with the per-letter spans on D and E hidden from the accessibility tree behind aria-label.

### Typography
NEWSREADER carries every word Mark wrote, and nothing else. Variable axes driven explicitly: font-optical-sizing: none, then font-variation-settings: 'opsz' <matched to the px size, clamped 6-72>, 'wght' <per the ladder>. Matching opsz to size is what makes the 204px "Commitment." a true display cut with hairline thins and high stroke contrast, while the 34px block F gets the sturdier text cut. It is the difference between a serif that looks typeset and one that looks scaled.
  A 70px/200/opsz 70, line-height 1.05
  B 118px/200/opsz 72, line-height 1.02
  C 93px/250/opsz 72, line-height 1.03
  D 149px/250/opsz 72, line-height 1.00
  E 204px/300/opsz 72, line-height 1.00
  F 34px/400/opsz 34, line-height 1.50
  G 59px/500/opsz 59, line-height 1.05
  H 56px/600/opsz 56, line-height 1.05
  LESSON 26px/400/opsz 26, line-height 1.50
Weight ceiling is 600. Newsreader goes to 800 and this scene does not use it: 800 would read as a shout and the director's note forbids celebration.
Letter-spacing: 0 everywhere except D and E, where spacing is produced by flex distribution rather than by a letter-spacing value, so the trailing period is not left with a dangling gap.

ARCHIVO carries everything the SITE says and nothing else: "07", "04:41", "NO PLATE", "STEP NN / 08", and the "LESSON" eyebrow. All at 11px, 0.1em tracking, uppercase, weight 500. Five instances, that is the complete inventory. The man is set in serif, the institution is set in grotesk, and the two typefaces never appear inside the same line or the same block.

No em dashes anywhere in the scene. The copy as supplied contains none and the line breaks introduce none.

### Contrast
Ground is #1f2025 throughout (relative luminance 0.0154). Every value below computed against it.
  Mark's eight units, arrived: #FCFCFC solid = 15.9:1. AAA.
  Mark's eight units, resting before arrival: #FCFCFC at 55% alpha composites to #98999B = 5.56:1. Passes AA for normal text and AAA for large text, so the pre-arrival state is a legitimate readable state, not a placeholder. This state does not exist at all under reduced motion or without scroll-driven-animation support, where opacity is 1.
  LESSON body text: #FCFCFC at 86% composites to #DDDDDE = 11.8:1. AAA.
  "LESSON" eyebrow, 11px: #D6A145 = 6.91:1. AA at 4.5:1 required, passes with margin.
  Step counter, 11px: #FCFCFC at 72% composites to #BEBEC0 = 8.66:1. AAA.
  Scene number "07", time stamp "04:41", "NO PLATE", all 11px: #FCFCFC at 62% composites to #A8A8AA = 6.78:1. AA required 4.5:1, passes.
  Gold hairline rule, non-text: #D6A145 = 6.91:1 against ground, far above the 3:1 non-text minimum.
Smallest type in the scene is 11px and its worst ratio is 6.78:1. Nothing in the scene sits below AA in any state, including mid-animation.

### Reduced motion
Under prefers-reduced-motion: reduce the scene is not degraded, it is simply finished. Everything the motion was there to reveal is already static CSS.

  - All eight units at opacity 1. The @supports block is overridden with animation: none.
  - The size ladder (70 / 118 / 93 / 149 / 204 / 34 / 59 / 56) is untouched. It was never animated. The rise to "Commitment." and the settle to a size smaller than the opening are fully visible at rest.
  - The weight ladder (200 through 600) is untouched. It was never animated.
  - The 1120px measure and the hard right edge on every line are untouched.
  - The gold hairline renders once, statically, in its final parked position 24px above the LESSON eyebrow, full measure wide. No transform, no transition, no JS attached.
  - The counter renders once as "STEP 08 / 08".
  - Hover tracking is disabled; the rule does not respond to the pointer.
  - All furniture identical.

A reduced-motion visitor loses the ratchet's rhythm and gains a completely composed, fully legible typographic page. Every argument the scene makes (the growth, the monumentality of "Commitment.", the subordination of the daily block, the quiet smaller ending, the rule resting above the lesson) is present. Nothing has to be inferred from something that did not happen. The same is true for any browser without animation-timeline support, and for any visitor whose JS fails: those paths land on this exact static composition.

### Assets


### Risk
The likeliest failure is that "every line fills the measure exactly" quietly does not happen, and the scene collapses into a ragged, arbitrary-looking stack of mismatched font sizes, which is the single most template-looking thing a type-only page can be. It fails because my px values are derived from an assumed 0.50em average advance and Newsreader's real advance at opsz 72 will not match that, especially on lines with many narrow letters ("It demanded consistency." is advance-light; "Accountability." is advance-heavy).

Mitigation, in order. (1) text-align: justify + text-align-last: justify on A, B, C, G, H means the fill is FORCED regardless of my estimate, so the px value only controls how ugly the word gaps get, not whether the edges line up. (2) Concrete acceptance test the developer runs before anything else: temporarily set text-align: left, measure each unit's natural width at 1440, and adjust its px value until it lands between 92% and 100% of 1120px. Within that band, justification closes the remainder with word gaps that read as intentional rather than as damage. Outside it, the gaps become rivers and the line looks broken. (3) D and E cannot be justified at all and use per-letter flex distribution, which is exact by construction and cannot drift. (4) Re-run the measurement check at 1280 and 1024, where 84vw takes over from 1120px and every ratio shifts.

Second risk, smaller: 204px display type at wght 300 on a dark ground can go optically thin to the point of looking like a rendering artefact rather than a choice. Check "Commitment." on a non-retina display before shipping; if the thins disappear, take E to wght 340 rather than reducing its size. Its size is load-bearing for the composition; 40 units of weight are not.

---

## Scene 08 — Life Doesn't Follow a Straight Line

**Reference:** Titan Intake — https://mobbin.com/sites/sections/997ccdfd-8e26-4f3b-ba9e-423d72ed08c1

- **Take:** Content items are laid out along a curved path that runs off-canvas, and the path slides so that whichever item reaches one fixed reading position is the only one that de-rotates to 0deg and comes to full opacity. Everything else stays tangent to the curve, tilted and faded, visibly waiting its turn. The reader's eye never moves; the curve moves past it. That is exactly the assigned lane, and it is the only reference found that keeps type legible while it rides a curve.
- **Leave:** The circle. Titan's path is a perfect geometric arc used as a product dial, with a photographic sky trapped inside the stroke and a UI screenshot parked beside it. A perfect circle is a machine, and this scene is about a life. Ours is an asymmetric bezier that swings right, dips, doubles back left and rises, never crossing itself. Also left behind: their numbered 01/02/03 step chips (this is not a process), their 'See a Demo' links, and their permanent radial layout at every breakpoint.

**Why it differs from every other scene:** It is the only scene where the reader's eye is nailed to one fixed point and the content travels a curved path past it, and the only one whose scroll-to-content mapping is deliberately non-uniform, so that two sentences arrive fast on top of each other and one takes the longest stretch on the page to reach.

### Layout
STAGE. Section is a 400vh container holding one position:sticky, height:100vh stage. All coordinates below are given in the stage's SVG viewBox space, "0 0 1440 900", preserveAspectRatio="xMidYMid slice", so they scale with the viewport.

AT 1440. Three things sit on the stage.

(1) THE PLATE. s08b-rockcut-bend, 620px wide x 470px tall, anchored to the stage's bottom-left corner and bleeding off both the left and bottom edges (so it is never a floating framed rectangle). Object-position 42% 60%, which puts the road's vanishing point (where the tarmac bends right and disappears between the two rock cuts) at stage (318, 776). Filter: brightness(0.62) saturate(0.78) contrast(1.05). Over it, a linear-gradient scrim at 118deg from rgba(38,40,42,0.88) at 0% to transparent at 56%, so the bright winter sky in the upper-right of the frame dissolves into the ground colour instead of butting against it. Plate number sits on the ground, not on the photo: "PL. 09" (developer: take the next number in the running plate sequence), 11px Archivo, at stage (24, 404), 24px above the plate's top edge, left-aligned to its left bleed.

(2) THE CURVE. One SVG path in the same viewBox, defined once and used for both the visible hairline and the text positioning via getTotalLength/getPointAtLength:
M 318 776
C 470 742, 560 668, 596 566
C 640 438, 786 404, 900 452
C 1012 498, 1064 566, 1150 560
C 1246 553, 1276 430, 1236 320
C 1198 216, 1030 178, 902 214
C 762 253, 700 168, 742 78
Its origin (318, 776) lands exactly on the photograph's vanishing point. Measured length L is approximately 2100px; read the real value at runtime and use fractions of L throughout. It swings right and up, dips, turns back up and to the LEFT, doubles back, then rises off the top edge. It never self-intersects (a crossing path reads as a scribble, not a road).

(3) THE READING ANCHOR. A fixed stage point R = (860, 470), right of centre and slightly above the midline, clear of the plate. A single gold dot, r=3.5, fill #D6A145, sits at R and never moves for the whole pinned run. It is the windscreen point. It is the only solid gold fill in the scene.

THE EIGHT STATEMENTS ride the curve at these arclengths, offset along the path normal:
  1 "I thought I knew where life was taking me."   s=0.00L   normal +0
  2 "I had a plan."                                s=0.13L   normal +0
  3 "But plans have a way of changing."            s=0.27L   normal +0
  4 "There were victories."                        s=0.41L   normal +72 (outside the bend)
  5 "There were setbacks."                         s=0.50L   normal -72 (inside the bend)
  6 "Both became teachers."                        s=0.62L   normal 0, sitting ON the line; the hairline is interrupted by a 0.9em gap behind this block only
  7 "Life rarely asks whether you're ready."       s=0.78L   normal +0
  8 "It simply asks: what will you do now?"        s=0.94L   normal +0
Each block's transform-origin is its own left edge at 50% height, anchored to the sampled point, max-width 26ch, no wrapping for lines 2, 4, 5, 6.
Lines 4 and 5 are the only pair placed on OPPOSITE sides of the path, so the reader physically watches the road swing between victories and setbacks. Line 6 is the only one straddling it.

THE LESSON does not ride the curve. After statement 8 clears the anchor (p > 0.96) the curve has exited the top of the stage and the lesson is already sitting, static, centred on the stage at (720, 470), max-width 22ch: an Archivo label "LESSON" in #D6A145 above, then two lines of Newsreader. Nothing about it moves. The motion stops, and that stillness is the punctuation.

FURNITURE, in the site's standing position, on the sticky stage so it holds for the entire pinned run: scene number "08" top-left at 40px/40px inset; time stamp "04:41" top-right at 40px inset. Both 11px, 0.1em, uppercase, Archivo 500, #FCFCFC at 0.55 alpha.

AT 375. The curve mechanic is not attempted. Forcing a bezier through a 375px column is slop, so the [data-curve] attribute is never applied below 768px and the same meaning is carried by the column itself. Single column, 24px gutters. The eight statements stack, 26px Newsreader, 44px apart, each with its own left inset tracing a shallow S down the page: 24, 40, 68, 96, 84, 56, 32, 24 px. A single 1px gold bezier is drawn down the left edge threading between those indents (static SVG, 0.55 alpha) so the column visibly bends. The plate goes full-bleed 375x240, cropped on the bend, and is placed immediately after statement 3, so the sentence about plans changing is followed at once by the road going out of sight. The lesson block sits last, 24px inset, 24px Newsreader.

### Motion
One driver: scroll progress p in [0,1] across the 400vh container, read once per frame into a cached value, consumed in a single rAF.

PHASE A, p = 0 to 0.06 (the first 24vh). The track transform interpolates from translate(0,0) to translate(R - P(0)) = translate(+542, -306), eased with cubic-bezier(0.33, 0, 0.15, 1). Visually: statement 1 rises out of the exact point where the road disappears in the photograph and travels up to the reading anchor, straightening as it goes. The first sentence comes out of the place the road went.

PHASE B, p = 0.06 to 1. The track's transform is translate(P(s0) - P(s(p))) where s0 = 0. Nothing else translates. The photograph, the anchor dot and the furniture are outside the track and stay put. The road slides past a stationary windscreen point.

THE SCROLL-TO-ARCLENGTH MAP IS DELIBERATELY NOT LINEAR. s(p)/L is a monotone piecewise curve through these control points:
  (0.06, 0.00) (0.22, 0.13) (0.36, 0.27) (0.48, 0.41) (0.55, 0.50) (0.68, 0.62) (0.85, 0.78) (0.96, 0.94) (1.00, 1.00)
Between control points, interpolate with cubic-bezier(0.40, 0, 0.60, 1), so every statement decelerates into the anchor and accelerates out of it. Read the numbers: the run from victories (0.48) to setbacks (0.55) is the shortest interval on the whole track, 7% of scroll for 9% of path, so those two arrive fast, one on top of the other. The stretch before statement 8 is the longest, 0.85 to 0.96, so "what will you do now?" takes the most scrolling to reach and sits at the anchor the longest. The scroll itself is uneven because the life was.

PER-STATEMENT STATE, a function of d = (that statement's arclength) - s(p), in px along the path:
  |d| <= 90        ACTIVE. opacity 1, blur 0px, rotate 0deg, letter-spacing -0.01em.
  90 < |d| <= 420  opacity = 1 - ((|d|-90)/330) * 0.66  (floors at 0.34)
                   blur   = ((|d|-90)/330) * 3px
                   rotate = tangentAngleAt(itsArclength) * clamp((|d|-90)/220, 0, 1), tangent clamped to +/-14deg
  |d| > 420        opacity 0.34, blur 3px, full clamped tangent rotation.
Opacity never reaches 0. The reader must always be able to see that there is more road with more sentences on it. The de-rotation is the whole point of the scene: the path is bent, but the one thing you are actually facing straightens up to be read, then tilts away again. Only transform, opacity and filter are touched. Nothing animates width, height, top or left.

DAMPING. Each computed target is lerped toward at 0.14 per frame (~180ms settle) so trackpad jitter does not make the type twitch.

THE HAIRLINE. Two overlaid copies of the same path. The travelled portion (behind the anchor) is stroke #D6A145 at 0.55 alpha, 1.25px. The portion ahead is #D6A145 at 0.20 alpha, 1.25px. The split is driven by stroke-dashoffset from s(p). If paint cost on the dashed stroke ever shows up in a profile, the fallback is a single static line at 0.55 alpha for the whole path, and the scene loses nothing essential.

PHOTO. Does not move, ever. It is the one fixed thing while the road wanders, which is the argument the scene is making.

### Interaction
Two, both quiet, neither decorative.

1. THE PLATE CLEARS ON HOVER. Hovering the photograph eases filter brightness 0.62 to 0.78 and the scrim's opacity 0.88 to 0.66 over 400ms, cubic-bezier(0.22, 1, 0.36, 1); reverses over 260ms on leave. The road you are being told about becomes momentarily easier to see. No caption appears, no zoom, no cursor change.

2. THE CURVE IS KEYBOARD-NAVIGABLE. The eight statements are a real <ol> in document order, each wrapped in a focusable element. Tab moves through them in order; focusing one solves s(p) = that statement's arclength for p and calls window.scrollTo({top, behavior:'smooth'}), which delivers the focused statement to the reading anchor at full opacity and 0deg. Clicking any statement does the same. This is not a flourish: it is the only way a keyboard user reaches statement 6 without scrolling blind, and it makes the curve a real navigation structure rather than a picture of one.

Nothing hovers on the type itself. No tooltips, no parallax on pointer move, no cursor-following anything.

### Typography
MARK'S NINE LINES, ALL NEWSREADER, opsz axis set to match the pixel size in every case.
  Statements 1, 2, 3, 7: 44px / weight 300 / line-height 1.18 / opsz 44 / letter-spacing 0 (-0.01em when active)
  Statements 4 and 5: 38px / weight 300 / opsz 38. Deliberately identical to each other and smaller than their neighbours. Neither victory nor setback is allowed to be the bigger word, because line 6 is about to say they were the same thing.
  Statement 6 "Both became teachers.": 44px / weight 400 / opsz 44. The only weight step up on the curve, and it is on the line that resolves the pair.
  Statement 8 "It simply asks: what will you do now?": 56px / weight 400 / opsz 56 / line-height 1.12, set on two lines breaking after "asks:". The largest type in the scene is the question, not the lesson.
  LESSON: Newsreader 34px / weight 400 / line-height 1.35 / opsz 34, two lines with a hard break between the sentences: "Resilience isn't refusing to fall." / "It's choosing to keep moving." Max-width 22ch. No quotation marks anywhere.

THE SITE'S OWN WORDS, ALL ARCHIVO, 11px / weight 500 / 0.1em tracking / uppercase:
  scene number "08", time stamp "04:41", plate number "PL. 09", and the single word "LESSON".
  "LESSON" is the only Archivo set in #D6A145. Everything else in Archivo is #FCFCFC at 0.55 alpha.

The two faces never touch. Every word Mark wrote is serif; every word the site says about him is sans. At 375 the scale drops to 26px for statements, 30px for statement 8, 24px for the lesson; the 11px furniture does not change size at any breakpoint.

### Contrast
Ground #26282a, relative luminance 0.0223.

  #FCFCFC at alpha 1.00 (active statement, statement 8, lesson body) → 14.4:1. Passes AAA.
  #FCFCFC at alpha 0.55 over ground (scene number, time stamp, plate number) → composites to #9C9C9C → 5.26:1. Passes AA for 11px normal text.
  #D6A145 at alpha 1.00 (the word LESSON, 11px) → 6.25:1. Passes AA.
  #D6A145 at alpha 1.00, the r=3.5 anchor dot → 6.25:1, well over the 3:1 non-text requirement.
  #D6A145 at alpha 0.55, the travelled hairline → composites to #86864... measured as #878786-equivalent luminance 0.2414 → 4.03:1. Passes the 3:1 non-text minimum. This is why the travelled line is 0.55 and not the 0.35 that looked better in isolation.
  #D6A145 at alpha 0.20, the untravelled hairline → below 3:1, and knowingly so. It is purely decorative: it carries no information the eight statements do not already carry, and the path it describes is redundant with the visible positions of the statements themselves. Nothing depends on seeing it.

  THE ONE HONEST PROBLEM: off-anchor statements floor at alpha 0.34, which composites to #6F6F6F and gives 2.86:1. No "not yet your turn" state can pass AA and still read as background. The mitigation is threefold and I am committing to all three: (a) the floor is 0.34, not the 0.18 the design wanted, specifically to buy that 2.86:1 rather than 1.10:1; (b) every one of the eight statements reaches alpha 1.00 and 14.4:1 within the scroll range, and the reader controls the scroll, and the keyboard path delivers any statement to full contrast on Tab; (c) under prefers-reduced-motion: reduce OR prefers-contrast: more, every statement renders at alpha 1.00, blur 0, rotate 0 in the static stacked layout, so no user who needs the contrast is ever shown the faded state.

  NO TEXT SITS ON THE PHOTOGRAPH AT ALL. The plate number is on the ground colour 24px above the plate's top edge. There is no scrim-over-text contrast case to measure in this scene.

### Reduced motion
A complete editorial spread, not a stripped one. Under prefers-reduced-motion: reduce (and identically when JS has not run, since the curve layout is scoped entirely under a [data-curve="on"] attribute that JS only adds AFTER it has successfully measured the path):

The 400vh container collapses to height:auto and the stage un-sticks. The section becomes a two-column spread at 1440: left column is the plate at its full 620x470, static, filter brightness(0.62) saturate(0.78), with PL. 09 above it; right column carries all eight statements stacked at 32px Newsreader, 40px apart, with the alternating left insets 0, 28, 64, 100, 82, 48, 20, 0 px so the column of type still visibly bends down the page, threaded by a single static gold bezier hairline at 0.55 alpha. Every statement is opacity 1, blur 0, rotate 0deg. The lesson block follows below the two columns, centred, at its full 34px. Scene number, time stamp and plate number are in their standing positions.

All nine of Mark's sentences are present, at 14.4:1, in reading order, at full size. Nothing is summarised, truncated or replaced by a still frame. A reader who never sees a pixel move gets the argument in full and gets a page that looks composed on purpose. The only thing they lose is the curve travelling; they keep the curve.

At 375 the reduced-motion version and the standard version are the same layout, because the mobile layout has no scroll-driven motion to remove. The optional view()-timeline lift on mobile statements animates opacity 0.45 to 1 only; the computed default is 1, so a stalled or unsupported animation leaves every word visible. No element on this page has an animation as its only route to being seen.

### Assets
- s08b-rockcut-bend

### Risk
The likeliest failure is that rotated type reads as amateur, and the whole thing lands as a text-on-a-path novelty rather than an argument. Three specific defences, all already in the spec: the active statement is always exactly 0deg and unblurred (nobody is ever asked to read tilted type), rotation is hard-clamped to +/-14deg so even the far-off statements never look thrown, and the reading anchor never moves a pixel, so the reader's eye is still while the road moves, which is a driver's experience rather than a designer's effect.

The second risk is the photograph. s08b-rockcut-bend is a bright winter daylight frame with blue sky, and this scene's ground is #26282a, still nearly night on the light arc. A full-bleed use of it would blow the arc apart. That is exactly why the plate is only 620x470 in a 1440x900 stage, bleeds off two edges so it has no framed-rectangle silhouette, is filtered to brightness(0.62) saturate(0.78), and carries a 118deg scrim that dissolves its bright upper-right corner into the ground colour. If in review it still fights the arc, the correct fix is to push brightness to 0.52 and extend the scrim stop to 68%, not to swap in s08-desert-bend, whose sky occupies the top 60% of the frame and would fight considerably harder.

---

## Scene 09 — Earning Trust

**Reference:** Readymag — https://mobbin.com/sites/sections/0df56e85-333b-49b0-b2e3-0c500a699fcc

- **Take:** A deck of unlike rectangles held in one perspective stack, each layer peeled up off the one below it so you see the accumulated edges of everything already passed. Crucially the layers do not vanish when they are superseded: the stack itself is the content, and the fact that you can count the strata is the payoff. That is the exact mechanic this scene needs, because 'one responsibility became another' is a stacking sentence and the lesson is that the earlier layers are what makes the top one trustworthy.
- **Leave:** Readymag's stack is a showcase of other people's work, so its layers are loud, chromatic, screenshot-flavoured and shadowed, and they slide sideways like a card shuffle. All of that is dropped. No shadows, no radius, no colour beyond the light arc, no lateral shuffle. The stack here is a set of hairline-ruled plates tinted out of the page's own light, and it only ever moves up and down.

**Why it differs from every other scene:** It is the only scene on the page where the frame accumulates rather than replaces: eight discrete plates enter and none of them ever leaves, so by the end the composition is a physical count of eight things stacked in perspective, which no other scene produces.

### Layout
DESKTOP 1440x900. Section is 620vh tall; inside it a position:sticky, height:100vh, overflow:hidden frame. 12-col grid, 96px outer margin, 24px gutter, column = 82px. All eight cards are flush left at x=308px (start of col 3). Right edges are deliberately ragged so the stack reads as paper rather than UI: card widths in order are 720, 560, 700, 700, 640, 720, 620, 700 px. Card fills are never a chosen colour, they are rgba(252,252,252,0.045) laid over whatever the light arc has made the ground (here #2e3031, composite approx #3a3c3d); the card currently being read is rgba(252,252,252,0.075) (approx #414243). Radius 0. No shadow anywhere in the scene. Each card is bounded by a 1px rgba(252,252,252,0.14) hairline, and the card currently being read carries a 1px #D6A145 rule on its TOP edge only, as though that is the edge catching light.

Card interiors. Five are type-only, 168px tall, 36px padding: his line set left, ranged left, max 2 lines. Three carry a photograph and are 274px tall, 32px padding, two-column: a 280x210 photo plate (the native 4:3 of the 4032x3024 files, so nothing is cropped or stretched) on the left, 28px gutter, his line in the remaining width. Under each photo plate, 10px below, its plate number in Archivo 11px / 0.1em / uppercase at rgba(252,252,252,0.6).

Per-card table (index, line, treatment, Newsreader size):
01 "Opportunity has a way of finding people who are prepared for it." type-only, 34px/1.28, opsz 36, max-width 30ch
02 "I wasn't chasing titles." type-only, 46px/1.16, opsz 48
03 "I was learning to become dependable." photo: jobsite-fixtures, PL. 21, 36px/1.22, opsz 40
04 "One responsibility became another." photo: jobsite-install, PL. 22, 36px/1.22, opsz 40
05 "One opportunity led to the next." type-only, 40px/1.2, opsz 40
06 "Before long I found myself leading others." photo: jobsite-bay, PL. 23, 36px/1.22, opsz 40
07 "Leadership isn't about being in front." type-only, 38px/1.22, opsz 40
08 "It's about being someone others can count on." type-only, 34px/1.28, opsz 36

Every card also carries, top-left inside the padding box, its own two-digit numeral in Archivo 11px / 0.1em / uppercase in #D6A145: 01 through 08.

Archival furniture, fixed to the sticky frame and never moving with the stack: scene number "09" top-left at 40px/40px; time stamp "03:40" directly beneath it (value to be reconciled against the site's global time ladder, which must own it, not this scene); running counter "03 / 08" bottom-left at 40px. All Archivo 11px, 0.1em, uppercase, #FCFCFC at 0.72. The counter numeral simply changes when a card comes to rest; it does not roll, tumble or animate.

The right third of the frame (x 1030 to 1344) is left empty for the whole scene. That emptiness is where the camera rise is legible.

OUTRO STATE (last 20% of the section, and the state the whole scene collapses to): the eight cards spread from 28px to 40px pitch and sit as a block of strata in the lower half of the frame; the lesson occupies the upper third, flush left at x=308: label "LESSON" in Archivo 11px / 0.1em / uppercase in #D6A145, 20px above "Trust is earned long before it's ever expected." in Newsreader 300, 52px/1.18, opsz 60, #FCFCFC, max-width 18ch.

MOBILE 375. The pin is abandoned entirely; no perspective, no stack. The eight cards become one flush-left column in normal document flow, 24px page margins, each separated by a 1px rgba(252,252,252,0.14) rule with 28px padding above and below. His lines all set at Newsreader 300, 24px/1.32, opsz 28. Photo cards put the photograph full-width (327px wide, 245px tall, still native 4:3) above the line, with the plate number beneath it. Numerals sit at the top-left of each block. Lesson closes the column at Newsreader 300, 30px/1.24. Depth is expressed instead by a single 1px #D6A145 vertical rule in the left margin at x=12px, which grows from 0 to full height as the reader passes the eight (transform: scaleY, transform-origin top, driven by scroll position).

### Motion
The governing idea: in a normal stacked-card section the new card covers and erases the old one. Here the opposite is the whole point. Nothing that came before is thrown away; each new responsibility comes to rest ON the previous ones and they stay in the frame, sunk but present and countable. At the end you can still see all eight things that got him there, which is exactly what "trust is earned long before it's ever expected" means.

ARCHITECTURE FIRST, BECAUSE THIS IS A PIN. The stylesheet's default state for this section is the finished, static, fully readable version: eight cards in a flush-left document-flow column at full text contrast, followed by the lesson. No pin, no transforms. A small script runs, confirms it has a layout, and only then adds `.is-scrubbed` to the section, which switches on position:sticky and the choreography. If the script never runs, throws, is deferred forever, or the tab is throttled, the reader gets the complete scene, not a blank one. There is no element in this scene whose only route to visibility is an animation.

Scroll progress p is a pure function of the section's own scroll position (0 at its top, 1 at its bottom), read in a rAF loop off a passive scroll listener, never a timer. A stall therefore cannot strand any element mid-state: whatever the scroll position is, p is correct.

CARD ENTRANCE. Card i (i = 0..7) has entry window p in [0.03 + i*0.0963, 0.03 + i*0.0963 + 0.0963], so entries finish at p = 0.80. At 620vh that is roughly 60vh of scroll per line, about 1.1s at a normal wheel pace, which is the pace of someone recalling them one at a time rather than reading a list. Local t = clamp((p - start)/0.0963, 0, 1), eased with easeOutQuint (1 - (1-t)^5) applied to the scrubbed value, not to a timed animation.
  - The incoming card translates translate3d(0, (1-t) * 42vh, 0), rising from below the frame's clip edge into its slot. Its top edge lands at y = 300px. That slot is fixed: the newest card is always in the same place, which is what makes the older ones appear to sink beneath it.
  - Its opacity goes 0.55 to 1.0 over t in [0, 0.35]. It is never below 0.55 at any point, ever.

RECESSION. When card i comes to rest, every already-placed card j translates down by (i - j) * 28px, scales by 1 - 0.018*(i - j) (transform-origin: 50% 0), and drops in opacity by 0.11 per step with a hard floor of 0.55. Each of those moves is scrubbed on the same t as the incoming card, so the sink and the arrival are one gesture. The sunk cards are progressively covered by the card above them; what remains visible of each is a 28px band carrying only its gold numeral. Their sentences are clipped by the card above, not faded into illegibility. Total sink for card 01 is 196px, which puts its bottom edge at y=664 in a 900px frame.

CAMERA RISE (the director's note, made literal). The stack container carries transform: perspective(2400px) rotateX(A) translate3d(0, Ty, 0). Across p in [0, 0.80], A goes 0deg to 6.5deg and Ty goes 0 to +4vh, both on a linear scrub. You start at eye level with a single card and end up slightly above the whole stack, looking down it. The rise is small on purpose. Leadership here is a change of vantage, not an elevation. The empty right third of the frame is what makes the pitch readable at 6.5 degrees.

THE ONE COUNTER-MOVE. The card currently being read is counter-rotated by -A on its own transform, so it is always perfectly square to the viewer while everything beneath it has tipped away into the record. The thing you are reading is flat and present; the things that earned it are foreshortened. This costs one line of code and it is the sentence "leadership isn't about being in front" stated as geometry.

OUTRO, p in [0.80, 1.0]. The stack settles rather than resolves. Pitch expands 28px to 40px (each card j translates to j*40px from the top of the block), rotateX eases 6.5deg back to 2.0deg, the container scales to 0.86 and translates to +14vh so the whole block of eight strata sits in the lower half of the frame. Over p in [0.82, 0.90] the lesson block goes from opacity 0 to 1 and translate3d(0, 10px, 0) to 0. The lesson sits physically on top of the eight strata that earned it and is the only thing in the frame at full brightness.

NO BLUR ANYWHERE. Depth is carried by opacity, scale and hairline weight alone, because the budget for this scene is transform and opacity and nothing else. Nothing animates width, height, top or left. No filter is animated. All eight cards and the container get will-change: transform on `.is-scrubbed` and have it removed at p >= 1.

There is no audio in this scene.

### Interaction
One affordance, and it exists because the outro deliberately covers his sentences.

Once the stack has settled (p >= 0.90) the eight strata become individually inspectable. Hovering any stratum lifts it clear of the ones above by translate3d(0, -14px, 0) over 180ms cubic-bezier(0.2, 0.7, 0.3, 1), raises its z-index above the block, returns its opacity to 1.0 and reveals its full line at Newsreader 300 / 22px / 1.3 inside the lifted card. Its gold top rule appears. Leaving returns it over 220ms. Only one can be lifted at a time.

The eight are marked up as an ordered list, `<ol>`, so their sequence is a fact of the document and not a visual trick. Each `<li>` takes tabindex="0" and :focus-visible produces exactly the same lift as :hover, with a 1px #D6A145 outline offset 2px, so a keyboard reader has full parity. On touch, a tap lifts a stratum and a tap anywhere else releases it.

This is not decoration. The reader has met all eight lines one at a time on the way down; the lift is how they go back and check any single one of them without scrolling backwards. Being able to re-verify any step is the argument the scene is making.

Nothing else in the scene is clickable. No card navigates anywhere, no photograph opens a lightbox, no video plays.

### Typography
Two families, never mixed within a single element.

Mark's words, all eight lines and the lesson: Newsreader, weight 300 throughout (never 200, which goes gauzy at these sizes on a dark ground, and never above 400, which starts to look like a headline rather than a person writing). Optical size axis set to match the rendered size: opsz 36 at 34px, opsz 40 at 36-40px, opsz 48 at 46px, opsz 60 at 52px. Sizes are set per line so each card's text block is roughly the same optical weight despite the lines being 24 to 62 characters long: 34px/1.28 for the two long lines (01, 08), 46px/1.16 for the shortest line (02, "I wasn't chasing titles."), 36px/1.22 for the three photo cards (03, 04, 06), 40px/1.2 for 05, 38px/1.22 for 07. Lesson at 52px/1.18. Ranged left, never justified, never centred. Hyphens off. Text-wrap: balance on the two-line cards. No italic anywhere, no small caps, no letterspacing on the serif.

Everything the site says: Archivo (Inter as fallback), 11px, 0.1em tracking, uppercase, weight 500. That is the scene number "09", the time stamp "03:40", the running counter "03 / 08", the three plate numbers "PL. 21" / "PL. 22" / "PL. 23", the "LESSON" label, and the eight per-card numerals "01" through "08". Every one of these is 11px. None of them is ever larger, and none of them is ever set in the serif, including the numerals on his own cards, because the counting is the institution's act and the words are his.

Gold #D6A145 appears at exactly four places and never as a fill: the 1px top rule on the card being read, the eight 11px card numerals, the "LESSON" label, and (mobile only) the 1px left-margin progress rule.

### Contrast
Ground is #2e3031 (relative luminance 0.0292). Card fill is rgba(252,252,252,0.045) over that ground, compositing to approximately #3a3c3d (L 0.0424). The active card is rgba(252,252,252,0.075), approximately #414243 (L 0.0533).

#FCFCFC on #2e3031 (furniture on bare ground): 12.9:1. Pass AAA.
#FCFCFC on #3a3c3d (his lines on a resting card): 11.4:1. Pass AAA.
#FCFCFC on #414243 (his line on the active card): 10.4:1. Pass AAA.
#FCFCFC at 0.72 on #2e3031 (scene number, stamp, counter, all 11px): composite approx #b9baba, 7.2:1. Pass AAA for normal text.
#FCFCFC at 0.6 on #3a3c3d (plate numbers under the photo plates, 11px): composite approx #a3a4a4, 4.6:1. Pass AA for normal text.
#FCFCFC at the 0.55 opacity FLOOR on #3a3c3d (the most receded card body): composite approx #a5a5a5, 4.56:1. Pass AA for normal text, and this text is 34px or larger so it only needs 3:1. This is why the recession floor is 0.55 and not the 0.30 that a stack like this would normally use; below 0.55 the sunk cards would become unreadable text pretending to be text, which is not allowed. Depth below that point is carried by clipping (the card above physically covers the one below) rather than by fading, so nothing in the frame is ever dim-and-illegible.
#D6A145 on #2e3031 (label and mobile rule): 5.7:1. Pass AA.
#D6A145 on #3a3c3d (the eight 11px card numerals): 5.2:1. Pass AA for normal text.
Hairline rgba(252,252,252,0.14) on #2e3031 is a non-text boundary and is not held to a text ratio; against the 1px gold rule it is clearly differentiated by hue and by luminance.
Photographs: the three jobsite files are their own plates with a 1px hairline and no text is ever set over them, so no text sits on unpredictable pixels anywhere in this scene.

### Reduced motion
Under prefers-reduced-motion: reduce, the script never adds `.is-scrubbed`, so the section stays in its stylesheet default, which is the complete scene and not a degraded one.

That default is: no sticky, no pin, no perspective, no transforms. The eight cards are an `<ol>` in normal document flow, one per row, flush left at x=308 on desktop and full width at 24px margins on mobile, separated by 1px rgba(252,252,252,0.14) rules with 32px above and below. Every one of his eight lines is present at full size and full #FCFCFC contrast, at the same per-line sizes given above (no recession, no 0.55 floor, everything at 1.0). All three photographs are present at 280x210 with their plate numbers. Every card carries its gold numeral. The counter reads "08 / 08". The lesson closes the section at Newsreader 300 / 52px with its gold "LESSON" label. The scene number and the time stamp sit where they always sit.

The section's height collapses from 620vh to its natural content height, roughly 1900px on desktop, so a reduced-motion reader is not given six screens of nothing.

The hover and focus lift is retained but its transition duration drops to 0ms: the stratum still lifts and still shows its full line, it simply arrives instantly. Reading is never taken away to satisfy a motion preference.

This exact same state is also the no-JavaScript state and the script-error state. There is one fallback in this scene, not three, and it is the whole scene.

### Assets
- jobsite-fixtures
- jobsite-install
- jobsite-bay

### Risk
The obvious failure is that this turns into a SaaS "features" stack, the single most templated pattern on the web, and the client's "AI slop" alarm goes off immediately. The tells to avoid are all specified out: border-radius is 0, there is no box-shadow anywhere in the scene, no card has an icon or a heading or a button, no card is the same width as its neighbour (620 to 720, flush left, ragged right), the three photo cards are a different height from the five type cards, and the photographs keep their native 4:3 inside the card instead of being cropped into a decorative banner. The card surfaces are alpha-white over the light arc rather than a chosen panel colour, so they change with the sunrise instead of sitting on it. Gold never fills anything.

The second risk is length: eight pinned beats at 620vh is a large share of a seventeen-scene page, and if it drags it becomes a slideshow. Mitigation is the 60vh-per-line pace, which is roughly 1.1 seconds each, plus the fact that the entrance windows do not overlap so there is never a moment where two lines compete. If it still tests long in situ, cut section height to 520vh and shorten the per-card window to 0.081 rather than removing any of Mark's lines, which are sacred.

The third risk is the pin itself. A sticky element that depends on JS to be visible is the exact failure mode the motion rules exist to prevent, so the default stylesheet state is the finished readable section and the pin is opt-in via a class the script only sets once it has confirmed a layout. Reviewers should verify this by disabling JavaScript and confirming all eight lines, all three photographs and the lesson are readable, and by backgrounding the tab mid-scene and scrolling back, which must never leave a card stranded because p is derived from scroll position and never from elapsed time.

---

## Scene 10 — The Road Became My Teacher

**Reference:** MOUTHWASH Studio — https://mobbin.com/sites/sections/672f92e4-3ef9-49c3-b9f5-dc2b4ade1c02

- **Take:** Their archive index is a single horizontal band of frames on a dark ground, bleeding off both edges, each frame carrying a tiny fixed monospace catalogue code (RC-164, RC-134, RC-172) directly beneath it, with a running counter parked in the bottom-left corner. Two of the returned states show the identical strip translated sideways, so the codes travel rigidly with their frames and the band is read as one continuous register rather than a carousel with slides. Three specific mechanics are worth taking: (1) the label belongs to the frame and moves with it, never to the screen, so the strip reads as a catalogue being pulled past a fixed window; (2) frames keep their own individual widths against a shared fixed height, which makes the band a strip of film rather than a grid of cards; (3) the band is horizontally off-centre in an otherwise empty screen, so the emptiness above it is the composition, not a mistake.
- **Leave:** Everything about their affect. Their strip is inert cargo for a portfolio index, moves at constant velocity, is driven by a drag and arrow keys, and its content is deliberately anonymous 3D miscellany with no relationship between adjacent items. Ours has eleven photographs in a fixed causal order (the sun rising) where adjacency is the entire argument, so constant velocity would flatten it. Their ground is pure black with no light arc; ours inherits #424448 and must instead build its own photographic ground because this is the scene where the page crosses the light threshold. And their labels are decorative pseudo-codes; ours are real plate numbers in a page-wide register, so they must be typographically quieter than MOUTHWASH set theirs.

**Why it differs from every other scene:** Scene 10 is the only one of the seventeen in which the reader stands still and the country is dragged sideways past a fixed window, and the only one whose archival furniture is alive: a stepping clock that walks the light from 03:50 to 15:10 because this is the single scene that crosses the page's night-to-day threshold.

### Layout
{"stage": "Section is position:relative, height 720vh at desktop / 560vh at mobile. Inside it one child: .stage { position:sticky; top:0; height:100svh; overflow:hidden }. Six layers, bottom to top: L0 photographic backdrop, L1 stage scrim, L2 horizon rule, L3 the strip, L4 top and bottom furniture scrims, L5 type. The raw page ground #424448 is never visible inside the stage; L0 covers it edge to edge at all times. This is deliberate and is how the director's no-raw-ground constraint is met.", "L0_backdrop_all_widths": "The currently-dwelling photograph, scaled to cover 112vw x 112svh and centred, i.e. 6vw of overscan on each side so its parallax drift never exposes an edge. Desktop: the full-size WebP under filter: blur(48px) saturate(0.62). Mobile: a separate 48px-wide pre-blurred derivative of the same file scaled up by the browser, because a 48px CSS blur over a full-bleed layer drops frames on mid-range Android. Crossfades between the eleven sources, never dips (see motion).", "desktop_1440x900": "Furniture bar: absolutely positioned, top:32px, left:48px, right:48px, a single flex row, space-between. Left cell: 'SCENE 10 / 17'. Centre cell: the stepping clock, e.g. '05:05', tabular-nums. Right cell: 'PL. 34'. STRIP BAND: absolutely positioned, top:8vh, height:46vh. Every frame is exactly 46vh tall (414px) and cropped to a uniform 3:2, so every frame is 621px wide. Gutter 24px, pitch 645px. Eleven frames = 7071px of content. The strip's resting left offset is 515px, computed as readingX minus half a frame (0.62 * 1440 = 893, minus 310.5 = 582.5; round to 582px). Total lateral travel = 11 x 645 = 7095px. HORIZON RULE: a 1px line at #FCFCFC/0.22 spanning the full 100vw, absolutely positioned at top:29.2vh, which is 46% down the strip band. Eleven 1px tick marks descend 8px from it, one per frame, travelling with the strip at 1.0x, each carrying no number (the plate numbers live on the frames). The active frame's tick is 2px and #D6A145. COPY PLATE: absolute, left:48px, bottom:8vh, width:640px, max-height:34vh, display:flex, flex-direction:column, justify-content:flex-end, overflow:hidden, mask-image: linear-gradient(to bottom, transparent 0, #000 44px). The stack grows upward from a fixed baseline, so the newest line is always at the same y and older lines are pushed up and out through the mask. Gap between lines 12px. The 4vh gap between the strip's bottom (54vh) and the plate's top (58vh) is the only breathing room and it is intentional: the strip and the words never touch.", "mobile_375x812": "Furniture bar collapses to two cells: left 'SC 10 / 17', right the stepping clock. 'PL. NN' is dropped from the bar because it is already on every frame. Top:20px, left:20px, right:20px. STRIP BAND: top:10vh, height:34vh. Frame height 276px, 3:2 crop, width 414px, i.e. 39px wider than the viewport, so exactly one photograph plus a 20px sliver of the next is ever visible. That is the point on mobile: you are inside one windscreen at a time. Gutter 12px, pitch 426px, travel 4686px. Resting left offset = 0.62*375 - 207 = 25px. Horizon rule at top:25.6vh. COPY PLATE: left:20px, right:20px (width 335px), bottom:6vh, max-height:30vh, which holds roughly three lines of the stack instead of four. Font drops to 19px/1.45. Section height 560vh.", "static_grain": "No decorative frames, no card chrome, no rounded corners anywhere. Photographs are hard-edged rectangles. The only drawn elements in the whole scene are the 1px horizon rule, its eleven ticks, and the 1px gold hover bracket."}

### Motion
{"driver": "One scroll-progress value p in 0..1, measured over the pinned range (720vh minus 100vh = 620vh at desktop, 3ted from a single passive scroll listener writing one transform inside one rAF). All eleven frames live in ONE composited element, .strip, which receives transform: translate3d(x,0,0) and will-change: transform. Nothing else on the page moves per frame.", "the_non_linear_scrub_this_is_the_whole_idea": "The strip does NOT translate linearly. Let i = floor(p * 11) and f = frac(p * 11). Then x = -645 * (i + E(f)) at desktop, where E is cubic-bezier(0.32, 0, 0.16, 1) evaluated numerically. Because E has near-zero slope at f=0 and f=1, the strip's lateral velocity falls to almost nothing at every frame boundary and peaks in the middle of each slot. Each photograph therefore settles at the reading position (62% of viewport width) and holds there for roughly 38% of its slot's scroll before releasing and being swept away. Eleven small dwells, no full stops, no snapping. MEANING: this is a truck slowing for something worth looking at and then pulling away from it. 'Every mile introduced me to a new place' is a sentence about repeated arrival and departure, and this curve is that sentence as a velocity graph. A constant-velocity strip would be a conveyor belt and would say nothing.", "per_slot_budget": "620vh / 11 = 56.4vh of scroll per photograph at desktop. Lateral 7095px over 5580px of vertical scrub = a 1.27:1 ratio, so the world moves sideways slightly faster than the reader moves down. Deliberate.", "the_accumulating_memory_stack": "Mark's six lines are anchored to slots 0, 1, 3, 5, 7 and 9. When slot n's dwell begins, its line enters at the fixed baseline: translateY 14px -> 0 and opacity 0 -> 1 over 420ms, cubic-bezier(0.16,1,0.3,1). It NEVER leaves. When the next line arrives, the previous one is pushed up by the flex layout and transitions to opacity 0.50 and font-weight 300 over 320ms. By slot 9 all six have been spoken; lines 1 and 2 have been pushed through the top mask and dissolved. Nothing is ever removed by script; the plate's overflow does the forgetting. MEANING: the three 'Every...' lines are an anaphora, a list a man is counting off, and a stack that only ever grows is what a list of accumulated miles looks like. The mask at the top is memory having a capacity.", "backdrop_crossfade": "L0 holds two <img> layers, A and B, and alternates. The incoming layer goes 0 -> 1 opacity over the first 30% of each slot; the outgoing layer STAYS at opacity 1 underneath, held by z-index, and is only reset once fully covered. Never cross-fade both directions: two source-over layers at 0.6 and 0.4 composite to 0.76 coverage, not 1.0, and the resulting eleven luminance dips in a scene about light arriving would be exactly the wrong artefact. This is the same trap already documented in components/k/JourneySequence.tsx and it applies here identically. L0 also drifts translateX from +2.4% to -2.4% linearly across the whole pinned range, a slow counter-parallax at roughly 0.08x the strip rate.", "the_ending_p_0.90_to_1.00": "The strip's last frame clears the reading position and the whole strip continues left and off screen. Simultaneously: L0's blur animates 48px -> 0px, its saturate 0.62 -> 1, and the L1 stage scrim's alpha 0.60 -> 0.30, all over p 0.90 -> 0.98, so s17-road-to-horizon resolves whole and sharp for the first and only time in the scene. The six-line stack fades to 0 over p 0.90 -> 0.94. The lesson replaces it, entering at p 0.94 with opacity 0 -> 1 and translateY 10px -> 0 over 520ms, set centred, max-width 780px, on a measured local scrim. MEANING: the scene spends its whole length showing you fragments travelling past at speed, then stops, and the fragments turn out to have been one view. That is what the lesson sentence claims and this is that claim performed.", "the_clock": "The furniture clock at top centre steps, never tweens: it swaps to slot n's value at the instant slot n's dwell begins. Eleven values 03:50, 05:05, 06:20, 07:10, 07:55, 08:40, 10:15, 11:30, 12:45, 13:55, 15:10. Archivo, font-variant-numeric: tabular-nums so no digit jitter. This is the only scene of the seventeen that spans the light crossover, so it is the only one whose time stamp is allowed to move, and moving it is how the archival furniture carries the light arc instead of merely labelling it.", "forbidden_here": "Nothing animates width, height, top or left. Nothing has an invisible start state that only an animation can undo: the server renders all six lines at full opacity, and the scrub only DIMS not-yet-reached lines, applied by a data-scrub='on' attribute set inside the same effect that wires the scroll listener. If that script never runs, all six lines are visible and correct."}

### Interaction
{"primary": "Scroll rate is the real control, and the deceleration curve is what makes that true. Because velocity approaches zero at every frame boundary, a reader who simply stops scrolling almost always stops on a settled photograph rather than mid-slide. The scene rewards stopping, which is a rarer interaction than clicking and the correct one for a documentary.", "hover": "Pointer over any frame: (1) that frame's brightness lifts from 0.88 to 1.00 and its saturate from 0.94 to 1.00 over 260ms ease-out, so the hovered photograph is the only fully-present one on screen; (2) its plate number goes from #FCFCFC to #D6A145 over 180ms; (3) a 1px #D6A145 bracket draws on its bottom-left corner, two 48px legs, scaleX and scaleY from 0 with transform-origin at the corner, 220ms, 40ms stagger between legs; (4) the top-right furniture cell swaps to that frame's plate number. On pointer-out everything reverses over 200ms. Guarded by @media (hover: hover) and (pointer: fine) so it never sticks on touch.", "no_fake_controls": "There are no buttons, no arrows, no drag handle and no lightbox. The frames are <figure> elements, not <button>s, because there is nothing to operate. Adding a click target that only enlarges an image would put a piece of app furniture in the middle of a documentary. The eleven <figure>s sit in DOM order with real alt text, so a screen reader gets the whole strip as a captioned sequence with no interaction to negotiate and the pinned track is not a focus trap because it contains nothing focusable.", "touch": "No horizontal touch handler at all. A swipeable strip inside a vertical scroll is a gesture conflict and on mobile the frame is wider than the viewport anyway, so the vertical scroll already delivers one photograph at a time."}

### Typography
{"marks_words": "Newsreader. The live line: optical-size 28, weight 400, 24px, line-height 1.40, letter-spacing -0.005em, colour #FCFCFC. Pushed-up lines: same face and size, weight 300, colour #FCFCFC at opacity 0.50. Mobile 19px / 1.45. The distinction between the live line and the remembered ones is carried by WEIGHT and opacity together, never by size, because six lines at six sizes would look like a type specimen rather than a man talking.", "the_lesson": "Newsreader, optical-size 40, weight 300, 40px desktop / 26px mobile, line-height 1.30, letter-spacing -0.012em, max-width 780px, centred, #FCFCFC. The two sentences are separated by a hard line break, not a comma and never an em dash. Set as: 'The road doesn't just take you to new places.' / 'It teaches you to see the world differently.'", "site_furniture": "Archivo, 11px, weight 500, letter-spacing 0.1em, uppercase, colour #FCFCFC at FULL opacity. Used for 'SCENE 10 / 17', the stepping clock (with font-variant-numeric: tabular-nums), and the plate numbers 'PL. 30' through 'PL. 40' set at the bottom-left inside each frame, 16px in from the frame's left and bottom edges. CRITICAL: the furniture is made quiet by size, weight and tracking, never by lowering opacity. Dropping site type to 0.72 alpha over a photographic backdrop is what breaks 11px contrast in this scene; see contrastCheck.", "never_mixed": "No Newsreader on any site label. No Archivo in any of Mark's sentences. The lesson is Mark's, so it is Newsreader.", "plate_register_handoff": "This scene consumes PL. 30 through PL. 40 inclusive, in the order listed under assets. The page-level plate register must reserve that block for scene 10."}

### Contrast
{"method": "Worst case throughout is the brightest region of the brightest photograph in the set (s13-first-daylight / s17-road-to-horizon sky, taken as sRGB 0.90 / 230). Compositing computed in sRGB as the browser does it, then converted to relative luminance. Page ground #424448 measures L=0.0576, giving the stated 9.5:1 against #FCFCFC; every value below is at least as good as that, which is the requirement since the ground itself is the floor.", "stage_scrim_L1": "rgba(18,19,22,0.60) over the whole backdrop. Worst-case backdrop 0.90 composites to 0.405 sRGB (103).", "marks_lines_and_the_lesson": "A bottom scrim, linear-gradient(to top, rgba(16,17,20,0.78), rgba(16,17,20,0) 46vh), sits behind the copy plate. Worst case 0.405 under 0.78 alpha -> 0.141 sRGB (36), L=0.0176. #FCFCFC at full opacity = 15.1:1. PASS AAA.", "pushed_up_lines_at_opacity_0.50": "0.50 white over 0.141 -> 0.565 sRGB (144), L=0.2793, against L=0.0176 = 4.87:1. PASS AA for normal text, and these are 24px so they clear AA-large with room. Note: 0.42 opacity was tested first and gave 3.87:1, which only passes as large text; 0.50 is the value to ship.", "furniture_top_bar": "A top scrim, linear-gradient(to bottom, rgba(16,17,20,0.72), rgba(16,17,20,0) 120px). Worst case 0.405 under 0.72 -> 0.161 sRGB (41), L=0.0222. #FCFCFC at full opacity = 14.2:1. PASS AAA at 11px. Without this bar, 11px #FCFCFC at 0.72 alpha directly on the 0.405 backdrop measures 3.7:1 and FAILS. That is the trap in this scene.", "plate_numbers_on_the_photographs": "Each frame carries its own local scrim, linear-gradient(to top, rgba(16,17,20,0.86), rgba(16,17,20,0) 96px), across its bottom edge. Worst case 0.90 under 0.86 -> 0.184 sRGB (47), L=0.0283. #FCFCFC = 13.1:1 PASS AAA. Brand gold #D6A145 (L=0.4022) on the same = 5.8:1, PASS AA at 11px. Gold appears nowhere else except the 2px active tick on the horizon rule, which is not text.", "horizon_rule": "#FCFCFC at 0.22 alpha, non-text decoration, exempt. Its visible contrast against the scrimmed backdrop is approximately 1.9:1, which is the intent: it should be findable, not assertive.", "reduced_motion_version": "Copy sits on a solid plate of #1B1D21 (L=0.0125), giving #FCFCFC 16.4:1. A solid plate is stricter than any scrim, so the static version cannot fail regardless of where the light arc has reached."}

### Reduced motion
{"principle": "Under @media (prefers-reduced-motion: reduce) this scene becomes a CONTACT SHEET. Not the same scene with the movement switched off, and not a shortened one. Every photograph, every word and the same reading order survive.", "implementation_rule": "ONE DOM tree, switched entirely in CSS in app/globals.css so the server can send it in the first byte. Do not branch the component on useReducedMotion(): that hook returns false on the server, so branching ships the 720vh pinned track to everybody and then swaps it on hydration, which is a multi-thousand-pixel jump landing on exactly the readers who asked for less movement.", "what_changes": "Section height: 720vh -> auto. .stage: position:sticky -> static, height:100svh -> auto, overflow:hidden -> visible. .strip: display:flex -> CSS grid, 2 columns at >=900px and 1 column at <900px, 32px gap, all transforms and will-change removed. L0 backdrop and L1/L4 scrims: display:none, since nothing needs to be lit by a photograph that is now sitting still in flow.", "the_static_composition": "Top: the furniture, 'SCENE 10 / 17' and a single honest range stamp '03:50 to 15:10', on the solid #1B1D21 plate. Below it: all six of Mark's lines at full opacity, weight 400, 24px Newsreader, on that same solid plate, 20px gap between them. Below that: the eleven photographs in the same light order, each at its native 3:2, each with its plate number PL. 30 to PL. 40 set beneath it in Archivo 11px, and each with its real alt text. Below the sheet: the lesson, 40px Newsreader 300, on its own solid plate. No hover states, no gold bracket, no crossfades, no clock stepping. The gold appears once, on nothing but the lesson's plate rule, or is omitted entirely.", "why_this_is_complete_not_degraded": "The scene's argument is eleven photographs in the order the light runs plus six sentences plus a conclusion. A contact sheet delivers all thirteen elements in order, at full size, permanently readable, with no time limit. The pinned strip delivers the same thirteen elements with a sense of travel added. The travel is the enrichment; it was never the content. This is also what a crawler and a no-JS client receive."}

### Assets
- s12c-night-highway
- s12-predawn-peaks
- s13-first-daylight
- s04-dawn-road-mist
- s11-sunrise-band
- s05-sunrise-horizon
- s08-desert-bend
- s09-interstate-traffic
- s06-wide-horizon
- s08b-rockcut-bend
- s17-road-to-horizon

### Risk
{"the_main_risk": "A scroll-driven horizontal image strip is the single most-copied 'premium website' device of the last five years. Built naively, at constant velocity, with equal gutters and equal frames, this becomes a conveyor belt of windscreen photographs that reads as a template component with our content poured into it, which is precisely the AI-slop accusation the client is guarding against.", "mitigation_1": "The deceleration curve. E(f) = cubic-bezier(0.32, 0, 0.16, 1) applied per slot means the strip breathes eleven times instead of gliding once. A conveyor has one velocity; this has eleven considered looks. It is the difference between footage and edited footage, and it costs about fifteen lines of code.", "mitigation_2": "Horizon registration. All eleven are cropped to an identical 3:2 with a per-image object-position y-offset tuned so each photograph's real horizon lands at 46% of the frame height, and the 1px rule is drawn at exactly that height across the full 100vw. The eleven separate photographs then read as one continuous windscreen with cuts in it rather than eleven cards in a carousel. This requires a hand-measured offset table for the eleven files, roughly twenty minutes of work, and it is the single highest-value detail in the scene. Do not skip it.", "mitigation_3": "The scene destroys its own mechanic to end. From p 0.90 the strip clears the screen entirely and one photograph resolves whole, sharp and unscrimmed. The device is revealed as a means rather than the point, which is the opposite of how the template version of this section behaves.", "secondary_risk_performance": "Eleven textures plus a full-bleed blurred layer will drop frames on mid-range Android. Serve the strip frames at 1280w desktop / 828w mobile (roughly 20MB decoded on mobile), give every one of the eleven loading='eager' and no priority, put the blur on a 48px pre-blurred derivative on mobile rather than a live 48px CSS filter, and keep the per-frame work to one transform write on one composited element inside one rAF. The eager-loading point is not optional: this codebase has already been bitten by lazy images inside a scroll-gated container arriving as hard pops on anything slower than localhost.", "third_risk_honesty": "The eleven clock values are a design device, not recorded times, and the ticks on the horizon rule must never acquire distance or mileage labels. Inventing '1,400 MI' to make the rule look complete would be the one fabricated fact on a page whose entire argument is that nothing on it is invented, and it would break Mark's rule 3."}

---

## Scene 11 — A Vision Begins to Form

**Reference:** Freshman — https://mobbin.com/sites/sections/3641b988-b26c-471d-a177-c5fc2254b123

- **Take:** The geometry, not the styling. Freshman sets a directors index as the hero at display scale, left-aligned metadata hung OUTSIDE the row on a narrow margin column (first name, territory in tiny caps), and the revealed image is a modest plate parked in the page margin rather than a full-bleed takeover. The list stays the subject; the photograph is subordinate evidence. I take three things exactly: (1) display-scale name stack as the entire composition, (2) an Archivo-scale register column hung in the outer margin, baseline-aligned to each row, (3) a single small plate in the margin that swaps per active row instead of a grid of thumbnails.
- **Leave:** Everything else. Freshman is a warm cream promotional index with hand-drawn display type, two images visible at once, and a bouncy hover feel. Wrong ground, wrong voice, wrong tone for a roll call. Most importantly its premise is inverted: every Freshman name has a photograph. In scene 11 only two of six do, and the design has to be built around the absence rather than around the reveal.

**Why it differs from every other scene:** It is the only scene on the site where the archive itself is a character and where the dominant visual event is a photograph failing to appear: four of six reveals resolve to a drawn empty frame, which no other scene does and which is the argument rather than a shortage.

### Layout
DESKTOP 1440x900. Page gutters 96. 12-col, 24px gutter, col=78. Everything in this scene hangs off a single spine at x=252 (col 3) except one deliberate axis flip in movement 3. Total scene height 540vh.

FURNITURE (fixed, house position): "SC. 11 / 17" at x=96, y=48 from scene top. "06:04" right-aligned to x=1344, same y. Both Archivo 500, 11px, 0.1em, uppercase, #FCFCFC. Take the time value from the site arc table if one exists; 06:04 is my read of a #666c71 ground (light up, sun not).

M1 THE PREMISE (0 to 90vh). "Freight moved every day." and "But what truly kept the industry moving wasn't trucks." set as two lines, Newsreader 400 opsz 32, 44px/1.30, left edge x=252, measure 34ch, 30px between them. Then 22vh of nothing but ground. Then "It was people." alone: Newsreader 500 opsz 60, 88px/1.05, x=252. The answer arrives in empty grey.

M2 THE ROLL CALL (90vh to 338vh) — the spine of the scene. A 100vh sticky frame pinned for 248vh of scroll (six rows x 38vh + 20vh lead-in). All six words are visible simultaneously; attention walks down them.
  - Word stack, x=252, width 546. Size is clamp(56px, min(6.1vw, 9.8vh), 88px) = 88px at 1440x900. 88 and not 96 is measured: "Dispatchers." at Newsreader 400 96px runs ~530px against a 546 column, no tolerance for font-variance. At 88px it is ~486.
  - Five single-line rows at 0.98 leading (86px line box) plus row 6 wrapping to two lines ("Families waiting" / "at home.") at 172px. Row gap 28px. Stack = 742px, vertically centred in the frame, top y=100.
  - Register column: "01"–"06" in Archivo 500 11px 0.1em #FCFCFC, right-aligned to x=236, baseline-aligned to each row's first baseline. This is the site counting people, in the site's own voice.
  - Plate well in the right margin: 480x270, a true 16:9 frame because the journey files are 1920x1080. Right edge locked to x=1344, so x=864–1344. It travels vertically to centre on the active row, clamped to top ∈ [88, 508] so it never leaves the frame. Caption block 34px directly beneath it, on the ground, never over the image.
  - Plate register: "PL. 26" sits in the ground 12px above the plate's top-left corner, outside the frame, Archivo 11px. Plate numbers must come from the site-wide register, not be hardcoded here.
  - Footnote under the stack at x=252, y=862: "TWO OF SIX ARE PHOTOGRAPHED." Archivo 500 11px 0.1em #FCFCFC.
  ROW-TO-PLATE TABLE (this is the content, and four of six are empty on purpose):
    01 Drivers.                  → s09-interstate-traffic. Caption: "INTERSTATE TRAFFIC. SHOT FROM THE DRIVER'S SEAT."
    02 Dispatchers.              → NO PHOTOGRAPH EXISTS
    03 Mechanics.                → jobsite-bay, object-fit cover, object-position 50% 45% (source is 4032x3024, 4:3, cropped to 16:9). Caption: "WAREHOUSE BAY, 2021. MARK'S OWN TRADE WORK."
    04 Customers.                → NO PHOTOGRAPH EXISTS
    05 Brokers.                  → NO PHOTOGRAPH EXISTS
    06 Families waiting at home. → NO PHOTOGRAPH EXISTS
  EMPTY PLATE STATE, designed so it can never read as a broken image: the same 480x270 box, 1px border rgba(252,252,252,0.72), interior is the ground colour, centred "NO PHOTOGRAPH EXISTS" in Archivo 500 11px 0.1em #FCFCFC. The caption block beneath keeps its exact position and reads "NO PLATE." Identical furniture to a full plate is what proves it is a designed state.

M3 THE TWINS (338vh to 408vh). "Every load represented someone's trust." / "Every mile represented someone's promise." Newsreader 400 opsz 32, 44px/1.34, 20px apart, and the whole two-line block is RIGHT-ALIGNED to x=1344. The axis flips off the spine exactly once, here, because the scene turns from naming people to naming what they carry. Right-aligning also flushes "trust." and "promise." to the same edge, so the parallel construction is carried by the setting and needs no motion at all.

M4 THE QUESTION (408vh to 478vh). "What if a company could be built where integrity wasn't just a word, but the standard?" Newsreader 300→400 opsz 72, 56px/1.22, x=252, measure 22ch, breaks to four lines. "the standard" is set Newsreader 600 at the same size and the same colour. Back on the spine.

M5 THE LESSON (478vh to 540vh). 1px rule rgba(252,252,252,0.72) spanning x=252→798. 20px below it, "LESSON" Archivo 500 11px 0.1em. 24px below that, Mark's two sentences in Newsreader 400 opsz 20, 28px/1.52, measure 46ch. Completely static.

MOBILE 375x812. Gutters 20, content 335.
  M1: 26px Newsreader 400 opsz 24; "It was people." 44px weight 500, 14vh gap before it.
  M2: sticky 100vh. Words clamp(30px, 8.6vw, 34px) = 32px. Register numbers go inline, baseline-aligned, 11px Archivo, 10px before the word ("01  Drivers."), because there is no margin column. Five rows at 34px line box + row 6 at 68px, 16px gaps = 318px stack, top at y=114. "Dispatchers." is ~177px, "Families waiting at home." ~368px so it still wraps, matching desktop. Plate 335x188 fixed at y=470 inside the frame — it does NOT travel on mobile, it only swaps. Caption 22px below. Footnote below that. Roll call gets 6 x 44vh + 20vh = 284vh of scroll.
  M3: right-aligned to x=355, 24px/1.35.
  M4: 30px/1.25, full 335 measure.
  Total mobile scene height 620vh.

### Motion
THE MEANING: this scene is a roll call, and the plate well is the archive being asked, name by name, whether it has a picture of this person. It travels to meet each name. Four times out of six it arrives empty. The motion is the act of checking, and the answer is mostly no. That is Mark's argument made mechanical: the industry runs on people nobody photographed.

ACTIVE ROW SELECTION. A reading line sits at 46vh (desktop) / 40vh (mobile). While the frame is pinned, the active row is the one whose vertical centre is nearest that line, with 12px of hysteresis at each boundary to stop flicker. Scroll progress through the 248vh pin maps linearly to rows 1–6, so each row owns ~38vh of scroll and gets roughly 600ms of reading at a normal wheel. No JS controls visibility of anything — see reducedMotion for the no-JS default.

ROW STATE CHANGE — and this is the answer to the 5.2:1 flag. THE WORDS NEVER CHANGE OPACITY. Not once, not ever, not on any row, in any state. All six sit at #FCFCFC 100% permanently. The active/inactive distinction is carried by four other channels:
  1. Weight: inactive 400 → active 600. Transition 240ms cubic-bezier(0.33, 1, 0.68, 1) on font-variation-settings 'wght'.
  2. Optical size: inactive opsz 24 → active opsz 72. Same 240ms. At 88px on a mid grey the opsz 24 drawing gives inactive rows sturdier hairlines that hold the ground; the active row's finer opsz 72 drawing is more than paid for by the jump to weight 600. This channel is doing real legibility work, not decoration.
  3. Position: active row translateX(0 → 20px), 300ms cubic-bezier(0.22, 1, 0.36, 1). Transform only.
  4. Tick: a 3px x 56px #FCFCFC bar at x = row left − 28, transform: scaleY(0) → scaleY(1) from centre, 260ms, 40ms after the row goes active.
  The register number "01"–"06" also goes weight 500 → 700. No opacity anywhere in the row system.

PLATE TRAVEL. The plate well moves by transform: translateY() only, 520ms cubic-bezier(0.22, 1, 0.36, 1), to centre on the new active row (clamped as in layout). Because rows 1–5 are evenly spaced the travel is a steady 114px step; row 6 is 157px away and hits the clamp, so the plate visibly falls short of "Families waiting at home." It lags at the one row it can least answer.

PLATE CONTENT SWAP. Outgoing layer opacity 1→0 over 220ms linear. Incoming layer opacity 0→1 over 340ms starting at 80ms, and simultaneously scale(1.04 → 1.00) over 700ms cubic-bezier(0.16, 1, 0.3, 1). Opacity is on the IMAGE layer, never on text.

THE SEARCHING BEAT. When the incoming state has no photograph, the "NO PHOTOGRAPH EXISTS" label waits 200ms after the frame settles, then opacity 0→1 over 260ms. One beat of looking, then nothing. This is the only intentional delay in the scene and it exists because the delay is the content. It applies only to state transitions; the initial render has the label already at opacity 1.

M1, M3, M4 ENTRANCES. Each line is its own element with `animation-timeline: view()`, range `entry 15% cover 45%`, animating translateY(14px → 0) and opacity(0 → 1). Because the lines are spatially staggered they land in sequence with no artificial delays. The four lines of M4 additionally sit in a wrapper doing scale(0.985 → 1.000) over the same range, so the question appears to resolve rather than arrive.

M5 LESSON. Zero motion. After 248vh of a moving archive, the lesson does not move at all. The stillness is the ending.

WHAT IS FORBIDDEN HERE: no parallax on the plate, no blur filters (they cost contrast on a ground this tight), no letter-spacing animation, no width/height/top/left, no scroll-hijack or smooth-scroll library, no audio.

### Interaction
The reader has a real instrument here, but scroll alone gives the complete scene.

HOVER (pointer: fine only). Hovering any of the six rows takes it active immediately — the state transition shortens to 140ms and the plate swap to 200ms so hover feels like a direct query rather than a scroll. Hover overrides the scroll-derived row. On pointer-out, a 400ms timer returns control to the scroll-derived row (cancelled if the pointer re-enters). The hit target is the full 546px column width, not the glyph bounds, so short words like "Brokers." are as easy to hit as long ones. Cursor stays default; no pointer cursor, because these are not links.

TOUCH. Tapping a row pins it active until the reader scrolls more than 8vh, then scroll takes over again. This lets a phone reader stop and interrogate "Customers." without fighting the scroll.

KEYBOARD. The six rows are a roving-tabindex listbox (role="listbox", each row role="option", aria-selected). One tab stop for the whole index. ArrowUp/ArrowDown move the active row, Home/End jump to 01/06. Focus ring: 2px solid #FCFCFC, 3px offset, on the row box.

SCREEN READER. The plate well is aria-live="polite" and announces the plate state on change, so the roll call reads aloud as: "Mechanics, selected. Plate 26. Warehouse bay, 2021, Mark's own trade work." then "Customers, selected. No photograph exists." The absence is announced, not silently skipped. Images carry real alt text; the empty frames are not images at all, they are text.

NOTHING ELSE IS CLICKABLE. No links, no buttons, no play control in this scene. mark-fieldnote.mp4 belongs to a scene that can give a click-to-play video its own space; putting it here would fight the roll call.

### Typography
TWO VOICES, NEVER MIXED.

MARK — Newsreader, always. Variable weight and opsz both used deliberately.
  M1 lines 1–2: Newsreader 400, opsz 32, 44px / 1.30, tracking 0.
  M1 "It was people.": Newsreader 500, opsz 60, 88px / 1.05, tracking -0.01em.
  M2 the six words: Newsreader 400 opsz 24 inactive → 600 opsz 72 active, 88px / 0.98, tracking -0.015em. Minimum weight in this scene is 400 and it is a hard floor, see contrastCheck.
  M3 the twins: Newsreader 400, opsz 32, 44px / 1.34.
  M4 the question: Newsreader 400, opsz 72, 56px / 1.22. "the standard" is Newsreader 600 at the identical size and identical colour. Weight is the only emphasis available.
  M5 the lesson: Newsreader 400, opsz 20, 28px / 1.52.

THE SITE — Archivo 500, 11px, 0.1em tracking, uppercase, #FCFCFC, for every one of these and nothing else:
  "SC. 11 / 17", "06:04", the register numbers 01–06, "PL. 26" / "PL. 27", the plate captions, "NO PHOTOGRAPH EXISTS", "NO PLATE.", "TWO OF SIX ARE PHOTOGRAPHED.", "LESSON".

The distinction does real work in this scene specifically: the six people are named in Mark's serif, and the archive that fails to picture them answers in the institution's sans. The argument is legible in the type alone with the sound off.

COPY DISCIPLINE. Mark's twelve lines are set verbatim, terminal periods included, since the periods are what make the six words a roll call rather than a list. Zero em dashes in any string above; the footnote and captions were written to avoid needing one.

### Contrast
Ground #666c71. Every value below computed against that exact ground.

TEXT — all of it, without exception, is #FCFCFC at opacity 1.000 = 5.18:1. Passes AA normal (4.5) and AA large (3.0). There is no second text colour in this scene. There is no faint grey. There is no text below 100% opacity at any point in any state, including transitional states, because 40% white composites to #A2A6A9 = 2.17:1 and 55% to #B9BBBD = 2.76:1, both failing. This is precisely why the active/inactive row system is built on weight, optical size, and translation rather than the conventional opacity dim.

NON-TEXT.
  Empty plate border and the LESSON rule: rgba(252,252,252,0.72) → #D1D3D4 = 3.51:1. Above the 3:1 threshold for meaningful non-text. The 0.55 value that would be the instinctive choice is 2.76:1 and is banned here.
  Active-row tick: solid #FCFCFC = 5.18:1.

GOLD IS NOT USED IN THIS SCENE, AND THAT IS A COMPUTED DECISION, NOT AN OVERSIGHT. #D6A145 on #666c71 measures 2.29:1. It fails as text at any size and it fails the 3:1 non-text threshold, so a gold hairline or tick on this ground would either be invisible or would have to be rescued with a scrim this composition does not want. Scene 11 spends zero gold. "Sparingly" includes none, and the two adjacent scenes on lighter and darker ground can carry the accent instead.

FLAGGED RISK THE RATIOS DO NOT CATCH: a 5.18:1 ratio is computed on solid coverage, but Newsreader at 88px and weight 300 puts hairline strokes barely a pixel wide against a mid grey, where it will visually vibrate and thin out despite passing. Hence the hard weight floor of 400 for anything above 40px in this scene, and the inactive rows using opsz 24 (the sturdier text drawing) rather than a display opsz. The active row goes to opsz 72, whose hairlines are finer, only in combination with the jump to weight 600.

NO TEXT SITS ON TOP OF A PHOTOGRAPH ANYWHERE IN THIS SCENE. Plate captions and plate numbers sit on the ground outside the frame, where the ratio is known and fixed. If a later revision ever needs type over an image here, the required treatment is a 70% black scrim (composites to #1F2022, giving #FCFCFC 15.89:1), but the current design does not need it and should not acquire it.

### Reduced motion
Under prefers-reduced-motion: reduce, the scene becomes a complete printed index. Nothing is summarised or dropped.

The sticky pin is removed entirely (position: static, the 248vh scroll allocation collapses to natural document height). The single travelling plate well is replaced by six permanent plate slots, one per row, so the whole roll call is one still tableau: each row is a two-column pair with the word at column 3–6 and its 480x270 plate at column 8–12, baseline-aligned, 40px apart vertically. Two rows carry photographs with their captions and plate numbers. Four carry the drawn empty frame with "NO PHOTOGRAPH EXISTS" and "NO PLATE." The footnote "TWO OF SIX ARE PHOTOGRAPHED." sits below the whole index as it does in the animated version. Every word of Mark's copy and every plate caption is present and readable at rest.

Rows have no active state at all in this mode — no dimming, no weight split. All six render at Newsreader 500 opsz 40, 88px, #FCFCFC. Uniform, because "active" has no meaning without motion and a permanently emphasised row would lie about where the reader is.

M1, M3, M4 render at their final state with no view() timeline attached. M5 is unchanged, since it never moved.

At 375 the same rule applies, stacked single-column: word, then its plate directly beneath it, six times.

Critically, this static tableau is also the NO-JS AND JS-FAILURE DEFAULT of the animated version. The DOM ships with all six words at full opacity, weight 400, and the plate well showing row 01's state; the CSS default state of every element in this scene is its final visible state. JS only adds emphasis and moves the plate. If the script never runs, the reader loses the roll call mechanic and loses nothing else. No word in this scene has an animation as its only route to being visible.

### Assets
- s09-interstate-traffic
- jobsite-bay

### Risk
The most likely failure is that the four empty plates read as broken images, a failed lazy-load, or a placeholder the developer forgot to fill, at which point the scene's whole point inverts into looking unfinished. Three mitigations, all required: (1) the empty frame is drawn, not defaulted — a 1px rgba(252,252,252,0.72) rule, ground-coloured interior, centred "NO PHOTOGRAPH EXISTS" in the site's 11px Archivo, and it carries the identical caption furniture as a full plate reading "NO PLATE.", so it is visibly a designed state and not an absent asset; (2) the footnote "TWO OF SIX ARE PHOTOGRAPHED." sits under the index in the site's voice, converting the absence from a defect into a stated fact; (3) the empty frames are never <img> elements with missing or broken sources — they are text in a bordered box, so they cannot produce a browser broken-image glyph even on a total asset failure.

Second risk, smaller but real: the 88px serif at weight 400 thinning out against a 5.18:1 grey on low-quality or non-retina displays. Mitigated by the weight-400 floor and the opsz 24 inactive drawing, but this one needs an eyes-on check on an actual sRGB laptop panel before sign-off, not just a computed ratio.

Third: hover and scroll fighting each other at the boundary between rows, producing a plate that flickers between two states. Mitigated by 12px of hysteresis on the reading line and the 400ms pointer-out handover, both of which must be built, not assumed.

---

## Scene 12 — More Than a Business

**Reference:** Savor — https://mobbin.com/sites/sections/eb632cd4-662c-4e13-b2e1-e19cb243aba1

- **Take:** A pinned statement in which each word is its own separate beat, held on a single muted field with no competing element whatsoever. The space between the words carries as much weight as the words. Savor lets a very short sentence occupy an entire screen and trusts the reader to wait for it, which is exactly the licence this scene needs to spend 420svh on one change of mind.
- **Leave:** Everything Savor does to keep the frame alive. The blurred organic ground drifts, and drift is the one thing forbidden here. Also leave the small centred scale (Savor's words are roughly 15px on a 1440 frame; our two questions must be the largest type in the scene, because the argument is that the second question weighs more than the first), the low-contrast white-on-green treatment, and the hand-drawn flourish under the last word.

**Why it differs from every other scene:** It is the only scene in the seventeen whose stylesheet contains no transform: nothing enters, nothing travels, the entire paragraph is already on the screen in the dark when you arrive, and scroll does one thing only, which is raise the light on it a clause at a time, so the film's light arc happens once at the scale of a single page of writing.

### Layout
TYPE-ONLY SCENE. No photograph, no video, no rule, no shape. Nine text beats plus the archival furniture, and nothing else in the DOM.

STRUCTURE: one section, height 420svh, containing a sticky stage (position: sticky; top: 0; height: 100svh; overflow: visible). After the section releases, a separate 100svh LESSON panel scrolls normally. Total scene 520svh.

THE UNIT. All type in the stage derives from one custom property so the composition is guaranteed to fit any stage without a media query per beat:
  --u: clamp(13px, 1.55svh + 0.35vw, 22px)     (1440x900 => 19px; 375x780 => 13px)

DESKTOP (>=1200px, measured at 1440x900).
Content frame 1240px wide, centred, so x runs 100 to 1340. Two columns, no grid gap trickery:
  MARGINAL COLUMN  x 100 to 300 (200px, text-align: right)
  GAP              40px
  STATEMENT COLUMN x 340 to 1260 (920px), 80px of air to the frame's right edge. The composition is deliberately left-heavy. It reads as a page, not a slide.

The statement block is vertically centred on 48svh, not 50svh, so the eye does not read it as sitting low. Safe area of 96px top and bottom is reserved for furniture; the block's computed height must not exceed 74svh (766px at this viewport it computes to 650px, 72svh).

Beats in the STATEMENT column, top to bottom, with gaps in --u multiples:
  b2  "what kind of business do I want to own?"        2.6u  = 49px, wraps to 2 lines, 118px tall
      gap 2.1u = 40px
  b4  "What kind of company deserves to exist?"        3.35u = 64px, wraps to 2 lines, 143px tall
      gap 2.3u = 44px
  b5  "A company built on honesty, when honesty costs something."     1.35u = 26px, one line, indented 48px
      gap 0.75u = 14px
  b6  "A company built on integrity, even when no one is watching."   1.35u = 26px, one line, indented 48px
      gap 1.6u = 30px
  b7  "I wasn't trying to build a trucking company."   1.35u = 26px, indent removed, back at the column's left edge
      gap 2.1u = 40px
  b9  "I was trying to build something people could believe in."      2.3u = 44px, wraps to 2 lines, 107px tall

b5 and b6 share a 48px indent because they are a matched pair; b7 physically un-indents, and that return to the left edge is the turn in the argument made structural rather than decorative.

Beats in the MARGINAL column, right-aligned, each top-aligned to the first baseline of the question it introduces:
  b1  "There came a moment when I stopped asking:"   1.05u = 20px, aligned to b2
  b3  "I began asking a different question."          1.05u = 20px, aligned to b4
These are stage directions in Mark's own voice, so they are Newsreader, not Archivo. Hanging them in the margin buys back 116px of stage height and gives the scene a documentary page structure rather than a stack.

ARCHIVAL FURNITURE, children of the sticky stage so it holds with it, 40px inset from the frame:
  top-left      "12"                  (scene number)
  top-right     "05:41"               (time stamp, pre-dawn)
  bottom-right  two right-aligned lines occupying the slot where PL. NN would sit if a photograph existed:
                  line 1: "BEAT 03 / 09"  (or "PAUSE")
                  line 2: "SHOW FULL STATEMENT" (button)
  bottom-left   empty. The plate slot is not filled with a substitute and not apologised for.

MOBILE (<768px, measured at 375x780). The marginal column cannot hang, so the pin splits into two consecutive sticky stages rather than shrinking the questions below 26px:
  STAGE A, 210svh: b1 (15px, in flow, 10px above its question), b2 (30px, 2 lines), b3 (15px), b4 (38px, 3 lines).
  STAGE B, 240svh: b5, b6, b7 (18px, 2 lines each), the pause, b9 (26px, 3 lines).
Side margins 24px, block width 327px. Furniture inset drops to 24px and the safe area to 64px. Both stages' blocks compute to under 78svh. The LESSON panel is unchanged.

LESSON PANEL (after the pin releases, both breakpoints). 100svh, centred both axes. Archivo label "LESSON" 11px, then 32px of space, then "The strongest foundation isn't concrete. It's character." set in Newsreader 400 at 2.1u (40px desktop, 27px mobile), broken onto two lines at the full stop, centred, max-width 22ch. "It's character." is set at weight 600. The return of ordinary, unpinned scrolling is the exhale, and the lesson is what the reader lands on when the floor comes back.

### Motion
THE WHOLE STATEMENT IS ALREADY ON SCREEN WHEN YOU ARRIVE. All nine beats are laid out at their final size and position from the first frame, at opacity 0.14. Nothing enters, nothing travels, nothing reflows. Scroll does one thing only: it raises the light on the paragraph, clause by clause. That is the light arc of the whole film performed at the scale of a single page of writing, in the scene that sits immediately after the crossover.

THIS SCENE'S STYLESHEET CONTAINS NO `transform`. Not one. Opacity is the only animated property in the section. It is the only scene in the seventeen for which that is true, and it is checkable in review.

THE DRIVER. One rAF-throttled scroll listener on the section computes
  p = clamp(0, (scrollY - sectionTop) / (sectionHeight - viewportHeight), 1)
and writes exactly one value per frame: `--p` on the section element. Register it so it is typed and interpolable:
  @property --p { syntax: '<number>'; inherits: true; initial-value: 0 }
Every beat carries inline `--in` and `--out` and computes its own opacity in CSS:
  opacity: clamp(0.14, calc(0.14 + 0.86 * ((var(--p) - var(--in)) / (var(--out) - var(--in)))), 1)
Nine beats, one JS write per frame, no per-element JS. Do NOT set will-change on the beats; nine promoted text layers costs more than it saves.

BEAT TABLE (p thresholds; scroll travel inside the pin is 320vh, so 0.01p = 3.2vh):
  b1  in 0.000  out 0.045
  b2  in 0.070  out 0.150   THEN falls back: fadeIn 0.300, fadeOut 0.380, floor 0.30
  b3  in 0.400  out 0.445
  b4  in 0.470  out 0.575
  b5  in 0.600  out 0.645
  b6  in 0.660  out 0.705
  b7  in 0.730  out 0.775
  PAUSE 0.775 to 0.875
  b9  in 0.875  out 0.955
  hold 0.955 to 1.000, then the stage releases

THE MECHANIC THAT MEANS SOMETHING. b2 is the question he outgrew. It comes to full ink and then holds ALONE at full for 0.15p, which is 48vh of wheel with a single question on an otherwise near-dark screen. Then it falls back to 0.30 and stays there for the remainder of the scene. It is never removed. "I stopped asking X, I began asking Y" does not mean X was deleted; it means it was outgrown, and the old question is still faintly on the screen underneath the new one when you scroll out. Its curve is the only non-monotonic one in the scene:
  opacity: max(0.30, min(rampUp(--in,--out), 1 - 0.70 * rampUp(0.300, 0.380)))
b4, the new question, ramps over 0.105p (33.6vh) rather than the 0.045p everyone else gets. It is the longest, largest line and it is allowed to take the longest to arrive.
b5, b6, b7 ramp at 0.045p with 0.015p gaps, which reads as a brisk list rather than three separate revelations.

THE LONG PAUSE IS SPENT IN SCROLL, NOT IN SPACE. From p 0.775 to 0.875, roughly 32vh of wheel or three to four notches, absolutely nothing on screen changes. No opacity moves. That is what "(long pause)" means and it is the boldest thing in the scene. The only tell that the page is alive is the counter in the bottom-right slot, which reads "PAUSE" for exactly that stretch.

THE COUNTER IS THE ONLY THING IN THE SCENE THAT CHANGES STATE. "BEAT 01 / 09" through "BEAT 09 / 09", derived from --p by the same listener. The numeral SUBSTITUTES INSTANTLY. No crossfade, no transition, no tick animation: a crossfade would be motion and this scene has none. Set in tabular-nums so the label never changes width. It is a clock in a silent room, and it is what makes total stillness read as held rather than broken.

EASING. There is none, and that is deliberate. Every ramp is linear in scroll position, because the scene is scrubbed rather than played, and an eased scrub means the words brighten at a speed the reader did not choose. Linear is the honest curve here. The only timed transition anywhere in the scene is on the SHOW FULL STATEMENT control: 120ms linear on opacity for its hover state.

### Interaction
Almost none, on purpose. There is no hover state on the words, no pointer affordance, no parallax under the cursor, no click target inside the statement. Moving the mouse across this scene does nothing at all, which is the point.

There is exactly one control, and it is the accessibility escape hatch made visible rather than hidden in a media query. In the bottom-right furniture slot, under the beat counter: a button reading "SHOW FULL STATEMENT" (Archivo 11px, 0.1em, uppercase, 1px underline at 3px offset, #12141A). Clicking it sets data-live="off" on the section, which in one step brings all nine beats to opacity 1, releases the pin (section height goes to auto, the stage to position: static), and swaps the counter line to "09 BEATS". It is not reversible within the session and does not need to be. It gives a reader who does not want to be held in a 420svh pin an immediate, dignified way out, and it fills the slot where PL. NN would sit if a photograph existed, so the corner is not empty and is not padded with a substitute.

Keyboard: the control is the section's only focusable element and takes a 2px #12141A focus ring at 3px offset. Space and PageDown behave normally; there is no scroll-snap, because snapping would fight the scrub and would make the pause feel like a stall rather than a held breath.

### Typography
MARK: Newsreader throughout, and the optical size axis is actually driven, not left at default. Every beat sets font-variation-settings: 'opsz' <its own rendered px, clamped 6 to 72>, so the 20px marginalia get a text-optimised cut and the 64px question gets a display cut.
  b1, b3 (marginalia)          Newsreader 300, opsz 20, 20px / 1.5, +0.01em, #12141A
  b2 THE OUTGROWN QUESTION     Newsreader 200, opsz 49, 49px / 1.18, -0.015em. Set at the lightest weight in the scene because it is the question that never had much weight.
  b4 THE NEW QUESTION          Newsreader 500, opsz 64, 64px / 1.12, -0.02em. Larger and heavier than b2 by 15px and 300 units of weight. That difference IS the argument.
  b5, b6                       Newsreader 300, opsz 26, 26px / 1.45, 0em. The repeated opener "A company built on" stays at 300; the operative noun ("honesty", "integrity") is set at 600. Mark's parallel construction made visible with weight rather than colour, since colour is unavailable on this ground.
  b7                           Newsreader 300, opsz 26, 26px / 1.45
  b9 THE PAYOFF                Newsreader 500, opsz 44, 44px / 1.22, -0.015em
  LESSON                       Newsreader 400, opsz 40, 40px / 1.3, centred; "It's character." at 600
Casing is Mark's own and is not normalised: "what kind of business do I want to own?" keeps its lowercase w after the colon, "What kind of company deserves to exist?" keeps its capital. The two questions differ in case because he wrote them that way, and the difference is doing work.

THE SITE: Archivo (Inter as the metric fallback), 11px, 0.1em, uppercase, weight 500, #12141A, tabular-nums wherever a numeral appears. Used for and only for: "12", "05:41", "BEAT 03 / 09", "PAUSE", "SHOW FULL STATEMENT", "LESSON", "09 BEATS". Nothing the man says is ever set in Archivo and no site label is ever set in Newsreader.

### Contrast
Ground #7d8787 (relative luminance 0.2343). Computed, not estimated.

PASSES:
  #12141A on #7d8787 = 4.99:1. Every beat at its final state, the lesson, and all furniture. Clears AA for both normal and large text. Does NOT clear AAA, so no beat may be shipped at a final opacity below 1.0: at this ratio a residual 0.95 alpha drops it under 4.5 immediately. That is the whole meaning of the TIGHT note on this scene, and it is why the ramps end at exactly 1, never 0.98.
  Furniture at 11px is small text and therefore must be full #12141A. It is never dimmed, never faded in, and never inherits --p.
  SHOW FULL STATEMENT underline, 1px #12141A = 4.99:1 as a non-text graphic, clears the 3:1 requirement.
  Focus ring 2px #12141A on ground = 4.99:1, clears 3:1.

GOLD IS NOT USED IN THIS SCENE, AND THE REASON IS ARITHMETIC. #D6A145 on #7d8787 = 1.59:1. It fails as text by a factor of three and would be near-invisible as a hairline. Rather than shrink it to a token that cannot be seen or darken the brand colour to something that is no longer the brand colour, scene 12 simply has no accent. It is the one scene with no photograph, no movement, and no gold. The accent returns in scene 13 with first daylight, where the ground is light enough to carry it.

DELIBERATELY SUB-THRESHOLD, AND DECLARED:
  Future beats at opacity 0.14 composite to #6e7778 = 1.24:1. This is unread text that has not arrived yet, it is transient, and every word of it reaches 4.99:1 before the reader is expected to read it.
  The outgrown question's residual at 0.30 composites to #5d6466 = 1.63:1. It is an afterimage of a line the reader has already read at full ink, not a line to be read.
  Both are lifted to opacity 1 (4.99:1) under @media (prefers-contrast: more), under prefers-reduced-motion: reduce, when JavaScript has not run, and when SHOW FULL STATEMENT is pressed. There is no path by which a reader is left with sub-threshold text as their only access to Mark's words.

### Reduced motion
VISIBLE IS THE DEFAULT STATE, AND THE SERVER SENDS IT THAT WAY. The nine beats are rendered by the server at opacity 1 and #12141A. The dimming rule is gated on an attribute the section's own script sets on mount: `[data-live="on"] .k-beat { opacity: <the clamp expression> }`. If the script never runs, never hydrates, or throws, the attribute is never written and the reader gets the complete statement in full ink. Nothing in this scene depends on an animation in order to become visible. (Note for whoever builds it: components/k/PinnedStatement.tsx in this repo does the opposite, rendering at 0.16 from the server and relying on hydration to bring the words up, with a noscript patch. Do not copy that pattern here.)

The reduced-motion version is the complete scene, not a degraded one. The script checks matchMedia('(prefers-reduced-motion: reduce)').matches before binding the listener and re-checks on the change event; if it matches, --p is never written and data-live is never set. In CSS:
  section height 420svh becomes auto
  the sticky stage becomes position: static; height: auto; padding: 96px 0
  every beat sits at opacity 1, #12141A, 4.99:1
  the marginalia still hang in the 200px margin at >=1200px, so the editorial structure survives intact
  the mobile two-stage split becomes one continuous column
  the long pause becomes 96px of vertical white space between b7 and b9. It is the only part of the pause that can survive without scroll, and a measured gap is the correct typographic translation of it
  the bottom-right slot reads "09 BEATS" in place of the live counter
  SHOW FULL STATEMENT is not rendered, because the statement is already full
  the LESSON panel becomes a normal 160px-padded block rather than a 100svh panel
Result: one quiet, fully readable page of Mark's writing, correctly ranked by size and weight, in the right typeface, with its furniture. A reader who never sees the reveal loses the pacing and loses nothing else.

### Assets


### Risk
The headline risk is that the 32vh frozen pause reads as a stuck sticky element rather than a held breath. A reader who scrolls three notches and sees literally zero pixels change will assume the page has broken, hit refresh, and lose the scene. Mitigations, in order: the counter in the bottom-right slot reads "PAUSE" for exactly that stretch and is the visible proof that the page is receiving scroll; the pause is capped at 0.10 of progress and must not be tuned longer no matter how good it feels in review, because it feels good in review precisely when you already know it is coming; and SHOW FULL STATEMENT gives an immediate exit. Test the pause on a trackpad with momentum scrolling before signing it off, not on a wheel mouse.

Second risk, and the one most likely to make it look cheap rather than broken: the 0.14 ghost state reading as a rendering failure or as an accessibility violation caught in an audit. #6e7778 on #7d8787 is 1.24:1 and will be flagged by any automated checker that walks the DOM without running the scroll. The defence has to be built in, not argued afterwards: full ink from the server, lift to 1 under prefers-contrast: more, and the visible escape control. If the ghost floor is ever raised as a compromise, raise it to 0.30 for all beats and re-space the ramps; do not leave it at an untested value between the two.

Third, quieter risk: 420svh of pin on a page that already asks a lot of the reader. This scene is the emotional turn, so it earns the length, but it must be the longest pin in the film. If any other scene is also over 400svh, shorten that one, not this one.

---

## Scene 13 — The Promise

**Reference:** Locomotive — https://mobbin.com/sites/sections/22cb319c-0c07-42ff-8281-53ee9406076d

- **Take:** A flat single-colour ground carrying three separated planes: a tabular list of small uppercase records held as the midground, a foreground element travelling across it at its own rate, and one rule line that stays absolutely fixed so the eye can measure the speed difference between the other two. The depth is built entirely from type and one hairline. No image, no gradient, no shadow. That is the exact problem this scene has: a layered parallax with no photograph to layer.
- **Leave:** The cut-out human figure (we have no such asset and faking one is forbidden), the deliberately scrambled/glitched duplicate row (a joke at the reader's expense, against Mark's rule 3), and the saturated brand-red ground (our ground is fixed at #909ca5 by the light arc and is never chosen).

**Why it differs from every other scene:** It is the only one of the seventeen with no photograph and no video, and it says so out loud: its plate slot reads "PL. NONE" while every other scene's reads "PL. NN".

### Layout
NO PHOTOGRAPH AND NO VIDEO. The director's note is answered by making the absence structural: this is the scene about the thing that existed before there was anything to photograph. Five depth planes built from type and two hairlines.

DESKTOP 1440x900. 12 col, 72px outer margin, 24px gutter, col = 86px. Section is 380vh tall; inside it one .stage at position:sticky; top:0; height:100vh; overflow:hidden. Everything below lives in the stage, absolutely positioned, z-ordered back to front.

THE SPINE (plane 1, never moves): a 1px vertical rule at x=464px, top 0 to bottom of stage, rgba(18,20,26,0.16). This is the only element in the scene with zero travel. Everything else is measured against it.

THE LEDGER (plane 2): 1px horizontal hairlines at 44px pitch, rgba(18,20,26,0.07), spanning x 464 to 1330, in a block 300vh tall. Paper, not information.

THE FILING LANE (plane 3, foreground) occupies cols 1 to 3, x 72 to 378, width 306. Two overlapping sub-columns of the same 306px band, both left-aligned at x=72, row pitch 34px, the second offset 17px vertically and started at a different index so no two labels ever align. Content is 32 rows: the sixteen real, generic filings a US motor carrier actually makes, repeated once. ARTICLES OF ORGANIZATION / EIN APPLICATION / USDOT NUMBER / MC OPERATING AUTHORITY / BOC-3 PROCESS AGENT / UCR REGISTRATION / IFTA LICENSE / IRP APPORTIONED PLATE / FORM 2290 HEAVY VEHICLE USE TAX / CERTIFICATE OF INSURANCE / FORM W-9 / DRUG AND ALCOHOL CONSORTIUM / ELD REGISTRATION / CARRIER PACKET / NOTICE OF ASSIGNMENT / RATE CONFIRMATION. Names only. No numbers, no seals, no signatures, no paper facsimile, no rotation, no shadow. aria-hidden="true".

THE PROMISE COLUMN (planes 4 to 6) occupies cols 5 to 11, x 512 to 1258, width 746. Three separate blocks at three different depths, each absolutely positioned, never re-laid-out:
 - COUPLET block, home top 38vh: "Every company begins with paperwork." then a 20px gap then "But that's not where KUL began."
 - HINGE block, home top 44vh: "KUL began with a promise." alone.
 - VOWS block, home top 34vh, fixed top edge, grows downward, height reserved at full four-item size from first paint so nothing ever reflows. Four items, 26px apart, max-width 720px. Each vow carries a 2px x 20px #12141A tick in the 48px gutter at x=464, sitting on the spine, aligned to its first line's cap height.
 - CLOSER: "The trucks would come later." is NOT in the promise column. It is set in the filing lane, x 72 to 378, Newsreader 30px, wrapping to three lines. The trucks arrive up the lane the paperwork vacated.

FURNITURE, unchanged position and size: "13 / 17" top-left at x=72 y=40; "06:40" top-right, right-aligned to x=1368, y=40. The plate slot is in its usual position and reads "PL. NONE" because there is no photograph. The grid never breaks; it states the absence.

AFTER THE PIN, in normal document flow: 22vh of ground, then in the promise column at x=512 the label "LESSON", 14px gap, a two-tone rule 72px wide and 8px tall (top 4px #12141A, bottom 4px #D6A145), 20px gap, then "Principles are promises you keep, even when they're difficult." at max-width 30ch. Then 26vh of ground before scene 14.

MOBILE 375. 20px margins. The filing lane cannot be a side column, so it becomes a full-width clipped window at the top of the stage, y 96 to 260 (164px tall), overflow:hidden, mask-image: linear-gradient(to bottom, transparent 0, #000 22%, #000 78%, transparent 100%). Both sub-layers and the closer sentence run through that window at the same rates. Promise column is x 20 to 355. Spine moves to x=20 and the vow ticks sit on it. Ledger pitch 36px. Section height 300vh.

### Motion
THE MEANING: parallax is distance, and distance is permanence. The paperwork is the nearest plane and moves fastest, so it streams past and is gone before you have read half of it. The vows are the furthest plane and are nearly nailed to the viewport. The spine does not move at all. The scene says "every company begins with paperwork, but that's not where KUL began" by letting the paperwork physically leave while the promise stays under your eye.

DRIVER. One passive scroll listener, one rAF tick, writing a single custom property on the section: --p = clamp((scrollY - sectionTop) / (sectionHeight - innerHeight), 0, 1). No per-element JS, no library, no measuring in the loop. Every layer is transform: translate3d(0, calc((var(--o) - var(--p) * var(--d)) * 1vh), 0) with --o and --d set per layer in CSS. Transform and opacity only, nothing else animates.

LAYER TABLE. --d is total travel in vh across the whole 380vh pin, so --d 380 equals scroll speed exactly; below 380 the layer floats, above 380 it outruns you.
 1 SPINE       o 0    d 0     (1.00 fixed to viewport, zero travel)
 2 LEDGER      o +40  d 190   (0.50x scroll)
 3 FILING FAR  o +36  d 520   (1.37x)
 4 FILING NEAR o +12  d 640   (1.68x)
 5 COUPLET     o +16  d 300   (0.79x)
 6 HINGE       o +105 d 200   (0.53x)
 7 VOWS        o +30  d 60    (0.16x, almost still)
 8 CLOSER      o +360 d 430   (1.13x, the fast lane)

RESULTING TIMELINE, all values derived from the table:
 p 0.00 to 0.21  The filing near-layer streams up and out. Its 121vh block clears the stage top at p=(12+121)/640=0.21. The far layer clears at p=(36+121)/520=0.30. Because the two run at 1.37x and 1.68x they shear against each other continuously: 31vh of relative slip across the pin, which reads as papers sliding over papers. The couplet floats up beneath them at 0.79x and leaves the top at p=0.22.
 p 0.30 to 0.73  THE EMPTY LANE. The left third of the screen is now completely bare and stays bare for 0.43 of the pin, which is 163vh of scrolling with nothing in it. This is the single most important gesture in the scene and it costs nothing: the paperwork is done and the trucks have not come yet.
 p 0.30 to 0.75  The hinge, "KUL began with a promise.", enters at p=(105-45)/200=0.30, crosses the optical centre at 0.525, exits at 0.75. It is the slowest thing on screen so far and it is alone.
 p 0.42 / 0.53 / 0.64 / 0.75  The four vows arrive, one at each threshold, into a block that is already at its final position and never moves them. Each entrance is 620ms, cubic-bezier(0.22, 1, 0.36, 1), from { opacity: 0; transform: translate3d(0, 14px, 0) } to { opacity: 1; transform: none }. Its tick draws 120ms later, 420ms, transform: scaleX(0) to scaleX(1), transform-origin left. The vows overlap the hinge's exit deliberately: the promise is still drifting up out of frame while its terms accumulate beneath it.
 p 0.73 to 0.94  "The trucks would come later." enters the empty filing lane at 1.13x, the only element in the scene set in Mark's serif but travelling at the institution's speed, and passes up and out. It never collides with the vows because it is in a different column.
 p 1.00  Pin releases with the four vows still on screen. The lesson follows in normal flow.

SCRUB AND DIRECTION. Every plane is a pure function of --p, so the scene runs identically backwards. The one exception is the four vow entrances: the class is added at its threshold and NEVER removed. Scrolling back up does not re-hide a promise.

THE VISIBILITY CONTRACT (this is the part that must not be got wrong). The vows' base CSS is opacity 1, transform none. The reveal is opt-in: the same synchronous script block that attaches the scroll listener sets html.js-scroll, and only html.js-scroll .vow { opacity: 0 } exists. A 400ms watchdog removes .js-scroll if the rAF loop has not ticked, which restores every vow to visible. No element in this scene has an animation as its only route to being seen.

### Interaction
Nothing. Deliberately, and it is worth stating as a decision rather than an omission. There is no hover target, no click target, no cursor change, no tooltip, no video to start anywhere in the section. The only input is scroll, and the only variable the scene reads is scroll position. This is the one scene on the page where the viewer is given nothing to do, because it is the scene about a commitment made before there was any equipment, any customer or any transaction to interact with. The filing column is aria-hidden and not focusable, so tab order runs straight from the previous scene's last control to the next one. Keyboard scroll (space, page down, arrows) drives --p exactly as the wheel does because the pin is real document height, not a scroll hijack. Nothing is trapped.

### Typography
Newsreader for every word Mark wrote, Archivo for every word the site says. No exceptions and no mixing inside a line.

NEWSREADER (Mark):
 Couplet, both lines: opsz 24, weight 300, 28px / 1.50, letter-spacing 0.
 Hinge "KUL began with a promise.": opsz 60, weight 400, 64px / 1.10, letter-spacing -0.015em.
 Vows 1 to 3 ("To do business with integrity." / "To treat people with respect." / "To never compromise safety for convenience."): opsz 32, weight 350, 34px / 1.40.
 Vow 4 (the long one, "To remember that behind every shipment, every invoice, every phone call, is a person who placed their trust in us."): opsz 30, weight 350, 30px / 1.50, max-width 720px, wraps to three lines. Set one size down deliberately so the four vows read as a set rather than as a paragraph that broke the rhythm.
 Closer "The trucks would come later.": opsz 30, weight 300, 30px / 1.35, in the filing lane at 306px wide, three lines.
 Lesson "Principles are promises you keep, even when they're difficult.": opsz 30, weight 500, 30px / 1.45, max-width 30ch. The only weight-500 serif in the scene.

ARCHIVO (the site), every instance at exactly the archival-furniture spec, 11px / weight 500 / 0.1em tracking / uppercase, no size variation anywhere:
 The scene number "13 / 17", the stamp "06:40", the plate slot "PL. NONE", the label "LESSON", and all 32 filing rows. The filings are set in the site's own furniture face at the furniture's own size, which is the point: paperwork is the institution talking, and it is typographically indistinguishable from the page's own record-keeping.

MOBILE 375: couplet 20px, hinge 40px / 1.12, vows 24px (long vow 22px / 1.5), closer 22px, lesson 24px. Archivo stays 11px everywhere; the furniture never scales.

### Contrast
Ground #909ca5, relative luminance 0.3242. All ratios computed against it, not against black or white.

 #12141A on #909ca5 = 6.56:1. PASS AA and AAA for large. Carries: all six Newsreader blocks (couplet, hinge, four vows, closer, lesson), the filing NEAR sub-column at 11px, the vow ticks, and the top 4px of the lesson rule.
 #2B3138 on #909ca5 = 4.68:1. PASS AA for normal text at 11px (verified above 4.5, the nearer #2E343B measured 4.48 and was rejected). Carries: the filing FAR sub-column, and the "LESSON" label. Nothing larger.
 #D6A145 on #909ca5 = 1.21:1. FAILS everything. Brand gold is therefore FORBIDDEN as text, as an icon, as a tick and as any mark read against the ground anywhere in this scene. It appears exactly once, as a 72x4px bar sitting flush beneath a 72x4px #12141A bar in the lesson rule, where it is read as a figure against the black bar (gold vs #12141A = 5.4:1) and not against the ground. It carries no information: remove it and nothing is lost but the brand note.
 Ledger hairlines rgba(18,20,26,0.07) over ground = approx 1.2:1, and the spine rgba(18,20,26,0.16) = approx 1.5:1. Both are decorative texture carrying zero information and are exempt; no text, number or state is ever encoded in a rule.

 Scrim: none used. There is no photograph, so there is nothing to scrim, and every value above is a flat colour on a flat known ground with no compositing in between. This is the only scene on the page where the contrast is exact rather than measured against an image.

### Reduced motion
A complete, ordered, fully readable static document, not a frozen frame of the pinned version. Under @media (prefers-reduced-motion: reduce) the script checks the media query BEFORE attaching and never installs the scroll listener at all, so --p is never written and no rAF ever runs.

 section { height: auto } .stage { position: static; height: auto; padding: 16vh 0 } and every layer gets position: static; transform: none; opacity: 1; animation: none.

 The layers then render in this document order down the promise column, which is the order they were always in the DOM:
 1. The label "FILINGS", then the sixteen filing names ONCE (not the 32-row doubled version, which existed only to have something to stream), set as a two-column list at 11px Archivo, #2B3138, 34px row pitch, in the left band. Still aria-hidden.
 2. "Every company begins with paperwork." / "But that's not where KUL began."
 3. "KUL began with a promise." at full 64px.
 4. All four vows, all visible, all four ticks drawn at full scaleX(1).
 5. "The trucks would come later."
 6. The lesson, with its two-tone rule.

 The spine and the ledger hairlines are retained as static texture at their stated alphas, so the scene still looks like a ledger page rather than a plain stack. The furniture, "13 / 17", "06:40" and "PL. NONE", sits in its normal place. Nothing is cut, no sentence is shortened, and the reader loses only the depth, which was never carrying information.

### Assets


### Risk
The filing column is the whole scene and it is one bad decision away from looking like decorative code-rain or, worse, like a fabricated document. Mitigations, all mandatory: use only the sixteen real, generic filing names with no numbers, no dates, no seals, no signature, no serial, no paper facsimile, no page edge, no rotation, no shadow and no skew, so it can never be mistaken for a record of anything; set it in the site's own 11px archival furniture spec so it reads as the page's record-keeping voice rather than as a prop; keep it to two sub-layers, never three, and if in browser it reads as noise rather than as filing, cut the far sub-column to 40 percent row density before touching anything else.

Second risk, smaller: 640vh of foreground travel across a 380vh pin is 1.68x, which is the top of the comfortable band. It is held there only because the motion is purely vertical, with no scale, no rotation, no horizontal component and no blur, and because the offending layer is gone by p=0.30. If it reads as fast in testing, drop FILING NEAR from d 640 to d 560 and FILING FAR from 520 to 470; the shear between them, which is the effect, survives at 90 vh of relative slip.

---

## Scene 14 — Meet KUL

**Reference:** Ragged Edge — https://mobbin.com/sites/sections/0162a9ba-2ce1-49f4-b599-e8a016dd7d75

- **Take:** The lockup presented alone on a flat single-colour field at very large scale, with the mark tucked hard enough against the wordmark that the two read as one settled object rather than two things placed near each other. And the nerve to leave the surrounding field genuinely, uncomfortably empty so the arrival has somewhere to land. I borrow the joining: KUL's 92px Archivo nameplate sits directly above Mark's 34px Newsreader greeting with only 22px between them, so the sentence names the object immediately above it and the two register as one settled block.
- **Leave:** The centring, the cartoon logomark, the pink, the whimsy, and the fact that nothing else exists on their page. KUL's version is left-anchored on a 12-column grid, must carry the archival furniture, a photograph, and a strip of regulatory numbers in the same field, and settles rather than simply sitting.

**Why it differs from every other scene:** It is the only scene in the seventeen whose climax is an object coming to rest rather than an element appearing, and the only one where three moving things stop against a fourth that never moved once.

### Layout
DESKTOP 1440x900. 12 cols, 72px outer margin, 24px gutter, col=86px. Section is 340vh tall containing a position:sticky;top:0;height:100vh stage (isolation:isolate, so the truck's multiply blend composites against this scene's ground only). Scroll progress p runs 0..1 over the 240vh of travel.

FURNITURE (never moves, never animates, present at p=0): "14 / 17" Archivo 11px at x72,y48. "07:58 EST" Archivo 11px flush right to x1368, y48.

THE SENTENCE. Four fragments of Mark's line share one baseline at y=270 (30vh), left edge x=72: "Every mile." / "Every lesson." / "Every decision." / "Led here." Newsreader 300, 64px, tracking -0.006em, 18px word-gap between fragments; total assembled width ~1010px, fits the 1296 measure. Three of them start displaced; "Led here." is already in its slot and never moves.

THE LOCKUP, y316..772, two columns:
LEFT (cols 1-4, x72..402): portrait window 330x412, hard edges, no radius, no shadow, no vignette. mark-portrait-a only (A over B: in A his face is larger in frame, more square to camera, and the red key falls off the right side of his head instead of flooding the crown). object-fit:cover, object-position:50% 34% — this crops the 1440x1920 3:4 source to 4:5 by cutting the empty ceiling and some floor while keeping the folding chairs and the stage edge, because the room is the point. filter:saturate(.82) contrast(1.04) brightness(1.02) — a display grade, not a retouch; the file is untouched and no face pixel is reconstructed. Deliberately NOT full-bleed: at full-bleed the red stage spill would flood the viewport and break the light arc's continuity between scene 13 and 15. Flush beneath it a caption bar 330x44, fill #12141A, Archivo 11px/0.1em/uppercase: "PL. 22" left, "MARK BROWN · SEPT 2021" right.
RIGHT (cols 6-12, x474..1368): "KUL ENTERPRISES" Archivo 700, 92px, tracking -0.02em, uppercase, baseline y430 (~800px wide). This is a nameplate, not speech, so it is correctly sans. 22px below it Mark speaks, Newsreader 34px/1.45, baselines 500/549/598: "Welcome to KUL Enterprises." (300) / "We didn't build this company to be the biggest." (300) / "We built it to be trusted." (500). The weight step is the scene's single typographic argument: what is denied is light, what is affirmed carries mass. Then a 102px gap, and at y700 the credentials read straight off the real door decal, Archivo 11px/0.1em/uppercase, 32px apart: "USDOT 7638788 · MC 66389691 · LOGANVILLE, GA". These are the institution's voice answering Mark's serif.

THE GROUND. A 1px rule, #12141A at 40%, x72..1368, y800. Present from p=0; it does not draw itself. truck-right.webp sits ON it: 396x168 (its native 2.357:1), right edge flush to x1368, bottom edge exactly on y800, so the tractor nose faces right into the margin like it has pulled up and stopped. The render is white-backed with no alpha, so it is composited with mix-blend-mode:multiply against the flat #a8b4c7 ground: white drops out, the black cab and baked drop shadow survive, and the chrome takes the scene's light instead of floating as a cutout. It occupies x972..1368, clear of the credentials which end near x874. Reserve its box at 396x223 from the start (elevation bottom-aligned inside) so the video swap causes zero reflow. Below the rule at y826, x72: the play control, Archivo 11px/700/0.1em, 40px hit area.

LESSON PANEL, 60vh, after the pin releases. Left margin x72 only, aligned to nothing else on the page, because a reputation is placed by other people, not by you. "LESSON" Archivo 11px/0.1em. Then Newsreader 44px/1.32, max-width 720px: "Reputation isn't built by what a company says." (300) then "It's built by what people experience." (500). Same light/heavy device, applied exactly twice in the scene and nowhere else.

MOBILE 375x812. Margins 20px, measure 335. The pin is dropped entirely below 768px width or 900px height; the scene becomes normal flow and each fragment converges on its own trigger as its centre crosses 62vh. Fragments stack as four left-aligned lines at Newsreader 30px/1.18, converging into a column above the already-placed "Led here." Portrait 335x419 + 40px caption. Nameplate Archivo 700/40px/-0.02em (~320px, one line). Vow at 24px/1.5. Credentials wrap to two lines. Rule x20..355; truck 335x142 sitting on it. Lesson at 26px, max-width 300px.

### Motion
The whole scene is driven by ONE custom property. @property --p { syntax:'&lt;number&gt;'; inherits:true; initial-value:1; } — initial-value is 1, meaning fully assembled and fully at rest. If the script never runs, stalls, or is throttled, the scene paints in its finished, complete, readable state. JS sets --p to 0 on mount and drives it from a rAF-throttled scroll read on the sticky stage; it writes that one property and touches nothing else. Where supported, animation-timeline:scroll() on the section drives the same keyframes natively with no JS at all. Transform and opacity only; nothing animates width, height, top or left.

p 0.00-0.10 DEAD AIR. Nothing moves. Three fragments sit visibly off-position at opacity .62, "Led here." sits finished at opacity 1. The arrival needs somewhere to arrive from.

p 0.10-0.22 "Every mile." travels translate3d(-318px,-112px,0) to none, opacity .62 to 1. cubic-bezier(0.22,1,0.36,1).
p 0.20-0.32 "Every lesson." from translate3d(292px,96px,0). Same easing. The 2% overlap with fragment 1 (~5vh) is deliberate so it does not tick like a metronome.
p 0.30-0.42 "Every decision." from translate3d(-96px,178px,0). Same easing.
"Led here." has zero keyframes. It is the only resolved thing on screen at p=0 and it never moves for the entire scene. That is the meaning: three things travelled a long way and stopped against a destination that was already standing there. The sentence assembles into its own statement.

p 0.42-0.50 THE HOLD. 19vh of scroll in which literally nothing on screen changes. No keyframe touches any element in this range. The assembled sentence is simply true for a while.

p 0.50-0.62 The sentence recedes without fading: transform:translate3d(0,-180px,0) scale(.42), transform-origin:0% 50%, so it retreats toward the left margin and becomes the header. cubic-bezier(0.65,0,0.35,1). Colour stays solid #12141A the whole way — 26.9px at 8.8:1, never dimmed, never at risk.

p 0.56-0.70 THE SETTLE. The portrait window, nameplate, vow and credentials move as ONE rigid transformed wrapper (single composited layer). Keyframes: 56% translate3d(0,54px,0) / 66% translate3d(0,-7px,0) / 70% translate3d(0,0,0). 56-66 cubic-bezier(0.16,0.84,0.32,1); 66-70 cubic-bezier(0.33,0,0.15,1). 7px of overshoot on 54px of travel is 13% — that is air suspension taking a load, not a cartoon bounce. The group is opacity 1 throughout; it is off-position, never invisible.

p 0.70-0.84 THE TRUCK SETTLES, later, slower, further, because it is heavier. 70% translate3d(46px,22px,0) / 80% translate3d(0,-4px,0) / 84% translate3d(0,0,0). It arrives from the right and slightly high. Its overshoot is 4px on 22px = 18% of a much shorter drop, and in absolute terms nearly half the lockup's: heavy things overshoot less. That single number is what makes it read as mass rather than as a div.

p 0.84-1.00 STILLNESS. 38vh of scroll with the composition completely at rest. Half this scene's scroll is motion and half is stillness. The last thing the viewer experiences in scene 14 is an object that stopped exactly where it said it would, and then stayed there. That is the argument of "We built it to be trusted," made with timing instead of adjectives.

### Interaction
One interaction, click only, below the rule at x72: "▶ PLAY · THE RIG, WESTBOUND". Clicking swaps the orthographic elevation for kul-hero-720.mp4 inside the box that was already reserved at 396x223, so nothing reflows and no dimension animates — the still scale drawing becomes the moving real thing, in the same footprint, standing on the same rule. video is preload="none", playsinline, muted at start with native controls, poster=kul-hero-poster.jpg. No autoplay and no audio without a user gesture; the user can unmute through the controls. Click again or press Esc to return the elevation. Focusable button, visible focus ring (2px #12141A offset 3px), aria-pressed.

Explicit non-interactions, by decision: the portrait has no hover state, no lightbox, no zoom, no parallax. The most important photograph on the site is not a toy. The nameplate is not a link. Nothing is draggable. mark-fieldnote.mp4 is deliberately NOT spent here; it belongs to a jobsite scene.

### Typography
Newsreader carries every word Mark wrote and nothing else. Fragments: Newsreader 300, 64px, opsz 32, tracking -0.006em, line-height 1.0. Greeting and vow: Newsreader 34px, opsz 24, line-height 1.45, weight 300 for "Welcome to KUL Enterprises." and "We didn't build this company to be the biggest.", weight 500 for "We built it to be trusted." Lesson: Newsreader 44px, opsz 36, line-height 1.32, weight 300 for "Reputation isn't built by what a company says.", weight 500 for "It's built by what people experience." The light/heavy step is used exactly twice in the scene and carries one idea: what is denied is light, what is affirmed has mass.

Archivo carries everything the site says. Nameplate "KUL ENTERPRISES" 700, 92px, tracking -0.02em, uppercase. Furniture, caption bar, credentials, play control all 11px, 0.1em, uppercase; 500 for the furniture/caption/credentials, 700 for the play control.

The register law is not bent. "Welcome to KUL Enterprises." is Mark speaking and is set in Newsreader at 34px, intact and unsplit. The 92px "KUL ENTERPRISES" above it is not speech at all, it is a nameplate, so it is correctly Archivo. Set type, not the supplied logo file: the client's logo kit is opaque raster with auto-traced "vectors" and cannot sit on a coloured ground.

Mobile: fragments 30px, nameplate 40px, vow 24px, lesson 26px; all furniture stays 11px/0.1em, unchanged, because the furniture is the one fixed thing across seventeen scenes.

### Contrast
Ground #a8b4c7 (relative luminance 0.4509). Computed, not estimated.
#12141A on #a8b4c7 = 8.83:1 — all body text, fragments at rest, nameplate, vow, lesson, furniture, credentials. AAA.
#12141A at 62% over #a8b4c7 = effective rgb(75,81,92), 3.81:1 — the three travelling fragments before they arrive, at 64px Newsreader. Passes AA large text (needs 3:1) with margin, and they reach the full 8.83:1 the moment they land.
The receded header sentence does NOT drop opacity. It scales to 0.42 (26.9px) and stays solid #12141A at 8.83:1. I tested the obvious alternative first: 28% opacity measured 1.74:1 and failed outright, which is why the recede is a transform and not a fade.
#F2F0EC on the #12141A caption bar = 17.4:1.
Brand gold #D6A145 on the caption bar #12141A = 8.06:1 — this is where the plate number "PL. 22" lives, and it is the only gold in the scene.
Brand gold #D6A145 on the #a8b4c7 ground = 1.11:1. Unusable. Measured, not guessed. So this scene ships NO gold on the ground: no gold rule, no gold tick, no gold text. The single accent is the plate number sitting on dark, where it is legible and where it means something (it marks the newest and most important photograph on the site). "Sparingly" is honoured by spending it once, in the one place the light arc allows.
Ground rule #12141A at 40% = 2.3:1, decorative only, carries no information.
Play control focus ring #12141A on ground = 8.83:1.

### Reduced motion
Under prefers-reduced-motion:reduce the scene is complete, not degraded, and it is achieved by a single line: --p is forced to 1, which is already the property's initial-value, and animation-timeline/animation are set to none.

Every element therefore paints in its finished position with no keyframes running at all: all four fragments assembled on the y=270 baseline as one continuous sentence at full opacity, the sentence at its 0.42 header scale in its header position, the portrait window and nameplate and vow and credentials at rest, the truck standing on the rule. Nothing is hidden, nothing is summarised, nothing is substituted with a placeholder. Because the assembled sentence and the header sentence are the same DOM element scaled, there is no duplicate copy to suppress and no branch that can leave words missing.

The section drops from 340vh to auto height and position:sticky becomes static, so the scene reads as one still composition followed by the lesson panel — the same 100vh-worth of design, just not pinned. Type sizes, colours, crops, plate number, credentials and contrast ratios are identical to the animated build.

The play control remains fully functional. Starting a video is a user-initiated action, not motion, and it is the one thing a reduced-motion reader should still be allowed to choose.

### Assets
- mark-portrait-a.webp
- truck-right.webp
- kul-hero-720.mp4
- kul-hero-poster.jpg

### Risk
The real risk is the photograph. A red-flooded, cluttered, vertical phone snapshot of a man standing backstage among folding chairs is being asked to carry the emotional payoff of the entire site, and handled as a hero it will read as low-rent and retroactively cheapen the thirteen scenes before it. The mitigation is to stop pretending it is a portrait and present it as an archival plate: hard 330x412 window, no radius, no shadow, no vignette, no gradient scrim, a restrained saturate(.82) display grade rather than an aggressive de-redding that would go grey-green and sickly, and a dark caption bar stating "PL. 22 · MARK BROWN · SEPT 2021". The plate number and the date reframe it as a record, and records are permitted to be badly lit. It also stays at 23% of viewport width so the red never floods the light arc. Critically, no generative repair of his face — the grade is display-only and the source file is untouched.

Second risk, mechanical: truck-right.webp is 2400x1018 with hasAlpha:no, so any naive placement puts a white rectangle on the blue ground. mix-blend-mode:multiply solves it cleanly against a flat colour, but only if the sticky stage sets isolation:isolate — without it the blend reaches through to whatever scene is painted behind and the truck will smear across the scroll. If the ground at this scroll position ever becomes a gradient rather than a flat #a8b4c7, multiply will band across the trailer's white roof; verify against the computed ground and if it bands, ship a pre-keyed alpha PNG instead rather than trying to tune the blend.

Third, smaller: the 19vh hold at p 0.42-0.50 will look like a bug to anyone who did not design it. It needs a comment in the code saying the stillness is the content, or the next person to touch this file will helpfully animate it.

---

## Scene 15 — What We Stand For

**Reference:** Ada — https://mobbin.com/sites/sections/4cd5f15a-ff1c-413b-ae5b-f332c13e3fb5

- **Take:** Zero gutters. Ada butts three numbered statement panels edge to edge so that six inches of separate claims read as ONE continuous object rather than three cards, with the ordinal pinned hard to one corner and the sentence pinned to the opposite one. That abutment is the whole mechanic I want: the moment gaps go to zero, a list stops being a list and becomes a slab. Ada also proves that numbered blocks need no icon, no illustration and no photograph to hold a viewport, which is exactly the constraint this scene is under.
- **Leave:** The saturated colour fills (green/ochre/aubergine). Every panel in Ada is a large solid field, and this site forbids both a large accent fill and any background choice at all, since the ground is dictated by the light arc. Also leave the equal panel widths and the centred sans headline. My version has no fills whatsoever: the divisions are made by 1px hairlines with the scene's own ground showing through, so the light arc passes straight through the composition.

**Why it differs from every other scene:** It is the only scene on the site that is a single mechanical object rather than a picture or a passage: six parts that visibly close on each other and seal, with the accent used once as a structural spine instead of a highlight, and it is the only scene whose column widths are derived from the character count of the sentences it holds.

### Layout
A type-only scene. No photograph, therefore NO plate number in the furniture (the plate rule applies only where a photograph appears), and I am not faking operational imagery that does not exist. The composition is one horizontal laminate of six strata, not a 3x2 grid and not a card set.

AT 1440: section padding 132px top, 148px bottom. Page margins 140px, so the content column is 1160px. Furniture on one line at the very top of the content column: "15 / 17" flush left, "10:52" flush right, both Archivo 500 / 11px / 0.1em / uppercase / #12141A. 36px below it the site kicker "WHAT WE STAND FOR", same Archivo 11px spec. 72px of air, then the block.

The block is 1160 x 576px: six strata, each exactly 96px tall, stacked flush with no gutters. Every stratum is an internal three-column grid: [ordinal 56px] [value name 320px] [promise 784px] = 1160. All three items sit on ONE shared baseline, 58px down from that stratum's top edge, so across the six strata you get three hard vertical alignments and six even baselines 96px apart. Each stratum carries a 1px top hairline in #12141A at 22% alpha; row six additionally carries a 1px bottom hairline at 40%. There is NO outer box, no left or right border, no cell fill, no zebra. An open-sided ruled field reads as a printed manifest, which is the native document of freight; a closed box would read as a UI table.

The 784px promise measure is not arbitrary. It is set so that the longest promise, RESPECT at 62 characters, sets on exactly ONE line at Newsreader 300 / 27px (approx. 766px of advance, 18px clear). Consequently all six promises set on one line each, six single lines, perfectly even. Likewise the 320px name column is sized off the longest name, ACCOUNTABILITY, which at 28px uppercase with 0.08em tracking measures approx. 290px and leaves 30px clear. The architecture is derived from the words, which is why it can never look like a template grid.

Cutting vertically through all six strata at x = 376px from the block's left edge (the seam where the names end and the promises begin) is a single 3px #D6A145 rule running the full 576px. That is the only accent in the scene: 1,728 square pixels. It lands on the seam between what a value is called and what it actually costs.

The closing line sits 88px below the block, left-aligned to x = 376px so it hangs in the same optical column as the six promises. Measure 784px, set on two lines with an explicit break after "written.".

AT 375: page margin 24px, block 327px. Furniture is the same 11px Archivo line, "15 / 17" and "10:52" space-between. The three-column stratum cannot survive, so each stratum becomes two lines: line A is the ordinal and the value name on one baseline (ordinal 32px slot, name follows), line B is the promise on a 327px measure at 19px/28px, which wraps to 2 lines for five of the six and 3 lines for RESPECT. Row heights are therefore 108px x5 and 136px x1, total block 676px. The unevenness is honest, not a bug. The gold rule cannot sit at a column seam because there is no column seam, so on mobile it moves to x = 0, the block's left edge, 3px wide by 676px tall, and becomes a spine binding the six.

### Motion
The motion means the closing sentence. Six things that are written separately become one thing that is lived together, so the six strata physically CLOSE on each other and the gaps go to zero.

DEFAULT STATE IN CSS IS THE FINISHED COMPOSITION. Every stratum's resting style is transform: none, opacity: 1. The keyframes run FROM a displaced position TO that resting style. If the observer never fires, if JS is stripped, if a keyframe stalls, the reader sees the completed, sealed, fully readable laminate. Nothing in this scene has an invisible or absent start state.

TRIGGER: one IntersectionObserver on the block, threshold 0, rootMargin "0px 0px -22% 0px", so it fires when the block's top edge crosses 78% of viewport height. It adds .is-settled once and disconnects. All animation declarations live inside .is-settled.

SETTLE (desktop): six strata start displaced away from the centre seam and travel inward on translateY only.
  row 1 from translateY(-72px), row 2 -48px, row 3 -24px, row 4 +24px, row 5 +48px, row 6 +72px, all to translateY(0).
That start state is not a hidden state: it is the same six strata, fully legible, with 24px of ground visible between every pair and the whole stack 120px taller. Duration 720ms, cubic-bezier(0.16, 1, 0.3, 1), animation-fill-mode backwards.
STAGGER, outside inward: rows 1 and 6 at 0ms, rows 2 and 5 at 100ms, rows 3 and 4 at 200ms. The last event on the page is the centre seam closing at 920ms. The composition finishes at its middle, not at its edge.

Nothing enters from off-screen. Nothing fades. Maximum travel is 72px. It reads as a press seating parts, not as a list sliding in.

SEAL: the gold rule then draws top to bottom. transform-origin 50% 0, scaleY(0) to scaleY(1), 900ms, cubic-bezier(0.33, 1, 0.68, 1), delay 980ms. Base style is scaleY(1).

CLOSING LINE: translateY(16px) to 0, 640ms, cubic-bezier(0.16, 1, 0.3, 1), delay 1240ms. Opacity is never touched.

MOBILE: identical structure, reduced travel. Row 1 -36px, row 2 -24px, row 3 -12px, row 4 +12px, row 5 +24px, row 6 +36px. Same staggers, same easings, gold spine draws at the same 980ms.

Transform only, throughout. No width, height, top, left, margin or gap is ever animated; the gaps close because the boxes move, not because a gap property shrinks.

### Interaction
Deliberately close to nothing, and the stillness is the point: this is the scene where the site stops performing and states its terms. There is exactly one pointer affordance and one keyboard affordance, and neither carries information.

HOVER: hovering a stratum takes its own top hairline from #12141A at 22% alpha to #12141A at 100%, 160ms ease-out, no movement, no fill, no scale. It marks which line you are on and nothing more. It is explicitly NOT gold, because gold measures 1.44:1 against this ground and a gold hairline would be less visible than the state it replaced.

KEYBOARD: the six strata are an ordered list of <li> elements with no tabindex, because none of them does anything. The closing line and the section are reached in normal reading order. Any focusable furniture uses a 2px #12141A outline at 4px offset, 11.5:1.

TOUCH: nothing is lost. Hover conveys no content, so there is no hover-only information to strand on a phone.

No parallax the reader steers, no drag, no click-to-expand. Six promises that need a click to be read are six promises the company is hiding.

### Typography
Newsreader is Mark's voice and it carries every word he wrote, including the six value names, which are his. Archivo carries only the machinery: scene number, time stamp, kicker, ordinals. Nothing is ever mixed inside a single phrase.

VALUE NAMES (INTEGRITY, SAFETY, COMMUNICATION, RESPECT, EXCELLENCE, ACCOUNTABILITY): Newsreader 500, 28px, uppercase, 0.08em tracking, font-variation-settings 'opsz' 28, #12141A. Uppercase Newsreader at this optical size reads as inscription rather than as a UI label, which is the register the scene needs. Mobile 19px, same weight and tracking.

THE SIX PROMISES ("We do the right thing, even when no one is watching." and the other five): Newsreader 300, 27px, line-height 1.0 because each sets on exactly one line by construction, 'opsz' 27, #12141A. The light weight against the 500 of the name is the only differentiation used inside a stratum: no colour change, no size drop, no grey. Mobile 19px / 28px, wrapping to 2 lines (3 for RESPECT).

CLOSING LINE: Newsreader 300, 40px / 54px, 'opsz' 40, #12141A, on a 784px measure, broken as two lines. "Values don't matter because they're written." on line one at weight 300; "They matter because they're lived." on line two at Newsreader 500. The weight steps up on the clause that matters. Contrast is untouched, so both clauses hold 11.5:1. Mobile 26px / 36px on a 327px measure.

ORDINALS 01 through 06: Archivo 500, 11px, 0.1em tracking, uppercase, #12141A, baseline-aligned with the name and promise on the same stratum.

FURNITURE, "15 / 17" and "10:52" and the kicker "WHAT WE STAND FOR": Archivo 500, 11px, 0.1em, uppercase, #12141A. Same place, same size as all sixteen sibling scenes. No plate number, because there is no photograph.

Every serif optical-size axis is set to match its rendered px size rather than left at default, so the 40px closing line and the 27px promises get correctly different letterform contrast.

### Contrast
Ground #c5cdd8, relative luminance 0.6012.

#12141A, luminance 0.00654, ratio (0.6512 / 0.05654) = 11.52:1. This is the colour of EVERY glyph in the scene without exception: value names, the six promises, the closing line, the ordinals, the scene number, the time stamp, the kicker. Passes AAA for both normal and large text with enormous headroom, including the 11px Archivo furniture which needs only 4.5:1.

#D6A145, luminance 0.4022, ratio against this ground = 1.44:1. FAILS everything, so gold carries zero text and zero glyphs in this scene. It exists solely as the 3px non-informational spine rule. Removing that rule entirely would cost the composition nothing a reader needs, which is the test I applied before allowing it at 1.44:1.

Hairlines: #12141A at 22% alpha composites to approximately #a2aab5 on this ground, about 1.5:1. These are structural rules, not boundaries a reader must perceive to use the scene, and the layout is fully legible with all of them removed (the six baselines are 96px apart and self-evident). The hover state raises the relevant hairline to full #12141A at 11.5:1, so the one hairline that ever changes state changes it visibly.

No scrim is used anywhere, because there is no photograph and no video underneath any text. Every ratio above is measured against the scene's literal ground colour, not against black or white.

### Reduced motion
Under prefers-reduced-motion: reduce, the block renders in its finished state at first paint and never moves. This is not a fallback that had to be authored: the resting CSS already IS the sealed laminate, so the media query simply sets animation: none on the six strata, the gold rule and the closing line.

The reader gets: all six strata flush at 96px each with zero gaps, all six hairlines drawn, the gold spine at full scaleY(1) height, the closing line in position, all type at full opacity and full 11.5:1 contrast. Identical pixels to the end state of the animated version. Nothing is summarised, nothing is stacked differently, nothing is omitted, and no information is trapped in a transition. Hover still darkens a hairline; that is a 160ms colour change with no movement, so it is retained rather than disabled.

### Assets


### Risk
The most likely failure is that a ruled six-row block reads as a spreadsheet, which is precisely the "PowerPoint" charge the client is worried about. Mitigations, all load-bearing: no cell fills, no zebra striping, no outer box and no left or right border (an open-sided ruled field is a printed page, a closed one is a table widget); hairlines at 22% alpha rather than solid; 96px strata with a 58px baseline offset, which is roughly triple the row height any data table would use; and the promise type set at Newsreader 300 / 27px, far larger than a table would ever set. If it still reads as a table in build review, the fix is to delete the five interior hairlines and keep only the top and bottom rules, letting the 96px rhythm carry the structure on its own.

The second risk is the gold. At 1.44:1 against #c5cdd8, #D6A145 is nearly tonal here and a 1px gold line would simply look muddy and cheap, like a rendering artefact. That is why the spine is 3px rather than 1px, why it runs a full 576px so it is read as a deliberate architectural mark rather than a stray stroke, and why it is placed to cross all six horizontal hairlines, so it also reads by its six intersections. It is never asked to carry meaning a reader could miss. If it still looks weak on a calibrated screen, remove it entirely rather than darkening it or adding a shadow: the scene is complete without it, and a muddied brand gold is worse than no brand gold.

The third risk is the settle reading as generic "items slide in on scroll". The defences are that nothing enters from off-screen, nothing fades, travel maxes at 72px, and the sequence resolves inward to the centre seam rather than outward or top-to-bottom. If it still feels like a template, cut the travel to 40px and the duration to 560ms before touching anything else.

---

## Scene 16 — The Road Ahead

**Reference:** V7 — https://mobbin.com/sites/sections/a5b3c6c0-dd04-4ca2-b06b-4ee1c673c2a5

- **Take:** V7 draws its history as a literal measuring instrument, not a list: a dense comb of thin vertical ticks running edge to edge, most of them neutral and unlabelled, only three or four picked out in accent colour, with the dated stations set in serif underneath and the endpoints ('2023', '2024') labelled in small caps at the extremes. The mechanic worth stealing is that the EMPTY ticks are the majority and are left visible. A conventional timeline draws only the events, which silently implies the story is full. A ruler draws every graduation whether or not anything happened there, so absence becomes something you can literally count. That is the exact instrument this scene needs: KUL has one tractor and wants fifty, and a ruler is the only form that can state that without either boasting or apologising.
- **Leave:** V7's rule is a horizontal carousel with prev/next arrow buttons, so it hides most of itself off-screen and asks you to page through. Wrong here: the whole point is that all fifty graduations must be visible simultaneously and un-scrollable, so the emptiness cannot be paged away from. Also drop V7's colour-coded event ticks (orange, red, mixed) which read as a product changelog, and drop the horizontal drag entirely. The rule in this scene never moves, ever.

**Why it differs from every other scene:** This is the only scene on the site that renders an instrument rather than a picture, and the only one where the reader's scroll buys almost nothing: three full screens of effort move the master marker twenty-six pixels. Every other scene rewards scrolling with arrival; scene 16 shows the same movement at two magnifications at once so the reader feels how large the effort is and how small the progress looks, which is the honest condition of a one-truck carrier aiming at fifty.

### Layout
DESKTOP 1440x900. 12 columns, 72px outer margins, 24px gutters, column = 86px. Everything is left-aligned to x=72 except where noted; the scene reads as an instrument sheet, not a page.

FURNITURE (static, present at all times, never animated): "SC. 16" at x=72 y=48. Time stamp "10:40" right-aligned to x=1368, y=48. "PL. 24" sits under the photograph in Block D, not in the header. All Inter 11px / 0.1em / uppercase / #12141A.

BLOCK A, the opening triad. Top pad 140px.
  L1 "Every road leads somewhere." x=72, Newsreader 300, opsz 60, 64px/1.12, tracking -0.015em.
  L2 "Some journeys last a few miles." x=182 (col 2), Newsreader 300, opsz 44, 44px/1.20. 28px below L1.
  L3 "Others shape an entire lifetime." x=182, Newsreader 44px/1.20; "Others shape" at weight 300, "an entire lifetime." at weight 500. 12px below L2.
  Bottom pad 160px.

BLOCK B, THE INSTRUMENT. Section is 460vh tall; inner container is position:sticky, top:0, height:100vh, overflow:hidden, giving 320vh of pinned scroll after entry and exit.
  MASTER RULE: 1px horizontal line, x=72 to x=1368 (1296px), at y=30vh. Colour #12141A at 34% (=#999DA2, 2.11:1, decorative).
  THE COMB: exactly 50 ticks hanging below it, one per tractor. Interval 1296/49 = 26.45px; render the whole comb as one inline SVG with shape-rendering="crispEdges" and each tick x rounded to the nearest integer so nothing aliases into mush.
    Tick 01 (x=72): 2px wide, 28px tall, SOLID #A05C08. In service.
    Tick 02 (x=98): 2px wide, 28px tall, OUTLINED only, 1px stroke #A05C08, hollow interior. Next, not yet.
    Ticks 03-50: 1px wide, 12px tall, #12141A at 32%. Majors at 10/20/30/40/50 are 18px tall at #12141A 55% (=#6E7177, 4.0:1).
    Numerals below, Inter 11px 0.1em: "01" at x=72 in #12141A; "02" at x=98 in #5A6068 with "NEXT" set beneath it at 11px #5A6068; "50" right-aligned to x=1368 in #12141A.
    Endpoint captions, Inter 11px 0.1em uppercase, 20px below the numerals: left "IN SERVICE TODAY" at x=72; right "TARGET, END OF 2029" right-aligned to x=1368.
  DETAIL CALLOUT (technical-drawing convention). Two 1px diagonal hairlines at #12141A 22% run from (72, 30vh+34) to (72, 58vh) and from (98, 30vh+34) to (1368, 58vh), forming a trapezoid that enlarges the single interval between tractor 01 and tractor 02 to the full page width.
  DETAIL RULE: 1px, x=72 to x=1368, at y=58vh, #12141A 40%. Left cap 2px x 20px solid #A05C08; right cap 2px x 20px outlined #A05C08 1px, hollow. Three station ticks, 1px x 14px #12141A 40%, at x=504, x=936, x=1368.
  STATIONS, Newsreader 400, opsz 22, 22px/1.35, #12141A, baseline at 58vh+52px:
    x=504 "One shipment at a time."
    x=936 "One relationship at a time."
    right-aligned to x=1368 "One promise kept at a time."
  Each station has a 1px x 180px underline in #A05C08, 10px below its baseline, transform-origin left.
  READ HEADS: master head is a 2px x 56px #A05C08 bar rising ABOVE the master rule (the comb hangs below, so they never collide) with a 5x5px square cap on top. Detail head is 2px x 44px #A05C08 rising above the detail rule.

BLOCK C, the calibration. 180px below the pin release.
  "KUL Enterprises is still writing its story." x=72, Newsreader 300, opsz 40, 40px/1.20.
  56px below it: a 1px rule x=72 to x=1368 at #12141A 34%, with five 1px x 14px ticks hanging at x=72, 396, 720, 1044, 1368. Under each, Inter 11px / 0.1em / uppercase / #12141A: INTEGRITY, CHARACTER, SAFETY, SERVICE, TRUST (the last right-aligned to x=1368). The five values are printed as the units the instrument is graduated in.

BLOCK D, the plate. 200px below Block C.
  s16-valley-from-height.webp cropped 16:9 to 480x270, right-aligned so its right edge lands on x=1368 (left edge x=888). "PL. 24" in Inter 11px 0.1em at x=888, 14px below the image.
  To its left at x=72: the tagline, Archivo 500, 14px, 0.14em tracking, uppercase, line-height 2.0, #12141A, on three lines: STRENGTH IN MOTION. / BUILT ON INTEGRITY. / DRIVEN BY SAFETY.

BLOCK E, the lesson. 200px below Block D. Set at x=468 (col 6) to x=1368, breaking the scene's left alignment for the only time, so the eye exits to the right where scene 17 begins. Newsreader, opsz 48, 48px/1.24, max-width 820px. "The journey never really ends." weight 300; "It simply becomes someone else's beginning." weight 500. Bottom pad 220px.

MOBILE 375. Margins 24px. Furniture unchanged at 11px, x=24 / right-aligned x=351.
  Block A: L1 34px/1.15, L2 and L3 24px/1.25 indented 20px, all x=24.
  Block B: the master rule goes FULL BLEED, x=0 to x=375, deliberately touching both screen edges because it does not comfortably fit, and that is true. Interval 7.65px; ticks 1px x 8px, majors 1px x 14px, tick 01 2px x 20px solid gold at x=0, tick 02 outlined at x=8. Only "01" and "50" numerals survive; endpoint captions stack to two lines each at 10px. Detail rule x=24 to x=351 at y=62vh. The three stations no longer sit at their x positions; they stack left at x=24, Newsreader 20px/1.35, 20px apart, each keeping its 140px gold underline. Pin shortens to 260vh.
  Block C: rule x=24 to x=351 with five ticks; the five words become one Inter 11px 0.1em line below it, "INTEGRITY · CHARACTER · SAFETY · SERVICE · TRUST", middot separators (never an em dash), wrapping to two lines.
  Block D: photo full bleed 375x211, tagline below it at x=24, 13px/2.0.
  Block E: x=24 to x=351, 30px/1.28, no indent.

### Motion
The meaning to encode: this company advances one kept promise at a time, and against the scale of the goal that advance is almost invisible, but at the scale of the man doing it, it is the whole screen. So the scene shows one movement at two magnifications simultaneously.

THE SCRUB. One rAF-throttled scroll handler reads the sticky section's getBoundingClientRect and writes exactly one CSS custom property, --p (0 to 1, clamped), onto the sticky container. Every moving part derives from --p in CSS. Nothing else listens to scroll. Only transform and opacity are ever touched.

Master head x = 72 + 26.45 * p, i.e. it crawls 26 PIXELS across the entire 320vh of pinned scroll, and lands exactly on tick 02.
Detail head x = 72 + 1296 * f(p), where f is the stepped ramp below, i.e. it crosses 1296 pixels over the same scroll.
Both are transform: translate3d(calc(var(--x) * 1px), 0, 0) on a will-change:transform layer.

f(p), the stepped ramp. The head moves at constant rate between stations and holds at each one, because a truck at 62mph is linear and a milestone is a stop:
  p 0.00-0.10  f = 0.      Dead hold. Nothing moves at all. The instrument simply exists for a full screen of scroll. This beat is not filler; the stillness is the argument.
  p 0.10-0.34  f 0 -> 0.333, linear.
  p 0.34-0.40  f = 0.333.  Hold at station 1.
  p 0.40-0.62  f 0.333 -> 0.667, linear.
  p 0.62-0.68  f = 0.667.  Hold at station 2.
  p 0.68-0.90  f 0.667 -> 1.0, linear.
  p 0.90-1.00  f = 1.0.    Final hold on the hollow endpoint.
Implement f as a single clamped piecewise expression in JS writing --f; do not use a spring or an easing library. The linearity is the point.

STATION UNDERLINES. When the detail head's x passes a station's x, that station's 1px gold underline runs transform: scaleX(0) -> scaleX(1), transform-origin left, 420ms cubic-bezier(0.22, 0.61, 0.36, 1). Fires once, never reverses on scroll-up (the promise stays kept). Three underlines, three moments, spaced roughly 0.28 of the pin apart, so at 320vh that is a deliberate several-second gap between them. The reader is meant to feel the distance between one kept promise and the next.

TICK 02. At p >= 0.92 the outlined tick 02 on the master rule and the outlined right cap on the detail rule both raise their stroke opacity from 0.55 to 1 over 260ms ease-out. They NEVER fill. The scene ends on an empty shape, because the second tractor does not exist yet.

ENTRANCES. Blocks A, C, D, E use one CSS keyframe only: @keyframes k-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }, 700ms cubic-bezier(0.22, 0.61, 0.36, 1), applied by an IntersectionObserver adding .is-in. The elements are opacity 1 and untransformed in their base CSS; the observer's only job is to replay them. If the observer never fires, or JS is dead, every word in this scene is already on screen at full strength. Block A staggers 0 / 120 / 240ms.

THE ONE PIECE OF JS-DRIVEN HIDING, done safely: the three station underlines default to scaleX(1) in CSS. The scrub handler sets data-scrubbing="true" on the sticky container inside its FIRST successful rAF write, and only the rule [data-scrubbing="true"] .station-underline { transform: scaleX(0) } collapses them. So the underlines can only be hidden by code that has already proven it is running and can therefore also reveal them. No element in this scene has an animation as its only route to being visible.

NO PARALLAX ANYWHERE. The photograph does not drift, the rule does not drift, the background does not drift. In a scene whose subject is measurement, anything that floats is a lie.

### Interaction
Pointer hover on the comb, and it is the emotional payload of the scene. The 50 ticks are one SVG; a single pointermove listener on the SVG maps clientX to the nearest tick index (index = round((x - 72) / 26.45), clamped 0-49) and positions a small label 34px above the master rule, snapped to that tick's x, Inter 11px / 0.1em / uppercase / #12141A on a 4px-padded #dee3e8 ground so it stays at 14.08:1 over the rule beneath it. Content is arithmetic, never a claim:
  tick 01 -> "TRACTOR 01 / IN SERVICE"
  tick 02 -> "TRACTOR 02 / NEXT"
  ticks 03-50 -> "TRACTOR 07 / NOT YET" (number substituted, zero-padded)
The hovered tick raises to #12141A at 70% for its duration, 120ms. Label appears with opacity only, 120ms, and follows the pointer by snapping tick to tick, not by tracking continuously, so it feels like an instrument detent rather than a tooltip.

Hovering is what makes the reader count the empty ones themselves. Forty-eight of the fifty answer "NOT YET". Nobody has to write that sentence.

KEYBOARD AND AT. The hover label is decorative and pointer-only: aria-hidden, and the SVG carries pointer-events only on a desktop pointer:fine media query, so touch devices get no phantom hover state. There are NOT 50 tab stops. The instrument is one focusable element, tabindex="0", role="img", with aria-label: "Fleet measure. One tractor in service today. The target is fifty tractors by the end of 2029. Forty-nine of the fifty marks on this rule are empty." On focus it takes a 2px #12141A outline at 4px offset around the whole comb. The three station lines and every caption are real text in the DOM and are read in source order regardless.

Nothing in this scene is click-through, expandable, or a control. There is no button. The reader looks, counts, and moves on.

### Typography
Strict separation, no exceptions in this scene.

NEWSREADER carries only Mark's own writing, four places: the opening triad (Block A, 64px weight 300 / 44px weight 300 / 44px mixed 300 and 500), the three station lines on the detail rule (22px weight 400, opsz 22), the still-writing line in Block C (40px weight 300, opsz 40), and the lesson in Block E (48px, opsz 48, first sentence weight 300, second weight 500). Optical size axis is set to match the rendered px in every case, which is the whole reason this face was chosen; at 64px it should be set opsz 60 so the thins genuinely thin out, and at 22px opsz 22 so the stations stay sturdy under a 1px gold rule. Tracking -0.015em at 64px, -0.01em at 44-48px, 0 at 22px and below.

ARCHIVO / INTER carries everything the institution says, and in this scene the institution says a lot because the institution is an instrument: the scene number, the time stamp, "PL. 24", the numerals 01 / 02 / 50, "NEXT", "IN SERVICE TODAY", "TARGET, END OF 2029", the five value words, the hover labels. All of these are Inter 11px / 0.1em / uppercase, matching the site's archival furniture spec exactly, so the instrument's own annotations are typographically indistinguishable from the plate numbers and scene stamps. That is deliberate. The ruler is the site talking, not Mark.

The single Archivo departure is the tagline in Block D: Archivo 500, 14px, 0.14em, uppercase, line-height 2.0, three lines. It is the one piece of institutional copy allowed above 11px, because it is the company's formal signature and needs to sit as a block against the 480px photograph without shrinking into a caption. It is still unmistakably the site's voice, not Mark's.

Emphasis anywhere in this scene is carried by WEIGHT, never by colour, size jump, italic, or gold. Gold is not a typographic material here at all.

No em dashes appear in any string in this scene. The mobile value list uses middot separators.

### Contrast
Ground #dee3e8, relative luminance 0.7629.

TEXT, all of it:
  #12141A on #dee3e8 = 14.08:1. Carries every Newsreader line, every Inter label, the numerals 01 and 50, the five value words, the tagline, the hover labels, the furniture. Passes AAA at every size used.
  #5A6068 on #dee3e8 = 4.91:1. Used only for the "02" numeral and the word "NEXT", both 11px. Passes AA for small text.
  There is no third text colour in this scene.

GOLD, and this is the important correction. The brief names the brand gold as #D6A145, but #D6A145 on #dee3e8 is 1.80:1, which is below the 3:1 minimum for meaningful non-text graphics and would look washed out and weak on this near-daylight ground. The codebase has already resolved this into a two-value system: --color-gold-lit #d6a145 for dark grounds and --color-gold #a05c08 for light. Scene 16 sits at the bright end of the light arc, so every gold mark here uses #A05C08, which is 4.03:1 on #dee3e8. Same brand gold, value-corrected for a light ground, exactly as the rest of the site already does it. It is used at 2px stroke maximum, on tick 01, the outline of tick 02, the two read heads, the two detail-rule caps, and the three 1px station underlines. Total gold ink on screen is under 900 square pixels. It is never a fill, never a background, and never text.

HAIRLINES, all decorative and all redundantly explained by adjacent 14.08:1 text:
  master rule and Block C rule, #12141A at 34% = #999DA2 = 2.11:1
  minor comb ticks, #12141A at 32% = 2.2:1
  major comb ticks at 10/20/30/40/50, #12141A at 55% = #6E7177 = 4.0:1
  callout diagonals, #12141A at 22% = 2.0:1
No meaning in this scene is carried by colour or by contrast alone. Every gold mark has an Inter label at 14.08:1 or 4.91:1 sitting directly beneath it saying the same thing in words, and the whole instrument is restated in the aria-label. A reader with no colour perception at all still gets "01 IN SERVICE", "02 NEXT", "50 TARGET, END OF 2029".

Focus ring: 2px #12141A at 4px offset, 14.08:1.

### Reduced motion
Under prefers-reduced-motion: reduce the scene is not degraded, it is simply finished. Everything is present, at full contrast, in its end state.

The section height collapses from 460vh to auto and the sticky container becomes position: static, height: auto with 120px of internal padding. There is no pin, so there is no scrub, so the scroll handler is never attached at all (guard the addEventListener behind the media query, do not just no-op inside it). --p is never written and data-scrubbing is never set.

The instrument renders complete: master rule with all 50 graduations, tick 01 solid #A05C08, tick 02 outlined #A05C08 at full stroke opacity, all numerals and endpoint captions present. The callout diagonals and the detail rule render exactly as in the animated version. The detail read head is parked at the right end of the detail rule, on the hollow cap, which is where the motion would have left it. All three station underlines are at scaleX(1), which is their CSS default, so no code has to run for them to be there. The master read head is parked on tick 02.

Crucially the truth of the scene survives intact: tick 02 is still hollow, "NEXT" is still printed under it, and "TARGET, END OF 2029" is still the right-hand endpoint. A reduced-motion reader is told exactly the same thing, that one tractor exists and forty-nine marks are empty. Nothing about the arithmetic depended on the animation.

Blocks A, C, D, E drop the k-rise animation entirely (they are opacity 1, untransformed by default, so this is a no-op) and the IntersectionObserver is not attached.

Hover retains its 120ms opacity transition on the label only, which is a state change rather than motion, and the tick-to-tick snap is instant. If that is still unwanted, the label can be made instant with transition: none under the same query at no cost to comprehension.

### Assets
- s16-valley-from-height.webp

### Risk
The likeliest failure is that a reader, or the client, sees fifty tick marks with one filled and reads it as the site confessing weakness, or worse, as a progress bar at 2 percent. A progress bar is a promise; this must read as a survey mark.

Four mitigations, all already in the layout. First, the endpoint is labelled "TARGET, END OF 2029", never a bare year and never "goal" phrased as inevitability, so the empty span is explicitly the future and not a shortfall. Second, tick 02 is hollow rather than filled, so the scene ends on an outline and never asserts a truck that does not exist. Third, the three stations name what actually closes the gap in Mark's own words, one shipment, one relationship, one promise kept, so the empty rule has a stated method underneath it rather than just a wish. Fourth, the five values are printed as the ruler's units in Block C, which reframes the whole instrument: the thing being measured is not fleet size, it is conduct, and by that measure the rule is already full.

The second risk is craft. At 26.45px spacing, 1px ticks on a DPR-1 display will half-pixel and turn into a grey smear, which would look like a cheap CSS repeating-linear-gradient rather than a drawn instrument. Mitigation is mandatory: render the comb as one inline SVG with shape-rendering="crispEdges" and integer-rounded x values, not as fifty divs and never as a gradient. Verify at 1280, 1440 and 1728 and on a DPR-1 external monitor, not only on a retina laptop, because the failure is invisible at DPR 2.

Third risk, smaller: 320vh of pin with a 0.10 dead hold at the top can read as a broken scroll on a trackpad. The hover interaction is the insurance, since anything the pointer touches responds instantly and proves the page is alive, but the hold should be checked on a real trackpad and dropped to 0.06 if it reads as a hang rather than a beat.

---

## Scene 17 — The Next Journey

**Reference:** Waka Waka — https://mobbin.com/sites/sections/fe089d5d-5adb-4849-a282-ae46d8fd7eac

- **Take:** The catalogue-raisonné index: a hard-left catalogue number column (N°0001) locking a five-column record row, generous ~44px row rhythm so the table breathes instead of tabulating, hairline row separators at very low opacity, and above it a persistent three-part header rail (identity hard left / section name centred / live status hard right). It proves an index can be the finished artwork of a page rather than its footer. The right-hand status slot in that rail is where my plate counter goes.
- **Leave:** Its warm cream ground and its serif product names (my ground is fixed by the light arc at #eff1f3 and every word in the table is Archivo, because the table is the institution speaking, not Mark). Its rows are inert display; mine must be real links back into the film. Its rail clock is decoration; mine counts something the reader is actually doing. And its index IS the whole page, where mine is the last movement of a seventeen-scene documentary and must arrive as a resolution, not an opening.

**Why it differs from every other scene:** It is the only scene in which scrolling reveals but never transforms, and the only one where all 26 photographs appear as lines of type instead of images: the film stops and becomes a document.

### Layout
GOVERNING IDEA: a manuscript margin. Every Archivo word the SITE says lives in the left margin (x=72-312). Every Newsreader word MARK says lives in the measure (x=336+). The man speaks in the column, the institution annotates in the margin. This single rule generates the whole scene and is the typographic form of the brief's man-versus-institution distinction.

AT 1440 (12 col, 72px outer margin, 1296 content, 24px gutter):
Furniture, at scene top, y=40px from scene edge: "SCENE 17 OF 17" at x=72, "09:12" right-aligned at x=1368. Both 11px Archivo 500, 0.1em, uppercase, #4A5058. The "OF 17" total is revealed only here; every other scene shows its number alone. No PL. NN in the furniture, because no photograph appears in this scene. The scene with no plate is the scene that lists all twenty-six plates.

Scene top padding 18vh, then:
[A] SUMMATION. Measure left edge x=336, width 760. Four separate blocks, 28px apart, broken only at Mark's own full stops: "Every mile I've traveled." / "Every lesson I've learned." / "Every promise I've chosen to keep." / "Has led to this moment." A 40px x 1px gold rule sits in the margin at x=272 on the last line's cap-height. Then 26vh.
[B] THE TURN. Same x=336 rail, measure 700. Two lines, 18px apart. A 24px x 1px hairline (#12141A/20) sits at x=296 on the second line's baseline, citing it as the correction. Then 22vh.
[C] THE SILENCE. Exactly 40vh of untouched ground. At its vertical centre, in the margin at x=72, one word: "SILENCE" (11px Archivo, 0.1em, uc, #4A5058). The site names what the man is doing. Then the thesis, x=336, measure 900, two lines: "Trust isn't given." / "It's earned." Then 24vh.
[D] THE CADENCE. Three blocks, 20px apart, at x=336: "One mile." / "One decision." / "One relationship at a time." Beside each, in the margin at x=72, an Archivo numeral: 01, 02, 03. The site has started counting his sentences 200px before the plate index begins. That is the hinge of the scene. Then 18vh.
[E] THE TWO DOORS. A row from x=336 to x=1368, split into two 480px halves by a 1px vertical hairline (#12141A/12) at x=852. Left: "Request a rate" with "/QUOTE" 10px beneath. Right: "What we haul" with "/SERVICES" beneath. In the margin at x=72, aligned to the row's top: "CONTINUE". Then 20vh.
[F] THE PLATE INDEX. Full 1296 width, breaking the margin rule once, deliberately: the archive is bigger than either voice. Sticky rail, 56px tall, top:0, ground-coloured, 1px bottom hairline: "PLATE INDEX" left / "THE JOURNEY, 2026" centred / "PLATES 00 / 26" right, tabular-nums. Column-head row 32px tall: PLATE / SUBJECT / PLACE / SCENE / FILE. Then 26 rows at 44px each. Columns: 96 / 460 / 320 / 100 / 280, gaps 10px, totalling 1296. Col 1 "PL. 01"…"PL. 26" tabular; col 2 subject in sentence case ("Two children, frangipani bush"); col 3 place and date; col 4 "SC. 02" right-aligned; col 5 the bare filename, right-aligned, ligatures off. Row order is the order of the light, matching the film: s02-jamaica-childhood, s02b-caribbean-water, gal-alpine-lake, gal-river-rocks, gal-waterfall-figure, s12c-night-highway, s12-predawn-peaks, s12b-predawn-peaks-alt, s11-sunrise-band, s11b-sunrise-cloud, s05-sunrise-horizon, s04-dawn-road-mist, s13-first-daylight, s07-pines-road, s06-wide-horizon, hero-two-lane-centred, hero-sage-plain, s08-desert-bend, s08b-rockcut-bend, s09-interstate-traffic, s09b-elevated-traffic, s10-endless-road, s14-confident-highway, hero-open-road-blue, s16-valley-from-height, s17-road-to-horizon. Then a 3-row addendum in the same grid, col 1 reading A / B / C, all #4A5058: "Two portraits, September 2021, stage lighting" / "Three job sites, 2021 to 2022" / "One field note, video with sound, click to play". Then 48px, then the colophon at x=336, measure 620, with "COLOPHON" in the margin at x=72 on its first baseline. Then 22vh.
[G] THE SIGN-OFF. x=336, measure 900, one line: "Thank you for taking this journey with us." In the margin at x=72 on its baseline: "END". Then 24vh of empty daylight and nothing else. The last thing on the page is ground.

AT 375 (20px margin, 335 measure): the manuscript margin does not survive, so it inverts honestly instead of being crushed. Every Archivo label moves from the left margin to directly above its Newsreader block, 12px gap, same 11px/0.1em/uc. Measure is full width. Silence void shrinks to 28vh, still labelled. Cadence numerals 01/02/03 move inline, 12px before each line, baseline-aligned. Doors stack, 24px apart, divider becomes a horizontal hairline. The index becomes 26 stacked records, never a scrolling table: line 1 is a space-between flex row of "PL. 01" and "SC. 02"; line 2 the subject at 14px; line 3 place and filename at 11px separated by a middot. Record height auto, ~62px, 12px vertical padding, 1px bottom hairline. The sticky rail drops its centre item and keeps "PLATE INDEX" left, "00 / 26" right. Nothing on this page scrolls horizontally, because nothing in this scene is wider than the column it lives in.

### Motion
THE ARGUMENT: after sixteen scenes of parallax, pinning, scrub and drift, this is the only scene where scrolling REVEALS but never TRANSFORMS. Nothing here is tied to scroll progress. Every element arrives once, settles 14px downward into place, and is then permanently still. The stillness is the resolution. Exactly one thing in the scene keeps moving, and it is a number.

Implementation pattern for every entrance, non-negotiable: the resting state is what is written in CSS. Elements render at opacity 1, translateY 0. An IntersectionObserver adds a `.settle` class whose keyframe runs FROM the offset state TO the resting state, with `animation-fill-mode: none`. If JS never runs, if the observer never fires, if the tab is throttled, every word is simply already there. There is no invisible start state anywhere in this scene.

[A] Each of the four sentences settles on its OWN trigger, when its own top edge crosses 78vh: opacity 0 to 1, translateY 14px to 0, 620ms, cubic-bezier(0.22,0.61,0.36,1). No time-based stagger. The reader's hand sets the pace, so the four read as a man recalling them one at a time rather than as a queue playing out. The gold rule beside "Has led to this moment." draws with transform: scaleX(0) to scaleX(1), transform-origin left, 520ms, same easing, 200ms after that line settles.
[B] One observer for the pair, so they read as a single thought with a hinge. 520ms, same easing, 90ms delay on the second line. That 90ms is the only time-based stagger in the entire scene, and it exists solely so "But" lands second.
[C] The 40vh silence has no animation of any kind; the SILENCE label is present from first paint. The thesis lines then break the scene's own rule: they do NOT translate. Opacity 0 to 1 only, 900ms, cubic-bezier(0.33,1,0.68,1), triggered at 70vh. In a scene where everything settles into place, the thesis is the one thing that was always already there.
[D] Each cadence line settles on its own trigger at 76vh, 480ms. Its margin numeral (01/02/03) then fades in, opacity only, 320ms, 140ms AFTER its line. The words come first, the record of them comes second. The scene's whole thesis is in that 140ms.
[E] No entrance offset; the doors settle at 82vh with opacity only, 400ms. Hover and focus are the motion here, not scroll.
[F] THE ODOMETER, the one moving thing. Each of the 26 rows settles when its own top crosses 88vh, a deliberately low trigger so rows are written up from the bottom edge like a page proof: translateY 10px to 0 plus opacity, 380ms, cubic-bezier(0.22,0.61,0.36,1). At a normal scroll rate the 44px row pitch fires these roughly 60 to 90ms apart, which reads as a ledger being written, with no hardcoded stagger and no fixed tempo. As each row settles, the sticky rail's counter is set to max(current, thisRowIndex). It is derived from the highest settled index, never incremented, so fast scrolling and scroll-back are both correct, and it is MONOTONIC: scrolling back up leaves the count at its maximum. Miles do not un-accumulate. The digits use tabular-nums so nothing reflows. When it reaches 26 the counter stops and a 40px x 1px gold rule draws beneath it, scaleX 0 to 1 from the left, 400ms. Nothing else in the scene animates while the table is on screen. One number counting in a completely still room is the entire visual argument: everything has come to rest, and the only thing still counting is the miles.
[G] Opacity only, 1100ms, cubic-bezier(0.33,1,0.68,1), triggered at 68vh. The slowest thing in the scene, with nothing else on screen when it fires.

Only transform and opacity are animated anywhere. No filter, no width, no height, no top, no left. The sticky rail is `position: sticky`, which is layout, not animation. No audio.

### Interaction
The scene turns its credits into navigation. Every one of the 26 index rows is a real link back into the film: `<a href="#sc-02">` wrapping the whole 44px row, anchoring to the scene where that plate appears. The visible SCENE column is the link's meaning made legible, so the reader is told where they are being sent before they click. Hover: row background #12141A at 3%, 120ms, and the FILE column shifts from #4A5058 to #12141A. There is deliberately NO thumbnail preview on hover: the idea of this scene is that the photographs have become text, and a popover image would destroy it.

The two doors: on hover or focus-visible the whole link block translateY(-2px) over 180ms and its 1px underline goes from #12141A/15 to solid #D6A145. Tiny motion, because the scene has stopped moving.

Keyboard and assistive tech: the table is wrapped in `<nav aria-label="Plate index">` preceded by a "Skip the plate index" link, 11px Archivo, visually hidden until focused, so nobody has to tab through 26 stops to reach the sign-off. Focus-visible everywhere is a 2px #12141A outline at 8px offset, never a colour-only cue. The counter lives in an `aria-live="off"` region so it never interrupts a screen reader; it is a visual device, and the table's own row count carries the same information semantically.

Anchor jumps use `scroll-behavior: smooth`, disabled to an instant jump under prefers-reduced-motion.

### Typography
NEWSREADER, for Mark, exclusively in the measure. Optical size axis set per size, which is the whole reason this face was chosen.
- Summation: Newsreader, opsz 40, weight 300, 56px / 1.28, letter-spacing -0.01em. The fourth line, "Has led to this moment.", steps to weight 400.
- The turn: Newsreader, opsz 36, weight 300, 36px / 1.40, -0.005em.
- The thesis: Newsreader, opsz 72, weight 200, 96px / 1.10, -0.02em. Then "It's earned." alone steps to weight 500. This is the only weight jump of that size in the scene: the earned half is physically heavier ink than the given half. Nobody has to be told; it just reads right. Weight 200 at 96px is a whisper at scale, which is the correct reading of a claim about trust.
- The cadence: Newsreader, opsz 40, weight 300, 40px / 1.35.
- The sign-off: Newsreader, opsz 48, weight 300, 44px / 1.35.

ARCHIVO, for the site, exclusively in the margin and in the index.
- All furniture and margin labels (SCENE 17 OF 17, 09:12, SILENCE, 01/02/03, CONTINUE, COLOPHON, END): 11px, weight 500, 0.1em, uppercase.
- Index rail and column heads: 11px, weight 500, 0.1em, uppercase. The counter adds `font-variant-numeric: tabular-nums`.
- Index col 1 PLATE and col 4 SCENE: 11px, weight 500, 0.1em, uppercase, tabular-nums.
- Index col 2 SUBJECT: 14px, weight 400, sentence case, 0em.
- Index col 3 PLACE: 13px, weight 400.
- Index col 5 FILE: 11px, weight 400, 0em, `font-variant-ligatures: none` so filenames read as filenames.
- Door labels: 22px, weight 500, 0.01em, sentence case. Their paths: 11px, 0.1em, uppercase.
- Colophon body: 15px / 1.60, weight 400. Set note beneath it: 11px / 1.70, weight 400.

The two families never appear on the same line, in the same block, or in the same column. At 375 the labels move above their blocks rather than beside them, which preserves the separation while losing the margin.

MOBILE SIZES: summation 32/1.30, turn 24/1.40, thesis 44/1.12 (still the largest thing on the screen), cadence 26/1.35, sign-off 30/1.30, colophon 15/1.65.

### Contrast
Ground is #eff1f3 everywhere. This is the only scene on the page that carries no photograph and therefore needs no scrim anywhere: every ratio below is measured directly against the ground.
- #12141A on #eff1f3 = 16.3:1. All Newsreader copy, index col 2 SUBJECT, colophon body, door labels.
- #4A5058 on #eff1f3 = 7.19:1. All secondary Archivo micro type at 11-13px: furniture, margin labels, column heads, PLACE, SCENE, FILE, addendum rows, set note.
- #A05C08 on #eff1f3 = 4.60:1. Used once, on the PL. 02 plate number at 11px. Passes AA for small text.
- #D6A145 on #eff1f3 = 2.10:1. FAILS as text and is therefore NEVER used as text in this scene. It appears only as the 40px rule beside "Has led to this moment.", the 40px rule under the completed counter, the 1px door underlines on hover, and a 3px dot beside row PL. 02. All four are decorative and all four are redundant with a signal that already passes.
- Hairlines at #12141A/8 (row separators), /10 (rail underline), /12 (door divider), /20 (table head rule and the citation tick). Non-informational separators, exempt from contrast minimums; every boundary they mark is also carried by spacing.
- Row hover fill #12141A at 3% over the ground leaves col 2 at 15.9:1 and col 5 at 7.0:1. Both still pass.

### Reduced motion
Under prefers-reduced-motion: reduce, every `@keyframes` in this scene is simply not applied, because all of them are wrapped in `@media (prefers-reduced-motion: no-preference)`. Since the resting state IS the written CSS, what renders is the complete scene on first paint: all four summation sentences, both turn lines, the labelled 40vh silence, both thesis lines, all three cadence lines with their numerals, both doors, the sticky rail, the column heads, all 26 index rows, the 3-row addendum, the full colophon, and the sign-off. Nothing is hidden, nothing is faded, nothing waits for a scroll position.

The gold rule beside "Has led to this moment." renders at scaleX(1). The rule under the counter renders at scaleX(1). The counter renders "PLATES 26 / 26" immediately and never animates or changes, which is truthful: there are 26 plates and they are all listed. The rail still sticks, because sticky positioning is layout and not motion, and it is what keeps the table legible during a long scroll. Anchor links jump instantly rather than smooth-scrolling. Hover and focus states drop their 180ms and 120ms transitions and switch instantly, keeping every affordance intact.

This is not a degraded version. The only thing a reduced-motion reader loses is the pleasure of watching the counter climb, and they are given the finished number instead. Every word, every row, every link and every ratio is identical.

### Assets


### Risk
The most likely failure is that a 26-row table at the bottom of a page reads as a footer sitemap or a data dump, and the scene dies at precisely the moment it should resolve. Three specific mitigations, all structural rather than decorative: the sticky counting rail gives the table a spine and a reason to be scrolled through rather than skimmed; every row is a live link back into the film, so the table is navigation doing real work and not a credits crawl; and the 44px row pitch with a per-row settle keeps it feeling written rather than dumped.

Second risk: the counter is the only moving thing in the scene, so if the IntersectionObserver never fires the whole scene looks broken and the count sits at zero under a table of 26. Which is why the counter's DEFAULT RENDERED STATE IS "26 / 26", not "00 / 26". JS resets it to 00 on mount only after confirming the observer has attached and at least one row has been seen. Wrong-but-final beats zero-and-stuck. This is the same failure class as the reveal-visibility trap already recorded on this project.

Third risk, and the one to guard hardest: someone will eventually want to add thumbnails to the index, or a hover preview, because a list of image filenames with no images looks like an oversight. It is the opposite. The idea of this scene is that a journey turns into a record, and the moment a photograph reappears in the index the scene has no argument left.

---

