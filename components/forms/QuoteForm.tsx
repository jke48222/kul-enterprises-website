"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { services } from "@/lib/services";
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
 * Freight quote form. Exactly 5 required core fields (origin, destination,
 * freight type, pickup date, contact) plus one optional detail box. Short
 * forms convert; detail can follow in the reply.
 *
 * v2 (§3.20): numbered groups over the underline field system. POST contract
 * unchanged — endpoint /api/quote, field names origin/destination/
 * freightType/pickupDate/contact/details, botcheck honeypot.
 */

function GroupLegend({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <legend className="mb-8 block w-full">
      <span className="flex items-baseline gap-3 text-micro uppercase text-ink/60">
        <span aria-hidden className="text-ink/40 [font-feature-settings:'tnum']">
          {index}
        </span>
        <span>{children}</span>
      </span>
    </legend>
  );
}

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function QuoteForm() {
  const { state, serverError, submit } = useFormSubmit("/api/quote");
  // Instance-scoped ids: pages can render several forms without collisions.
  const uid = useId();
  const [lane, setLane] = useState<{ origin: string; destination: string } | null>(null);
  const [today] = useState(localToday);

  // Echo the lane into the success takeover; submission itself is untouched.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    setLane({
      origin: String(data.get("origin") ?? ""),
      destination: String(data.get("destination") ?? ""),
    });
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
              body={lane ? `${lane.origin} → ${lane.destination}` : undefined}
              note="A person replies the same business day."
            />
          </m.div>
        ) : (
          <m.form
            key="form"
            onSubmit={handleSubmit}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast, ease: [...EASE.micro] }}
            className="space-y-12"
          >
            <Honeypot />

            <fieldset>
              <GroupLegend index="01">The lane</GroupLegend>
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                <Field
                  id={`${uid}-origin`}
                  label="Origin (city, state)"
                  name="origin"
                  type="text"
                  required
                  maxLength={200}
                  autoComplete="off"
                  placeholder="Atlanta, GA"
                />
                <Field
                  id={`${uid}-destination`}
                  label="Destination (city, state)"
                  name="destination"
                  type="text"
                  required
                  maxLength={200}
                  autoComplete="off"
                  placeholder="Charlotte, NC"
                />
              </div>
            </fieldset>

            <fieldset>
              <GroupLegend index="02">The freight</GroupLegend>
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                <SelectField
                  id={`${uid}-freightType`}
                  label="Freight type"
                  name="freightType"
                  required
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
                </SelectField>
                <Field
                  id={`${uid}-pickupDate`}
                  label="Target pickup date"
                  name="pickupDate"
                  type="date"
                  required
                  min={today}
                  suppressHydrationWarning
                />
              </div>
            </fieldset>

            <fieldset>
              <GroupLegend index="03">Reach you</GroupLegend>
              <div className="space-y-10">
                <Field
                  id={`${uid}-contact`}
                  label="Your email or phone"
                  name="contact"
                  type="text"
                  required
                  maxLength={200}
                  autoComplete="email"
                  placeholder="you@company.com or 555-123-4567"
                />
                <TextareaField
                  id={`${uid}-details`}
                  label="Weight, dimensions, commodity"
                  optional
                  name="details"
                  rows={3}
                  maxLength={2000}
                  placeholder="e.g. 24 pallets, 38,000 lbs, packaged food product"
                />
              </div>
            </fieldset>

            <div className="space-y-6">
              {/* Trust strip inside the form column, above submit (§4.8). */}
              <p className="text-micro uppercase text-ink/60 [font-feature-settings:'tnum']">
                Priced by a person · Same business day · USDOT 7638788 · MC 66389691
              </p>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
                {/* The gold submit pill is this viewport's single gold spend. */}
                <SubmitButton state={state}>Request My Quote</SubmitButton>
                <p className="text-micro uppercase text-ink/60 [font-feature-settings:'tnum']">
                  Time-critical?{" "}
                  <a href="tel:+16789721148" className="link-hairline text-ink">
                    678-972-1148
                  </a>{" "}
                  — dispatch answers 24/7
                </p>
              </div>
            </div>
          </m.form>
        )}
      </AnimatePresence>

      <div className="mt-6">
        <FormStatus
          state={state}
          serverError={serverError}
          successMessage="Quote request received. Dispatch will reply the same business day."
        />
      </div>
    </div>
  );
}
