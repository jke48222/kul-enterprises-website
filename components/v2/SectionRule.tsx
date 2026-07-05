/**
 * SectionRule — §3.5. Plain full-width structural hairline (§2.4):
 * ink-colored on paper ground, white/12 on ink ground. Never gold —
 * gold rules exist only as BirdMark or the legal byline rule.
 * Server component; pure decoration.
 */

export type SectionRuleProps = { ground?: "ink" | "paper" };

export function SectionRule({ ground = "paper" }: SectionRuleProps) {
  return (
    <div
      aria-hidden
      className={
        ground === "ink"
          ? "h-px w-full bg-white/[0.12]"
          : "h-px w-full bg-ink/[0.15]"
      }
    />
  );
}

export default SectionRule;
