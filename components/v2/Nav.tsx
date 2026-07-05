"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { EASE } from "@/components/v2/motion";
import { site } from "@/lib/site";
import MenuOverlay from "./MenuOverlay";

/**
 * §3.1 — fixed chrome bar. Three scroll states (top / hidden / pinned),
 * ground-aware theme flip driven by a single IntersectionObserver over
 * [data-ground] sections, hairline-underline active state (never gold),
 * ghost CTA on /quote and /contact. Renders MenuOverlay (mobile).
 */

type NavProps = Record<string, never>;

const LINKS = [
  { label: "Services", href: "/services" },
  { label: "Drivers", href: "/drivers" },
  { label: "Safety", href: "/safety" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

type ScrollState = "top" | "pinned" | "hidden";
type Ground = "ink" | "paper";

function Wordmark({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      aria-label="KUL Enterprises — home"
      onClick={onNavigate}
      className="relative z-[1] inline-flex h-11 flex-col items-end justify-center leading-none"
    >
      <span className="font-omnibus text-[20px] font-bold leading-none">
        KUL
      </span>
      <span className="mt-[3px] block font-mont text-[7px] font-semibold uppercase leading-none tracking-[0.3em]">
        Enterprises
      </span>
    </Link>
  );
}

export default function Nav({}: NavProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [scrollState, setScrollState] = useState<ScrollState>("top");
  const [theme, setTheme] = useState<Ground>("ink");
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  // Three scroll states, 6px direction threshold (§3.1).
  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;
    if (Math.abs(delta) < 6 && y >= 80) return;
    lastY.current = y;
    if (y < 80) setScrollState("top");
    else if (delta > 0 && y > window.innerHeight) setScrollState("hidden");
    else setScrollState("pinned");
  });

  // Theme flip: one IO watching [data-ground] sections crossing a 56px top
  // line; writes data-nav-theme on <html> and mirrors it into state.
  useEffect(() => {
    let io: IntersectionObserver | null = null;

    const apply = (ground: Ground) => {
      setTheme(ground);
      document.documentElement.setAttribute("data-nav-theme", ground);
    };

    const build = () => {
      io?.disconnect();
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-ground]"),
      );
      if (!sections.length) {
        apply("ink");
        return;
      }
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const ground = (entry.target as HTMLElement).dataset.ground;
            if (ground === "ink" || ground === "paper") apply(ground);
          }
        },
        {
          // A 1px horizontal band at 56px from the viewport top.
          rootMargin: `-56px 0px ${57 - window.innerHeight}px 0px`,
          threshold: 0,
        },
      );
      sections.forEach((s) => io?.observe(s));
    };

    build();
    window.addEventListener("resize", build);
    return () => {
      window.removeEventListener("resize", build);
      io?.disconnect();
    };
  }, [pathname]);

  // Close the overlay on route change.
  useEffect(() => setMenuOpen(false), [pathname]);

  const isPaper = theme === "paper";
  const pinned = scrollState === "pinned";
  const hidden = scrollState === "hidden" && !menuOpen;
  const ctaGhost = pathname === "/quote" || pathname === "/contact";
  const ghostClass = isPaper ? "btn-ghost-light" : "btn-ghost-dark";

  return (
    <>
      <m.header
        className={`fixed inset-x-0 top-0 z-[80] ${
          isPaper ? "text-ink" : "text-paper"
        }`}
        initial={false}
        animate={
          reduced ? { opacity: hidden ? 0 : 1 } : { y: hidden ? "-100%" : "0%" }
        }
        transition={{ duration: 0.3, ease: EASE.micro }}
      >
        <div
          className={`relative transition-colors duration-300 ${
            pinned
              ? isPaper
                ? "bg-paper/[0.85] backdrop-blur-md"
                : "bg-ink/[0.85] backdrop-blur-md"
              : "bg-transparent"
          }`}
        >
          <div className="mx-auto flex h-14 max-w-[1760px] items-center justify-between px-[clamp(20px,5vw,90px)]">
            <Wordmark />

            {/* Center links — desktop only */}
            <nav
              aria-label="Primary"
              className="absolute left-1/2 top-0 hidden h-full -translate-x-1/2 items-center gap-8 lg:flex"
            >
              {LINKS.map((link) => {
                const active =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className="relative flex h-11 items-center font-mont text-label font-semibold uppercase"
                  >
                    <span className="link-hairline">{link.label}</span>
                    {active && (
                      // Persistent hairline underline — currentColor, never gold.
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-2 h-px bg-current"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-5">
              <a
                href={site.phoneHref}
                className="hidden h-11 items-center font-mont text-micro font-medium uppercase tabular-nums md:inline-flex"
              >
                {site.phone}
              </a>
              {/* Gold element #1 in every viewport; ghost on /quote + /contact.
                  Hidden < md — the StickyMobileBar carries mobile gold (§3.3). */}
              <div className="hidden md:block">
                <Link
                  href="/quote"
                  className={`${ctaGhost ? ghostClass : "btn-gold"} uppercase`}
                >
                  Request a Quote
                </Link>
              </div>

              {/* Mobile MENU / CLOSE roll + two-line icon */}
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="v2-menu-overlay"
                className="relative flex h-11 min-w-[44px] items-center justify-end gap-3 font-mont text-label font-semibold uppercase lg:hidden"
              >
                <span aria-hidden className="block h-[1em] overflow-hidden">
                  <m.span
                    className="block"
                    initial={false}
                    animate={{ y: menuOpen ? "-1em" : "0em" }}
                    transition={{ duration: 0.3, ease: EASE.micro }}
                  >
                    <span className="block h-[1em] leading-none">Menu</span>
                    <span className="block h-[1em] leading-none">Close</span>
                  </m.span>
                </span>
                <span className="sr-only">
                  {menuOpen ? "Close menu" : "Open menu"}
                </span>
                <span aria-hidden className="relative block h-[10px] w-5">
                  <m.span
                    className="absolute left-0 top-0 block h-px w-full bg-current"
                    initial={false}
                    animate={menuOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE.micro }}
                  />
                  <m.span
                    className="absolute bottom-0 left-0 block h-px w-full bg-current"
                    initial={false}
                    animate={
                      menuOpen ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }
                    }
                    transition={{ duration: 0.3, ease: EASE.micro }}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* Hairline closing the bar — invisible at top state */}
          <div
            aria-hidden
            className={`absolute inset-x-0 bottom-0 h-px transition-opacity duration-300 ${
              isPaper ? "bg-ink/[0.15]" : "bg-white/[0.12]"
            } ${scrollState === "top" ? "opacity-0" : "opacity-100"}`}
          />
        </div>
      </m.header>

      {/* Sibling of the header: a fixed overlay must never live inside a
          transformed ancestor (the hide/show translate would re-anchor it). */}
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
