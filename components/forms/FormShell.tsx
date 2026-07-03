"use client";

import { useState } from "react";

/**
 * Shared client-side form machinery: idle, submitting, success or error,
 * with a honeypot field and accessible status messaging. Forms stay short because every extra field costs conversion.
 */
export type FormState = "idle" | "submitting" | "success" | "error";

export function useFormSubmit(endpoint: string) {
  const [state, setState] = useState<FormState>("idle");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
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
      if (!res.ok || !body?.ok) throw new Error(String(res.status));
      form.reset();
      setState("success");
    } catch {
      setState("error");
    }
  };

  return { state, submit, reset: () => setState("idle") };
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
}: {
  state: FormState;
  successMessage: string;
}) {
  return (
    <div className="min-h-6">
      <div role="status" aria-live="polite">
        {state === "success" && (
          <p className="border border-gold-dim/40 bg-gold/10 px-4 py-3 text-sm font-medium text-ink">
            {successMessage}
          </p>
        )}
      </div>
      {/* Errors interrupt: rendered into an always-present assertive region. */}
      <div role="alert">
        {state === "error" && (
          <p className="border border-red-800/40 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
            Something went wrong sending your message. Please try again, or call
            us directly at 678-972-1148.
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
  return (
    <button
      type="submit"
      disabled={state === "submitting"}
      className="btn-gold w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto"
    >
      {state === "submitting" ? "Sending…" : children}
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
      className="mb-1.5 block text-sm font-semibold text-ink"
    >
      {children}
      {optional && (
        <span className="ml-2 font-normal text-graywarm-deep">(optional)</span>
      )}
    </label>
  );
}
