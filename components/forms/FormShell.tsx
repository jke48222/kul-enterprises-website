"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Shared client-side form machinery: idle, submitting, success or error,
 * with a honeypot field and accessible status messaging. Forms stay short because every extra field costs conversion.
 *
 * v2 note: submission logic (useFormSubmit), the honeypot, and the
 * FormStatus live-region semantics are the v1 contract and MUST NOT change.
 * Only presentation below (SubmitButton, Label, FormStatus styling,
 * SuccessPanel) belongs to the v2 underline system (§3.20).
 */
export type FormState = "idle" | "submitting" | "success" | "error";

export function useFormSubmit(endpoint: string) {
  const [state, setState] = useState<FormState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    setServerError(null);
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // The server reports delivery failures in the body (ok: false), so a
      // 200 alone is not proof the lead went anywhere.
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.ok) {
        // Actionable server messages ("Too many requests...") beat the
        // generic copy: a specific reason tells the user what to do next.
        if (typeof body?.error === "string") setServerError(body.error);
        throw new Error(String(res.status));
      }
      form.reset();
      setState("success");
    } catch {
      setState("error");
    }
  };

  return { state, serverError, submit, reset: () => setState("idle") };
}

export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormStatus({
  state,
  successMessage,
  serverError,
}: {
  state: FormState;
  successMessage: string;
  serverError?: string | null;
}) {
  return (
    <div className="min-h-6">
      {/* Success is announced politely; the visible confirmation is the
          editorial SuccessPanel takeover, so the message here is sr-only. */}
      <div role="status" aria-live="polite">
        {state === "success" && <p className="sr-only">{successMessage}</p>}
      </div>
      {/* Errors interrupt: rendered into an always-present assertive region. */}
      <div role="alert">
        {state === "error" && (
          <p className="border-l-2 border-[#8C3B2E] pl-4 text-sm font-medium text-[#8C3B2E]">
            {serverError ??
              "Something went wrong sending your message. Please try again, or call us directly at 678-972-1148."}
          </p>
        )}
      </div>
    </div>
  );
}

export function SubmitButton({
  state,
  children,
}: {
  state: FormState;
  children: React.ReactNode;
}) {
  const submitting = state === "submitting";
  return (
    <button
      type="submit"
      disabled={submitting}
      aria-busy={submitting}
      className="btn-gold w-full uppercase disabled:cursor-wait disabled:opacity-60 sm:w-auto"
    >
      {/* Masked label roll: children roll up to SENDING… in 120ms (§3.20). */}
      <span className="block h-[1.25em] overflow-hidden">
        <span
          className={`flex flex-col transition-transform duration-[120ms] ease-linear motion-reduce:transition-none ${
            submitting ? "-translate-y-1/2" : ""
          }`}
        >
          <span className="block h-[1.25em]">{children}</span>
          <span aria-hidden className="block h-[1.25em]">
            Sending…
          </span>
        </span>
      </span>
    </button>
  );
}

export function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-micro uppercase text-ink opacity-60"
    >
      {children}
      {optional && <span className="opacity-70"> · optional</span>}
    </label>
  );
}

/**
 * Editorial success takeover (§3.20): serif headline, echo of the submitted
 * lane/name in body-l, tabular micro note, tel: fallback. Rendered by the
 * forms inside an AnimatePresence swap; scrolls itself into view on mobile.
 * Paper ground (all three v2 forms live on paper sections).
 */
export function SuccessPanel({
  headline,
  body,
  note,
}: {
  headline: string;
  body?: string;
  note?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      ref.current?.scrollIntoView({
        block: "center",
        behavior: reduced ? "auto" : "smooth",
      });
    }
  }, [reduced]);

  return (
    <div ref={ref} className="py-6">
      <p className="max-w-[14ch] font-omnibus text-h2 text-ink">{headline}</p>
      {body && <p className="mt-4 max-w-[62ch] text-body-l text-graywarm-deep">{body}</p>}
      {note && (
        <p className="mt-6 text-micro uppercase text-ink/60 [font-feature-settings:'tnum']">
          {note}
        </p>
      )}
      <p className="mt-3 text-micro uppercase text-ink/60 [font-feature-settings:'tnum']">
        Time-critical?{" "}
        <a href="tel:+16789721148" className="link-hairline font-semibold text-ink">
          678-972-1148
        </a>
      </p>
    </div>
  );
}
