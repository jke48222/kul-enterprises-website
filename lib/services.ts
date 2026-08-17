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
  description: string;
  bestFor: string[];
  commitments: string[];
  /** One plain sentence, shown under the name on the services carousel. */
  blurb: string;
  /** Comparison table values. Keep these short enough to sit on one line. */
  equipment: string;
  equipmentNote: string;
  lane: string;
  laneNote: string;
  leadTime: string;
  /**
   * Print the lead time as it stands, with no "Lead time" prefix. For entries
   * that are not a time, like "By contract". The comparison list reads this
   * flag; nothing may compare against the leadTime text itself, because that
   * text is editable in the CMS.
   */
  leadTimeNoPrefix?: boolean;
  bestForShort: string;
  /** Square photograph for the carousel card. */
  card: string;
  /** Wide photograph for the top of the service's own page. */
  wide: string;
  /** Measurements printed on the blueprint drawing. Nominal, not measured. */
  dimensions: ServiceDimension[];
};

export const services: Service[] = content.services;

/**
 * There used to be a third picture per service here, called `image`, plus a
 * `serviceImages` lookup beside it. Both went on 28 Jul 2026. Every service
 * already carries `card` for the carousel and `wide` for the top of its own
 * page, the third one pointed at stock photography that no longer exists, and
 * the only things reading it were components that had themselves stopped
 * being rendered. Two pictures per service is the whole set.
 */
