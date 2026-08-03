/**
 * THE JOURNEY REBUILD: THE SPINE OF THE PAGE.
 *
 * ============================================================================
 * READ THIS BEFORE TOUCHING ANY SCENE. EVERY NUMBER ON THE PAGE COMES FROM HERE.
 * ============================================================================
 *
 * The Journey is seventeen scenes telling one story. When the seventeen were
 * designed separately, each one invented its own version of the things they all
 * share, and the result did not survive being read end to end: the clock ran
 * backwards in six places, the same photograph carried two different plate
 * numbers, and five scenes each invented their own way of saying "no photograph
 * exists".
 *
 * So the shared things live here, once, and no scene keeps a local copy:
 *
 *   1. THE LIGHT ARC      what colour the ground is under each scene
 *   2. THE LIGHT STAGE    where in the day each scene sits
 *   3. THE PLATE REGISTER which photograph is which, and its number
 *
 * If you are adding or reordering a scene, change it here and the page follows.
 * If you find yourself typing a hex colour or a plate number into a scene
 * component, stop: it belongs in this file.
 *
 * (lib/journey.ts is the OLD six-chapter page and is still holding that page
 * up. It goes when the rebuild replaces it.)
 */

/**
 * ============================================================================
 * 1. THE LIGHT ARC
 * ============================================================================
 * The whole page is one sunrise. It opens in near-black and ends in daylight,
 * and the ground travels continuously between the two as you scroll.
 *
 * IT IS PURE CSS AND THAT IS THE IMPORTANT PART. Each scene paints a gradient
 * from its own colour to the next scene's colour, so stacking the seventeen
 * sections gives one unbroken ramp down the page. There is no scroll listener,
 * nothing repaints, and it is correct with JavaScript switched off and for
 * anyone who asked for reduced motion. An earlier plan drove this from a scroll
 * handler, which would have put the legibility of the whole page behind a
 * script. That is the exact failure components/k/Reveal.tsx exists to prevent.
 *
 * THE COLOURS ARE NOT INVENTED. Hue and saturation were sampled from Mark's own
 * photographs at each stage of the light, then damped to about a third so the
 * ground never competes with the pictures sitting on it. Only lightness is
 * designed, and it is designed around contrast.
 *
 * WHY SCENE 10 SWALLOWS SO MUCH OF THE RAMP. Between a dark ground and a light
 * one there is a band where neither white nor near-black text can reach 4.5:1.
 * Measured, it is luminance 0.177 to 0.190, and it is unavoidable: a property
 * of the contrast formula, not of these colours. So the page crosses it inside
 * scene 10, the road sequence, the one scene where every word sits on a
 * photograph with its own measured scrim rather than on the page ground.
 * Scenes 1 to 9 crowd into the dark end, 11 to 17 into the light end.
 *
 * That is also right dramatically. Scene 10 is the sunrise, so the sunrise is
 * where night becomes day.
 *
 * EVERY SCENE WAS CHECKED AT BOTH ENDS of its gradient, not at its midpoint. A
 * section is lightest at its bottom edge and that is where white text is in
 * most danger. All seventeen clear 4.5:1 at both ends. If you change a colour,
 * re-run that check on the scene above and the scene below as well.
 *
 * WHY THE DARK HALF CLIMBS FURTHER THAN IT NEEDS TO. The first version of these
 * values kept scenes 1 to 9 between #08090a and #252629, which is almost no
 * change at all. Rendered as one strip it was obvious that the first thirteen
 * screens of the page, about forty per cent of it, had no visible light in them
 * whatsoever, and then scene 10 did everything at once. That is not a dawn, it
 * is a light switch.
 *
 * White text stays safe up to luminance 0.1774, and scene 9 was ending at
 * 0.0027. There was no reason for the restraint. The dark half now climbs to
 * #35373a, which a reader can actually see happening, and still holds 4.7x
 * margin under the ceiling. Scene 10 goes on doing the crossing, but now it is
 * the sun coming up over a sky that has already been getting lighter for a
 * while, which is what a sunrise is.
 */

