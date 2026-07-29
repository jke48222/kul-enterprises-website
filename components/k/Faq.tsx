"use client";

import { useId, useState } from "react";
import { FAQ_ITEMS } from "@/lib/faq";

/**
 * THE QUESTIONS, AS A NUMBERED INDEX
 *
 * Eight questions, each on its own ruled row with its number out in the left
 * margin, and the answer opening underneath the one you press.
 *
 * ============================================================================
 * IT EXISTED AS CONTENT AND APPEARED ON NO PAGE.
 * ============================================================================
 * content/faq.json has held eight written answers since the early build and
 * nothing in app/ or components/ ever imported it. Mark's plan specced an FAQ
 * section with FAQPage structured data; it was written and never wired. This is
 * that, and the JSON is untouched: every word below is the copy that was
 * already approved.
 *
 * SHAPE TAKEN FROM BÜRO, pulled from Mobbin. A number in a narrow gutter, the
 * question in a wide reading column, a hairline between every row, and the
 * answer expanding in place rather than in a card. It was chosen over the
 * usual two-column accordion grid for one reason: this site already speaks in
 * numbered ruled documents. The safety page sets its commitments as numbered
 * clauses and the road ahead page sets its stages as a ruled index. A boxed
 * accordion here would have been the one component on the site that looked
 * like it came from somewhere else.
 *
 * ============================================================================
 * IT IS EIGHT <button>s, NOT EIGHT <div>s WITH onClick.
 * ============================================================================
 * Which means Enter and Space work, the tab order is right, and a screen
 * reader announces "expanded" or "collapsed" without being told to. The
 * pairing is the standard disclosure one: the button carries `aria-expanded`
 * and `aria-controls`, the panel carries `aria-labelledby` pointing back, and
 * the ids are instance-scoped so two of these on one page could never collide.
 *
 * MORE THAN ONE CAN BE OPEN AT ONCE, on purpose. An accordion that closes the
 * previous answer when you open the next one is fighting somebody comparing
 * two of them, which on a page about lead times and coverage is exactly what a
 * broker is doing.
 *
 * THE PANEL IS NOT UNMOUNTED WHEN CLOSED. It is height-collapsed with
 * `grid-template-rows` and hidden from assistive technology, so the answer is
 * in the server HTML and a crawler reads all eight without running anything.
 * That is the whole point of having an FAQ: it is read by machines at least as
 * often as by people.
 *
 * THE STRUCTURED DATA IS NOT IN THIS FILE, and that is not tidiness. A server
 * component cannot call a function that lives in a "use client" module, and
 * the home page threw exactly that error when the builder sat here. Both sides
 * read lib/faq.ts instead, which is also what stops the page and the search
 * result ever disagreeing.
 */

const ITEMS = FAQ_ITEMS;

export default function Faq() {
  const uid = useId();
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) =>
    setOpen((prev) => (prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i]));

  return (
    <ul className="flex flex-col border-t border-k-rule-strong">
      {ITEMS.map((item, i) => {
        const isOpen = open.includes(i);
        const qid = `${uid}-q-${i}`;
        const aid = `${uid}-a-${i}`;
        return (
          <li key={item.q} className="border-b border-k-rule">
            <h3>
              <button
                id={qid}
                type="button"
                aria-expanded={isOpen}
                aria-controls={aid}
                onClick={() => toggle(i)}
                className="group flex w-full items-start gap-5 py-6 text-left md:gap-10"
              >
                <span className="w-7 shrink-0 pt-1 font-text text-k-micro uppercase tabular-nums text-k-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-text text-k-lede text-k-ink transition-colors duration-200 group-hover:text-k-gold">
                  {item.q}
                </span>
                {/* A plus that becomes a minus. Two rules, one of which turns:
                    the same device as the menu mark, so the site opens things
                    the same way wherever you are. It is decoration, because
                    the button already announces its own state. */}
                <span
                  aria-hidden="true"
                  className="relative mt-2 block h-3 w-3 shrink-0 text-k-ink-faint"
                >
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? "scale-y-0" : "scale-y-100"
                    }`}
                  />
                </span>
              </button>
            </h3>

            {/* THE COLLAPSE IS A GRID ROW GOING TO ZERO, not a height in
                pixels. It means the answer can be any length and nothing has
                to measure it, and unlike `display: none` it can be animated.
                The inner element needs the `overflow-hidden`, not the outer
                one, or the text spills while the row is closing. */}
            <div
              id={aid}
              role="region"
              aria-labelledby={qid}
              inert={!isOpen ? true : undefined}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[68ch] pb-7 pl-12 pr-8 font-text text-k-body text-k-ink-soft md:pl-[68px]">
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
