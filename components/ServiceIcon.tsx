/** Minimal line icons, one per service. Quiet, consistent, stroke only. */
export default function ServiceIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    "power-only": (
      // Tractor + kingpin hook
      <>
        <path d="M4 28 L4 18 L14 18 L18 12 L26 12 L28 18 L28 28" />
        <circle cx="10" cy="28" r="3" />
        <circle cx="23" cy="28" r="3" />
        <path d="M28 21 L36 21" />
        <circle cx="38" cy="21" r="2" />
      </>
    ),
    "dry-van": (
      // Box trailer
      <>
        <rect x="4" y="12" width="28" height="14" />
        <path d="M32 26 L38 26 M4 30 L38 30" />
        <circle cx="12" cy="30" r="2.5" />
        <circle cx="28" cy="30" r="2.5" />
      </>
    ),
    reefer: (
      // Snowflake
      <>
        <path d="M20 6 L20 34 M8 13 L32 27 M32 13 L8 27" />
        <path d="M20 6 L16 10 M20 6 L24 10 M20 34 L16 30 M20 34 L24 30" />
      </>
    ),
    dedicated: (
      // Repeating loop between two points
      <>
        <circle cx="9" cy="14" r="3" />
        <circle cx="31" cy="26" r="3" />
        <path d="M12 14 L26 14 Q32 14 31 20 M28 26 L14 26 Q8 26 9 20" />
      </>
    ),
    regional: (
      // Pin with radius
      <>
        <circle cx="20" cy="16" r="5" />
        <path d="M20 21 L20 28" />
        <path d="M8 32 Q20 26 32 32" />
      </>
    ),
    expedited: (
      // Bolt
      <>
        <path d="M23 5 L11 22 L19 22 L16 35 L29 17 L21 17 Z" />
      </>
    ),
    otr: (
      // Road to horizon
      <>
        <path d="M6 34 L17 8 M34 34 L23 8 M17 8 L23 8" />
        <path d="M20 16 L20 19 M20 24 L20 27" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[slug] ?? paths["dry-van"]}
    </svg>
  );
}
