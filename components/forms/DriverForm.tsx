"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { DUR, EASE } from "@/components/k/motion";
import { PanelField, PanelSelect, PanelTextarea } from "./PanelField";
import { useFormSubmit, Honeypot, FormStatus } from "./FormShell";
import { fill } from "@/lib/content";
import Copy from "@/components/k/Copy";
import forms from "@/content/forms.json";

/** Everything this form says. Edited at /admin under "Forms". */
const t = forms.driver;

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
              {fill(t.successHeading)}
            </p>
            {applicant ? (
              <p className="font-text text-k-lede text-k-gold">
                {fill(t.successThanks).replace("{sender}", applicant)}
              </p>
            ) : null}
            <Copy
              text={t.successBody}
              className="max-w-[62ch] font-text text-k-body text-k-ink-soft"
              linkClassName="underline underline-offset-4"
            />
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
                label={fill(t.fields.name.label)}
                name="name"
                type="text"
                required
                maxLength={200}
                autoComplete="name"
              />
              <PanelField
                tone="light"
                id={`${uid}-contact`}
                label={fill(t.fields.contact.label)}
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
              label={fill(t.fields.experience.label)}
              name="experience"
              required
              defaultValue=""
            >
              <option value="" disabled>
                {fill(t.fields.experience.placeholder)}
              </option>
              {t.fields.experience.options.map((option) => (
                <option key={option}>{fill(option)}</option>
              ))}
            </PanelSelect>

            <PanelTextarea
              tone="light"
              id={`${uid}-note`}
              label={fill(t.fields.note.label)}
              name="note"
              rows={4}
              maxLength={2000}
              placeholder={fill(t.fields.note.placeholder)}
            />

            <div className="flex flex-col gap-6 pt-5">
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

      {/* Anything the form needs to say back, including a failure to send. */}
      {state === "error" ? (
        // role="alert": the send just failed and the reader may be hearing
        // this page rather than seeing it. Without it the FormStatus live
        // region below is unmounted at the exact moment there is something
        // to announce, and a failed send is silent. WCAG 4.1.3.
        <p role="alert" className="pt-5 font-text text-k-small text-k-error">
          {serverError ?? fill(t.error)}
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
