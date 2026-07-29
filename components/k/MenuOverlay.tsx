"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  m,
  useIsPresent,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

/**
 * THE MENU PANEL
 *
 * Below 1180 pixels the bar at the top of the page has no room for the menu,
 * so it shows a Menu button instead. Pressing it covers the screen with this
 * panel. It is the only way to reach the menu on a phone or a tablet, so it
 * has to carry everything the wide bar carries: the eight pages, the seven
 * services that sit behind the Services link on a wide screen, and the two
 * ways of getting in touch.
 *
 * It carries one page the wide bar does not. The Road Ahead came off the bar
 * when The Journey went on it, because the pill was full, so on a phone this
 * panel is the only navigation that lists it and on a desktop it is reachable
 * from the home page, the Drivers page and the footer. The reasoning is
 * written out in full on MENU_ONLY_LINKS in Nav.tsx.
 *
 * The panel is a proper dialog, which means a few things have to hold while
 * it is open, all handled below:
 *
 *   THE PAGE BEHIND IT     stops scrolling, so a flick of the thumb moves the
 *                          menu rather than the page underneath it.
 *
 *   THE KEYBOARD           cannot leave the panel. Tabbing past the last item
 *                          returns to the first, Escape closes, and closing
 *                          puts the cursor back on the Menu button that
 *                          opened it.
 *
 *   A SCREEN READER        is told the rest of the page is unavailable, so it
 *                          reads the menu and not the page behind it.
 *
 * TO CHANGE THE MENU: edit LEFT_LINKS, RIGHT_LINKS and MENU_ONLY_LINKS in
 * Nav.tsx. This panel reads those same lists, so the wide bar and the menu can
 * never drift apart. The services below them come from the CMS.
 */

type MenuOverlayProps = {
  open: boolean;
  onClose(): void;
  /** The pages from the bar, in the order they are read across it. */
  links: readonly { href: string; label: string }[];
};

function Panel({ onClose, links }: Omit<MenuOverlayProps, "open">) {
  const reduced = useReducedMotion();
  // False from the moment the panel starts closing until it is actually
  // removed, which is the window its closing animation plays in.
  const present = useIsPresent();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Whatever had the cursor before the panel opened, so it can be handed
    // back when the panel closes.
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const stops = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!stops.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      // Tabbing off either end wraps round to the other, which is what keeps
      // the cursor inside the panel.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  const sweep = reduced
    ? { duration: 0.2 }
    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <m.div
      ref={panelRef}
      id="k-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      // Once it is on its way out it stops taking taps, so the last frames of
      // the closing animation cannot swallow a press meant for the page.
      className={`fixed inset-0 z-[90] flex flex-col bg-k-coal text-k-on-dark min-[1180px]:hidden ${
        present ? "" : "pointer-events-none"
      }`}
      // The panel wipes down from the top edge rather than fading, so it
      // reads as the bar itself opening out. Reduced motion gets the fade.
      initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
      animate={
        reduced
          ? { opacity: 1, transition: sweep }
          : { clipPath: "inset(0 0 0% 0)", transition: sweep }
      }
      exit={
        reduced
          ? { opacity: 0, transition: { duration: 0.2 } }
          : {
              clipPath: "inset(0 0 100% 0)",
              transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
            }
      }
    >
      {/* The top of the panel repeats the top of the bar, in the same place,
          so the lion does not appear to jump when the panel opens. */}
      <div className="flex shrink-0 items-center justify-between px-6 py-[18px] sm:px-8">
        <Link
          href="/"
          aria-label="KUL Enterprises, back to the home page"
          onClick={onClose}
          className="shrink-0"
        >
          <Image
            src="/images/brand/lion-mark.webp"
            alt="KUL Enterprises"
            width={38}
            height={38}
          />
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="px-4 py-3 font-text text-k-label uppercase text-k-on-dark transition-colors duration-200 hover:text-k-gold-lit"
        >
          Close
        </button>
      </div>

      {/* The middle scrolls on its own if a short screen cannot hold the
          whole menu, which keeps the quote button at the bottom reachable. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 sm:px-8">
        <nav aria-label="Menu">
          <ul>
            {links.map((link, index) => (
              <li key={link.href} className="overflow-hidden">
                <m.div
                  initial={reduced ? { opacity: 0 } : { y: "110%" }}
                  animate={reduced ? { opacity: 1 } : { y: "0%" }}
                  transition={{
                    duration: reduced ? 0.2 : 0.55,
                    ease: [0.16, 1, 0.3, 1],
                    // Each line follows the one above it, so the list arrives
                    // in reading order rather than all at once.
                    delay: 0.16 + index * 0.045,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block py-2 font-display text-k-d3 font-black text-k-on-dark transition-colors duration-200 hover:text-k-gold-lit"
                  >
                    {link.label}
                  </Link>
                </m.div>
              </li>
            ))}
          </ul>
        </nav>

        {/* The services. On a wide screen these live in the panel that grows
            out of the bar when Services is hovered, which a touch screen has
            no way of reaching, so they are listed here instead. */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: reduced ? 0.2 : 0.5 }}
          className="mt-8 border-t border-k-rule-dark pt-6"
        >
          <h2 className="font-text text-k-micro uppercase text-k-on-dark-faint">
            Freight services
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  onClick={onClose}
                  className="block py-2 font-text text-k-small text-k-on-dark-soft transition-colors duration-200 hover:text-k-gold-lit"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </m.div>
      </div>

      {/* Pinned to the bottom, above the phone's home bar. */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: reduced ? 0.2 : 0.58 }}
        className="shrink-0 border-t border-k-rule-dark px-6 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-5 sm:px-8"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/quote"
            onClick={onClose}
            className="rounded-full bg-k-gold-lit px-6 py-3 font-text text-k-label uppercase text-k-void transition-opacity duration-200 hover:opacity-90"
          >
            Get a quote
          </Link>
          <a
            href={site.phoneHref}
            className="rounded-full border border-k-rule-dark px-6 py-3 font-text text-k-label uppercase tabular-nums text-k-on-dark transition-colors duration-200 hover:border-k-gold-lit hover:text-k-gold-lit"
          >
            {site.phone}
          </a>
        </div>
        <p className="mt-4 font-text text-k-micro uppercase tabular-nums text-k-on-dark-faint">
          {`${site.city}, ${site.state} · USDOT ${site.usdot} · MC ${site.mc}`}
        </p>
      </m.div>
    </m.div>
  );
}

export default function MenuOverlay({
  open,
  onClose,
  links,
}: MenuOverlayProps) {
  /**
   * Holding the page still while the menu is open.
   *
   * This deliberately follows `open` rather than living inside the panel
   * itself. The panel stays mounted for as long as its closing animation
   * runs, and that animation is not guaranteed to finish on any particular
   * schedule: browsers stop animating a page the moment it is put in the
   * background, so a visitor who opens the menu and switches app mid-close
   * would come back to a page that had been left unable to scroll. Tying the
   * lock to the state instead means it lifts when the menu is dismissed,
   * whatever the animation is doing.
   */
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? <Panel onClose={onClose} links={links} /> : null}
    </AnimatePresence>
  );
}
