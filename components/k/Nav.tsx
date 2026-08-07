"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import MenuOverlay from "@/components/k/MenuOverlay";
import MenuMark from "@/components/k/MenuMark";
import { SearchBarButton, SearchCorner, SearchPanel } from "@/components/k/Search";
import { NAV_PANELS, type PanelKey } from "@/components/k/NavPanels";
import { fill } from "@/lib/content";
import nav from "@/content/navigation.json";

/**
 * SITE NAVIGATION
 *
 * One floating pill sits at the top of every page. It never changes shape as
 * you scroll; only the material it is made of firms up, so the movement stays
 * calm.
 *
 *   AT THE TOP OF THE HOME   A light smoked glass. The hero film carries on
 *   PAGE                     moving and colouring through it, and the pill
 *                            lifts off the picture on the faintest shadow.
 *
 *   ONCE SCROLLED, AND ON    The same glass, firmer. The tint deepens, the
 *   EVERY INTERIOR PAGE      lit edge along its top brightens, and a layered
 *                            shadow arrives underneath so the bar separates
 *                            from the page rather than floating on it.
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
 * TO CHANGE THE MENU: edit the three lists below. Read the note on
 * MENU_BREAKPOINT before adding a link or lengthening a label, because the
 * bar is already close to full.
 */

/**
 * Menu items to the left of the lion. Everything on this side is the freight:
 * what we haul, who drives it, how it is kept safe, and the paperwork a broker
 * needs to set us up. The Carrier Packet reads as a company page and is not
 * one, which is why the footer has always filed it under Freight; it sits here
 * now so the bar and the footer agree.
 */
/**
 * A link as the CMS stores it, turned into a link this file can trust.
 *
 * `panel` arrives from JSON as a plain string, and only some strings name a
 * real preview panel in NavPanels. Rather than assert, the value is checked
 * against the panels that actually exist: a link naming a panel that was never
 * built simply gets no preview and still navigates, which is the right way for
 * a CMS field to fail. An empty string is how the CMS says "no panel".
 */
const withPanel = (links: readonly { href: string; label: string; panel: string }[]) =>
  links.map((l) => ({
    href: l.href,
    label: fill(l.label),
    panel: (l.panel && l.panel in NAV_PANELS ? l.panel : null) as PanelKey | null,
  }));

const LEFT_LINKS = withPanel(nav.bar.leftLinks);

/**
 * Menu items to the right of the lion. Everything on this side is the company
 * and the conversation.
 *
 * THE JOURNEY SITS HERE, DIRECTLY AFTER ABOUT, and that placement is the whole
 * argument for where it goes. It is the founder's story rather than anything
 * being sold, so putting it on the left among Services and Safety would file a
 * story page as an operations page and a broker scanning for a service would
 * stop on it by mistake. About is the page that raises the question the
 * Journey answers, so the two belong next to each other, which is exactly how
 * the footer already groups them under Company.
 */
const RIGHT_LINKS = withPanel(nav.bar.rightLinks);

/**
 * Pages the menu carries but the wide bar has no room for.
 *
 * Seven top-level links, the lion and the quote button already filled the bar;
 * the arithmetic under MENU_BREAKPOINT below is how close it was. An eighth
 * did not fit at any width the bar is asked to work at, so one link had to come
 * off, and The Road Ahead is the one that costs least. It is a vision page with
 * nothing transactional on it, the home page links to it directly from the
 * fleet numbers, the Drivers page links to it in the body copy, and the footer
 * lists it under Company. Nothing else on the bar has that many ways in.
 *
 * TO PUT IT BACK ON THE BAR something else has to leave, because the widths
 * below have no slack for a fourth link on the right of the lion.
 */
const MENU_ONLY_LINKS = withPanel(nav.bar.menuOnlyLinks);

/**
 * Every page again as one list, for the menu panel to read. Reading the lists
 * above rather than keeping a separate copy is what stops the wide bar and the
 * menu panel drifting apart when a page is added to one of them.
 *
 * The menu-only page is spliced in before the right-hand links rather than
 * added at the end, because the menu is read straight down and Contact should
 * be the last page a thumb passes before the quote button and the phone number
 * pinned at the foot of the panel.
 */