/** Which text colour a scene's ground can carry. */
export type Ink = "light" | "dark" | "on-photo";

/** The near-white used on every dark scene. */
export const INK_LIGHT = "#FCFCFC";
/**
 * The near-black used on every light scene. Darker than the site's usual ink
 * because scenes 11 and 12 sit on mid-greys with very little headroom left.
 */
export const INK_DARK = "#12141A";

/**
 * ============================================================================
 * GOLD. READ ALL OF THIS BEFORE PUTTING ANY ON A LIGHT SCENE.
 * ============================================================================
 * #D6A145 is the brand gold and it works as text on every dark scene. From
 * scene 11 the ground is light and it collapses to between 2.3:1 and 1.1:1, so
 * the light half needs the site's darker #A05C08 instead.
 *
 * THAT SECOND VALUE IS NOT A TEXT COLOUR ON THIS PAGE, AND ITS OWN COMMENT IN
 * globals.css IS WHY THE MISTAKE IS EASY TO MAKE. It is documented there as
 * "4.57:1 on paper", which is true and irrelevant: paper is #F0F0F0 and it is
 * lighter than six of this page's seven light grounds. Against the grounds
 * actually used here:
 *
 *   scene 11  #909ca5   1.86   fails 4.5 AND fails 3.0
 *   scene 12  #9fabbd   2.24   fails both
 *   scene 13  #b3becd   2.77   fails both
 *   scene 14  #cad1db   3.39   mark only
 *   scene 15  #dce0e6   3.93   mark only
 *   scene 16  #e5e9ed   4.27   mark only
 *   scene 17  #eff1f3   4.60   text is fine
 *
 * So the rule for the light half is: GOLD IS A MARK, NOT A WORD. A rule, a
 * tick, a keyline. Those are non-text and held to 3:1. Set the words in
 * INK_DARK beside it.
 *
 * On scenes 11, 12 and 13 gold does not clear even 3:1, so it must not appear
 * at all. Call goldFor() rather than reaching for a hex: it returns null where
 * gold is not allowed.
 *
 * This is the same error the site already made once with --color-ink-faint: a
 * colour carrying a contrast figure measured against a ground nothing uses.
 */
export const GOLD_ON_DARK = "#D6A145";
export const GOLD_ON_LIGHT = "#A05C08";

/**
 * ============================================================================
 * 2. THE LIGHT STAGE, WHICH REPLACED A CLOCK
 * ============================================================================
 * Each scene is stamped with where it sits in the day. This began as a clock
 * time and that was wrong twice over. The times ran backwards when the scenes
 * were read in order, and inventing "05:41" and setting it in the same typeface
 * as the plate numbers claims a precision that does not exist: Mark did not
 * record when he took these. The page's whole argument is that nothing on it is
 * made up, so it cannot carry a fabricated clock.
 *
 * A named stage says the true thing instead, and it cannot run backwards
 * because it is derived from the same arc as the ground colour.
 */
export type Stage =
  | "Night"
  | "Before first light"
  | "The sky begins to lift"
  | "Night into day"
  | "Full day"
  | "Sun high";

export type Scene = {
  /** 1 to 17. Printed by the furniture as "SC. 01". */
  n: number;
  /** Used for the section id, the anchor and the chapter rail. */
  slug: string;
  title: string;
  /** Ground at the top of the section. */
  from: string;
  /** Ground at the bottom. Always the next scene's `from`, so the ramp joins. */
  to: string;
  ink: Ink;
  stage: Stage;
  /**
   * How tall the section is, in vh. A BUDGET, NOT A SUGGESTION.
   *
   * The first draft ran to 6,400vh: sixty-four screens, six to ten minutes of
   * scrolling for a one-truck carrier's story. The cause was that every scene
   * pinned itself, and a pinned scene has to spend scroll distance just to play
   * its own animation. Seven ran back to back.
   *
   * So pinning is rare now and has to be earned. Four scenes hold the viewport
   * still and they are the four that are ABOUT stillness: the opening, the
   * pause after "We never went back", the road, and the moment he stops asking
   * what kind of business he wants to own. Everything else is ordinary flow at
   * 110 to 200vh. Total 3,110vh, about thirty-one screens.
   *
   * If you add a pin, take the distance from somewhere else.
   */
  vh: number;
  /** Whether this scene holds the viewport still. Exactly four do. */
  pinned: boolean;
};

