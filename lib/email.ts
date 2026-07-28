import { after } from "next/server";
import { site } from "./site";

/**
 * Resend delivery, env-guarded (07-design-research / tech foundation):
 * - RESEND_API_KEY unset in development: the send is stubbed, logged, and
 *   reported as accepted-but-not-delivered so forms remain testable.
 * - RESEND_API_KEY unset in production: the send FAILS (ok: false) so the
 *   route returns 502 and the visitor is told to call instead. A silently
 *   dropped lead is worse than a visible error.
 * - RESEND_API_KEY set: delivers via Resend's REST API to
 *   dispatch@kulenterprises.com. The `from` uses Resend's shared onboarding
 *   sender until the client's domain is verified in Resend.
 */
/**
 * WHO THE QUOTE AND CONTACT EMAILS COME FROM
 *
 * Resend's shared `onboarding@resend.dev` address can ONLY deliver to the
 * email address that owns the Resend account. It cannot deliver to
 * dispatch@kulenterprises.com, so leaving it in place means every lead is
 * rejected by Resend and never arrives.
 *
 * TO FIX THIS PROPERLY, once only:
 *   1. Add and verify kulenterprises.com as a domain in Resend.
 *   2. Set RESEND_FROM in the hosting environment, for example
 *      RESEND_FROM="KUL Enterprises <dispatch@kulenterprises.com>"
 *   3. Set RESEND_API_KEY in the same place.
 *
 * Until step 2 is done this logs a warning on every send, because a silently
 * rejected lead looks identical to a working form from the outside.
 */
function senderAddress(): string {
  const configured = process.env.RESEND_FROM;
  if (configured) return configured;

  console.warn(
    "[email] RESEND_FROM is not set, so the shared onboarding@resend.dev " +
      `sender is being used. Resend will reject delivery to ${site.email}. ` +
      "Verify the domain in Resend and set RESEND_FROM to fix this."
  );
  return "KUL Website <onboarding@resend.dev>";
}

export async function sendViaResend({
  subject,
  text,
  replyTo,
}: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<{ ok: boolean; delivered: boolean }> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[email] RESEND_API_KEY is not set in production; refusing to fake a send."
      );
      return { ok: false, delivered: false };
    }
    console.log(`[email:stub] ${subject}\n${text}`);
    return { ok: true, delivered: false };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: senderAddress(),
        to: [site.email],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "<unreadable>");
      console.error(`[email] Resend rejected the send: ${res.status} ${body}`);
    }
    return { ok: res.ok, delivered: res.ok };
  } catch (err) {
    console.error("[email] Resend request failed:", err);
    return { ok: false, delivered: false };
  }
}

/** Pragmatic email shape check — used to gate reply_to, not to reject leads. */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/**
 * Lead redundancy: every submission is also written to the server log as one
 * structured JSON line, so a Resend outage or quota hit never loses a lead —
 * it stays recoverable from the hosting logs. If LEAD_WEBHOOK_URL is set
 * (e.g. a Zapier/Make hook feeding a spreadsheet), the lead is mirrored there
 * too, fire-and-forget.
 */
export function recordLead(kind: string, data: Record<string, string>): void {
  const entry = { kind, at: new Date().toISOString(), ...data };
  console.log(`[lead] ${JSON.stringify(entry)}`);

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    // after(): a bare fire-and-forget fetch would be frozen with the
    // serverless instance the moment the route responds — precisely in the
    // fast-failure paths this mirror exists for.
    after(() =>
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      }).catch((err) => console.error("[lead] webhook mirror failed:", err))
    );
  }
}

/** Shared request parsing + honeypot for the three form endpoints. */
export type FormResult =
  | { data: Record<string, string>; spam: false }
  | { data: null; spam: true };

export async function readForm(
  req: Request,
  required: string[]
): Promise<FormResult | { error: string }> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { error: "Invalid request body." };
  }
  const raw = (body ?? {}) as Record<string, unknown>;

  // Honeypot: real users never fill this hidden field. Log a bounded slice
  // of the payload before discarding, so an autofill false positive is
  // recoverable but a bot can't flood the logs with multi-MB bodies.
  if (typeof raw.botcheck === "string" && raw.botcheck.trim()) {
    console.log(`[lead:honeypot] ${JSON.stringify(raw).slice(0, 2000)}`);
    return { data: null, spam: true };
  }

  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string") data[k] = v.trim().slice(0, 2000);
  }
  for (const field of required) {
    if (!data[field]) return { error: `Missing required field: ${field}` };
  }
  return { data, spam: false };
}
