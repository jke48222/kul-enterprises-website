"use client";

import { services } from "@/lib/services";
import {
  useFormSubmit,
  Honeypot,
  FormStatus,
  SubmitButton,
  Label,
} from "./FormShell";

/**
 * Freight quote form. Exactly 5 required core fields (origin, destination,
 * freight type, pickup date, contact) plus one optional detail box. Short
 * forms convert; detail can follow in the reply.
 */
export default function QuoteForm() {
  const { state, submit } = useFormSubmit("/api/quote");

  return (
    <form onSubmit={submit} noValidate={false} className="space-y-6">
      <Honeypot />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="origin">Origin (city, state)</Label>
          <input
            id="origin"
            name="origin"
            type="text"
            required
            autoComplete="off"
            placeholder="Atlanta, GA"
            className="field-light"
          />
        </div>
        <div>
          <Label htmlFor="destination">Destination (city, state)</Label>
          <input
            id="destination"
            name="destination"
            type="text"
            required
            autoComplete="off"
            placeholder="Charlotte, NC"
            className="field-light"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="freightType">Freight type</Label>
          <select
            id="freightType"
            name="freightType"
            required
            className="field-light"
            defaultValue=""
          >
            <option value="" disabled>
              Select a service…
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Not sure">Not sure, advise me</option>
          </select>
        </div>
        <div>
          <Label htmlFor="pickupDate">Target pickup date</Label>
          <input
            id="pickupDate"
            name="pickupDate"
            type="date"
            required
            className="field-light"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contact">Your email or phone</Label>
        <input
          id="contact"
          name="contact"
          type="text"
          required
          autoComplete="email"
          placeholder="you@company.com or 555-123-4567"
          className="field-light"
        />
      </div>

      <div>
        <Label htmlFor="details" optional>
          Weight, dimensions, commodity
        </Label>
        <textarea
          id="details"
          name="details"
          rows={3}
          placeholder="e.g. 24 pallets, 38,000 lbs, packaged food product"
          className="field-light resize-y"
        />
      </div>

      <FormStatus
        state={state}
        successMessage="Quote request received. Dispatch will reply the same business day."
      />
      <SubmitButton state={state}>Request My Quote</SubmitButton>
    </form>
  );
}
