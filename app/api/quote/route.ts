import { NextResponse } from "next/server";
import { readForm, sendViaResend } from "@/lib/email";

export async function POST(req: Request) {
  const parsed = await readForm(req, [
    "origin",
    "destination",
    "freightType",
    "pickupDate",
    "contact",
  ]);
  if ("error" in parsed) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  // Honeypot hit: pretend success so bots learn nothing.
  if (parsed.spam) return NextResponse.json({ ok: true });

  const d = parsed.data;
  const result = await sendViaResend({
    subject: `Freight Quote Request: ${d.origin} to ${d.destination}`,
    replyTo: d.contact.includes("@") ? d.contact : undefined,
    text: [
      "New freight quote request from kulenterprises.com",
      "",
      `Origin:       ${d.origin}`,
      `Destination:  ${d.destination}`,
      `Freight type: ${d.freightType}`,
      `Pickup date:  ${d.pickupDate}`,
      `Contact:      ${d.contact}`,
      d.details ? `\nDetails:\n${d.details}` : "",
    ].join("\n"),
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "Email delivery failed." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true, delivered: result.delivered });
}
