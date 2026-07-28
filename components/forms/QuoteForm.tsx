"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { services } from "@/lib/services";
import { DUR, EASE } from "@/components/v2/motion";
import { PanelField, PanelSelect, PanelTextarea } from "./PanelField";
import { useFormSubmit, Honeypot, FormStatus } from "./FormShell";

/**
 * THE QUOTE FORM
 *
 * Six questions, which is everything needed to put a price on a load. Drawn on
 * the Paper artboard "Quote, desktop 1440", where it sits on the right of the
 * dark panel with the explanation on the left.
 *
 * The first four questions sit two to a row because they pair up naturally:
 * where it starts and where it ends, then what it is and when it moves. The
 * last two run the full width because the answers are longer.
 *
 * TO CHANGE THE QUESTIONS: edit the fields below. If you add or remove one,
 * update the sentence on the quote page that says how many there are, and tell
 * whoever maintains the form handler, because the names here have to match
 * what it expects.
 *
 * The list of freight types is not typed in here. It comes from
 * content/services.json, so adding a service to the site adds it to this list
 * automatically.
 */

/** Today, in the visitor's own timezone, so the date picker cannot go back. */
function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function QuoteForm() {
  const { state, serverError, submit } = useFormSubmit("/api/quote");
  // Instance-scoped ids, so a page could hold two forms without them clashing.
  const uid = useId();
  const [lane, setLane] = useState<{ origin: string; destination: string } | null>(
    null
  );
  const [today] = useState(localToday);

  // The lane is read back so the thank you can repeat it to the sender.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    setLane({
      origin: String(data.get("origin") ?? ""),
      destination: String(data.get("destination") ?? ""),
    });
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
            className="flex flex-col gap-5 rounded-sm border border-k-rule-dark bg-k-blueprint p-9"
          >
            <p className="font-display text-k-d2 font-black text-k-on-dark">
              Sent to dispatch.
            </p>
            {lane ? (
              <p className="font-text text-k-lede text-k-gold-lit">
                {lane.origin} to {lane.destination}
              </p>
            ) : null}
            <p className="font-text text-k-body text-k-on-dark-soft">
              A person replies the same business day. If the load moves sooner
              than that, call dispatch instead of waiting.
            </p>
          </m.div>
        ) : (
          <m.form
            key="form"
            onSubmit={handleSubmit}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast, ease: [...EASE.micro] }}
            className="flex flex-col gap-5"
          >
            <Honeypot />

            {/* Where it starts and where it ends. */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <PanelField
                id={`${uid}-origin`}
                label="Origin (city, state)"
                name="origin"
                type="text"
                required
                maxLength={200}
                autoComplete="off"
                placeholder="Atlanta, GA"
              />
              <PanelField
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

            {/* What it is and when it moves. */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <PanelSelect
                id={`${uid}-freightType`}
                label="Freight type"
                name="freightType"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select a service
                </option>
                {services.map((s) => (
                  <option key={s.slug} value={s.name}>
                    {s.name}
                  </option>
                ))}
                <option value="Not sure">Not sure, advise me</option>
              </PanelSelect>
              <PanelField
                id={`${uid}-pickupDate`}
                label="Target pickup date"
                name="pickupDate"
                type="date"
                required
                min={today}
                suppressHydrationWarning
              />
            </div>

            <PanelField
              id={`${uid}-contact`}
              label="Your email or phone"
              name="contact"
              type="text"
              required
              maxLength={200}
              autoComplete="email"
              placeholder="you@company.com or 555-123-4567"
            />

            <PanelTextarea
              id={`${uid}-details`}
              label="Weight, dimensions, commodity"
              name="details"
              rows={3}
              maxLength={2000}
              placeholder="24 pallets, 38,000 lbs, packaged food product"
            />

            <div className="flex flex-col gap-6 pt-1">
              <p className="max-w-[560px] font-text text-[12px] leading-[19px] text-k-on-dark-soft">
                By sending this you agree we may contact you about this load. We
                do not add you to a mailing list and we do not pass your details
                to anyone else.
              </p>
              <button
                type="submit"
                disabled={state === "submitting"}
                className="w-fit rounded-full bg-k-gold-lit px-9 py-4 font-text text-k-label uppercase text-k-void transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
              >
                {state === "submitting" ? "Sending" : "Send the request"}
              </button>
            </div>
          </m.form>
        )}
      </AnimatePresence>

      {/* Anything the form needs to say back, including a failure to send. */}
      {state === "error" ? (
        <p className="pt-5 font-text text-k-small text-[#C98A7A]">
          {serverError ??
            "That did not send. Call dispatch on 678-972-1148 and the load will be quoted the same way."}
        </p>
      ) : (
        <FormStatus
          state={state}
          serverError={serverError}
          successMessage="Quote request received. Dispatch will reply the same business day."
        />
      )}
    </div>
  );
}