const MENU_LINKS = [...LEFT_LINKS, ...MENU_ONLY_LINKS, ...RIGHT_LINKS];

/** How far down the page the visitor scrolls before the glass firms up. */
const SCROLL_TRIGGER_PX = 60;

/**
 * The width the bar swaps arrangement at. At this width and above it lays
 * the menu out across the pill; below it the menu is put away behind a Menu
 * button and MenuOverlay.tsx takes over.
 *
 * Where 1240 comes from. Two things have to fit across the window: the pill,
 * and the search circle that owns the top right corner from this width up.
 * The pill's menus need 1036 pixels, measured out below, and the corner
 * needs 80 a side: 16 of edge, the 56 circle, 8 of clearance, reserved on
 * BOTH sides so the pill stays centred and the lion stays on the window's
 * centre line. 1036 plus 160 is 1196, at which the bar would be running at
 * its own limit; at 1240 the pill still has about 44 pixels of slack.
 *
 * The halves, with the lion dead centre and both given equal width so that
 * holds, governed by whichever is wider. Measured in the browser at the 12px
 * tracked caps the links are set in:
 *
 *   RIGHT HALF, 457px   About 51, The Journey 103, Contact 71, two 28px gaps
 *                       between them, a 28px gap after them, and the 148px
 *                       quote button. This half governs, because the quote
 *                       button only exists on this side.
 *
 *   LEFT HALF, 426px    24px of inset, then Services 72, Drivers 63, Safety 58
 *                       and Carrier Packet 125 with three 28px gaps.
 *
 * Two of the wider half, plus the lion column at 102 and the pill's own 20 of
 * padding, is 1036 pixels of pill.
 *
 * ADDING A LINK OR LENGTHENING A LABEL widens one half and eats the slack,
 * and once it is gone this number has to rise or the bar starts clipping
 * again. Every extra pixel on the wider half costs two pixels of pill and a
 * little over two pixels here, and the search corner has already spent what
 * the number used to hold in reserve. Measure it in a browser rather than
 * trusting the sum, and change the min-[1240px] in the class names below to
 * match, because Tailwind cannot read a constant. The corner's own width
 * lives in components/k/Search.tsx and the reservation is the third term in
 * the pill's width clamp; the three have to agree.
 */
const MENU_BREAKPOINT = 1240;

/**
 * THE BAR AS A MATERIAL, NOT A BOX.
 *
 * The bar reads as a piece of smoked glass laid over the page: the page keeps
 * its colour and its movement through it, a lit hairline runs along its top
 * edge where the light would catch, and a layered shadow sets it above the
 * page rather than printed on it. Three states, and the difference between
 * them is how firm the glass is, never how big it is.
 *
 * WHY THE TINTS ARE THESE NUMBERS AND NOT LIGHTER. The bar has to stay legible
 * over two opposite grounds: the near-white interior pages, and full-bleed
 * photography that runs from black to a blown-out white. Because it is
 * see-through, its real colour is a mix of this tint and whatever is behind it,
 * so the lighter the tint the lighter that mix gets and the harder the words
 * are to read. The binding constraint is the gold hover, never the resting
 * white, because gold-lit is a much darker colour than the paper white the
 * links sit at when nobody is pointing at them.
 *
 * These were measured, not guessed. Each figure below comes from reading the
 * real pixels the browser had behind the bar, compositing this tint over them,
 * and taking the ratio against #fcfcfc resting and #d6a145 hovered. The
 * brightest single pixel inside a link's own text box was used every time,
 * which is the worst case a reader can actually hit:
 *
 *   FIRM, 0.84   On the light pages the ground is k-paper #f0f0f0 and the
 *                glass composites to #323232: 12.47:1 resting, 5.51:1 hovered.
 *                On the Journey the sequence puts eleven photographs under the
 *                bar and one of them has a pure white #ffffff pixel there; the
 *                glass composites even that to #353535, 12.03:1 and 5.32:1.
 *
 *   HERO, 0.55   Sampled across fourteen frames of the whole 8.67 second hero
 *                film. The worst frame lands behind the Journey link and
 *                composites to #3d3839: 11.19:1 resting and 4.94:1 hovered.
 *                Dropping this to 0.50 takes the hover to 4.61:1 and 0.42 puts
 *                it under the 4.5:1 minimum, so there is roughly one step of
 *                room here and no more.
 *
 * ANY CHANGE TO THESE VALUES HAS TO BE RE-MEASURED against both grounds, and
 * the gold hover is the one that fails first. Changing the hero film counts as
 * changing these values, because the numbers above are a property of that film.
 *
 * The tints are hand-written rgba on purpose. Tailwind's opacity modifiers do
 * not work on the k- tokens, and `bg-k-void/70` renders nothing at all rather
 * than a see-through surface, which has shipped as a bug here twice.
 */
