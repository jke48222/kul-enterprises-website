"use client";

import { useState } from "react";

export type QA = { q: string; a: string };

/**
 * FAQ accordion. `boxed` renders the reference treatment: a bordered group,
 * plus marker on the left of each 15px question, hairline dividers.
 */
export default function Faq({
  items,
  boxed = false,
}: {
  items: QA[];
  boxed?: boolean;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (boxed) {
    return (
      <div className="divide-y divide-ink/10 bg-[#F8F8F8]">
        {items.map((item, i) => {
          const open = openIdx === i;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpenIdx(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-baseline gap-4 px-4 py-[14px] text-left sm:px-6"
              >
                <span
                  aria-hidden
                  className={`select-none font-mont text-sm text-gold-dim transition-transform duration-300 ${
                    open ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
                <span className="font-mont text-[15px] font-medium text-ink2">
                  {item.q}
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-6 pl-12 pr-10 text-[15px] leading-relaxed text-graywarm-deep sm:px-6 sm:pl-14">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpenIdx(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span className="text-base font-semibold text-ink">{item.q}</span>
              <span
                aria-hidden
                className={`text-xl font-light text-gold-dim transition-transform duration-300 ${
                  open ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pr-10 leading-relaxed text-graywarm-deep">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
