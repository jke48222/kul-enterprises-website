import { NextResponse } from "next/server";
import { isEmail, readForm, recordLead, sendViaResend } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { fill } from "@/lib/content";
import forms from "@/content/forms.json";

export async function POST(req: Request) {
  if (!rateLimit(`driver:${clientIp(req)}`).allowed) {
    return NextResponse.json(
      { ok: false, error: fill(forms.shared.rateLimited) },
      { status: 429 }
    );
  }

  const parsed = await readForm(req, ["name", "contact", "experience"]);
  if ("error" in parsed) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  if (parsed.spam) return NextResponse.json({ ok: true });

  const d = parsed.data;
  recordLead("driver", d);
  const result = await sendViaResend({
    subject: `Driver Inquiry: ${d.name} (${d.experience})`,
    replyTo: isEmail(d.contact) ? d.contact : undefined,
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
      { ok: false, error: fill(forms.shared.deliveryFailed) },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true, delivered: result.delivered });
}
