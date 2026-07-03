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
  recordLead("contact", d);
  // isEmail gates reply_to only — an unusual-but-real address (the browser's
  // type=email is looser than the regex) must never cost KUL the lead.
  const result = await sendViaResend({
    subject: `Website Contact: ${d.name}`,
    replyTo: isEmail(d.email) ? d.email : undefined,
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
