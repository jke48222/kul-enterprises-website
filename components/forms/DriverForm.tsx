"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { DUR, EASE } from "@/components/k/motion";
import { PanelField, PanelSelect, PanelTextarea } from "./PanelField";
import { useFormSubmit, Honeypot, FormStatus } from "./FormShell";

/**
 * THE DRIVER FORM
 *
 * Four questions, which is everything needed to put somebody on the list and
 * call them back later. Drawn on the Paper artboard "Drivers, desktop 1440",
 * where it sits on the warm panel at the foot of the page.
 *
 * IT DOES NOT PROMISE A CALL TODAY. KUL has one truck and one driver, and the
 * second seat opens when the second truck is booked. The wording here and on
 * the page above it says so plainly, because a driver who is told to expect a
 * call this week and hears nothing for months is worse off than one who was
 * told the truth at the start.
 *
 * TO CHANGE THE QUESTIONS: edit the fields below. The four names sent to the
 * server are name, contact, experience and note, and the handler in
 * app/api/driver expects exactly those, so renaming one here means renaming it
 * there too.
 *
 * The fields wear the light colourway because this form sits on a warm ground
 * rather than the dark panel the quote form uses.
 */
export default function DriverForm() {
  const { state, serverError, submit } = useFormSubmit("/api/driver");
  // Instance-scoped ids, so the labels still point at the right boxes if this
  // form is ever placed on a page twice.
  const uid = useId();
  const [applicant, setApplicant] = useState<string | null>(null);

  // Remember the name so the confirmation can use it. The sending itself is
  // untouched by this.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    setApplicant(String(data.get("name") ?? ""));
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
              You are on the list.
            </p>
            {applicant ? (
              <p className="font-text text-k-lede text-k-gold">
                Thank you, {applicant}.
              </p>
            ) : null}
            <p className="max-w-[62ch] font-text text-k-body text-k-ink-soft">
              Your details are with Mark. There is no call today, because the
              seat is not open today. When the second truck is booked, everybody
              on this list is called.
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
                id={`${uid}-contact`}
                label="Phone or email"
                name="contact"
                type="text"
                required
                maxLength={200}
                autoComplete="tel"
              />
            </div>

            <PanelSelect
              tone="light"
              id={`${uid}-experience`}
              label="How long have you held a CDL-A"
              name="experience"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Choose one
              </option>
              <option>Less than one year</option>
              <option>One to three years</option>
              <option>Three to five years</option>
              <option>Five to ten years</option>
              <option>More than ten years</option>
            </PanelSelect>

            <PanelTextarea
              tone="light"
              id={`${uid}-note`}
              label="Anything else"
              name="note"
              rows={4}
              maxLength={2000}
              placeholder="Lanes you know, endorsements you hold, when you would be free to start."
            />

            <div className="flex flex-col gap-6 pt-5">
              <p className="max-w-[560px] font-text text-[12px] leading-[19px] text-k-ink-soft">
                By sending this you agree we may contact you about driving work.
                We do not add you to a mailing list and we do not pass your
                details to anyone else.
              </p>
              <button
                type="submit"
                disabled={state === "submitting"}
                className="w-fit rounded-full bg-k-gold px-9 py-4 font-text text-k-label uppercase text-k-surface transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
              >
                {state === "submitting" ? "Sending" : "Send my details"}
              </button>
            </div>
          </m.form>
        )}
      </AnimatePresence>

      {/* Anything the form needs to say back, including a failure to send. */}
      {state === "error" ? (
        <p className="pt-5 font-text text-k-small text-k-error">
          {serverError ??
            "That did not send. Call dispatch on 678-972-1148 and your details can be taken over the phone instead."}
        </p>
      ) : (
        <FormStatus
          state={state}
          serverError={serverError}
          successMessage="Your details are on the list. Nobody is called until the second truck is booked."
        />
      )}
    </div>
  );
}
