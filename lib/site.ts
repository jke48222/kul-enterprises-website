import content from "@/content/site.json";

/**
 * Single source of truth for the KUL business facts.
 *
 * The values live in content/site.json so the client can edit them through
 * the CMS (/admin) without touching code; this module derives the handful
 * of computed fields and feeds the nav, footer, JSON-LD, and pages.
 *
 * The five "stories" that used to live here were removed on 28 Jul 2026.
 * Nothing rendered them once the About page was rebuilt, and the comment
 * above them claimed the five pictures were Mark's own photographs when they
 * were stock. Every photograph on the site is now genuinely his, and the five
 * stock files went with the data.
 */
export const site = {
  ...content,
  location: `${content.city}, ${content.state}`,
  phoneHref: `tel:+1${content.phone.replace(/\D/g, "")}`,
} as const;
