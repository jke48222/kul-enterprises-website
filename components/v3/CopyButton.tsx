"use client";

/**
 * CopyButton — v3 port (v2 §3.25). THE clipboard primitive: clipboard
 * write + masked COPY→COPIED roll (0.2s EASE.micro), revert after 1.6s;
 * selects adjacent text when the Clipboard API is unavailable.
 * aria-live="polite". Ground-aware via currentColor.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/v3/motion";

export type CopyButtonProps = {
  value: string;
  label?: string;
};

export function CopyButton({ value, label = "COPY" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  function selectAdjacentText() {
    const el =
      buttonRef.current?.previousElementSibling ??
      buttonRef.current?.parentElement;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  async function handleCopy() {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 1600);
        return;
      } catch {
        // fall through to selection fallback
      }
    }
    selectAdjacentText();
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${value}`}
      className="inline-flex h-11 min-w-11 items-center justify-center text-micro uppercase tracking-[0.18em] opacity-70 transition-opacity duration-200 hover:opacity-100"
    >
      <span
        aria-hidden
        className="relative block h-[1em] overflow-hidden leading-none"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={copied ? "copied" : "copy"}
            className="block leading-none"
            initial={reduced ? { opacity: 0 } : { y: "110%" }}
            animate={reduced ? { opacity: 1 } : { y: "0%" }}
            exit={reduced ? { opacity: 0 } : { y: "-110%" }}
            transition={{ duration: 0.2, ease: [...EASE.micro] }}
          >
            {copied ? "COPIED" : label}
          </m.span>
        </AnimatePresence>
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}

export default CopyButton;
