import type { Metadata } from "next";
import LegalPage from "@/components/concept/LegalPage";
import { site } from "@/lib/site";
import PageClosing from "@/components/concept/PageClosing";

export const metadata: Metadata = { title: "Terms & Conditions" };

// Draft for client and attorney review before launch.
export default function TermsConditions() {
  return (
    <>
      <LegalPage
        gradient="linear-gradient(90deg,#161616,#1B2E52)"
        eyebrow="Legal"
        title="Terms & Conditions"
        sections={[
          {
            heading: "Using this site",
            body: [
              "This website presents KUL Enterprises LLC and lets you request quotes, contact dispatch, and inquire about driving. By using it you agree to these terms and to use the site lawfully and in good faith.",
            ],
          },
          {
            heading: "Quotes and service",
            body: [
              "Quotes provided through this site or by phone are good-faith commitments based on the information you supply. Final rates and service terms are confirmed at booking and governed by the written agreement, rate confirmation, bill of lading, and applicable federal and state transportation law, which control over anything on this site.",
            ],
          },
          {
            heading: "Content",
            body: [
              "The KUL name, lion mark, Doctor Bird mark, photography, and site content belong to KUL Enterprises LLC or are used under license. You may not copy or reuse them without written permission.",
            ],
          },
          {
            heading: "No warranties; limitation",
            body: [
              "The site is provided as is. We work to keep information current, but we do not warrant that every page is error-free, and we are not liable for damages arising from use of the site itself. Freight services are governed by the operative shipping documents, not this website.",
            ],
          },
          {
            heading: "Governing law",
            body: [
              `These terms are governed by the laws of the State of Georgia. Questions belong at ${site.email}.`,
            ],
          },
        ]}
      />
      <PageClosing />
    </>
  );
}
