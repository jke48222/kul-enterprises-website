"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { CHAPTERS, GROUND_CLASS, type Chapter } from "@/lib/journey";
import Breadcrumb from "@/components/k/Breadcrumb";

/**
 * THE SHELF
 *
 * Six chapters standing on two shelves like records in a rack. Hover one and it
 * lifts off the shelf and offers two things to do with it. Open one and it
 * comes to the middle of the screen, big, with the rest of the page pushed out
 * of focus behind it, and it turns over to show what is on the back.
 *
 * TAKEN FROM shopify.com/editions, from a screen recording the client sent.
 * Their device: covers standing on lit shelves, a hover that raises the cover
 * and reveals Open and Details, a Details click that blurs the page and brings
 * the cover forward, a Flip button that turns it over to a numbered track
 * listing, and a chronological index rail underneath. All of that is here.
 *
 * WHY IT SUITS THIS PAGE RATHER THAN JUST LOOKING GOOD. A record sleeve has a
 * picture on the front and a list of what is on it on the back, and that is
 * exactly the shape of these six chapters: a photograph, and the handful of
 * lines Mark wrote for it. The back of each sleeve is his own copy, numbered,
 * verbatim. Nothing had to be invented to fill the form.
 *
 * THE THREE SLEEVES WITH NO PHOTOGRAPH ARE THE POINT, NOT A PROBLEM. Chapters
 * 02, 03 and 04 have no picture and never will, so they get typographic
 * sleeves, set on the same ground their own section uses further down the page.
 * A reader who opens chapter 03 later recognises the sleeve. Type-only sleeves
 * are ordinary in a record rack, which is the one place this absence can sit
 * without looking like a missing asset.
 *
 * WHAT IS DELIBERATELY NOT COPIED FROM THE REFERENCE. Shopify date every
 * edition in the rail: 2026 Spring, 2025 Winter, and so on. There are no dates
 * here. The only year anybody has confirmed is 2026, when the company started,
 * and inventing a decade for the Air Force or a year for the construction sites
 * to make the rail look complete would be the one lie on a page whose whole
 * argument is that nothing on it is invented. The rail is numbered instead.
 *
 * ============================================================================
 * THE OPENED SLEEVE IS A DIALOG AND IS BUILT LIKE ONE
 * ============================================================================
 *
 * Escape closes it, the backdrop closes it, focus moves into it when it opens
 * and returns to the sleeve that opened it when it closes, and Tab is held
 * inside it while it is open. It is `role="dialog" aria-modal="true"`, and the
 * page behind it is inert to assistive technology. None of that is decoration:
 * a modal that traps a keyboard user is worse than no modal.
 *
 * REDUCED MOTION gets all of the function and none of the movement. The sleeves
 * do not lift, the card does not fly or turn, and Flip swaps the two faces
 * instantly rather than rotating. Everything remains operable and every word
 * remains readable, because none of the meaning is in the movement.
 */

/** How far a sleeve lifts off the shelf on hover, in pixels. */
const LIFT = 10;

const EASE = [0.16, 1, 0.3, 1] as const;

