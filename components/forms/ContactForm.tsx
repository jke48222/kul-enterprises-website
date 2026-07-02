"use client";

import {
  useFormSubmit,
  Honeypot,
  FormStatus,
  SubmitButton,
  Label,
} from "./FormShell";

export default function ContactForm() {
  const { state, submit } = useFormSubmit("/api/contact");

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
          <Label htmlFor="email">Email</Label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="field-light"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="message">How can we help?</Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="field-light resize-y"
        />
      </div>

      <FormStatus
        state={state}
        successMessage="Message received. We'll get back to you shortly."
      />
      <SubmitButton state={state}>Send Message</SubmitButton>
    </form>
  );
}
