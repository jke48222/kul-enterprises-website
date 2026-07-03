/**
 * Section seam: feathers the NEIGHBORING section's ground (a solid or a
 * CSS gradient) into this section's edge, so full-bleed photo bands
 * dissolve into each other instead of cutting on a hard line. Render it
 * inside a `relative overflow-hidden` section, after the background
 * imagery and before (or below, via z-order) the text content.
 */
export default function Seam({
  edge,
  background,
  height = "10rem",
}: {
  edge: "top" | "bottom";
  /** The adjoining section's background: e.g. "#161616" or the credentials band's gradient. */
  background: string;
  height?: string;
}) {
  const mask = `linear-gradient(${edge === "top" ? "180deg" : "0deg"}, black, transparent)`;
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${
        edge === "top" ? "top-0" : "bottom-0"
      }`}
      style={{
        height,
        background,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    />
  );
}
