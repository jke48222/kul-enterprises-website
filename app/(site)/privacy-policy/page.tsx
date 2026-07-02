import type { Metadata } from "next";
import LegalPage from "@/components/concept/LegalPage";
import { site } from "@/lib/site";
import PageClosing from "@/components/concept/PageClosing";

export const metadata: Metadata = { title: "Privacy Policy" };

// Draft for client and attorney review before launch.
export default function PrivacyPolicy() {
  return (
    <>
      <LegalPage
        gradient="linear-gradient(90deg,#161616,#1F4A32)"
        eyebrow="Legal"
        title="Privacy Policy"
        sections={[
          {
            heading: "What we collect",
            body: [
              "When you submit a quote request, contact form, or driver inquiry, we collect only what you type: your name, contact details, and the freight or employment information you choose to share. We do not buy, sell, or trade personal information, and we do not run advertising trackers on this site.",
            ],
          },
          {
            heading: "How we use it",
            body: [
              "Form submissions are delivered by email to our dispatch inbox and used solely to respond to your request: pricing a lane, answering a question, or talking with you about driving for KUL. We keep correspondence as long as needed to serve you and to meet recordkeeping obligations that apply to motor carriers.",
            ],
          },
          {
            heading: "What we store in your browser",
            body: [
              "This site sets a single session flag so our intro animation plays once per visit instead of on every page. It contains no personal information and disappears when you close your browser. See Manage Cookies for details.",
            ],
          },
          {
            heading: "Sharing",
            body: [
              "We share information only when required to deliver the service you asked for (for example, insurance certificates naming your company), when the law requires it, or with providers that process our email and hosting under confidentiality obligations.",
            ],
          },
          {
            heading: "Your choices",
            body: [
              `To review, correct, or delete information you have sent us, email ${site.email} or call ${site.phone}. We respond the same business day.`,
            ],
          },
        ]}
      />
      <PageClosing />
    </>
  );
}