export default function JourneyShelf() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();
  // Where to put focus back when the card closes.
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const open = useCallback((i: number, el: HTMLButtonElement) => {
    openerRef.current = el;
    setOpenIndex(i);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    openerRef.current?.focus();
  }, []);

  // The page behind must not scroll while a card is open, and the lock belongs
  // here rather than inside the card. Inside the card it is released by the
  // card unmounting, and the card does not unmount until its exit animation
  // finishes: if that animation never runs, which is what a browser does to a
  // tab nobody is looking at, the page is left permanently unscrollable. Tied
  // to the state instead, it is released the moment the card is closed.
  useEffect(() => {
    if (openIndex === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [openIndex]);

  return (
    <section className="relative overflow-hidden bg-k-surface pt-36">
      {/* The light the shelves stand in. A soft warm pool behind the rack, which
          is what stops a near-white ground reading as a blank browser window. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[80%] bg-[radial-gradient(60%_50%_at_50%_38%,rgba(214,161,69,0.10)_0%,rgba(214,161,69,0)_70%)]"
      />

      <div className="relative mx-auto max-w-[1248px] px-6 md:px-12 lg:px-24">
        {/* The last of the hand-rolled trails, dead until 29 Jul 2026 like the
            one in LegalPage. Shared component now, so KUL goes home. */}
        <Breadcrumb
          items={[{ label: "KUL", href: "/" }, { label: "The Journey" }]}
        />
        <h1 className="max-w-[16ch] pt-6 font-display text-k-d2 font-black text-k-ink">
          Before the first truck, there was a boy on a plane.
        </h1>
        {/* "You do not need any of it to book a load" closed this line until
            29 Jul 2026. It was said to somebody who has already chosen to open
            the page, and the pinned statement further down says the same thing
            far better and on purpose: none of this is a sales argument. What
            is left is the only part that is an instruction. */}
        <p className="max-w-[46ch] pt-5 font-text text-k-body text-k-ink-soft">
          Six chapters. Take one off the shelf, or read them in order below.
        </p>
      </div>

      <div className="relative mx-auto max-w-[1100px] px-6 pt-16 md:px-12 md:pt-20">
        <Rack onOpen={open} reduced={Boolean(reduced)} />
      </div>

      <ChapterIndex onOpen={open} />

      <AnimatePresence>
        {openIndex !== null && (
          <OpenSleeve
            chapter={CHAPTERS[openIndex]!}
            onClose={close}
            reduced={Boolean(reduced)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/**
 * The rack.
 *
 * All six sleeves live in one wrapping list, two across on a phone and three
 * from tablet up, so the rows form themselves and there is no breakpoint logic
 * in JavaScript to disagree with the server about.
 *
 * THE SHELF BOARDS ARE PER SLEEVE AND JOIN UP. Each sleeve carries its own
 * length of board underneath, full width with no gap between one and the next,
 * so a row of them reads as one continuous shelf and a wrapped row gets its own
 * shelf for free. Drawing one board per row instead would mean knowing where
 * the rows break, which is exactly the thing this layout is avoiding.
 *
 * Three across at 390px gives a 101px sleeve, which is a thumbnail rather than
 * a record. Two across gives 155px, which is a sleeve you can read the title on.
 */
function Rack({
  onOpen,
  reduced,
}: {
  onOpen: (i: number, el: HTMLButtonElement) => void;
  reduced: boolean;
}) {
  return (
    <ul className="flex flex-wrap">
      {CHAPTERS.map((chapter, i) => (
        <li key={chapter.n} className="flex w-1/2 flex-col justify-end md:w-1/3">
          <div className="px-2 md:px-3">
            <Sleeve chapter={chapter} index={i} onOpen={onOpen} reduced={reduced} />
          </div>
          <div
            aria-hidden="true"
            className="mt-0 h-[10px] w-full bg-[linear-gradient(180deg,#ffffff_0%,#f2f2f2_45%,#d9d9d9_100%)] shadow-[0_18px_28px_-14px_rgba(0,0,0,0.45)]"
          />
          {/* Air under the board before the next shelf. */}
          <div aria-hidden="true" className="h-14" />
        </li>
      ))}
    </ul>
  );
}

/**
 * A sleeve standing on the shelf.
 *
 * The whole thing is one button, so a keyboard reaches it in one Tab and Enter
 * opens it. The two pills that appear on hover are not buttons inside a button,
 * which would be invalid: they are labels on the one control, and the second
 * action lives in the opened card instead.
 */
function Sleeve({
  chapter,
  index,
  onOpen,
  reduced,
}: {
  chapter: Chapter;
  index: number;
  onOpen: (i: number, el: HTMLButtonElement) => void;
  reduced: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <m.button
      ref={ref}
      type="button"
      onClick={() => ref.current && onOpen(index, ref.current)}
      className="group relative block w-full origin-bottom text-left"
      whileHover={reduced ? undefined : { y: -LIFT }}
      whileFocus={reduced ? undefined : { y: -LIFT }}
      transition={{ duration: 0.45, ease: [...EASE] }}
    >
      <span className="sr-only">
        Chapter {chapter.n}, {chapter.title}. Open.
      </span>

      <span
        aria-hidden="true"
        className="relative block aspect-square w-full overflow-hidden shadow-[0_14px_22px_-12px_rgba(0,0,0,0.55)] transition-shadow duration-500 group-hover:shadow-[0_26px_38px_-14px_rgba(0,0,0,0.6)]"
      >
        <SleeveFace chapter={chapter} />

        {/* The two things you can do with it, revealed on hover the way the
            reference does. On a touch screen there is no hover, so the whole
            sleeve is the control and these are decoration. */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-2 pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="rounded-full bg-[rgba(252,252,252,0.92)] px-3.5 py-1.5 font-text text-k-micro uppercase text-k-ink backdrop-blur-sm">
            Open
          </span>
          <span className="rounded-full bg-[rgba(44,44,44,0.88)] px-3.5 py-1.5 font-text text-k-micro uppercase text-k-on-dark backdrop-blur-sm">
            {chapter.lines.length} lines
          </span>
        </span>
      </span>
    </m.button>
  );
}

/** The front of a sleeve: a photograph, or type on the chapter's own ground. */
function SleeveFace({ chapter }: { chapter: Chapter }) {
  if (chapter.cover) {
    return (
      <>
        <Image
          src={chapter.cover}
          alt=""
          fill
          sizes="(min-width: 768px) 236px, 33vw"
          className="object-cover"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.05)_40%,rgba(0,0,0,0.72)_100%)]"
        />
        <span className="absolute inset-x-0 top-0 flex justify-between p-3.5">
          <span className="font-text text-k-micro uppercase tabular-nums text-k-on-dark">
            {chapter.n}
          </span>
        </span>
        <span className="absolute inset-x-0 bottom-0 p-3.5">
          <span className="block break-words font-display text-[14px] font-black leading-[1.15] text-k-on-dark md:text-[15px]">
            {chapter.title}
          </span>
        </span>
      </>
    );
  }

  // No photograph exists, so the sleeve is type. Same ground as the chapter's
  // own section further down the page.
  return (
    <span
      className={`absolute inset-0 flex flex-col justify-between overflow-hidden p-3.5 md:p-4 ${GROUND_CLASS[chapter.ground]}`}
    >
      <span className="font-text text-k-micro uppercase tabular-nums text-k-gold-lit">
        {chapter.n}
      </span>
      {/* The size steps with the sleeve. "Construction" is a single long word,
          and at the desktop size in a 155px phone sleeve it runs straight off
          the edge. break-words is the belt to that braces: a title nobody has
          written yet may be longer still. */}
      <span className="block break-words font-display text-[15px] font-black leading-[1.08] text-k-on-dark md:text-[19px] lg:text-[22px]">
        {chapter.title}
      </span>
      <span className="font-text text-k-micro uppercase text-k-on-dark-faint">
        No photograph
      </span>
    </span>
  );
}

/**
 * The rail under the shelves.
 *
 * The reference dates every edition. This numbers them instead, because the
 * only date anybody has confirmed is 2026. See the note at the top of the file.
 */
function ChapterIndex({ onOpen }: { onOpen: (i: number, el: HTMLButtonElement) => void }) {
  return (
    <nav aria-label="Chapters" className="relative mt-6 border-t border-k-rule">
      <ul className="mx-auto flex max-w-[1248px] flex-wrap px-6 md:flex-nowrap md:px-12 lg:px-24">
        {CHAPTERS.map((chapter, i) => (
          <li key={chapter.n} className="w-1/2 min-w-0 md:w-auto md:flex-1">
            <IndexButton chapter={chapter} index={i} onOpen={onOpen} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function IndexButton({
  chapter,
  index,
  onOpen,
}: {
  chapter: Chapter;
  index: number;
  onOpen: (i: number, el: HTMLButtonElement) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => ref.current && onOpen(index, ref.current)}
      className="block w-full py-5 pr-4 text-left transition-colors duration-300 hover:text-k-ink"
    >
      <span className="block font-text text-k-micro uppercase tabular-nums text-k-gold">
        {chapter.n}
      </span>
      <span className="block pt-1.5 font-text text-k-small text-k-ink">{chapter.title}</span>
    </button>
  );
}

/**
 * The sleeve, opened.
 *
 * Front is the sleeve art at size. Back is Mark's copy for that chapter,
 * numbered, which is what a record's back cover is.
 */
function OpenSleeve({
  chapter,
  onClose,
  reduced,
}: {
  chapter: Chapter;
  onClose: () => void;
  reduced: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // The card is portalled to the end of <body> rather than left where it sits
  // in the tree. Inside the shelf section it was painting UNDERNEATH the very
  // sleeves it is supposed to cover, because the shelves sit in their own
  // stacking context and z-50 cannot climb out of one. A modal also has no
  // business inside a section with overflow hidden. Portalling fixes both and
  // is what a dialog should do anyway.
  useEffect(() => setMounted(true), []);

  // Escape closes, Tab stays inside, and the first control is focused on open.
  useEffect(() => {
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <m.div
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.35, ease: [...EASE] }}
    >
      {/* The page, pushed out of focus. The reference blurs and desaturates it;
          this does the same with a wash heavy enough that the type over it is
          readable whatever the sleeve behind happens to be. */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-[rgba(252,252,252,0.86)] backdrop-blur-md"
      />

      <m.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex w-full max-w-[1100px] flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-16"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 18 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: [...EASE] }}
      >
        <div className="order-2 w-full lg:order-1 lg:w-[300px] lg:shrink-0">
          <span className="font-text text-k-micro uppercase tabular-nums text-k-gold">
            Chapter {chapter.n}
          </span>
          <h2 id={titleId} className="pt-3 font-display text-k-d3 font-black text-k-ink">
            {chapter.title}
          </h2>
          <p className="pt-4 font-text text-k-small text-k-ink-soft">{chapter.blurb}</p>

          <div className="flex flex-wrap gap-3 pt-7">
            <button
              type="button"
              data-autofocus
              onClick={() => setFlipped((f) => !f)}
              className="rounded-full bg-k-ink px-5 py-2.5 font-text text-k-micro uppercase text-k-on-dark"
            >
              {flipped ? "Show the sleeve" : "Turn it over"}
            </button>
            <a
              href={chapter.href}
              onClick={onClose}
              className="rounded-full border border-k-rule-strong px-5 py-2.5 font-text text-k-micro uppercase text-k-ink"
            >
              Read the chapter
            </a>
          </div>
        </div>

        {/* The sleeve itself, turning over. `preserve-3d` on the wrapper and a
            hidden back face on each side is what makes it one object rotating
            rather than two things crossfading. */}
        <div className="order-1 w-full max-w-[460px] lg:order-2 [perspective:1600px]">
          <m.div
            className="relative aspect-square w-full [transform-style:preserve-3d]"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: reduced ? 0 : 0.75, ease: [...EASE] }}
          >
            <div className="absolute inset-0 overflow-hidden shadow-[0_40px_60px_-30px_rgba(0,0,0,0.6)] [backface-visibility:hidden]">
              <SleeveFace chapter={chapter} />
            </div>

            <div
              className={`absolute inset-0 flex flex-col overflow-hidden p-7 shadow-[0_40px_60px_-30px_rgba(0,0,0,0.6)] [backface-visibility:hidden] [transform:rotateY(180deg)] ${GROUND_CLASS[chapter.ground === "warm" || chapter.ground === "paper" ? "void" : chapter.ground]}`}
            >
              <span className="font-text text-k-micro uppercase tabular-nums text-k-gold-lit">
                Chapter {chapter.n}
              </span>
              <ol className="flex flex-1 flex-col justify-center gap-3.5 py-6">
                {chapter.lines.map((line, i) => (
                  <li key={line} className="flex gap-3.5">
                    <span className="w-5 shrink-0 pt-1 font-text text-k-micro tabular-nums text-k-on-dark-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-text text-k-small text-k-on-dark">{line}</span>
                  </li>
                ))}
              </ol>
              <span className="border-t border-k-rule-dark pt-4 font-text text-k-small italic text-k-on-dark-soft">
                {chapter.lesson}
              </span>
            </div>
          </m.div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute -top-2 right-0 rounded-full border border-k-rule-strong bg-k-surface px-4 py-2 font-text text-k-micro uppercase text-k-ink lg:-top-6"
        >
          Close
        </button>
      </m.div>
    </m.div>,
    document.body,
  );
}
