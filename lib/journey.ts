/**
 * THE SIX CHAPTERS, IN ONE PLACE
 *
 * Both the shelf at the top of /journey and the chapter sections below it read
 * from here, so a line cannot be changed in one and left stale in the other.
 *
 * EVERY WORD IN `lesson` AND `lines` IS MARK'S, VERBATIM, from the screenplay
 * kept at briefs/the-journey-screenplay.md. Copy is sacred on this project. The
 * `title` and `blurb` fields are the only editorial writing here, and they name
 * things rather than characterise them.
 *
 * ============================================================================
 * ALL SIX HAVE A COVER NOW, AND THREE OF THEM ARE NOT OF WHAT THEY LABEL.
 * ============================================================================
 *
 * Chapters 02, 03 and 04 carried `cover: null` until 29 Jul 2026 and printed a
 * typographic sleeve reading "No photograph", because no photograph of a
 * construction site, of leaving home or of the Air Force has ever existed in
 * this archive. The client asked for all six to carry an image.
 *
 * WHAT THAT DOES AND DOES NOT MEAN. Nothing has been bought, staged or
 * generated, and that rule has not moved. All three covers are photographs
 * Mark took himself, pulled from the same archive as the rest of the page, and
 * chosen for what they are like rather than for what they show:
 *
 *   02  a rock cut, which is earth that has been worked
 *   03  a road running away to the horizon
 *   04  peaks before dawn, in the cold blue the chapter is set in
 *
 * NOTHING ON THE PAGE CLAIMS THEY ARE OF THE EVENTS. A sleeve prints its
 * number and its title and no caption, so no image here asserts anything. The
 * closing note at the foot of app/journey/page.tsx says in plain words that
 * three of the chapters have no photograph of what they describe and carry
 * images from the archive instead. If a cover is ever changed, check that note
 * still tells the truth: it is the only thing standing between this and a lie.
 *
 * The type is still `string | null` so a sleeve can go back to being coverless
 * without a schema change.
 */

export type Chapter = {
  /** Printed on the sleeve and in the index. */
  n: string;
  title: string;
  /** One line under the title in the index and on the opened sleeve. */
  blurb: string;
  /** Mark's own closing line for the chapter, printed on the sleeve back. */
  lesson: string;
  /**
   * A dashcam clip that plays in place of the cover in the navigation panel,
   * where six sleeves sit side by side and two of them moving is what stops
   * the row reading as a contact sheet.
   *
   * IT IS ONLY EVER SET ON A CHAPTER THE FOOTAGE IS ACTUALLY OF. Both clips
   * are Mark's own, filmed forward from the cab, so they belong to the two
   * driving chapters and to nothing else. Do not put one on chapter 02 to even
   * the row up: the road is not a construction site.
   *
   * `cover` stays set alongside it and is the poster, so the sleeve has
   * something to show before the video has a frame and for anyone who has
   * asked their machine to reduce motion.
   */
  clip?: string;
  /**
   * The photograph on the front of the sleeve, or null where none was ever
   * taken. Null means a typographic sleeve, not a placeholder.
   */
  cover: string | null;
  /** The ground the chapter's own section uses, and its sleeve when coverless. */
  ground: "void" | "coal" | "blueprint" | "warm" | "paper";
  /** The chapter's on-screen copy, numbered on the back of the sleeve. */
  lines: readonly string[];
  /** The section on the page this sleeve opens to. */
  href: string;
};

export const CHAPTERS: readonly Chapter[] = [
  {
    n: "01",
    title: "Jamaica",
    blurb: "Where it starts, and the oldest photograph the company owns.",
    lesson: "Sometimes life's greatest journeys begin without our permission.",
    cover: "/images/journey/s02-jamaica-childhood.webp",
    ground: "warm",
    lines: [
      "I was born in Jamaica.",
      "My mother brought my sister and me to America.",
      "She told us we were spending the summer with our father.",
      "We never went back.",
    ],
    href: "#chapter-01",
  },
  {
    n: "02",
    title: "Construction sites, every school break",
    blurb: "Not a summer job so much as an education.",
    lesson: "Character is often built long before opportunity arrives.",
    cover: "/images/journey/s08b-rockcut-bend.webp",
    ground: "void",
    lines: [
      "While most kids spent their summers playing, mine were spent on construction sites.",
      "Every school break. Every holiday. Every vacation. I worked alongside my father.",
      "At the time I didn't understand why. I only knew that it was expected.",
      "Work isn't something to avoid. It's something to take pride in.",
    ],
    href: "#chapter-02",
  },
  {
    n: "03",
    title: "Leaving home",
    blurb: "The first decisions that were his own to get wrong.",
    lesson: "Growth begins the moment excuses end.",
    cover: "/images/journey/s17-road-to-horizon.webp",
    ground: "coal",
    lines: [
      "As I grew older I began to notice something. I wasn't satisfied with simply being told how things were.",
      "I wanted to understand why they worked the way they did.",
      "Leaving home wasn't just about finding a place to live. It was about finding out who I was.",
      "Independence isn't the freedom to avoid mistakes. It's accepting responsibility for them.",
    ],
    href: "#chapter-03",
  },
  {
    n: "04",
    title: "The Air Force",
    blurb: "Where the habit of checking equipment before trusting it comes from.",
    lesson: "Character grows when comfort is replaced with commitment.",
    cover: "/images/journey/s12-predawn-peaks.webp",
    ground: "blueprint",
    lines: [
      "Freedom brought a question. What kind of man did I want to become?",
      "I wanted structure. I wanted to be challenged. That's what led me to the United States Air Force.",
      "It demanded consistency. Accountability. Commitment.",
      "Discipline isn't about being controlled. It's about learning to control yourself.",
    ],
    href: "#chapter-04",
  },
  {
    n: "05",
    title: "Eleven years, other people's trucks",
    blurb: "Eleven photographs taken through a windscreen, in the order the light runs.",
    lesson: "Trust is earned long before it's ever expected.",
    cover: "/images/journey/s05-sunrise-horizon.webp",
    clip: "/videos/dash-night-720.mp4",
    ground: "void",
    lines: [
      "I thought I was learning how to drive a truck.",
      "What I didn't realize was that the road was teaching me something far greater.",
      "Every delivery reminded me that trust travels farther than freight.",
      "The farther I traveled, the more I realized every person has a story.",
    ],
    href: "#chapter-05",
  },
  {
    n: "06",
    title: "One truck of his own",
    blurb: "KUL Enterprises, from 2026. One tractor, one driver.",
    lesson: "Principles are promises you keep, even when they're difficult.",
    cover: "/images/journey/s07-pines-road.webp",
    clip: "/videos/dash-daylight-720.mp4",
    ground: "paper",
    lines: [
      "Every company begins with paperwork. But that's not where KUL began.",
      "KUL began with a promise.",
      "We didn't build this company to be the biggest. We built it to be trusted.",
      "A company's reputation isn't created by advertising. It's created by the decisions no one else sees.",
    ],
    href: "#chapter-06",
  },
] as const;

/** Tailwind ground classes, kept beside the data so a sleeve and its section match. */
export const GROUND_CLASS: Record<Chapter["ground"], string> = {
  void: "bg-k-void",
  coal: "bg-k-coal",
  blueprint: "bg-k-blueprint",
  warm: "bg-k-warm",
  paper: "bg-k-paper",
};
