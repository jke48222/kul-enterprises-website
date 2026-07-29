"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { services } from "@/lib/services";
import MenuOverlay from "@/components/k/MenuOverlay";

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
 * The bar has exactly two arrangements, and MENU_BREAKPOINT below is the
 * width they swap at. There is deliberately nothing in between: an earlier
 * version squeezed the full menu into the middle widths and it never fit, so
 * the links ended up touching each other and the quote button was cut off by
 * the edge of the pill.
 *
 * TO CHANGE THE MENU: edit LEFT_LINKS and RIGHT_LINKS below. Keep them the
 * same length so the lion stays centred, and read the note on
 * MENU_BREAKPOINT before adding a link or lengthening a label.
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

/**
 * The same pages again as one list, for the menu panel to read. Reading the
 * two lists above rather than keeping a third copy is what stops the wide bar
 * and the menu panel drifting apart when a page is added to one of them.
 */
const MENU_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

/** How far down the page the visitor scrolls before the background fades in. */
const SCROLL_TRIGGER_PX = 60;

/**
 * The width the bar swaps arrangement at. At this width and above it lays
 * the menu out across the pill; below it the menu is put away behind a Menu
 * button and MenuOverlay.tsx takes over.
 *
 * Where 1180 comes from. The pill is 94% of the window, the lion sits dead
 * centre, and the two halves either side of it are given equal width for that
 * to hold, so the bar is governed by whichever half is wider. Measured today
 * that is the right one at 479 pixels: three links, the gaps between them,
 * and the quote button. Two of those plus the lion and the padding is 1080
 * pixels of pill, which the window reaches at 1149.
 *
 * The number here is 1180 rather than 1149 so the bar is never asked to run
 * at exactly its own limit. That leaves about 30 pixels of window spare, and
 * spending it is what any change below has to come out of first.
 *
 * ADDING A LINK OR LENGTHENING A LABEL widens that half and eats the margin,
 * and once it is gone this number has to rise or the bar starts clipping
 * again. Every extra pixel on the wider half costs two pixels of pill and a
 * little over two pixels here. Measure it in a browser rather than trusting
 * the sum, and change the number in the class names below to match, because
 * Tailwind cannot read a constant.
 */
const MENU_BREAKPOINT = 1180;

/** Ties the Services link to the panel it opens, for screen readers. */
const SERVICES_PANEL_ID = "kul-services-panel";

