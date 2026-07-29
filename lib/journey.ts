import content from "@/content/journey.json";

/**
 * THE SIX CHAPTERS, IN ONE PLACE
 *
 * Both the shelf at the top of /journey and the chapter sections below it read
 * from here, so a line cannot be changed in one and left stale in the other.
 *
 * THAT SENTENCE WAS NOT TRUE UNTIL 29 JUL 2026. app/journey/page.tsx kept its
 * own copy of chapters 02 to 04, with the same words typed out a second time,
 * so the shelf and the page were two sources that happened to agree. Once the
 * words moved into the CMS that stopped being survivable: a client editing
 * chapter 03 would have changed the sleeve and left the section beneath it
 * saying something else. The page derives those three from this list now, and
 * the words exist once.
 *
 * The words themselves live in content/journey.json and are edited at /admin
 * under "The Journey, chapters".
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
  /**
   * The section on the page this sleeve opens to.
   *
   * Derived from the number rather than stored, because the two must agree and
   * a chapter whose sleeve scrolls to the wrong section is a bug the CMS should
   * not be able to create.
   */
  href: string;
};

export const CHAPTERS: readonly Chapter[] = content.chapters.map((c) => ({
  ...c,
  // An empty string is what the CMS stores for "no video on this chapter",
  // because a Tina field cannot hold null. The type wants undefined, and a
  // sleeve checks for truthiness, so the two are reconciled here rather than
  // in three components.
  clip: c.clip || undefined,
  cover: c.cover || null,
  ground: c.ground as Chapter["ground"],
  href: `#chapter-${c.n}`,
}));

/** Tailwind ground classes, kept beside the data so a sleeve and its section match. */
export const GROUND_CLASS: Record<Chapter["ground"], string> = {
  void: "bg-k-void",
  coal: "bg-k-coal",
  blueprint: "bg-k-blueprint",
  warm: "bg-k-warm",
  paper: "bg-k-paper",
};
