"use client";

/**
 * Current year, evaluated in the visitor's browser. The footer is statically
 * prerendered, so a server-side Date would freeze at build time and go stale
 * every January. suppressHydrationWarning absorbs the build-year/now-year
 * mismatch in the handoff window.
 */
export default function YearStamp() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
