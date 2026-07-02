import { site } from "./site";

/**
 * Resend delivery, env-guarded (07-design-research / tech foundation):
 * - RESEND_API_KEY unset (local dev, preview): the send is stubbed, logged,
 *   and reported as accepted-but-not-delivered so forms remain testable.
 * - RESEND_API_KEY set (production): delivers via Resend's REST API to
 *   dispatch@kulenterprises.com. The `from` uses Resend's shared onboarding
 *   sender until the client's domain is verified in Resend.
 */
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
    console.log(`[email:stub] ${subject}\n${text}`);
    return { ok: true, delivered: false };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "KUL Website <onboarding@resend.dev>",
      to: [site.email],
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  return { ok: res.ok, delivered: res.ok };
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

  // Honeypot: real users never fill this hidden field.
  if (typeof raw.company_website === "string" && raw.company_website.trim()) {
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
