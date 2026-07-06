"use client";

/**
 * FaqAccordion — v3 port (v2 §3.17). Hairline rows, plus-glyph rotating
 * 45°, panel height 0→auto (the one sanctioned height animation, 0.4s
 * EASE.micro), one open at a time, aria-expanded/controls, optional
 * FAQPage JSON-LD. Apple-register questions: 600 weight, tight tracking.
 * No gold anywhere.
 */

import { useId, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/v3/motion";

export type FaqAccordionProps = {
  items: { q: string; a: string }[];
  ground?: "ink" | "paper";
  jsonLd?: boolean;
};

export function FaqAccordion({
  items,
  ground = "paper",
  jsonLd = false,
}: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();
  const reduced = useReducedMotion();
  const ink = ground === "ink";

  const border = ink ? "border-white/[0.12]" : "border-ink/15";
  const question = ink ? "text-paper" : "text-ink";
  const glyph = ink ? "text-paper/60" : "text-ink/60";
  const answer = ink ? "text-paper/70" : "text-graywarm-deep";

  const schema = jsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null;

  return (
    <div>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ul>
        {items.map((item, i) => {
          const isOpen = open === i;
          const buttonId = `${uid}-faq-q-${i}`;
          const panelId = `${uid}-faq-a-${i}`;
          return (
            <li key={buttonId} className={`border-t ${border} last:border-b`}>
              <h3 className="m-0">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={`flex min-h-[44px] w-full items-center justify-between gap-6 py-6 text-left text-[clamp(1.125rem,1.02rem+0.5vw,1.375rem)] font-semibold leading-tight tracking-[-0.008em] ${question}`}
                >
                  <span>{item.q}</span>
                  <m.span
                    aria-hidden
                    className={`shrink-0 text-[24px] font-normal leading-none ${glyph}`}
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{
                      duration: reduced ? 0 : 0.3,
                      ease: [...EASE.micro],
                    }}
                  >
                    +
                  </m.span>
                </button>
              </h3>
              <m.div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{
                  duration: reduced ? 0 : 0.4,
                  ease: [...EASE.micro],
                }}
                className="overflow-hidden"
              >
                <p className={`max-w-[62ch] pb-7 text-body ${answer}`}>
                  {item.a}
                </p>
              </m.div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FaqAccordion;
