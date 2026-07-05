"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { DUR, EASE } from "@/components/v2/motion";
import { Field } from "./Field";
import { SelectField } from "./SelectField";
import { TextareaField } from "./TextareaField";
import {
  useFormSubmit,
  Honeypot,
  FormStatus,
  SubmitButton,
  SuccessPanel,
} from "./FormShell";

/**
 * Driver inquiry. Deliberately short; the page above does the recruiting.
 * v2 (§3.20/§4.5): underline system, success takeover "We've got you."
 * POST contract unchanged — endpoint /api/driver, field names
 * name/contact/experience/note, botcheck honeypot.
 */
export default function DriverForm() {
  const { state, serverError, submit } = useFormSubmit("/api/driver");
  // Instance-scoped ids: the drivers page also renders the closing contact form.
  const uid = useId();
  const [applicant, setApplicant] = useState<string | null>(null);

  // Echo the name into the success takeover; submission itself is untouched.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    setApplicant(String(data.get("name") ?? ""));
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
              headline="We’ve got you."
              body="A person calls back to talk lanes, home time, and equipment."
              note={applicant ? `Thanks, ${applicant}.` : undefined}
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
                id={`${uid}-contact`}
                label="Phone or email"
                name="contact"
                type="text"
                required
                maxLength={200}
                autoComplete="tel"
              />
            </div>

            <SelectField
              id={`${uid}-experience`}
              label="CDL-A experience"
              name="experience"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select…
              </option>
              <option>Less than 1 year</option>
              <option>1–3 years</option>
              <option>3–5 years</option>
              <option>5–10 years</option>
              <option>10+ years</option>
            </SelectField>

            <TextareaField
              id={`${uid}-note`}
              label="Anything you want us to know"
              optional
              name="note"
              rows={3}
              maxLength={2000}
              placeholder="Endorsements, preferred lanes, home-time needs…"
            />

            {/* The gold submit pill is the drivers page's whole gold spend (§4.5). */}
            <SubmitButton state={state}>Start the Conversation</SubmitButton>
          </m.form>
        )}
      </AnimatePresence>

      <div className="mt-6">
        <FormStatus
          state={state}
          serverError={serverError}
          successMessage="Thanks. We'll reach out to talk about driving for KUL."
        />
      </div>
    </div>
  );
}
