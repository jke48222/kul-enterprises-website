"use client";

import { useId } from "react";
import { AnimatePresence, m } from "framer-motion";
import { DUR, EASE } from "@/components/k/motion";
import { useUnderlineField } from "./Field";
import { useFormSubmit, Honeypot, FormStatus } from "./FormShell";
import { fill } from "@/lib/content";
import Copy from "@/components/k/Copy";
import forms from "@/content/forms.json";

/** Everything this form says. Edited at /admin under "Forms". */
const t = forms.packet;

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
              {fill(t.successHeading)}
            </p>
            <Copy
              text={t.successBody}
              className="max-w-[62ch] font-text text-k-body text-k-ink-soft"
              linkClassName="underline underline-offset-4"
            />
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
              {fill(t.sentence.before)}{" "}
              <Blank
                id={`${uid}-company`}
                name="company"
                label={fill(t.fields.company.label)}
                size={18}
                autoComplete="organization"
              />
              {fill(t.sentence.afterCompany)}{" "}
              <Blank
                id={`${uid}-authority`}
                name="authority"
                label={fill(t.fields.authority.label)}
                size={12}
              />
              {fill(t.sentence.afterAuthority)}{" "}
              <Blank
                id={`${uid}-email`}
                name="email"
                label={fill(t.fields.email.label)}
                size={22}
                type="email"
                autoComplete="email"
              />
              {fill(t.sentence.end)}
            </p>

            <div className="flex flex-col gap-6">
              <Copy
                text={t.consent}
                className="max-w-[560px] font-text text-[12px] leading-[19px] text-k-ink-soft"
                linkClassName="underline underline-offset-2"
              />
              <button
                type="submit"
                disabled={state === "submitting"}
                className="w-fit rounded-full bg-k-gold px-9 py-4 font-text text-k-label uppercase text-k-surface transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
              >
                {state === "submitting"
                  ? fill(forms.shared.sendingLabel)
                  : fill(t.submitLabel)}
              </button>
            </div>
          </m.form>
        )}
      </AnimatePresence>

      {state === "error" ? (
        // role="alert": the send just failed and the reader may be hearing
        // this page rather than seeing it. Without it the FormStatus live
        // region below is unmounted at the exact moment there is something
        // to announce, and a failed send is silent. WCAG 4.1.3.
        <p role="alert" className="pt-5 font-text text-k-small text-k-error">
          {serverError ??
            fill(t.error)}
        </p>
      ) : (
        <FormStatus
          state={state}
          serverError={serverError}
          successMessage={fill(t.successAnnouncement)}
        />
      )}
    </div>
  );
}