export const SCENES: readonly Scene[] = [
  { n: 1,  slug: "beginning",     title: "Every Road Has a Beginning",          from: "#08090a", to: "#0a0c0e", ink: "light",    stage: "Night",                  vh: 180, pinned: true  },
  { n: 2,  slug: "jamaica",       title: "Jamaica",                             from: "#0a0c0e", to: "#0d0f11", ink: "light",    stage: "Night",                  vh: 300, pinned: true  },
  { n: 3,  slug: "work",          title: "Learning the Value of Work",          from: "#0d0f11", to: "#101216", ink: "light",    stage: "Night",                  vh: 110, pinned: false },
  { n: 4,  slug: "questions",     title: "Seeing the World Differently",        from: "#101216", to: "#14141a", ink: "light",    stage: "Before first light",     vh: 110, pinned: false },
  { n: 5,  slug: "independence",  title: "The Beginning of Independence",       from: "#14141a", to: "#17181f", ink: "light",    stage: "Before first light",     vh: 130, pinned: false },
  { n: 6,  slug: "challenge",     title: "Choosing a Greater Challenge",        from: "#17181f", to: "#1f2025", ink: "light",    stage: "Before first light",     vh: 100, pinned: false },
  { n: 7,  slug: "discipline",    title: "Forged Through Discipline",           from: "#1f2025", to: "#26282a", ink: "light",    stage: "Before first light",     vh: 150, pinned: false },
  { n: 8,  slug: "straight-line", title: "Life Doesn't Follow a Straight Line", from: "#26282a", to: "#2e3031", ink: "light",    stage: "The sky begins to lift", vh: 170, pinned: false },
  { n: 9,  slug: "trust",         title: "Earning Trust",                       from: "#2e3031", to: "#35373a", ink: "light",    stage: "The sky begins to lift", vh: 160, pinned: false },
  // The hinge of the page. It carries the light crossing by itself, which is
  // why its gradient travels so much further than anything either side of it.
  { n: 10, slug: "the-road",      title: "The Road Became My Teacher",          from: "#35373a", to: "#909ca5", ink: "on-photo", stage: "Night into day",         vh: 460, pinned: true  },
  { n: 11, slug: "people",        title: "A Vision Begins to Form",             from: "#909ca5", to: "#9fabbd", ink: "dark",     stage: "Full day",               vh: 180, pinned: false },
  { n: 12, slug: "more-than",     title: "More Than a Business",                from: "#9fabbd", to: "#b3becd", ink: "dark",     stage: "Full day",               vh: 220, pinned: true  },
  { n: 13, slug: "promise",       title: "The Promise",                         from: "#b3becd", to: "#cad1db", ink: "dark",     stage: "Full day",               vh: 120, pinned: false },
  { n: 14, slug: "meet-kul",      title: "Meet KUL",                            from: "#cad1db", to: "#dce0e6", ink: "dark",     stage: "Full day",               vh: 200, pinned: false },
  { n: 15, slug: "values",        title: "What We Stand For",                   from: "#dce0e6", to: "#e5e9ed", ink: "dark",     stage: "Sun high",               vh: 130, pinned: false },
  { n: 16, slug: "road-ahead",    title: "The Road Ahead",                      from: "#e5e9ed", to: "#eff1f3", ink: "dark",     stage: "Sun high",               vh: 150, pinned: false },
  { n: 17, slug: "next",          title: "The Next Journey",                    from: "#eff1f3", to: "#eff1f3", ink: "dark",     stage: "Sun high",               vh: 240, pinned: false },
] as const;

/** The text colour a scene sets. "on-photo" scenes set light and rely on scrims. */
export function inkFor(scene: Scene): string {
  return scene.ink === "dark" ? INK_DARK : INK_LIGHT;
}

