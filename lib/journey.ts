import content from "@/content/pages/journey.json";

/**
 * THE FIVE ACTS OF THE JOURNEY, FOR THE NAVIGATION SHELF.
 *
 * The Journey is seventeen scenes; nobody wants seventeen menu items. The
 * page's natural curtains fall after scenes 2, 7, 10 and 14, which divides the
 * film into five acts, and those are what the navigation offers. Each sleeve
 * jumps to the scene its act opens on.
 *
 * THE TITLES ARE THE CMS'S; THE STRUCTURE IS NOT. Which scene an act opens at
 * and which photograph is on its sleeve are decisions about the page's anatomy
 * and the archive's files, so they live here. The names live in
 * content/pages/journey.json and are edited at /admin with the rest of the
 * page's words. The two are zipped by position, which is safe because the act
 * list is fixed-length by design.
 *
 * THE COVERS ARE ALL MARK'S OWN PHOTOGRAPHS, chosen for what they are like
 * rather than for what they show, the same honesty rule the old six-chapter
 * shelf followed. The one clip is dash-daylight: his own footage, previously
 * the only dashcam file the site never used, and it rides the act that is
 * actually about driving.
 *
 * The export keeps the name CHAPTERS so the navigation did not have to be
 * rewired when the six chapters became five acts; a chapter and an act are the
 * same thing to a menu.
 */

export type Chapter = {
  /** Printed on the sleeve. */
  n: string;
  title: string;
  /** The anchor of the scene this act opens on, including the #. */
  href: string;
  /** The sleeve's photograph. Null prints the typographic no-photograph sleeve. */
  cover: string | null;
  /** A short muted clip for the sleeve, only where the act is about driving. */
  clip: string | null;
  /** Ground class for a typographic sleeve. Unused while every act has a cover. */
  ground: "void" | "coal" | "blueprint" | "warm" | "paper";
};

const ACT_STRUCTURE = [
  { n: "01", href: "#beginning", cover: "/images/journey/s02-jamaica-childhood.webp", clip: null },
  { n: "02", href: "#work", cover: "/images/journey/s04-dawn-road-mist.webp", clip: null },
  { n: "03", href: "#straight-line", cover: "/images/journey/s10-endless-road.webp", clip: "/videos/dash-daylight-720.mp4" },
  { n: "04", href: "#people", cover: "/images/journey/mark-portrait.webp", clip: null },
  { n: "05", href: "#values", cover: "/images/journey/s17-road-to-horizon.webp", clip: null },
] as const;

export const CHAPTERS: readonly Chapter[] = ACT_STRUCTURE.map((act, i) => ({
  ...act,
  title: content.acts[i]?.title ?? "",
  ground: "void",
}));

/** Grounds for typographic sleeves. Kept for the day a cover is withdrawn. */
export const GROUND_CLASS: Record<Chapter["ground"], string> = {
  void: "bg-k-void",
  coal: "bg-k-charcoal",
  blueprint: "bg-k-blueprint",
  warm: "bg-k-warm-panel",
  paper: "bg-k-paper",
};
