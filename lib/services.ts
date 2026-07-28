import content from "@/content/services.json";

/**
 * The 7 KUL services. One dedicated page per freight type for SEO.
 * Copy lives in content/services.json, editable through the CMS (/admin).
 */
export type ServiceDimension = {
  /** The letter printed beside this measurement on the blueprint drawing. */
  ref: string;
  label: string;
  value: string;
};

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
  /** One plain sentence, shown under the name on the services carousel. */
  blurb: string;
  /** Comparison table values. Keep these short enough to sit on one line. */
  equipment: string;
  equipmentNote: string;
  lane: string;
  laneNote: string;
  leadTime: string;
  bestForShort: string;
  /** Square photograph for the carousel card. */
  card: string;
  /** Wide photograph for the top of the service's own page. */
  wide: string;
  /** Measurements printed on the blueprint drawing. Nominal, not measured. */
  dimensions: ServiceDimension[];
};

export const services: Service[] = content.services;

/** Image lookup by slug, kept for callers that only have the slug. */
export const serviceImages: Record<string, { src: string; alt: string }> =
  Object.fromEntries(content.services.map((s) => [s.slug, s.image]));
