import { NextResponse } from "next/server";
import { readForm, sendViaResend } from "@/lib/email";

export async function POST(req: Request) {
  const parsed = await readForm(req, ["name", "email", "message"]);
  if ("error" in parsed) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  if (parsed.spam) return NextResponse.json({ ok: true });

  const d = parsed.data;
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