const GLASS_FILTER = "blur(20px) saturate(165%)";

/**
 * EVERY STATE BELOW HAS THE SAME FIVE SHADOW LAYERS IN THE SAME ORDER, and
 * every layer is inset in all three states or in none of them. This is not
 * tidiness. A browser can only ease one box-shadow into another when the two
 * have the same number of layers and each pair agrees about being inset; the
 * moment they differ it gives up and swaps them on the first frame. The first
 * version of this had three layers over the hero and five once scrolled, and
 * the shadow banged into place while the tint was still easing. Layers that a
 * state does not want are kept as a fully transparent `0 0 0 0`, which costs
 * nothing to paint and gives the transition something to interpolate to.
 *
 *   1  the ring that gives the pill its edge
 *   2  the hairline along the top where the light catches
 *   3  the tight contact shadow
 *   4  the mid lift
 *   5  the wide soft pool
 *
 * Layers 3 to 5 are three shadows rather than one because a single large blur
 * reads as a sticker dropped on the page, and a contact shadow with a lift and
 * a pool behind it reads as an object held above it. The two wide ones are
 * pulled in hard with a negative spread so nothing bleeds sideways past the
 * pill and turns into a halo.
 */
const SURFACE = {
  /** The top of the home page, over the hero film. */
  hero: {
    tint: "rgba(14,14,14,0.55)",
    /* A sheen down the first 18 pixels, which is where a curved glass edge
       would catch the sky. Held in pixels rather than a percentage because
       this same background stretches over the services panel when it opens,
       and a percentage would smear the sheen down the whole panel. It stops
       well above the caps, which start at 26 pixels, so it lifts the edge
       without lifting the ground the words are measured against. */
    sheen:
      "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0) 18px)",
    /* No contact shadow and no pool. The bar is sitting on a photograph here,
       and a dark halo on a dark photograph reads as a smudge, so all the lift
       comes from the single soft layer four. */
    shadow: [
      "inset 0 0 0 1px rgba(255,255,255,0.06)",
      "inset 0 1px 0 rgba(255,255,255,0.14)",
      "0 0 0 0 rgba(0,0,0,0)",
      "0 10px 26px -18px rgba(0,0,0,0.55)",
      "0 0 0 0 rgba(0,0,0,0)",
    ].join(", "),
  },
  /** Scrolled, and every interior page from its first frame. */
  firm: {
    tint: "rgba(14,14,14,0.84)",
    sheen:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0) 18px)",
    shadow: [
      "inset 0 0 0 1px rgba(255,255,255,0.08)",
      "inset 0 1px 0 rgba(255,255,255,0.18)",
      "0 1px 1px 0 rgba(0,0,0,0.04)",
      "0 10px 22px -12px rgba(0,0,0,0.26)",
      "0 26px 56px -30px rgba(0,0,0,0.40)",
    ].join(", "),
  },
  /** The services panel is open and the pill has turned into paper. */
  panel: {
    tint: "rgba(252,252,252,0.97)",
    /* The sheen is kept as a shape and emptied rather than set to `none`. A
       white highlight on a white panel would be invisible anyway, and a
       gradient cannot cross-fade into a keyword, so this keeps the door open
       for ever animating it. The ring below flips to ink instead, because a
       lit top edge on paper is a thing glass does and paper does not. */
    sheen:
      "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0) 18px)",
    shadow: [
      "inset 0 0 0 1px rgba(0,0,0,0.07)",
      "inset 0 1px 0 rgba(255,255,255,0)",
      "0 2px 4px 0 rgba(0,0,0,0.04)",
      "0 24px 60px -28px rgba(0,0,0,0.34)",
      "0 0 0 0 rgba(0,0,0,0)",
    ].join(", "),
  },
} as const;

