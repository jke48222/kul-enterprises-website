"use client";

import { useId } from "react";
import {
  useFormSubmit,
  Honeypot,
  FormStatus,
  SubmitButton,
  Label,
} from "./FormShell";

export default function ContactForm() {
  const { state, serverError, submit } = useFormSubmit("/api/contact");
  // Instance-scoped ids: this form renders twice on some pages (body + closing).
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
          <Label htmlFor={`${uid}-email`}>Email</Label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className="field-light"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`${uid}-message`}>How can we help?</Label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={5}
          required
          maxLength={2000}
          className="field-light resize-y"
        />
      </div>

      <FormStatus
        state={state}
        serverError={serverError}
        successMessage="Message received. We'll get back to you shortly."
      />
      <SubmitButton state={state}>Send Message</SubmitButton>
    </form>
  );
}
