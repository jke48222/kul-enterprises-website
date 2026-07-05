/**
 * BirdMark — §3.5. The ceremonial gold rule: a full-width hairline
 * interrupted at center by the Doctor Bird mark (VistaJet bird-in-rule).
 * The bird PNG is gold-toned — this counts as the viewport's 2nd gold
 * element and appears AT MOST ONCE per page (§2.4, §2.7).
 * Currently placed only on About §4.2.5. Server component.
 */

import Image from "next/image";

export type BirdMarkProps = { ground?: "ink" | "paper" };

export function BirdMark(_props: BirdMarkProps) {
  return (
    <div className="flex w-full items-center gap-6" role="presentation">
      <span aria-hidden className="h-px flex-1 bg-gold/70" />
      <Image
        src="/images/brand/doctor-bird-flight.png"
        width={40}
        height={28}
        alt=""
      />
      <span aria-hidden className="h-px flex-1 bg-gold/70" />
    </div>
  );
}

export default BirdMark;
