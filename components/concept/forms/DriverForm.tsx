"use client";

import { useId } from "react";
import {
  useFormSubmit,
  Honeypot,
  FormStatus,
  SubmitButton,
  Label,
} from "./FormShell";

/** Driver inquiry. Deliberately short; the page above does the recruiting. */
export default function DriverForm() {
  const { state, serverError, submit } = useFormSubmit("/api/driver");
  // Instance-scoped ids: the drivers page also renders the closing contact form.
  const uid = useId();

  return (
    <form onSubmit={submit} className="space-y-6">
      <Honeypot />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${uid}-name`}>Your name</Label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            required
            maxLength={200}
            autoComplete="name"
            className="field-light"
          />
        </div>
        <div>
          <Label htmlFor={`${uid}-contact`}>Phone or email</Label>
          <input
            id={`${uid}-contact`}
            name="contact"
            type="text"
            required
            maxLength={200}
            autoComplete="tel"
            className="field-light"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`${uid}-experience`}>CDL-A experience</Label>
        <select
          id={`${uid}-experience`}
          name="experience"
          required
          className="field-light"
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
        </select>
      </div>

      <div>
        <Label htmlFor={`${uid}-note`} optional>
          Anything you want us to know
        </Label>
        <textarea
          id={`${uid}-note`}
          name="note"
          rows={3}
          maxLength={2000}
          placeholder="Endorsements, preferred lanes, home-time needs…"
          className="field-light resize-y"
        />
      </div>

      <FormStatus
        state={state}
        serverError={serverError}
        successMessage="Thanks. We'll reach out to talk about driving for KUL."
      />
      <SubmitButton state={state}>Start the Conversation</SubmitButton>
    </form>
  );
}