/**
 * Ties whichever link is hovered to the panel it opens, for screen readers.
 *
 * One id rather than one per link, because only one panel is ever open and
 * only the link that opened it carries aria-controls at that moment.
 */
const PANEL_ID = "kul-nav-panel";

export default function Nav() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [openPanel, setOpenPanel] = useState<PanelKey | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  /**
   * Kept stable rather than written inline where it is used. The menu panel
   * builds its keyboard trap around this function, and rebuilds it whenever
   * the function changes; handing it a new one on every render of this bar
   * would tear the trap down and put the cursor back on the Close button
   * mid-way through someone tabbing through the menu.
   */
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Stable for the same reason as closeMenu above: the search panel builds
  // its keyboard trap around this function and rebuilds it when it changes.
  const closeSearch = useCallback(() => setSearchOpen(false), []);

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
    setOpenPanel(null);
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  /**
   * Command K on a Mac, Control K elsewhere, opens the search from anywhere
   * on the page, which is the shortcut every search on the web has settled
   * on, and presses it closed again. It closes the menu on its way in: two
   * sheets over the page at once and the reader is under a pile, not on a
   * site.
   */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMenuOpen(false);
        setOpenPanel(null);
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /**
   * A press anywhere off the bar closes the search, which is how every
   * dropdown on the web says "never mind". pointerdown rather than click,
   * so it is gone before the page underneath acts on the press, and only
   * while the search is out, so the page is never carrying a listener for
   * a panel that is not there.
   */
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!searchOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [searchOpen]);

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

  // Interior pages have no hero picture, so the glass starts firm there.
  const onHome = pathname === "/";
  // The pill is "open" whether it grew a services panel on hover or the
  // search on click; the material change is the same event either way.
  const panelOpen = openPanel !== null || searchOpen;
  // WITH THE MENU OPEN THE PILL IS SITTING ON THE MENU, NOT ON THE PAGE. The
  // hero surface is nearly clear glass, which is right over a photograph and
  // wrong over a flat dark panel: the pill loses its edge entirely and the
  // mark appears to be floating on the menu rather than held in the bar. So
  // the menu firms it up, exactly as scrolling does.
  const surface = panelOpen
    ? SURFACE.panel
    : scrolled || !onHome || menuOpen
      ? SURFACE.firm
      : SURFACE.hero;

  // The panel turns the pill white, so the menu has to switch to dark text.
  const linkColour = panelOpen
    ? "text-k-ink hover:text-k-gold"
    : "text-k-on-dark hover:text-k-gold-lit";

  // The search circle wears the page's glass until it is pressed, and then
  // it turns to paper WITH the pill, at the client's word: the press is one
  // event and the two objects answer it in the same material. It still never
  // follows the hover panels, which are the pill's own affair.
  const circleSurface = searchOpen
    ? SURFACE.panel
    : scrolled || !onHome
      ? SURFACE.firm
      : SURFACE.hero;

  /**
   * One row of the menu.
   *
   * EVERY LINK ON THE BAR OPENS A PANEL, and each opens a different one. The
   * link still goes to its own page when it is followed, so nothing is trapped
   * behind a panel. On a touch screen, where there is no hover at all, tapping
   * simply goes to the page, which is the right result.
   *
   * Opening on focus as well as on hover is what makes the panels exist for
   * somebody using a keyboard. Focus is the keyboard's hover, and without it
   * the pointer was the only way in. Escape closes the panel again without
   * leaving the link, so a keyboard user is never made to tab out through the
   * whole panel to get past it.
   */
  const renderLink = (link: { href: string; label: string; panel: PanelKey | null }) => {
    const isOpen = link.panel !== null && link.panel === openPanel;
    return (
      <li key={link.href}>
        <Link
          href={link.href}
          // While the search is out, wandering the pointer across the menu
          // must not swap the panel away mid-thought: typed words outrank a
          // stray hover. The links still navigate; only the previews wait.
          onMouseEnter={() => {
            if (!searchOpen) setOpenPanel(link.panel);
          }}
          onFocus={() => {
            if (!searchOpen) setOpenPanel(link.panel);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape" && openPanel) setOpenPanel(null);
          }}
          {...(link.panel
            ? // aria-controls only while the panel is actually in the DOM: a
              // reference to an unmounted id is a broken promise to AT.
              { "aria-expanded": isOpen, ...(isOpen ? { "aria-controls": PANEL_ID } : {}) }
            : {})}
          className={`whitespace-nowrap font-text text-k-label uppercase transition-colors duration-200 ${
            isOpen ? "text-k-gold" : linkColour
          }`}
        >
          {link.label}
        </Link>
      </li>
    );
  };

  return (
    <>
      <header
        // THE BAR STACKS ABOVE THE MENU PANEL, WHICH IS WHY THIS IS 95 AND NOT
        // 50. MenuOverlay sits at 90 and covers the whole screen, so at 50 it
        // buried the button that opened it and the menu had to grow a second,
        // differently placed Close control. Above it, one button does both
        // jobs without moving, and the pill it lives in stays where the reader
        // last saw it. The route transition is at 200 and still covers both.
        className="fixed inset-x-0 top-0 z-[95] flex justify-center px-4"
        onMouseLeave={() => setOpenPanel(null)}
        // Escape works wherever focus is. It sat on the trigger link alone,
        // so a keyboard reader who tabbed INTO the open panel had no way
        // back except through every link in it.
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpenPanel(null);
            setSearchOpen(false);
          }
        }}
        ref={headerRef}
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
            keeps working when a scrollbar is taking up part of the window.

            THIS IS A PLAIN DIV, NOT AN `m.div`. It used to carry framer's
            `layout` prop, which does nothing here: layout animations live in
            the domMax feature set and this app runs LazyMotion on domAnimation,
            so the prop was failing silently and reading as though the pill
            animated its own size when it never has. Every state change on it is
            a CSS transition, below, which is also the only reason it stays
            smooth while the services panel is animating its height.

            THE EDGE AND THE SHADOW ARE BOX-SHADOWS, NOT A BORDER. A real border
            would have to be present in every state to avoid the bar changing
            height by two pixels the moment it firms up, and it cannot be given
            the top-lit hairline that makes the glass read as a curved edge. An
            inset shadow costs no layout at all. */}
        <div
          className="mt-4 w-[min(1180px,94vw)] max-w-full overflow-hidden min-[1240px]:w-[min(1180px,94vw,100vw_-_160px)]"
          style={{
            borderRadius: panelOpen ? 28 : 999,
            backgroundColor: surface.tint,
            backgroundImage: surface.sheen,
            boxShadow: surface.shadow,
            /* The blur and the saturation never change, so the browser is
               never asked to re-blur the whole backdrop at a new radius while
               a frame is in flight. Saturation is what stops translucency
               reading as fog: the colour of the page underneath stays alive
               through the glass instead of going grey. */
            backdropFilter: GLASS_FILTER,
            WebkitBackdropFilter: GLASS_FILTER,
            /* The shadow is given a little longer than the tint so the depth
               settles just after the colour does, which is what makes the bar
               feel like it is being set down rather than switched on. Both
               curves are the house micro easing from globals.css. */
            transition:
              "background-color var(--duration-standard) var(--ease-micro), box-shadow 520ms var(--ease-micro)",
          }}
        >
          {/* One fixed width bar, in two arrangements.

              FROM 1240 PIXELS WIDE AND UP the bar is laid out as three columns.
              The outer two are always given exactly the same width and the lion
              sits in the column between them, which is what puts it on the dead
              centre of the bar. The menus are then pushed out to the two ends,
              away from the lion. Because the centring comes from the columns
              rather than from counting menu items, the lion stays put even if
              the menu gains or loses an item later.

              For that to hold, the padding on the two ends has to stay equal. If
              you change one side, change the other by the same amount.

              BELOW 1240 PIXELS the menu is put away. The bar becomes the lion at
              one end and the search, Menu and quote buttons at the other, and
              the menu itself moves into the panel in MenuOverlay.tsx, which is
              also the only place The Road Ahead appears. There is no third
              arrangement in between, because there is no width between a phone
              and the swap point where seven links, the lion, the quote button
              and the search fit on one line with room to breathe. See
              MENU_BREAKPOINT above. */}
          <nav
            aria-label="Primary"
            className="flex w-full items-center justify-between py-2.5 pl-6 pr-2.5 min-[1240px]:grid min-[1240px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] min-[1240px]:px-2.5"
          >
            {/* The menu to the left of the lion, packed against the near end of
                the bar. Below the swap point it is not rendered at all. */}
            <ul className="hidden items-center gap-x-7 pl-6 min-[1240px]:flex">
              {LEFT_LINKS.map(renderLink)}
            </ul>

            {/* The lion. The wide bar gives it padding on both sides, which is
                what holds the menu off it; the narrow bar has nothing beside it
                to hold off, so it sits on the end of the pill instead. */}
            {/* THE MARK IS 38px AND SO WAS ITS TARGET, three pixels under the
                44px a thumb needs, and it is the control every visitor reaches
                for to get home. The pseudo-element takes the target to exactly
                44 square without adding a pixel to the pill, which would
                otherwise grow the whole bar. It helps the wide bar too: the
                horizontal padding there was already generous but the height
                was still 38. */}
            <Link
              href="/"
              aria-label="KUL Enterprises, back to the home page"
              className="relative shrink-0 before:absolute before:-inset-[3px] before:content-[''] min-[1240px]:justify-self-center min-[1240px]:px-8"
            >
              <Image
                src="/images/brand/lion-mark.webp"
                alt="KUL Enterprises"
                width={38}
                height={38}
                priority
              />
            </Link>

            {/* Everything at the far end of the bar. Which of the four is
                showing changes with the width, but they always sit together and
                always end flush with the quote button.

                THE GAP DROPS TO 4px UNDER 360, measured on the 344 pixel
                cover screen of a folded phone: at 8px the row runs 2px past
                the pill there and the pill shaves the end off the quote
                button. Two 4px gaps buy the row 8px back, which is 6 more
                than it needs. */}
            <div className="flex items-center gap-x-1 min-[360px]:gap-x-2 min-[1240px]:justify-end min-[1240px]:gap-x-7">
              <ul className="hidden items-center gap-x-7 min-[1240px]:flex">
                {RIGHT_LINKS.map(renderLink)}
              </ul>

              {/* THE SEARCH, at every width below the corner circle. The same
                  44 pixel square as the menu mark beside it. Pressing it
                  swaps whatever the pill was showing for the search; pressing
                  it again puts the search away. */}
              <SearchBarButton
                colour={linkColour}
                open={searchOpen}
                onToggle={() => {
                  setOpenPanel(null);
                  setMenuOpen(false);
                  setSearchOpen((v) => !v);
                }}
              />

              {/* THE MENU BUTTON IS A MARK, NOT THE WORD, AND IT IS ALSO THE
                  CLOSE BUTTON.
                  The word had to be set in the same size, case and face as the
                  seven links it stands in for, so on a phone it read as an
                  eighth destination sitting next to Get a quote rather than as
                  the way in to the other seven.

                  ONE CONTROL, TWO STATES. The panel used to carry its own
                  Close button at the other side of its own header row, so
                  opening the menu made the mark disappear from one place and a
                  word appear in another. Now the bar stays above the open
                  panel and this same button folds into a cross, which is why
                  the header is stacked above MenuOverlay rather than under it.
                  The drawing and the fold are in components/k/MenuMark.tsx.

                  THE ACCESSIBLE NAME IS ON THE BUTTON, and it changes with the
                  state, so a screen reader hears "Menu, expanded" and then
                  "Close menu". The square is 44 by 44, the smallest target a
                  thumb can be asked to find. */}
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setMenuOpen((v) => !v);
                }}
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                aria-controls="k-menu"
                aria-label={menuOpen ? "Close menu" : "Menu"}
                className={`flex h-11 w-11 shrink-0 items-center justify-center transition-colors duration-200 min-[1240px]:hidden ${linkColour}`}
              >
                <MenuMark open={menuOpen} />
              </button>

              <Link
                href="/quote"
                /* 12px of caps in 12px of padding measures 40px tall, four
                   short of the target a thumb needs on the one button the whole
                   site is trying to get people to press. The height is bought
                   with a pseudo-element rather than more padding, because
                   padding here grows the pill and the pill sets the height of
                   the bar at every width. */
                className="relative shrink-0 whitespace-nowrap rounded-full bg-k-gold-lit px-6 py-3 font-text text-k-label uppercase text-k-void transition-opacity duration-200 before:absolute before:-inset-y-0.5 before:inset-x-0 before:content-[''] hover:opacity-90"
              >
                Get a quote
              </Link>
            </div>
          </nav>

          {/* The panel. It grows out of the pill, not under it, and which one
              it is depends on the link being hovered. The shapes are all in
              components/k/NavPanels.tsx; nothing about them is decided here.

              KEYED ON THE PANEL NAME so that moving from one link to the next
              swaps the contents rather than closing and reopening. Without the
              key, React reuses the same element and the new panel's markup
              appears inside the old one's height animation, which reads as the
              menu stuttering. */}
          {/* KEYED ON THE PATH ON PURPOSE. The closing animation is run by
              JavaScript, and a browser stops running that for any tab that
              is not on screen, so a panel closed by a navigation the reader
              made in another tab, a control-click, a middle-click, would
              wait half-open until this tab was next looked at, and "wait"
              holds the next panel back until the old one has finished
              leaving. Remounting on navigation throws a dying panel away at
              once instead of animating it: nobody can watch a collapse
              through a page swap anyway, and a panel must never outlive the
              page it was opened over. */}
          <AnimatePresence key={pathname} initial={false} mode="wait">
            {searchOpen ? (
              /* THE SEARCH GROWS OUT OF THE PILL exactly as the services
                 panels do, through the same animation with the same easing,
                 because it is the same event: the bar opening. The only
                 difference is the trigger. Hover opens a menu being skimmed;
                 a click opens a tool being used, so the search waits to be
                 pressed and does not close when the pointer wanders. It is
                 keyed apart from the panels so moving between the two swaps
                 the contents rather than reopening the shape. */
              <m.div
                key="search"
                initial={reduced ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reduced ? undefined : { height: 0, opacity: 0 }}
                transition={sweep}
                className="overflow-hidden"
              >
                <SearchPanel onClose={closeSearch} />
              </m.div>
            ) : openPanel ? (
              <m.div
                key={openPanel}
                initial={reduced ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reduced ? undefined : { height: 0, opacity: 0 }}
                transition={sweep}
                id={PANEL_ID}
                className="overflow-hidden"
              >
                {(() => {
                  const Panel = NAV_PANELS[openPanel];
                  return <Panel />;
                })()}
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* THE SEARCH, from 1240 up: a circle of the bar's own glass holding
            the top right corner of the window, on the pill's midline. The
            pill's width clamp above is what reserves this corner; the two
            agree through MENU_BREAKPOINT, and the note on that constant is
            where the arithmetic lives. Pressing it opens the search out of
            the pill; pressing it again puts the search away. */}
        <SearchCorner
          surface={circleSurface}
          open={searchOpen}
          onToggle={() => {
            setOpenPanel(null);
            setSearchOpen((v) => !v);
          }}
        />
      </header>

      {/* The menu panel for every width below the swap point. It sits outside
          the bar rather than inside it because the bar carries its own
          stacking order, and anything nested in it is stuck underneath the
          sticky bar at the bottom of the screen however high it is stacked. */}
      <MenuOverlay open={menuOpen} onClose={closeMenu} links={MENU_LINKS} />
    </>
  );
}
