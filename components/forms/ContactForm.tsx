"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { DUR, EASE } from "@/components/k/motion";
import { PanelField, PanelTextarea } from "./PanelField";
import { useFormSubmit, Honeypot, FormStatus } from "./FormShell";

/**
 * THE CONTACT FORM
 *
 * For anything the three routing rows on the contact page do not cover. It
 * sends name, email and message to app/api/contact.
 *
 * IT USED TO END ON THE WRONG TYPEFACE. The confirmation came from a shared
 * panel that set its headline in Omnibus, the serif the client rejected, so
 * the last thing a broker saw after successfully making contact was the one
 * face that is not the brand. It now matches the quote, driver and packet
 * forms: its own confirmation, in the display face, on a light panel.
 *
 * The fields wear the light colourway, because this form sits on a light
 * ground rather than the dark panel the quote form uses.
 */
export default function ContactForm() {
  const { state, serverError, submit } = useFormSubmit("/api/contact");
  // Instance-scoped ids, because this form renders twice on some pages.
  const uid = useId();
  const [sender, setSender] = useState<string | null>(null);

  // Remember the name so the confirmation can use it. The sending itself is
  // untouched by this.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    setSender(String(data.get("name") ?? ""));
    return submit(e);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait" initial={false}>
        {state === "success" ? (
          <m.div
            key="success"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.base, ease: [...EASE.out] }}
            className="flex max-w-[760px] flex-col gap-5 rounded-sm border border-k-rule bg-k-surface p-9"
          >
            <p className="font-display text-k-d3 font-black text-k-ink">
              It is with dispatch.
            </p>
            {sender ? (
              <p className="font-text text-k-lede text-k-gold">
                Thank you, {sender}.
              </p>
            ) : null}
            <p className="max-w-[62ch] font-text text-k-body text-k-ink-soft">
              A person reads it and replies, usually the same business day. If
              it is more urgent than that, call dispatch instead of waiting.
            </p>
          </m.div>
        ) : (
          <m.form
            key="form"
            onSubmit={handleSubmit}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast, ease: [...EASE.micro] }}
            className="flex max-w-[760px] flex-col gap-3"
          >
            <Honeypot />

            <div className="grid gap-3 sm:grid-cols-2">
              <PanelField
                tone="light"
                id={`${uid}-name`}
                label="Your name"
                name="name"
                type="text"
                required
                maxLength={200}
                autoComplete="name"
              />
              <PanelField
                tone="light"
                id={`${uid}-email`}
                label="Email"
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
              />
            </div>

            <PanelTextarea
              tone="light"
              id={`${uid}-message`}
              label="How can we help"
              name="message"
              rows={5}
              required
              maxLength={2000}
            />

            <div className="flex flex-col gap-6 pt-5">
              <button
                type="submit"
                disabled={state === "submitting"}
                className="w-fit rounded-full bg-k-gold px-9 py-4 font-text text-k-label uppercase text-k-surface transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
              >
                {state === "submitting" ? "Sending" : "Send the message"}
              </button>
            </div>
          </m.form>
        )}
      </AnimatePresence>

      {state === "error" ? (
        <p className="pt-5 font-text text-k-small text-k-error">
          {serverError ??
            "That did not send. Call dispatch on 678-972-1148 and it can be handled on the phone instead."}
        </p>
      ) : (
        <FormStatus
          state={state}
          serverError={serverError}
          successMessage="Message received. A person replies, usually the same business day."
        />
      )}
    </div>
  );
}
