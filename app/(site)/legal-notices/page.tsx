import type { Metadata } from "next";
import LegalPage from "@/components/concept/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Legal Notices & Disclaimers" };

// Draft for client and attorney review before launch.
export default function LegalNotices() {
  return (
    <LegalPage
      gradient="linear-gradient(90deg,#161616,#2E4A5E)"
      eyebrow="Legal"
      title="Legal Notices & Disclaimers"
      sections={[
        {
          heading: "Operating authority",
          body: [
            `KUL Enterprises LLC operates as a for-hire interstate motor carrier under USDOT ${site.usdot} and MC ${site.mc}, based in ${site.location}. Authority and safety records are public and can be verified through the FMCSA SAFER system.`,
          ],
        },
        {
          heading: "Insurance",
          body: [
            "Auto liability and cargo coverage are maintained as required by federal regulation. Certificates of insurance are issued directly by our insurer on request, with your company listed as certificate holder where applicable.",
          ],
        },
        {
          heading: "Forward-looking statements",
          body: [
            "Statements about our plans, including fleet growth goals, describe intentions rather than guarantees. They reflect what we are building toward and may change with market conditions.",
          ],
        },
        {
          heading: "Third-party links",
          body: [
            "Links to external sites, such as government verification systems, are provided for convenience. We are not responsible for their content or availability.",
          ],
        },
        {
          heading: "Contact",
          body: [
            `Notices and legal correspondence: ${site.email}, or by phone at ${site.phone}.`,
          ],
        },
      ]}
    />
  );
}
