"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { DUR, EASE } from "@/components/v2/motion";
import { Field } from "./Field";
import { TextareaField } from "./TextareaField";
import {
  useFormSubmit,
  Honeypot,
  FormStatus,
  SubmitButton,
  SuccessPanel,
} from "./FormShell";

/**
 * Contact form on the §3.20 underline system. POST contract unchanged —
 * endpoint /api/contact, field names name/email/message, botcheck honeypot.
 */
export default function ContactForm() {
  const { state, serverError, submit } = useFormSubmit("/api/contact");
  // Instance-scoped ids: this form renders twice on some pages (body + closing).
  const uid = useId();
  const [sender, setSender] = useState<string | null>(null);

  // Echo the name into the success takeover; submission itself is untouched.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    setSender(String(data.get("name") ?? ""));
    return submit(e);
  };

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {state === "success" ? (
          <m.div
            key="success"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.base, ease: [...EASE.out] }}
          >
            <SuccessPanel
              headline="It’s with dispatch."
              body={sender ? `Thanks, ${sender}.` : undefined}
              note="A person replies the same business day."
            />
          </m.div>
        ) : (
          <m.form
            key="form"
            onSubmit={handleSubmit}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast, ease: [...EASE.micro] }}
            className="space-y-10"
          >
            <Honeypot />

            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
              <Field
                id={`${uid}-name`}
                label="Your name"
                name="name"
                type="text"
                required
                maxLength={200}
                autoComplete="name"
              />
              <Field
                id={`${uid}-email`}
                label="Email"
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
              />
            </div>

            <TextareaField
              id={`${uid}-message`}
              label="How can we help?"
              name="message"
              rows={5}
              required
              maxLength={2000}
            />

            {/* The gold submit pill is this viewport's single gold spend. */}
            <SubmitButton state={state}>Send Message</SubmitButton>
          </m.form>
        )}
      </AnimatePresence>

      <div className="mt-6">
        <FormStatus
          state={state}
          serverError={serverError}
          successMessage="Message received. We'll get back to you shortly."
        />
      </div>
    </div>
  );
}