/**
 * The gold a scene may use, or null where it may not use any.
 *
 * Returns null for scenes 11 to 13, whose grounds are mid-greys that even a
 * hairline cannot clear 3:1 against. Those three scenes carry no gold at all,
 * and that is correct rather than a gap: gold is an accent, and an accent that
 * cannot be seen is not one.
 */
export function goldFor(scene: Scene): string | null {
  if (scene.ink !== "dark") return GOLD_ON_DARK;
  return scene.n >= 14 ? GOLD_ON_LIGHT : null;
}

/**
 * ============================================================================
 * 3. THE PLATE REGISTER
 * ============================================================================
 * Every photograph has exactly one number and it is the number below. Scenes
 * look theirs up; no scene writes one down.
 *
 * This exists because the first draft gave one photograph two different plate
 * numbers in two scenes, gave one number to two different photographs, and used
 * numbers past the end of the register. A plate number that is not stable is
 * worse than none at all, because it is furniture claiming to be a catalogue.
 *
 * THE ORDER IS THE ORDER OF THE LIGHT, not the order the scenes use them. That
 * is what makes this a record of the archive rather than a list of where things
 * got used.
 *
 * THREE BODIES OF WORK, KEPT APART ON PURPOSE. The road archive is twenty-four
 * frames shot through a windscreen over eleven years. The working life is three
 * phone photographs from 2021 and 2022. The portraits are from September 2021.
 * Presenting them as one undifferentiated set is how a 2022 warehouse
 * photograph nearly ended up standing in for a 1990s childhood.
 */
export type PlateGroup = "Jamaica" | "The road" | "Working life" | "Portrait";

export type Plate = {
  /** Its number in the register. Printed as "PL. 07". */
  n: number;
  /** Filename under /images/journey, without the extension. */
  file: string;
  /** Read aloud to anyone using a screen reader. Say what is in the picture. */
  alt: string;
  group: PlateGroup;
  /** Roughly when it was taken, where that is actually known. */
  when?: string;
};

