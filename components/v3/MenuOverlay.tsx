"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { DUR, EASE, STAGGER } from "@/components/v3/motion";
import { site } from "@/lib/site";

/**
 * v3 mobile-only full-screen ink menu — v2 §3.1 mechanics preserved:
 * clip-wipe open (0.7s ease-inout, close 40% faster), masked link rise,
 * focus trap, scroll lock, Escape, focus restore. The gold pill is the
 * overlay's single gold element.
 */

const BASE = "/v3";

type MenuOverlayProps = { open: boolean; onClose(): void };

const LINKS = [
  { label: "Home", href: BASE },
  { label: "Services", href: `${BASE}/services` },
  { label: "About", href: `${BASE}/about` },
  { label: "Safety", href: `${BASE}/safety` },
  { label: "Drivers", href: `${BASE}/drivers` },
  { label: "Carrier Packet", href: `${BASE}/carrier-packet` },
  { label: "Contact", href: `${BASE}/contact` },
] as const;

function Panel({ onClose }: { onClose(): void }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Scroll lock + focus trap + Escape; restore focus to trigger on unmount.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus();
    };
  }, [onClose]);

  const meta = `${site.city.toUpperCase()}, GEORGIA — SOUTHEAST BASED · NATIONWIDE SERVICE · USDOT ${site.usdot} · MC ${site.mc}`;

  return (
    <m.div
      ref={panelRef}
      id="v3-menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[90] flex flex-col bg-ink text-paper lg:hidden"
      initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
      animate={
        reduced
          ? { opacity: 1, transition: { duration: 0.3 } }
          : {
              clipPath: "inset(0 0 0% 0)",
              transition: { duration: 0.7, ease: EASE.inout },
            }
      }
      exit={
        reduced
          ? { opacity: 0, transition: { duration: 0.3 } }
          : {
              clipPath: "inset(0 0 100% 0)",
              transition: { duration: 0.42, ease: EASE.inout },
            }
      }
    >
      {/* Top zone: lockup + CLOSE */}
      <div className="flex h-14 shrink-0 items-center justify-between px-[clamp(20px,5vw,90px)]">
        <Link
          href={BASE}
          aria-label="KUL Enterprises — home"
          onClick={onClose}
          className="inline-flex h-11 items-center"
        >
          <Image
            src="/images/brand/kul-logo-lockup.png"
            alt="KUL Enterprises LLC"
            width={244}
            height={91}
            className="h-7 w-auto"
          />
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-11 items-center text-label font-semibold uppercase"
        >
          Close
        </button>
      </div>

      {/* Middle zone: masked link rise */}
      <nav
        aria-label="Menu"
        className="flex min-h-0 flex-1 items-center overflow-y-auto px-[clamp(20px,5vw,90px)]"
      >
        <ul className="w-full py-6">
          {LINKS.map((link, i) => {
            const active =
              pathname === link.href ||
              (link.href !== BASE && pathname.startsWith(`${link.href}/`));
            return (
              <li key={link.href} className="overflow-hidden">
                <m.div
                  initial={reduced ? { opacity: 0 } : { y: "110%" }}
                  animate={reduced ? { opacity: 1 } : { y: "0%" }}
                  transition={
                    reduced
                      ? { duration: 0.3, delay: 0.25 + i * STAGGER.items }
                      : {
                          duration: DUR.slower,
                          ease: EASE.out,
                          delay: 0.25 + i * STAGGER.items,
                        }
                  }
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="relative flex items-baseline gap-4 py-[0.35rem] pl-5"
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-1/2 h-[0.65em] w-[2px] -translate-y-1/2 bg-paper/80"
                      />
                    )}
                    <span
                      aria-hidden
                      className="text-micro font-medium uppercase text-paper/40 tabular-nums"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[clamp(2.2rem,9vw,3.5rem)] font-semibold leading-none tracking-[-0.015em]">
                      {link.label}
                    </span>
                  </Link>
                </m.div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom zone: pills + meta line, entering last */}
      <div className="shrink-0 px-[clamp(20px,5vw,90px)] pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <m.div
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE.out, delay: 0.7 }}
        >
          <Link
            href={`${BASE}/quote`}
            onClick={onClose}
            className="btn-gold uppercase"
          >
            Request a Quote
          </Link>
          <a
            href={site.phoneHref}
            className="btn-ghost-dark uppercase tabular-nums"
          >
            {site.phone}
          </a>
        </m.div>
        <m.p
          className="mt-5 text-micro font-medium uppercase text-paper/60 tabular-nums"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.85 }}
        >
          {meta}
        </m.p>
      </div>
    </m.div>
  );
}

export default function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  return (
    <AnimatePresence>{open && <Panel onClose={onClose} />}</AnimatePresence>
  );
}
