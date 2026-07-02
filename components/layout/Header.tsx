"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, site } from "@/lib/site";
import BrandMark from "@/components/brand/BrandMark";

/**
 * Fixed header: transparent over each page's dark intro band, solid ink on
 * scroll. Utility strip (Schneider's structure) + letter-spaced nav with a
 * gold active/hover underline (the Volvo/Rolls restraint).
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile panel on route change.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Utility strip */}
      <div
        className={`hidden border-b border-white/5 transition-colors duration-500 md:block ${
          scrolled ? "bg-ink/95" : "bg-black/30"
        }`}
      >
        <div className="mx-auto flex max-w-content items-center justify-between px-6 py-2 text-xs text-graywarm">
          <span className="uppercase tracking-eyebrow">{site.serviceArea}</span>
          <div className="flex items-center gap-6">
            <a href={site.phoneHref} className="transition-colors hover:text-white">
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="transition-colors hover:text-white"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`transition-colors duration-500 ${
          scrolled
            ? "border-b border-gold/20 bg-ink/95 backdrop-blur"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
          <BrandMark />

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative text-sm font-medium transition-colors ${
                    active ? "text-white" : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex">
            <Link
              href="/quote"
              className="inline-flex items-center bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
            >
              Request a Quote
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden className="block space-y-1.5">
              <span
                className={`block h-px w-6 bg-white transition-transform duration-300 ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-6 bg-white transition-opacity duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-6 bg-white transition-transform duration-300 ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-gold/20 bg-ink/95 backdrop-blur lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-content flex-col px-6 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-white/5 py-3 text-sm font-medium text-white/85"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/quote"
              className="mt-4 inline-flex items-center justify-center bg-gold px-5 py-3 text-sm font-semibold text-ink"
            >
              Request a Quote
            </Link>
            <div className="mt-4 flex flex-col gap-1 pb-4 text-xs text-graywarm">
              <a href={site.phoneHref}>{site.phone}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
