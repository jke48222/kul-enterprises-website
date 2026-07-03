import content from "@/content/site.json";

/**
 * Single source of truth for KUL business facts and the story sections.
 * The values live in content/site.json so the client can edit them through
 * the CMS (/admin) without touching code; this module derives the handful
 * of computed fields and feeds the nav, footer, JSON-LD, and pages.
 */
export const site = {
  ...content,
  location: `${content.city}, ${content.state}`,
  phoneHref: `tel:+1${content.phone.replace(/\D/g, "")}`,
} as const;

export type Story = (typeof content.stories)[number];

/**
 * REPLACEABLE ASSET: Mark's five photos, upscale when hi-res originals arrive.
 * The five story sections. These are Mark's own photographs, mapped to the
 * brand's themes per the Blueprint. Real places, real miles.
 */
export const stories = content.stories;
