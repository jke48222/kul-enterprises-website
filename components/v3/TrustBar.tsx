/**
 * TrustBar — the Blueprint's trust section, verbatim placement:
 * "Immediately below the hero." Six facts in one hairline band —
 * USDOT · MC · Licensed & Insured · Southeast Based · Nationwide Service ·
 * 24/7 Communication. Zero-gold; identifiers static, never animated.
 */

import { site } from "@/lib/site";
import { Rise } from "./Rise";

const ITEMS = [
  { label: "USDOT", value: site.usdot },
  { label: "MC", value: site.mc },
  { label: "Licensed & Insured", value: "Auto + Cargo" },
  { label: "Southeast", value: "Based" },
  { label: "Nationwide", value: "Service" },
  { label: "Communication", value: "24/7" },
] as const;

export function TrustBar() {
  return (
    <section data-ground="paper" className="border-b border-ink/10 bg-paper">
      <div className="mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]">
        <Rise>
          <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-ink/10">
            {ITEMS.map((item) => (
              <div
                key={item.label}
                className="px-2 py-5 text-center lg:px-4 lg:py-6"
              >
                <dt className="text-micro uppercase text-ink/50">
                  {item.label}
                </dt>
                <dd className="mt-1 text-[15px] font-semibold tabular-nums text-ink">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </Rise>
      </div>
    </section>
  );
}

export default TrustBar;