export default function Nav() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Kept stable rather than written inline where it is used. The menu panel
   * builds its keyboard trap around this function, and rebuilds it whenever
   * the function changes; handing it a new one on every render of this bar
   * would tear the trap down and put the cursor back on the Close button
   * mid-way through someone tabbing through the menu.
   */
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_TRIGGER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Closing both on route change stops them hanging open after a click. The
  // menu links close the menu on their way out too, but this also covers the
  // back button, which they never see.
  useEffect(() => {
    setPanelOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Widening the window past the swap point puts the laid-out menu back and
  // takes the Menu button away with it. Without this the menu panel would be
  // left covering the screen with nothing on it to close it but the keyboard.
  useEffect(() => {
    const laidOut = window.matchMedia(`(min-width: ${MENU_BREAKPOINT}px)`);
    const onChange = () => {
      if (laidOut.matches) setMenuOpen(false);
    };
    laidOut.addEventListener("change", onChange);
    return () => laidOut.removeEventListener("change", onChange);
  }, []);

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

  /**
   * One row of the menu.
   *
   * The Services row also opens the panel of service cards below the bar.
   * That used to happen on hover and on nothing else, which meant the panel
   * did not exist for anybody using a keyboard: the pointer was the only way
   * in. Focus is the keyboard's version of hover, so it opens the panel too,
   * and Escape closes it again without leaving the link.
   *
   * The link still goes to the services page when it is followed, so nothing
   * is trapped behind the panel. On a touch screen, where there is no hover
   * at all, tapping simply goes to that page, which is the right result.
   */
  const renderLink = (link: { href: string; label: string; panel: boolean }) => (
    <li key={link.href}>
      <Link
        href={link.href}
        onMouseEnter={() => setPanelOpen(link.panel)}
        onFocus={() => setPanelOpen(link.panel)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && panelOpen) setPanelOpen(false);
        }}
        {...(link.panel
          ? { "aria-expanded": panelOpen, "aria-controls": SERVICES_PANEL_ID }
          : {})}
        className={`whitespace-nowrap font-text text-k-label uppercase transition-colors duration-200 ${
          link.panel && panelOpen ? "text-k-gold" : linkColour
        }`}
      >
        {link.label}
      </Link>
    </li>
  );

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4"
        onMouseLeave={() => setPanelOpen(false)}
      >
        {/* The pill. It carries the width for everything inside it, which is
            what keeps the bar and the services panel below it exactly the same
            width as each other.

            The width is 94% of the window, but never wider than the space the
            header leaves after its own padding. Without that second limit the
            bar asks for more room than the pill it is drawn inside can give it
            on any screen under about 530 pixels, and the pill quietly crops
            the far end off, taking the gap to the right of the quote button
            with it. `max-w-full` rather than another window measurement so it
            keeps working when a scrollbar is taking up part of the window. */}
        <m.div
          layout
          transition={sweep}
          className="mt-4 w-[min(1180px,94vw)] max-w-full overflow-hidden backdrop-blur"
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
          {/* One fixed width bar, in two arrangements.

              FROM 1180 PIXELS WIDE AND UP the bar is laid out as three columns.
              The outer two are always given exactly the same width and the lion
              sits in the column between them, which is what puts it on the dead
              centre of the bar. The menus are then pushed out to the two ends,
              away from the lion. Because the centring comes from the columns
              rather than from counting menu items, the lion stays put even if
              the menu gains or loses an item later.

              For that to hold, the padding on the two ends has to stay equal. If
              you change one side, change the other by the same amount.

              BELOW 1180 PIXELS the menu is put away. The bar becomes the lion at
              one end and the Menu and quote buttons at the other, and the menu
              itself moves into the panel in MenuOverlay.tsx. There is no third
              arrangement in between, because there is no width between a phone
              and 1180 where seven links, the lion and the quote button fit on
              one line with room to breathe. See MENU_BREAKPOINT above. */}
          <nav
            aria-label="Primary"
            className="flex w-full items-center justify-between py-2.5 pl-6 pr-2.5 min-[1180px]:grid min-[1180px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] min-[1180px]:px-2.5"
          >
            {/* The menu to the left of the lion, packed against the near end of
                the bar. Below the swap point it is not rendered at all. */}
            <ul className="hidden items-center gap-x-7 pl-6 min-[1180px]:flex">
              {LEFT_LINKS.map(renderLink)}
            </ul>

            {/* The lion. The wide bar gives it padding on both sides, which is
                what holds the menu off it; the narrow bar has nothing beside it
                to hold off, so it sits on the end of the pill instead. */}
            <Link
              href="/"
              aria-label="KUL Enterprises, back to the home page"
              className="shrink-0 min-[1180px]:justify-self-center min-[1180px]:px-8"
            >
              <Image
                src="/images/brand/lion-mark.webp"
                alt="KUL Enterprises"
                width={38}
                height={38}
                priority
              />
            </Link>

            {/* Everything at the far end of the bar. Which of the three is
                showing changes with the width, but they always sit together and
                always end flush with the quote button. */}
            <div className="flex items-center gap-x-2 min-[1180px]:justify-end min-[1180px]:gap-x-7">
              <ul className="hidden items-center gap-x-7 min-[1180px]:flex">
                {RIGHT_LINKS.map(renderLink)}
              </ul>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                aria-controls="k-menu"
                className={`shrink-0 whitespace-nowrap px-4 py-3 font-text text-k-label uppercase transition-colors duration-200 min-[1180px]:hidden ${linkColour}`}
              >
                Menu
              </button>

              <Link
                href="/quote"
                className="shrink-0 whitespace-nowrap rounded-full bg-k-gold-lit px-6 py-3 font-text text-k-label uppercase text-k-void transition-opacity duration-200 hover:opacity-90"
              >
                Get a quote
              </Link>
            </div>
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
                id={SERVICES_PANEL_ID}
                className="overflow-hidden"
              >
                {/* Every service is in this row. It scrolls sideways rather
                    than shrinking the cards to fit. */}
                <div className="flex w-full gap-4 overflow-x-auto px-5 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                      Compare all
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

      {/* The menu panel for every width below the swap point. It sits outside
          the bar rather than inside it because the bar carries its own
          stacking order, and anything nested in it is stuck underneath the
          sticky bar at the bottom of the screen however high it is stacked. */}
      <MenuOverlay open={menuOpen} onClose={closeMenu} links={MENU_LINKS} />
    </>
  );
}
