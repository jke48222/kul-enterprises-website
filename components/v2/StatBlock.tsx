/**
 * StatBlock (FactRow) — §3.13. STATIC FACTS, NO ANIMATION OF VALUES —
 * USDOT/MC law (§ constraints): identifiers render static, never animated,
 * never counted up. Grid with vertical hairline dividers; value in Omnibus
 * h3 with tabular-nums, micro label at 60% above it. The whole row enters
 * as ONE Rise. Server component.
 *
 * Page agents pick facts ONLY from the allowed list in §3.13 — never
 * invent numbers.
 */

import { Rise } from "./Rise";

export type Fact = { label: string; value: string; href?: string };

export type StatBlockProps = {
  facts: Fact[];
  ground?: "ink" | "paper";
  columns?: 2 | 3 | 4;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

const COLS: Record<2 | 3 | 4, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export function StatBlock({
  facts,
  ground = "ink",
  columns = 4,
}: StatBlockProps) {
  const ink = ground === "ink";
  const external = (href: string) => href.startsWith("http");

  return (
    <Rise>
      <dl
        className={cx(
          "grid grid-cols-2 gap-x-8 gap-y-10 md:gap-y-0",
          COLS[columns],
          ink
            ? "md:divide-x md:divide-white/[0.12]"
            : "md:divide-x md:divide-ink/[0.15]",
        )}
      >
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="md:px-[clamp(16px,2vw,32px)] md:first:pl-0"
          >
            <dt
              className={cx(
                "text-micro uppercase",
                ink ? "text-paper/60" : "text-ink/60",
              )}
            >
              {fact.label}
            </dt>
            <dd
              className={cx(
                "mt-3 font-omnibus text-h3 tabular-nums",
                ink ? "text-cream" : "text-ink",
              )}
            >
              {fact.href ? (
                <a
                  href={fact.href}
                  className="link-hairline"
                  target={external(fact.href) ? "_blank" : undefined}
                  rel={external(fact.href) ? "noopener noreferrer" : undefined}
                >
                  {fact.value}
                </a>
              ) : (
                fact.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Rise>
  );
}

export default StatBlock;
