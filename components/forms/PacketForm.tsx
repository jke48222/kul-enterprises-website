"use client";

import { useId } from "react";
import { AnimatePresence, m } from "framer-motion";
import { DUR, EASE } from "@/components/v2/motion";
import { useUnderlineField } from "./Field";
import { useFormSubmit, Honeypot, FormStatus } from "./FormShell";

/**
 * THE CARRIER PACKET REQUEST
 *
 * The request is genuinely one sentence long, so it is set as one sentence
 * with the three answers written into it, rather than as a stack of boxes.
 *
 * Drawn on the Paper artboard "Carrier Packet, desktop 1440", though that
 * artboard was drawn after the code rather than before it. Every other page
 * on the site was designed in Paper first, which is the house rule; this one
 * was built straight from the written plan and the artboard was made
 * afterwards to record what shipped.
 *
 * ON THE LABELS. Every blank has a real label attached to it, hidden from the
 * screen but read aloud by a screen reader. The sentence around a blank is not
 * a label: somebody listening to the page hears the fields out of context, so
 * "Your company name" has to exist as words even though the sentence already
 * says it. Never delete the sr-only spans to tidy the markup.
 *
 * TO CHANGE THE QUESTIONS: the three names sent to the server are company,
 * authority and email, and app/api/packet expects exactly those.
 */

/** One blank in the sentence. Grows with what is typed, never shrinks below size. */
function Blank({
  id,
  name,
  label,
  size,
  type = "text",
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  size: number;
  type?: string;
  autoComplete?: string;
}) {
  const { error, handlers } = useUnderlineField<HTMLInputElement>({});

  return (
    <span className="inline-flex flex-col align-baseline">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        size={size}
        maxLength={200}
        autoComplete={autoComplete}
        placeholder={label}
        {...handlers}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`min-w-0 border-b bg-transparent px-1 pb-1 font-text text-k-lede text-k-ink caret-current outline-none transition-colors duration-200 placeholder:text-k-ink-soft focus:border-k-gold focus-visible:outline-none ${
          error ? "border-k-error" : "border-k-ink"
        }`}
      />
      {error ? (
        <span
          id={`${id}-error`}
          className="pt-1 font-text text-k-micro uppercase text-k-error"
        >
          {error}
        </span>
      ) : null}
    </span>
  );
}

export default function PacketForm() {
  const { state, serverError, submit } = useFormSubmit("/api/packet");
  const uid = useId();

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
              The request reached dispatch.
            </p>
            <p className="max-w-[62ch] font-text text-k-body text-k-ink-soft">
              The packet is attached to a reply by the person who drives the
              truck, so it comes back when he is not on a load. If you need it
              inside a fixed window, call and say so.
            </p>
          </m.div>
        ) : (
          <m.form
            key="form"
            onSubmit={submit}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast, ease: [...EASE.micro] }}
            className="flex flex-col gap-10"
          >
            <Honeypot />

            {/* The sentence. leading-loose gives the blanks room to sit on
                their own underline without the lines colliding when it wraps. */}
            <p className="max-w-[900px] font-text text-k-lede leading-loose text-k-ink">
              Send the packet for{" "}
              <Blank
                id={`${uid}-company`}
                name="company"
                label="Your company name"
                size={18}
                autoComplete="organization"
              />
              , MC or USDOT{" "}
              <Blank
                id={`${uid}-authority`}
                name="authority"
                label="Your MC or USDOT number"
                size={12}
              />
              , to{" "}
              <Blank
                id={`${uid}-email`}
                name="email"
                label="Where to send it"
                size={22}
                type="email"
                autoComplete="email"
              />
              .
            </p>

            <div className="flex flex-col gap-6">
              <p className="max-w-[560px] font-text text-[12px] leading-[19px] text-k-ink-soft">
                We use this to send the packet and nothing else. You are not
                added to a mailing list and your details are not passed on.
              </p>
              <button
                type="submit"
                disabled={state === "submitting"}
                className="w-fit rounded-full bg-k-gold px-9 py-4 font-text text-k-label uppercase text-k-surface transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
              >
                {state === "submitting" ? "Sending" : "Send the request"}
              </button>
            </div>
          </m.form>
        )}
      </AnimatePresence>

      {state === "error" ? (
        <p className="pt-5 font-text text-k-small text-k-error">
          {serverError ??
            "That did not send. Call dispatch on 678-972-1148 and the packet can be sent from the phone instead."}
        </p>
      ) : (
        <FormStatus
          state={state}
          serverError={serverError}
          successMessage="The packet request reached dispatch."
        />
      )}
    </div>
  );
}
