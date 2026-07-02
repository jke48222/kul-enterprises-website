"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { label: "About", href: "/concept/about" },
  { label: "Services", href: "/concept/services" },
  { label: "Drive With KUL", href: "/concept/drivers" },
  { label: "Safety & Compliance", href: "/concept/safety" },
  { label: "Carrier Packet", href: "/concept/carrier-packet" },
  { label: "Contact", href: "/concept/contact" },
  { label: "Request a Quote", href: "/concept/quote", gold: true },
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
        className="relative mx-auto flex h-12 max-w-[1120px] items-center justify-between rounded-full bg-ink/90 pl-3 pr-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur sm:pl-5 sm:pr-2"
      >
        {/* Hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
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
          href="/concept"
          aria-label="KUL Enterprises concept home"
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

        {/* Gold pill CTA */}
        <Link
          href="/concept/quote"
          className="rounded-full bg-gold px-4 py-2 font-mont text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F8F8F8] transition-colors hover:bg-gold-soft hover:text-ink sm:px-5 sm:text-xs"
        >
          <span className="sm:hidden">Quote</span>
          <span className="hidden sm:inline">Request a Quote</span>
        </Link>

        {/* Dropdown */}
        {open && (
          <nav
            aria-label="Concept"
            className="absolute left-2 top-[calc(100%+8px)] w-64 overflow-hidden rounded-2xl bg-paper shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
          >
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block border-b border-ink/5 px-6 py-4 text-sm font-medium transition-colors last:border-0 hover:bg-white ${
                  item.gold ? "text-gold-dim" : "text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
