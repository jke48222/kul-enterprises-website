"use client";

import {
  useFormSubmit,
  Honeypot,
  FormStatus,
  SubmitButton,
  Label,
} from "./FormShell";

/** Driver inquiry. Deliberately short; the page above does the recruiting. */
export default function DriverForm() {
  const { state, submit } = useFormSubmit("/api/driver");

  return (
    <form onSubmit={submit} className="space-y-6">
      <Honeypot />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Your name</Label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="field-light"
          />
        </div>
        <div>
          <Label htmlFor="contact">Phone or email</Label>
          <input
            id="contact"
            name="contact"
            type="text"
            required
            autoComplete="tel"
            className="field-light"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="experience">CDL-A experience</Label>
        <select
          id="experience"
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
        <Label htmlFor="note" optional>
          Anything you want us to know
        </Label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="Endorsements, preferred lanes, home-time needs…"
          className="field-light resize-y"
        />
      </div>

      <FormStatus
        state={state}
        successMessage="Thanks. We'll reach out to talk about driving for KUL."
      />
      <SubmitButton state={state}>Start the Conversation</SubmitButton>
    </form>
  );
}
