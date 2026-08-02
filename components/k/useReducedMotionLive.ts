"use client";

import { useSyncExternalStore } from "react";

/**
 * THE MOTION PREFERENCE, OBSERVED RATHER THAN SAMPLED.
 *
 * Every motion gate on this site used to read matchMedia once, on mount, so a
 * reader who flipped the OS setting mid-session kept the old behaviour until
 * a reload. The CSS layers always responded live; the JS layers now do too.
 *
 * useSyncExternalStore rather than state-in-effect for the usual reasons: the
 * subscription is shared machinery, the server snapshot is honest (assume
 * reduced until the client says otherwise would flash motion OFF, so the
 * server says false and the arming contracts elsewhere keep anything from
 * moving before the client has spoken), and there is no render-after-mount
 * just to learn a value that was readable synchronously.
 *
 * Effects that gate on this should take it as a dependency: when the reader
 * flips the setting, the effect re-runs, tearing the motion down or setting
 * it up in both directions.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

export function useReducedMotionLive(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