export const PLATES: readonly Plate[] = [
  { n: 1,  file: "s02-jamaica-childhood",  group: "Jamaica", when: "Early 1980s", alt: "Mark Brown as a boy, with his sister, in front of a frangipani bush in Jamaica" },
  { n: 2,  file: "s02b-caribbean-water",   group: "Jamaica", alt: "Clear shallow Caribbean water meeting pale sand" },

  { n: 3,  file: "s12c-night-highway",     group: "The road", alt: "An interstate at night, headlights and lane markings drawing forward" },
  { n: 4,  file: "s12-predawn-peaks",      group: "The road", alt: "Mountain peaks under a violet sky before sunrise" },
  { n: 5,  file: "s12b-predawn-peaks-alt", group: "The road", alt: "A dark treeline below distant peaks in pre-dawn light" },
  { n: 6,  file: "s13-first-daylight",     group: "The road", alt: "A grey blue sky lifting over the interstate before sunrise" },
  { n: 7,  file: "s04-dawn-road-mist",     group: "The road", alt: "A two lane road running into low mist at dawn" },
  { n: 8,  file: "s11-sunrise-band",       group: "The road", alt: "A band of sunrise colour along the horizon above the highway" },
  { n: 9,  file: "s11b-sunrise-cloud",     group: "The road", alt: "Sunrise cloud stretched across the sky above an empty road" },
  { n: 10, file: "s05-sunrise-horizon",    group: "The road", alt: "The sun breaking the horizon at the end of a straight road" },
  { n: 11, file: "s07-pines-road",         group: "The road", alt: "A two lane road running on through dense pine forest" },
  { n: 12, file: "s16-valley-from-height", group: "The road", alt: "A road seen from height, running down through a valley" },
  { n: 13, file: "gal-alpine-lake",        group: "The road", alt: "A still alpine lake with pines and snow on the far ridge" },
  { n: 14, file: "gal-river-rocks",        group: "The road", alt: "A shallow river running over rocks between wooded banks" },
  { n: 15, file: "gal-waterfall-figure",   group: "The road", alt: "A wide low waterfall with a person standing at its foot" },
  { n: 16, file: "s08-desert-bend",        group: "The road", alt: "A desert highway bending out of sight" },
  { n: 17, file: "s08b-rockcut-bend",      group: "The road", alt: "A highway curving through a rock cut under a bright sky" },
  { n: 18, file: "s06-wide-horizon",       group: "The road", alt: "A wide horizon opening out on both sides of the road" },
  { n: 19, file: "hero-two-lane-centred",  group: "The road", alt: "A two lane road running straight toward a distant treeline" },
  { n: 20, file: "hero-sage-plain",        group: "The road", alt: "A highway crossing an open sage plain toward low hills" },
  { n: 21, file: "s09-interstate-traffic", group: "The road", alt: "Traffic across several lanes of interstate in daylight" },
  { n: 22, file: "s09b-elevated-traffic",  group: "The road", alt: "Interstate traffic seen from an elevated stretch of road" },
  { n: 23, file: "s10-endless-road",       group: "The road", alt: "An empty road running to the horizon under a deep blue sky" },
  { n: 24, file: "s14-confident-highway",  group: "The road", alt: "An open highway running through low green hills in full sun" },
  { n: 25, file: "s17-road-to-horizon",    group: "The road", alt: "The road running on with the sun high and no destination visible" },
  { n: 26, file: "hero-open-road-blue",    group: "The road", alt: "An open road under a wide blue sky seen through the windscreen" },

  // 2021 to 2022. HIS WORKING LIFE, NOT HIS CHILDHOOD. These are twenty-five
  // years after the construction sites scene 3 describes, and they must never
  // be used to illustrate it.
  { n: 27, file: "jobsite-bay",      group: "Working life", when: "November 2021", alt: "A warehouse bay with scissor lifts parked against a concrete wall" },
  { n: 28, file: "jobsite-install",  group: "Working life", when: "March 2022",    alt: "A worker on a lift fitting a light into a high ceiling" },
  { n: 29, file: "jobsite-fixtures", group: "Working life", when: "May 2022",      alt: "Light fittings boxed and staged in rows across a warehouse floor" },

  // The real portrait: a studio headshot, and the one the page uses. The two
  // 2021 frames below it are backstage phone snapshots under a red stage light
  // and were only ever standing in because nothing better existed. Keep them
  // registered, because they are still part of the archive and scene 11 answers
  // "Drivers." with one of them, but do not reach for them for a portrait.
  { n: 30, file: "mark-portrait",    group: "Portrait", alt: "Mark Brown, founder of KUL Enterprises, in a grey jacket against a plain studio background" },
  { n: 31, file: "mark-portrait-a",  group: "Portrait", when: "September 2021", alt: "Mark Brown standing in a light suit under stage lighting" },
  { n: 32, file: "mark-portrait-b",  group: "Portrait", when: "September 2021", alt: "Mark Brown standing in a light suit under stage lighting" },
] as const;

/**
 * The plate for a filename. Throws rather than guessing: a plate number that
 * silently comes back undefined is how the register broke in the first place.
 */
export function plate(file: string): Plate {
  const found = PLATES.find((p) => p.file === file);
  if (!found) {
    throw new Error(
      `[journey] "${file}" is not in the plate register in lib/journey-spine.ts. ` +
        `Add it there first, so it gets one stable number.`,
    );
  }
  return found;
}

/** "PL. 07". The only way a plate number is ever printed. */
export function plateLabel(file: string): string {
  return `PL. ${String(plate(file).n).padStart(2, "0")}`;
}

/**
 * THE ONE WAY THE PAGE SAYS A PHOTOGRAPH DOES NOT EXIST.
 *
 * There is no constant here any more, and that is deliberate rather than an
 * oversight. Scene 11 was the last caller: it drew an empty frame four times
 * out of six, and on 2 Aug the client replaced that with Mark's portrait
 * standing for the whole roll call. The two absences that remain are stated
 * in the client's own sentences, in the CMS, because each one is about a
 * different missing thing: scene 3's childhood summers and scene 6's
 * enlistment. If a third scene ever needs to say it, phrase it there, in his
 * words, rather than reviving a house form for absence.
 */

