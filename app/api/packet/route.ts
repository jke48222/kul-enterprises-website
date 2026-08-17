import { NextResponse } from "next/server";
import { isEmail, readForm, recordLead, sendViaResend } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { fill } from "@/lib/content";
import forms from "@/content/forms.json";

/**
 * Carrier packet requests.
 *
 * The packet itself is not on the site and is not sent by this route. All this
 * does is tell dispatch that a broker asked, and who to send it to. That is
 * deliberate: the documents are a W-9, a certificate of insurance and an
 * authority letter, and a person attaches those to a reply.
 *
 * Before this existed the page was a mailto link, which meant a request only
 * arrived if the broker's machine had a mail client set up, and KUL had no
 * record of anybody who asked and gave up.
 */
export async function POST(req: Request) {
  if (!rateLimit(`packet:${clientIp(req)}`).allowed) {
    return NextResponse.json(
      { ok: false, error: fill(forms.shared.rateLimited) },
      { status: 429 }
    );
  }

  const parsed = await readForm(req, ["company", "authority", "email"]);
  if ("error" in parsed) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  if (parsed.spam) return NextResponse.json({ ok: true });

  const d = parsed.data;
  recordLead("packet", d);
  // isEmail gates reply_to only. A real but unusual address must never cost
  // KUL the lead, the same rule the contact route follows.
  const result = await sendViaResend({
    subject: `Carrier packet: ${d.company} (${d.authority})`,
    replyTo: isEmail(d.email) ? d.email : undefined,
    text: [
      "A broker asked for the carrier packet on kulenterprises.com",
      "",
      `Company:      ${d.company}`,
      `MC or USDOT:  ${d.authority}`,
      `Send it to:   ${d.email}`,
      "",
      "Attach: operating authority, signed W-9, certificate of insurance.",
      "The certificate has to come from the insurance agent, so ask them",
      "first if the broker needs to be named as holder.",
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
