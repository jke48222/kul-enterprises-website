"use client";

import { useId } from "react";
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
  const { state, serverError, submit } = useFormSubmit("/api/quote");
  // Instance-scoped ids: pages can render several forms without collisions.
  const uid = useId();

  return (
    <form onSubmit={submit} className="space-y-6">
      <Honeypot />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${uid}-origin`}>Origin (city, state)</Label>
          <input
            id={`${uid}-origin`}
            name="origin"
            type="text"
            required
            maxLength={200}
            autoComplete="off"
            placeholder="Atlanta, GA"
            className="field-light"
          />
        </div>
        <div>
          <Label htmlFor={`${uid}-destination`}>Destination (city, state)</Label>
          <input
            id={`${uid}-destination`}
            name="destination"
            type="text"
            required
            maxLength={200}
            autoComplete="off"
            placeholder="Charlotte, NC"
            className="field-light"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${uid}-freightType`}>Freight type</Label>
          <select
            id={`${uid}-freightType`}
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
          <Label htmlFor={`${uid}-pickupDate`}>Target pickup date</Label>
          <input
            id={`${uid}-pickupDate`}
            name="pickupDate"
            type="date"
            required
            className="field-light"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`${uid}-contact`}>Your email or phone</Label>
        <input
          id={`${uid}-contact`}
          name="contact"
          type="text"
          required
          maxLength={200}
          autoComplete="email"
          placeholder="you@company.com or 555-123-4567"
          className="field-light"
        />
      </div>

      <div>
        <Label htmlFor={`${uid}-details`} optional>
          Weight, dimensions, commodity
        </Label>
        <textarea
          id={`${uid}-details`}
          name="details"
          rows={3}
          maxLength={2000}
          placeholder="e.g. 24 pallets, 38,000 lbs, packaged food product"
          className="field-light resize-y"
        />
      </div>

      <FormStatus
        state={state}
        serverError={serverError}
        successMessage="Quote request received. Dispatch will reply the same business day."
      />
      <SubmitButton state={state}>Request My Quote</SubmitButton>
    </form>
  );
}
