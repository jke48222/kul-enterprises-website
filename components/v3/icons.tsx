/**
 * v3 service icon set — hairline stroke line-art, one per freight type,
 * plus the filled TruckMark that travels the Strength-in-Motion roadway.
 * All currentColor, stroke 1.6, decorative by default (callers add
 * aria-hidden). Clean, crisp, never cartoonish (Mark's design email §5).
 */

type IconProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Tractor only, no trailer — Power Only. */
export function IconPowerOnly({ className }: IconProps) {
  return (
    <svg viewBox="0 0 56 32" className={className} {...stroke} aria-hidden>
      {/* chassis + fifth-wheel deck */}
      <path d="M4 23 H24" />
      <path d="M7 19.5 H21 V23" />
      {/* cab */}
      <path d="M24 23 V9 H35 L41 15.5 H45 V23 H42" />
      <path d="M35 9 V15.5 H41" />
      {/* wheels */}
      <circle cx="12" cy="25.5" r="3.2" />
      <circle cx="20" cy="25.5" r="3.2" />
      <circle cx="38" cy="25.5" r="3.2" />
      <path d="M24 23 H34.8" />
    </svg>
  );
}

/** Box trailer + cab — Dry Van. */
export function IconDryVan({ className }: IconProps) {
  return (
    <svg viewBox="0 0 56 32" className={className} {...stroke} aria-hidden>
      <rect x="3" y="7.5" width="28" height="14.5" rx="0.5" />
      <path d="M33 22 V11 H41 L47 17 V22 H44.5" />
      <path d="M41 11 V17 H47" />
      <path d="M31 20 H33" />
      <circle cx="10" cy="25.5" r="3.2" />
      <circle cx="17.5" cy="25.5" r="3.2" />
      <circle cx="40" cy="25.5" r="3.2" />
      <path d="M33 22 H36.8" />
      <path d="M3 22 H6.8" />
    </svg>
  );
}

/** Reefer — dry van with the cold unit + snowflake. */
export function IconReefer({ className }: IconProps) {
  return (
    <svg viewBox="0 0 56 32" className={className} {...stroke} aria-hidden>
      <rect x="3" y="7.5" width="28" height="14.5" rx="0.5" />
      {/* reefer unit on the trailer nose */}
      <rect x="29.5" y="9.5" width="1.5" height="5" />
      {/* snowflake */}
      <path d="M15 11 V19" />
      <path d="M11.5 13 L18.5 17" />
      <path d="M18.5 13 L11.5 17" />
      <path d="M33 22 V11 H41 L47 17 V22 H44.5" />
      <path d="M41 11 V17 H47" />
      <circle cx="10" cy="25.5" r="3.2" />
      <circle cx="17.5" cy="25.5" r="3.2" />
      <circle cx="40" cy="25.5" r="3.2" />
      <path d="M33 22 H36.8" />
      <path d="M3 22 H6.8" />
    </svg>
  );
}

/** Two terminals joined by an out-and-back loop — Dedicated lanes. */
export function IconDedicated({ className }: IconProps) {
  return (
    <svg viewBox="0 0 56 32" className={className} {...stroke} aria-hidden>
      <circle cx="9" cy="16" r="2.8" />
      <circle cx="47" cy="16" r="2.8" />
      {/* outbound arc */}
      <path d="M12 13 C 20 4.5, 36 4.5, 44 13" />
      <path d="M38.5 7.5 L44 13 L37 13.5" />
      {/* return arc */}
      <path d="M44 19 C 36 27.5, 20 27.5, 12 19" />
      <path d="M17.5 24.5 L12 19 L19 18.5" />
    </svg>
  );
}

/** Home pin with radiating range arcs — Regional. */
export function IconRegional({ className }: IconProps) {
  return (
    <svg viewBox="0 0 56 32" className={className} {...stroke} aria-hidden>
      {/* pin */}
      <path d="M22 8 a5 5 0 1 1 0 10 a5 5 0 1 1 0 -10" />
      <circle cx="22" cy="13" r="1.4" />
      <path d="M22 18 V24" />
      {/* range arcs east */}
      <path d="M32 8 a14 14 0 0 1 0 18" />
      <path d="M37.5 5 a20 20 0 0 1 0 24" />
    </svg>
  );
}

/** Highway sweeping to the horizon — Over-the-Road. */
export function IconOTR({ className }: IconProps) {
  return (
    <svg viewBox="0 0 56 32" className={className} {...stroke} aria-hidden>
      {/* horizon */}
      <path d="M17 8 H39" />
      {/* road edges, perspective bow */}
      <path d="M11 28 C 17 20, 22 13, 24.8 8" />
      <path d="M45 28 C 39 20, 34 13, 31.2 8" />
      {/* center dashes, fading to the horizon */}
      <path d="M28 26 V21.5" />
      <path d="M28 18 V15" />
      <path d="M28 12.5 V10.8" />
    </svg>
  );
}

/** Compact truck with speed lines — Expedited. */
export function IconExpedited({ className }: IconProps) {
  return (
    <svg viewBox="0 0 56 32" className={className} {...stroke} aria-hidden>
      <path d="M3 11.5 H11" />
      <path d="M5.5 16.5 H13" />
      <path d="M3 21.5 H11" />
      <rect x="17" y="9.5" width="20" height="12.5" rx="0.5" />
      <path d="M39 22 V13 H45 L50 18 V22 H47.5" />
      <path d="M45 13 V18 H50" />
      <circle cx="23" cy="25.5" r="3.2" />
      <circle cx="43" cy="25.5" r="3.2" />
      <path d="M37 22 H39" />
    </svg>
  );
}

/**
 * TruckMark — the filled silhouette that travels the gold roadway
 * (Strength in Motion). Points right; fill currentColor.
 */
export function TruckMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 30" className={className} aria-hidden>
      <g fill="currentColor">
        {/* trailer */}
        <rect x="2" y="5" width="35" height="15" rx="1" />
        {/* cab */}
        <path d="M39 20 V7.5 H48 L55.5 15 V20 Z" />
        {/* window */}
        <path d="M41.5 10 H47 L50.5 13.5 H41.5 Z" fill="#0B0B0B" opacity="0.55" />
        {/* wheels */}
        <circle cx="10" cy="22.5" r="3.4" />
        <circle cx="18" cy="22.5" r="3.4" />
        <circle cx="43" cy="22.5" r="3.4" />
        <circle cx="52" cy="22.5" r="3.4" />
      </g>
    </svg>
  );
}

export const SERVICE_ICONS: Record<
  string,
  (props: IconProps) => React.ReactElement
> = {
  "power-only": IconPowerOnly,
  "dry-van": IconDryVan,
  reefer: IconReefer,
  dedicated: IconDedicated,
  regional: IconRegional,
  otr: IconOTR,
  expedited: IconExpedited,
};
