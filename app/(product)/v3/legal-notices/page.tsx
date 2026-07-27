import type { Metadata } from "next";
import LegalPage from "@/components/v3/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legal Notices & Disclaimers",
  description:
    "Legal notices and disclaimers for the KUL Enterprises LLC website.",
};

// Draft for client and attorney review before launch.
// Audited v2 body copy ported verbatim; template = v3 LegalPage.
export default function LegalNotices() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Legal Notices & Disclaimers"
      updated="July 2026"
      sections={[
        {
          heading: "Pictures & wordmark",
          body: (
            <p>
              The photography featured on this website includes images taken
              personally by our founder while traveling the United States,
              together with licensed imagery. Equipment shown may differ in
              specification, configuration, or livery from the equipment
              assigned to any particular load. All third-party word marks and
              logos that may appear remain the property of their respective
              owners, and any use of such marks is under license or by
              permission.
            </p>
          ),
        },
        {
          heading: "Service information",
          body: (
            <p>
              Service descriptions, coverage areas, capacity, and transit
              expectations presented on this website are obtained under normal
              operating conditions and may vary depending on the lane, season,
              weather, road and environmental conditions, and applicable
              hours-of-service regulations. Nothing on this website
              constitutes a rate quotation or a commitment of capacity.
              Freight moves under signed agreements, including rate
              confirmations and broker-carrier agreements, and those documents
              govern in the event of any difference.
            </p>
          ),
        },
        {
          heading: "Copyright & IP",
          body: (
            <p>
              This website and its contents are protected by various
              intellectual property rights, including without limitation
              copyright, design rights, and trademarks, that are owned or
              licensed by {site.legalName}. You may not copy or use this
              website or any of its contents for any commercial purpose
              without our prior written consent. The KUL Enterprises name, the
              lion mark, and the Doctor Bird device are marks of{" "}
              {site.legalName}.
            </p>
          ),
        },
        {
          heading: "Brokers & partners",
          body: (
            <p>
              Freight brokers, agents, and partner carriers are not agents of{" "}
              {site.legalName} and have no authority to bind {site.legalName}{" "}
              by any express or implied undertaking or representation.
              Arrangements made through brokers or agents are subject to their
              own terms and conditions.
            </p>
          ),
        },
        {
          heading: "Operating authority & verification",
          body: (
            <p>
              {site.legalName} operates as a for-hire interstate motor carrier
              under USDOT {site.usdot} and MC {site.mc}, based in{" "}
              {site.location}. Authority and safety records are public and can
              be verified through the FMCSA SAFER system. Auto liability and
              cargo coverage are maintained as required by federal regulation,
              and certificates of insurance are issued directly by our insurer
              on request. Notices and legal correspondence: {site.email}.
            </p>
          ),
        },
      ]}
    />
  );
}
