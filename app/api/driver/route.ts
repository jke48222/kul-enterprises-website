import { NextResponse } from "next/server";
import { readForm, sendViaResend } from "@/lib/email";

export async function POST(req: Request) {
  const parsed = await readForm(req, ["name", "contact", "experience"]);
  if ("error" in parsed) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  if (parsed.spam) return NextResponse.json({ ok: true });

  const d = parsed.data;
  const result = await sendViaResend({
    subject: `Driver Inquiry: ${d.name} (${d.experience})`,
    replyTo: d.contact.includes("@") ? d.contact : undefined,
    text: [
      "New driver inquiry from kulenterprises.com",
      "",
      `Name:       ${d.name}`,
      `Contact:    ${d.contact}`,
      `Experience: ${d.experience}`,
      d.note ? `\nNote:\n${d.note}` : "",
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
