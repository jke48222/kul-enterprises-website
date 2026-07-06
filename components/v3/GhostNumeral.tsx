/**
 * GhostNumeral — v3 port (v2 §3.19). Oversized aria-hidden numeral behind
 * content, positioned by the caller. NEVER gold: paper 6% on ink, ink 5%
 * on paper (decoration alphas exempt from the opacity floor — aria-hidden).
 */

export type GhostNumeralProps = {
  children: string;
  className?: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function GhostNumeral({ children, className }: GhostNumeralProps) {
  return (
    <span
      aria-hidden
      className={cx(
        "pointer-events-none absolute z-0 select-none font-semibold leading-none tabular-nums tracking-[-0.03em]",
        "text-[clamp(8rem,16vw,15rem)]",
        "text-paper/[0.06] [[data-ground=paper]_&]:text-ink/[0.05]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export default GhostNumeral;
