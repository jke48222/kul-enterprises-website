import { trustPoints } from "@/lib/site";

/**
 * Trust bar directly below the hero. Compliance and reassurance facts,
 * separated by sparse gold diamonds (gold as punctuation, not fill).
 */
export default function TrustBar() {
  return (
    <section aria-label="Credentials" className="border-y border-white/10 bg-charcoal">
      <div className="mx-auto max-w-content px-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-5">
          {trustPoints.map((point, i) => (
            <li
              key={point}
              className="flex items-center gap-6 text-xs uppercase tracking-eyebrow text-graywarm-light"
            >
              <span>{point}</span>
              {i < trustPoints.length - 1 && (
                <span aria-hidden className="hidden h-1 w-1 rotate-45 bg-gold sm:block" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
