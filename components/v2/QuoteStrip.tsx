"use client";

/**
 * QuoteStrip — §3.16. The VistaJet booking row, wired to /api/quote.
 * One segmented horizontal row on ≥md (vertical hairline dividers, no
 * boxes), stacked underline fields below md — the row NEVER crushes.
 * POSTs the EXACT v1 field names (origin, destination, freightType,
 * pickupDate, contact — `details` omitted, optional in the API) through
 * the existing useFormSubmit hook, with the `botcheck` Honeypot.
 *
 * Focus choreography per §3.20: micro label above the line lifts to full
 * opacity; a 1.5px currentColor underline (NEVER gold) scales in over the
 * resting hairline. The circular gold submit arrow is the section's 2nd
 * gold (§2.7). Success swaps the strip for a one-line editorial
 * confirmation via AnimatePresence.
 *
 * headingLevel defaults to "h2" (rendered at h3 visual scale) so the strip
 * never breaks heading order (§2.1).
 */

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { EASE } from "@/components/v2/motion";
import { Honeypot, useFormSubmit } from "@/components/forms/FormShell";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export type QuoteStripProps = {
  ground?: "ink" | "paper";
  heading?: string;
  headingLevel?: "h2" | "h3";
};

export function QuoteStrip({
  ground = "paper",
  heading = "Send a lane. A person prices it.",
  headingLevel = "h2",
}: QuoteStripProps) {
  const { state, serverError, submit } = useFormSubmit("/api/quote");
  const uid = useId();
  // min = today for pickupDate (§3.16). Computed once per mount.
  const [today] = useState(() => new Date().toISOString().slice(0, 10));

  const ink = ground === "ink";
  const Heading = headingLevel;

  const restLine = ink ? "bg-white/[0.18]" : "bg-ink/15";
  const focusLine = ink ? "bg-paper" : "bg-ink";
  const labelColor = ink ? "text-paper/60" : "text-ink/60";
  const inputColor = ink ? "text-paper" : "text-ink";
  const divider = ink ? "md:divide-white/[0.12]" : "md:divide-ink/15";
  const rowRule = ink ? "md:border-white/[0.12]" : "md:border-ink/15";
  const microMuted = ink ? "text-paper/60" : "text-ink/60";
  const errorColor = ink ? "text-[#C98A7A]" : "text-[#8C3B2E]";

  const cell = "group relative px-0 py-4 md:py-5 md:px-[clamp(12px,1.2vw,24px)] md:first:pl-0";
  const label = `block text-micro uppercase ${labelColor} transition-opacity duration-200 group-focus-within:opacity-100`;
  const input = `peer mt-2 block w-full appearance-none rounded-none bg-transparent font-mont text-[17px] ${inputColor} outline-none`;
  // Resting hairline under each field (mobile only — the row's border-y carries it on md).
  const restUnderline = `pointer-events-none absolute inset-x-0 bottom-0 block h-px ${restLine} md:hidden`;
  // Focus underline: 1.5px full-strength currentColor ground ink/paper — never gold (§3.20).
  // group-focus-within (not peer) so it also fires for the nested select.
  const focusUnderline = `pointer-events-none absolute inset-x-0 bottom-0 block h-[1.5px] origin-left scale-x-0 ${focusLine} transition-transform duration-[450ms] ease-micro group-focus-within:scale-x-100 motion-reduce:transition-none`;

  return (
    <div data-ground={ground}>
      <Heading
        className={`font-omnibus text-h3 ${ink ? "text-cream" : "text-ink"}`}
      >
        {heading}
      </Heading>

      <AnimatePresence mode="wait" initial={false}>
        {state === "success" ? (
          <m.div
            key="confirmation"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [...EASE.out] }}
            className="mt-10"
          >
            <p
              className={`max-w-[30ch] font-omnibus text-h3 ${ink ? "text-cream" : "text-ink"}`}
            >
              Your lane is with dispatch. Same business day.
            </p>
            <p className={`mt-4 text-micro uppercase ${microMuted}`}>
              Time-critical?{" "}
              <a
                href={site.phoneHref}
                className={`link-hairline tabular-nums ${ink ? "text-paper/80" : "text-ink"}`}
              >
                {site.phone}
              </a>{" "}
              — dispatch answers 24/7
            </p>
          </m.div>
        ) : (
          <m.form
            key="strip"
            onSubmit={submit}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [...EASE.out] }}
            className="mt-8"
          >
            <Honeypot />
            <div
              className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_1.15fr_auto] md:items-end md:divide-x ${divider} md:border-y ${rowRule}`}
            >
              {/* ORIGIN */}
              <div className={cell}>
                <label htmlFor={`${uid}-origin`} className={label}>
                  Origin (city, state)
                </label>
                <input
                  id={`${uid}-origin`}
                  name="origin"
                  type="text"
                  required
                  autoComplete="off"
                  className={input}
                />
                <span aria-hidden className={restUnderline} />
                <span aria-hidden className={focusUnderline} />
              </div>

              {/* DESTINATION */}
              <div className={cell}>
                <label htmlFor={`${uid}-destination`} className={label}>
                  Destination
                </label>
                <input
                  id={`${uid}-destination`}
                  name="destination"
                  type="text"
                  required
                  autoComplete="off"
                  className={input}
                />
                <span aria-hidden className={restUnderline} />
                <span aria-hidden className={focusUnderline} />
              </div>

              {/* FREIGHT TYPE */}
              <div className={cell}>
                <label htmlFor={`${uid}-freightType`} className={label}>
                  Freight type
                </label>
                <div className="relative">
                  <select
                    id={`${uid}-freightType`}
                    name="freightType"
                    required
                    defaultValue=""
                    className={`${input} cursor-pointer pr-6`}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {services.map((s) => (
                      <option key={s.slug} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="Not sure">Not sure</option>
                  </select>
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[10px] ${labelColor} transition-transform duration-200 ease-micro peer-focus:rotate-180 motion-reduce:transition-none`}
                  >
                    ▾
                  </span>
                </div>
                <span aria-hidden className={restUnderline} />
                <span aria-hidden className={focusUnderline} />
              </div>

              {/* PICKUP DATE */}
              <div className={cell}>
                <label htmlFor={`${uid}-pickupDate`} className={label}>
                  Pickup date
                </label>
                <input
                  id={`${uid}-pickupDate`}
                  name="pickupDate"
                  type="date"
                  required
                  min={today}
                  suppressHydrationWarning
                  className={`${input} tabular-nums`}
                  style={{ colorScheme: ink ? "dark" : "light" }}
                />
                <span aria-hidden className={restUnderline} />
                <span aria-hidden className={focusUnderline} />
              </div>

              {/* CONTACT */}
              <div className={cell}>
                <label htmlFor={`${uid}-contact`} className={label}>
                  Email or phone
                </label>
                <input
                  id={`${uid}-contact`}
                  name="contact"
                  type="text"
                  required
                  autoComplete="email"
                  className={input}
                />
                <span aria-hidden className={restUnderline} />
                <span aria-hidden className={focusUnderline} />
              </div>

              {/* SUBMIT — circular gold arrow, the section's 2nd gold (§2.7). */}
              <div className="flex items-center py-4 md:items-end md:py-5 md:pl-[clamp(12px,1.2vw,24px)]">
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  aria-label={
                    state === "submitting"
                      ? "Sending your lane"
                      : "Send your lane to dispatch"
                  }
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-ink transition-colors duration-200 ease-micro hover:bg-gold-soft disabled:cursor-wait disabled:opacity-60"
                >
                  <span aria-hidden>{state === "submitting" ? "…" : "→"}</span>
                </button>
              </div>
            </div>

            {/* Inline status line (FormStatus semantics: assertive error region). */}
            <div className="mt-3 min-h-6" role="alert">
              {state === "error" && (
                <p className={`text-sm font-medium ${errorColor}`}>
                  {serverError ??
                    `Something went wrong sending your lane. Try again, or call dispatch at ${site.phone}.`}
                </p>
              )}
            </div>

            <p
              className={`mt-4 text-micro uppercase tabular-nums ${microMuted}`}
            >
              Priced by a person · Same business day · USDOT {site.usdot} · MC{" "}
              {site.mc}
            </p>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default QuoteStrip;
