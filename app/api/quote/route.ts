import { NextResponse } from "next/server";
import { isEmail, readForm, recordLead, sendViaResend } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { fill } from "@/lib/content";
import forms from "@/content/forms.json";

export async function POST(req: Request) {
  if (!rateLimit(`quote:${clientIp(req)}`).allowed) {
    return NextResponse.json(
      { ok: false, error: fill(forms.shared.rateLimited) },
      { status: 429 }
    );
  }

  const parsed = await readForm(req, [
    "origin",
    "destination",
    "freightType",
    "pickupDate",
    "contact",
    // The agreement checkbox. It is required here and not only in the browser,
    // because `required` on an input stops a browser and nothing else, and this
    // endpoint can be posted to directly. An unticked box sends no value at
    // all, so a missing key is exactly the case this rejects.
    "consent",
  ]);
  if ("error" in parsed) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  // Honeypot hit: pretend success so bots learn nothing.
  if (parsed.spam) return NextResponse.json({ ok: true });

  const d = parsed.data;
  recordLead("quote", d);
  const result = await sendViaResend({
    subject: `Freight Quote Request: ${d.origin} to ${d.destination}`,
    replyTo: isEmail(d.contact) ? d.contact : undefined,
    text: [
      "New freight quote request from kulenterprises.com",
      "",
      `Origin:       ${d.origin}`,
      `Destination:  ${d.destination}`,
      `Freight type: ${d.freightType}`,
      `Pickup date:  ${d.pickupDate}`,
      `Contact:      ${d.contact}`,
      d.details ? `\nDetails:\n${d.details}` : "",
      // The record that consent was actually given, which is the point of
      // asking for it. Without this line the agreement exists only as a tick
      // nobody kept.
      "",
      "Sender agreed to be contacted about this load, and to the privacy policy and terms.",
    ].join("\n"),
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: fill(forms.shared.deliveryFailed) },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true, delivered: result.delivered });
}
