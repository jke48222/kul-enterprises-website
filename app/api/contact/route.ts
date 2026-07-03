import { NextResponse } from "next/server";
import { isEmail, readForm, recordLead, sendViaResend } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`).allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  const parsed = await readForm(req, ["name", "email", "message"]);
  if ("error" in parsed) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  if (parsed.spam) return NextResponse.json({ ok: true });

  const d = parsed.data;
  if (!isEmail(d.email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  recordLead("contact", d);
  const result = await sendViaResend({
    subject: `Website Contact: ${d.name}`,
    replyTo: d.email,
    text: [
      "New contact message from kulenterprises.com",
      "",
      `Name:  ${d.name}`,
      `Email: ${d.email}`,
      "",
      d.message,
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
