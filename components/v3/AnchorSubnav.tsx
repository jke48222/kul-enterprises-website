"use client";

/**
 * AnchorSubnav — the Apple/Rolls-Royce anchored product sub-nav for
 * service detail pages (plan §9): a slim sticky bar under the chrome with
 * scroll-spied section anchors and a quiet charcoal Quote pill (btn-ink —
 * the gold budget stays with the nav CTA). Paper ground.
 */

import { useEffect, useState } from "react";
import Link from "next/link";

export type AnchorSubnavProps = {
  title: string;
  items: { id: string; label: string }[];
  quoteHref: string;
};

export function AnchorSubnav({ title, items, quoteHref }: AnchorSubnavProps) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [items]);

  return (
    <div
      data-ground="paper"
      className="sticky top-14 z-[60] border-b border-ink/10 bg-paper/[0.88] backdrop-blur-md"
    >
      <div className="mx-auto flex h-12 max-w-[1760px] items-center justify-between gap-4 px-[clamp(20px,5vw,90px)]">
        <p className="hidden text-[15px] font-semibold text-ink sm:block">
          {title}
        </p>
        <nav aria-label={`${title} sections`} className="flex min-w-0 items-center gap-6 overflow-x-auto">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative flex h-12 shrink-0 items-center text-micro uppercase transition-colors duration-200 ${
                  isActive ? "text-ink" : "text-ink/55 hover:text-ink"
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-px bg-ink"
                  />
                )}
              </a>
            );
          })}
        </nav>
        <Link
          href={quoteHref}
          className="btn-ink hidden !h-8 shrink-0 !px-4 text-[10px] sm:inline-flex"
        >
          Quote
        </Link>
      </div>
    </div>
  );
}

export default AnchorSubnav;
