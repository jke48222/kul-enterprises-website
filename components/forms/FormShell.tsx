"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Shared client-side form machinery: idle, submitting, success or error,
 * with a honeypot field and accessible status messaging. Forms stay short because every extra field costs conversion.
 *
 * v2 note: submission logic (useFormSubmit), the honeypot, and the
 * FormStatus live-region semantics are the v1 contract and MUST NOT change.
 * What is left here is shared behaviour only. The submit button and the
 * confirmation panel used to live here too and carried the old look with
 * them; every form now draws its own, so those are gone.
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
          own confirmation panel, so the message here is for screen readers
          only and never appears twice. */}
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






