"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { EASE } from "@/components/v3/motion";
import { site } from "@/lib/site";
import MenuOverlay from "./MenuOverlay";

/**
 * v3 fixed chrome bar — v2 §3.1 mechanics (three scroll states, one
 * IntersectionObserver ground-theme flip, hairline active state) with the
 * v3 brand addition: the DUAL-MARK RITUAL (Rolls-Royce device, plan §5).
 * At the top state the full KUL lockup shows; once scrolled, it crossfades
 * to the lion monogram — lion = primary mark, quiet luxury signature.
 * Opacity-only, reduced-motion safe (opacity is permitted motion).
 */

const BASE = "/v3";

const LINKS = [
  { label: "Services", href: `${BASE}/services` },
  { label: "About", href: `${BASE}/about` },
  { label: "Safety", href: `${BASE}/safety` },
  { label: "Drivers", href: `${BASE}/drivers` },
  { label: "Contact", href: `${BASE}/contact` },
] as const;

type ScrollState = "top" | "pinned" | "hidden";
type Ground = "ink" | "paper";

function DualMark({ scrolled }: { scrolled: boolean }) {
  return (
    <Link
      href={BASE}
      aria-label="KUL Enterprises — home"
      className="relative z-[1] inline-flex h-11 items-center"
    >
      {/* Full lockup — the top state. */}
      <m.span
        aria-hidden={scrolled}
        className="flex items-center"
        initial={false}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.3, ease: EASE.micro }}
      >
        <Image
          src="/images/brand/kul-logo-lockup.png"
          alt="KUL Enterprises LLC"
          width={244}
          height={91}
          priority
          className="h-7 w-auto"
        />
      </m.span>
      {/* Lion monogram — the scrolled state. */}
      <m.span
        aria-hidden={!scrolled}
        className="absolute left-0 flex items-center"
        initial={false}
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE.micro }}
      >
        <Image
          src="/images/brand/lion-head.png"
          alt=""
          width={500}
          height={500}
          className="h-8 w-8 object-contain"
        />
      </m.span>
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [scrollState, setScrollState] = useState<ScrollState>("top");
  const [theme, setTheme] = useState<Ground>("ink");
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  // Three scroll states, 6px direction threshold.
  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;
    if (Math.abs(delta) < 6 && y >= 80) return;
    lastY.current = y;
    if (y < 80) setScrollState("top");
    else if (delta > 0 && y > window.innerHeight) setScrollState("hidden");
    else setScrollState("pinned");
  });

  // Ground flip: one IO watching [data-ground] sections crossing 56px.
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
  const scrolled = scrollState !== "top";
  const ctaGhost =
    pathname === `${BASE}/quote` || pathname === `${BASE}/contact`;
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
            <DualMark scrolled={scrolled} />

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
                    className="relative flex h-11 items-center text-label font-semibold uppercase"
                  >
                    <span className="link-hairline">{link.label}</span>
                    {active && (
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
                className="hidden h-11 items-center text-micro font-medium uppercase tabular-nums md:inline-flex"
              >
                {site.phone}
              </a>
              {/* Gold element #1 in every viewport; ghost on /quote + /contact. */}
              <div className="hidden md:block">
                <Link
                  href={`${BASE}/quote`}
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
                aria-controls="v3-menu-overlay"
                className="relative flex h-11 min-w-[44px] items-center justify-end gap-3 text-label font-semibold uppercase lg:hidden"
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
                    animate={
                      menuOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }
                    }
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

      {/* Sibling of the header: fixed overlays never live inside a
          transformed ancestor. */}
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
