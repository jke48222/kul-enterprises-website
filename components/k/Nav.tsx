"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { services } from "@/lib/services";

/**
 * SITE NAVIGATION
 *
 * One floating pill sits at the top of every page. It never changes shape as
 * you scroll; only its background fades in, so the movement stays calm.
 *
 *   AT THE TOP OF THE PAGE   The pill is see-through and the hero picture
 *                            shows behind it.
 *
 *   ONCE SCROLLED            The same pill fades to a mostly solid dark
 *                            background so the words stay readable over
 *                            whatever is behind them.
 *
 *   SERVICES HOVERED         The pill stretches downward into a white panel.
 *                            The pill and the panel are one shape, so it
 *                            grows rather than dropping a separate box.
 *
 * The menu is split either side of the lion, which always sits in the middle.
 *
 * TO CHANGE THE MENU: edit LEFT_LINKS and RIGHT_LINKS below. Keep them the
 * same length so the lion stays centred.
 */

/** Menu items shown to the left of the lion. */
const LEFT_LINKS = [
  { href: "/services", label: "Services", panel: true },
  { href: "/drivers", label: "Drivers", panel: false },
  { href: "/safety", label: "Safety", panel: false },
  { href: "/road-ahead", label: "Road Ahead", panel: false },
] as const;

/** Menu items shown to the right of the lion. */
const RIGHT_LINKS = [
  { href: "/about", label: "About", panel: false },
  { href: "/carrier-packet", label: "Carrier Packet", panel: false },
  { href: "/contact", label: "Contact", panel: false },
] as const;

/** How far down the page the visitor scrolls before the background fades in. */
const SCROLL_TRIGGER_PX = 60;

export default function Nav() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_TRIGGER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Closing the panel on route change stops it hanging open after a click.
  useEffect(() => setPanelOpen(false), [pathname]);

  const sweep = reduced
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const };

  // Interior pages have no hero picture, so the pill starts solid there.
  const onHome = pathname === "/";
  const solid = scrolled || panelOpen || !onHome;

  // The panel turns the pill white, so the menu has to switch to dark text.
  const linkColour = panelOpen
    ? "text-k-ink hover:text-k-gold"
    : "text-k-on-dark hover:text-k-gold-lit";

  const renderLink = (link: { href: string; label: string; panel: boolean }) => (
    <li key={link.href}>
      <Link
        href={link.href}
        onMouseEnter={() => setPanelOpen(link.panel)}
        className={`whitespace-nowrap font-text text-k-label uppercase transition-colors duration-200 ${
          link.panel && panelOpen ? "text-k-gold" : linkColour
        }`}
      >
        {link.label}
      </Link>
    </li>
  );

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4"
      onMouseLeave={() => setPanelOpen(false)}
    >
      <m.div
        layout
        transition={sweep}
        className="mt-4 overflow-hidden backdrop-blur"
        style={{
          borderRadius: panelOpen ? 28 : 999,
          // Only the background fades. The pill itself never resizes on
          // scroll, which is what keeps the movement quiet.
          backgroundColor: panelOpen
            ? "rgba(252,252,252,0.97)"
            : solid
              ? "rgba(18,18,18,0.75)"
              : "rgba(18,18,18,0)",
          // At the very top of the home page the bar is completely invisible,
          // outline included, so nothing sits between the visitor and the
          // hero picture. It only draws itself once you start scrolling.
          border: panelOpen
            ? "1px solid rgba(0,0,0,0.08)"
            : solid
              ? "1px solid rgba(255,255,255,0.10)"
              : "1px solid rgba(255,255,255,0)",
          transition:
            "background-color 0.45s cubic-bezier(0.4,0,0.2,1), border-color 0.45s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* One fixed width bar. Everything inside is spaced evenly, and the
            lion stays in the middle because the two menu halves are equal. */}
        <nav
          aria-label="Primary"
          className="flex w-[min(1180px,94vw)] items-center justify-between py-2.5 pl-9 pr-2.5"
        >
          <ul className="hidden flex-1 items-center justify-evenly md:flex">
            {LEFT_LINKS.map(renderLink)}
          </ul>

          <Link
            href="/"
            aria-label="KUL Enterprises, back to the home page"
            className="shrink-0 px-8"
          >
            <Image
              src="/images/brand/lion-mark.webp"
              alt="KUL Enterprises"
              width={38}
              height={38}
              priority
            />
          </Link>

          <ul className="hidden flex-1 items-center justify-evenly md:flex">
            {RIGHT_LINKS.map(renderLink)}
          </ul>

          <Link
            href="/quote"
            className="ml-8 shrink-0 whitespace-nowrap rounded-full bg-k-gold-lit px-6 py-3 font-text text-k-label uppercase text-k-void transition-opacity duration-200 hover:opacity-90"
          >
            Get a quote
          </Link>
        </nav>

        {/* The services panel. It grows out of the pill, not under it. */}
        <AnimatePresence initial={false}>
          {panelOpen ? (
            <m.div
              key="panel"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduced ? undefined : { height: 0, opacity: 0 }}
              transition={sweep}
              className="overflow-hidden"
            >
              {/* Every service is in this row. It scrolls sideways rather
                  than shrinking the cards to fit. */}
              <div className="flex w-[min(1180px,94vw)] gap-4 overflow-x-auto px-5 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="flex w-[220px] shrink-0 flex-col gap-2.5"
                  >
                    <Image
                      src={service.card}
                      alt=""
                      width={900}
                      height={900}
                      className="h-[150px] w-full rounded-2xl object-cover"
                    />
                    <span className="font-display text-[19px] font-black leading-6 tracking-[-0.02em] text-k-ink">
                      {service.name}
                    </span>
                    <span className="font-text text-[12px] leading-[18px] text-k-ink-soft">
                      {service.blurb}
                    </span>
                  </Link>
                ))}

                {/* Sits at the end of the row, after the last service. */}
                <Link
                  href="/services"
                  className="flex w-[180px] shrink-0 flex-col items-start justify-center gap-3 rounded-2xl border border-k-rule bg-k-paper px-5"
                >
                  <span className="font-display text-[19px] font-black leading-6 tracking-[-0.02em] text-k-ink">
                    See all seven
                  </span>
                  <span className="border-b border-k-gold pb-0.5 font-text text-k-label uppercase text-k-gold">
                    View services
                  </span>
                </Link>
              </div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </m.div>
    </header>
  );
}
