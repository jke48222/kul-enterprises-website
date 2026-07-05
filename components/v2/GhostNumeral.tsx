/**
 * GhostNumeral — §3.19. Oversized aria-hidden Omnibus numeral sitting at
 * z-0 behind content, positioned by the caller via className. NEVER gold
 * (§2.7): paper at 6% alpha on ink, ink at 5% alpha on paper — decoration
 * alphas are exempt from the §2.1 opacity floor because it is aria-hidden.
 * Server component; static (any drift is applied by the caller).
 */

export type GhostNumeralProps = {
  children: string; // e.g. "01", "2029", "404"
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
        "pointer-events-none absolute z-0 select-none font-omnibus leading-none tabular-nums",
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
