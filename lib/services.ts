import content from "@/content/services.json";

/**
 * The 7 KUL services. One dedicated page per freight type for SEO.
 * Copy lives in content/services.json, editable through the CMS (/admin).
 */
export type Service = {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  bestFor: string[];
  commitments: string[];
  /** Placeholder imagery per service; swap for KUL fleet shots. */
  image: { src: string; alt: string };
};

export const services: Service[] = content.services;

/** Image lookup by slug, kept for callers that only have the slug. */
export const serviceImages: Record<string, { src: string; alt: string }> =
  Object.fromEntries(content.services.map((s) => [s.slug, s.image]));
