"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { services } from "@/lib/services";
import { DUR, EASE } from "@/components/k/motion";
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

  /**
   * THE FREIGHT TYPE ARRIVES ALREADY CHOSEN WHEN THE VISITOR CAME FROM A
   * SERVICE PAGE.
   *
   * "Quote this service" on /services/reefer links to /quote?service=reefer,
   * and this turns that into a selected option. Somebody who has just read a
   * page about reefer should not have to tell us it is reefer.
   *
   * IT READS THE URL IN AN EFFECT RATHER THAN DURING RENDER, and that is not
   * laziness. The server has no query string when it renders this form, so
   * picking the value up during render would produce different markup on the
   * two sides and React would throw a hydration mismatch. Starting empty and
   * setting it after mount is the version that agrees with itself. It also
   * avoids `useSearchParams`, which in the App Router forces the whole form
   * into a Suspense boundary to stay statically renderable.
   *
   * THE VALUE IS NOT TRUSTED. It is a slug from a URL anybody can edit, so it
   * is looked up in the real service list and discarded unless it matches. The
   * option values are service names, so what goes into state is the name we
   * found, never the string that arrived.
   */
  const [freightType, setFreightType] = useState("");

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    if (!slug) return;
    const match = services.find((s) => s.slug === slug);
    if (match) setFreightType(match.name);
    else if (slug === "not-sure") setFreightType("Not sure");
  }, []);

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
            // Same card as the form it replaces, so the panel does not change
            // shape or colour at the moment of success.
            className="flex flex-col gap-5 rounded-xl bg-k-coal p-6 md:p-9"
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
              A person replies, usually the same business day. If the load
              moves sooner than that, call dispatch instead of waiting.
            </p>
          </m.div>
        ) : (
          <m.form
            key="form"
            onSubmit={handleSubmit}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast, ease: [...EASE.micro] }}
            // THE FORM IS HELD ON A CARD, which is the move that makes this
            // read as Fiasco's rather than as fields floating on a page. Three
            // steps of dark: the section is black, this card is coal, and the
            // fields inside are blueprint. Each is one step lighter than what
            // holds it, so nothing needs a border to be legible as a layer.
            className="flex flex-col gap-5 rounded-xl bg-k-coal p-6 md:p-9"
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
                // Controlled, because the effect above may set it from the URL
                // after the first render. An uncontrolled select with a
                // defaultValue would ignore that.
                value={freightType}
                onChange={(e) => setFreightType(e.target.value)}
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

            {/* ============================================================
                THE AGREEMENT IS A CHECKBOX NOW, NOT A SENTENCE.
                ============================================================
                It used to be a paragraph saying "by sending this you agree",
                which is consent by ambush: the reader agrees by doing the thing
                they came to do, and there is no record that they ever saw it.
                A ticked box is a deliberate act, and it is the shape the client
                asked for after seeing Fiasco's contact form.

                IT IS ENFORCED ON THE SERVER AS WELL. `required` here only stops
                a browser, and anyone can post the endpoint directly, so
                app/api/quote/route.ts lists consent among its required fields
                and the reply records that it was given. An agreement that can
                be skipped by a curl command is not an agreement.

                THE INPUT IS A REAL CHECKBOX, styled with appearance-none rather
                than hidden behind a decorative span. A visually hidden required
                control cannot be focused when validation fails, and Chrome
                refuses to submit while reporting that it has nothing to point
                at, which strands the reader on a form that will not send and
                will not say why. */}
            <div className="flex flex-col gap-7 pt-2">
              <label className="flex max-w-[560px] cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="relative mt-px h-[18px] w-[18px] shrink-0 cursor-pointer appearance-none rounded-[3px] border border-k-rule-dark bg-k-blueprint transition-colors duration-200 checked:border-k-gold-lit checked:bg-k-gold-lit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-k-gold-lit checked:after:absolute checked:after:left-[5.5px] checked:after:top-[1.5px] checked:after:h-[9px] checked:after:w-[4px] checked:after:rotate-45 checked:after:border-b-2 checked:after:border-r-2 checked:after:border-k-void checked:after:content-['']"
                />
                <span className="font-text text-[12px] leading-[19px] text-k-on-dark-soft">
                  I agree KUL may contact me about this load. We do not add you
                  to a mailing list and we do not pass your details to anyone
                  else. See the{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-k-on-dark underline underline-offset-2 transition-colors duration-200 hover:text-k-gold-lit"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/terms-conditions"
                    className="text-k-on-dark underline underline-offset-2 transition-colors duration-200 hover:text-k-gold-lit"
                  >
                    Terms
                  </Link>
                  .
                </span>
              </label>

              {/* Hard right, on the reference. It is the last thing in the
                  panel and the only filled shape in it, so it reads as the end
                  of the form rather than as another field. */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="rounded-full bg-k-gold-lit px-9 py-4 font-text text-k-label uppercase text-k-void transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                >
                  {state === "submitting" ? "Sending" : "Send the request"}
                </button>
              </div>
            </div>
          </m.form>
        )}
      </AnimatePresence>

      {/* Anything the form needs to say back, including a failure to send. */}
      {state === "error" ? (
        <p className="pt-5 font-text text-k-small text-[#C98A7A]">
          {serverError ??
            "That did not send. Call dispatch on 678-972-1148 and the load can be quoted over the phone instead."}
        </p>
      ) : (
        <FormStatus
          state={state}
          serverError={serverError}
          /* Hedged to match the confirmation panel above. Both render on
             success, so an unhedged promise here would contradict it. */
          successMessage="Quote request received. Dispatch will reply, usually the same business day."
        />
      )}
    </div>
  );
}
