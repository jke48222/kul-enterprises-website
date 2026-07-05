"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { label: "About", href: "/v1/about" },
  { label: "Services", href: "/v1/services" },
  { label: "Drive With KUL", href: "/v1/drivers" },
  { label: "Safety & Compliance", href: "/v1/safety" },
  { label: "Carrier Packet", href: "/v1/carrier-packet" },
  { label: "Contact", href: "/v1/contact" },
  { label: "Request a Quote", href: "/v1/quote", gold: true },
];

/**
 * Floating pill navigation: hamburger left, centered brand lockup, gold
 * pill CTA right. Hamburger opens a compact light dropdown list.
 */
export default function ConceptNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-10 sm:pt-6">
      <div
        ref={ref}
        className="relative mx-auto flex h-12 max-w-[1120px] items-center justify-between rounded-full bg-ink/95 pl-3 pr-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:pl-5 sm:pr-2"
      >
        {/* Hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="kul-nav-menu"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/5"
        >
          {/* Doctor Bird morph: display pose at rest, flight pose while the
              menu is open. Crossfade + slight scale/rotate, transform and
              opacity only, same 300ms feel as a hamburger-to-X. */}
          <span aria-hidden className="relative block h-7 w-7">
            <Image
              src="/images/brand/doctor-bird-display.png"
              alt=""
              width={302}
              height={261}
              className={`absolute inset-0 m-auto h-7 w-7 object-contain transition-[transform,opacity] duration-300 ease-out ${
                open ? "-rotate-12 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <Image
              src="/images/brand/doctor-bird-flight.png"
              alt=""
              width={148}
              height={109}
              className={`absolute inset-0 m-auto h-7 w-7 object-contain transition-[transform,opacity] duration-300 ease-out ${
                open ? "rotate-0 scale-100 opacity-100" : "rotate-12 scale-50 opacity-0"
              }`}
            />
          </span>
        </button>

        {/* Centered lockup */}
        <Link
          href="/v1"
          aria-label="KUL Enterprises home"
          className="absolute left-1/2 -translate-x-1/2"
        >
          <Image
            src="/images/brand/kul-logo-lockup.png"
            alt="KUL Enterprises LLC"
            width={244}
            height={91}
            priority
            className="h-7 w-auto sm:h-8"
          />
        </Link>

        {/* Gold pill CTA. Ink text: white on this gold fails WCAG AA (~2.6:1). */}
        <Link
          href="/v1/quote"
          className="kul-gold-metal rounded-full px-4 py-2 font-mont text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-[filter] duration-300 hover:brightness-110 sm:px-5 sm:text-xs"
        >
          <span className="sm:hidden">Quote</span>
          <span className="hidden sm:inline">Request a Quote</span>
        </Link>

        {/* Dropdown: always in the DOM (hidden when closed) so the button's
            aria-controls target exists for assistive tech. */}
        <nav
          id="kul-nav-menu"
          aria-label="Site"
          hidden={!open}
          className="absolute left-2 top-[calc(100%+8px)] w-max overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        >
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              // Route-change effect misses same-page clicks; close explicitly.
              onClick={() => setOpen(false)}
              className={`block whitespace-nowrap border-b border-ink/5 px-6 py-4 pr-10 text-sm font-medium transition-colors last:border-0 hover:text-gold ${
                item.gold ? "text-gold-dim" : "text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
