import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export type LegalSection = { heading: string; body: string[] };

/**
 * Shared shell for the concept legal pages: quiet dark article layout,
 * gradient title, dated. Copy is drafted for client and attorney review.
 */
export default function LegalPage({
  eyebrow,
  title,
  updated = "July 2026",
  sections,
  gradient = "linear-gradient(90deg,#161616,#2E2E2E)",
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  sections: LegalSection[];
  /** Left-to-right page wash; each legal page carries its own hue. */
  gradient?: string;
}) {
  return (
    <section style={{ background: gradient }}>
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-40 md:pt-44">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            {eyebrow}
          </p>
          <h1 className="kul-grad-text mt-4 font-omnibus text-[clamp(2rem,3.6vw,2.8rem)] leading-tight">
            {title}
          </h1>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-graywarm">
            {site.legalName} · Last updated {updated}
          </p>
        </Reveal>
        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <Reveal key={s.heading}>
              <h2 className="font-omnibus text-xl text-cream">{s.heading}</h2>
              {s.body.map((para, i) => (
                <p key={i} className="mt-3 leading-relaxed text-graywarm-light">
                  {para}
                </p>
              ))}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
