import type { Metadata } from "next";
import LegalPage from "@/components/concept/LegalPage";
import { site } from "@/lib/site";
import PageClosing from "@/components/concept/PageClosing";

export const metadata: Metadata = { title: "Manage Cookies" };

// Draft for client and attorney review before launch.
export default function ManageCookies() {
  return (
    <>
      <LegalPage
        gradient="linear-gradient(90deg,#161616,#5A1D1D)"
        eyebrow="Legal"
        title="Manage Cookies"
        sections={[
          {
            heading: "The short version",
            body: [
              "This site does not use advertising cookies, analytics trackers, or third-party profiling. There is nothing to opt out of, because we never opted you in.",
            ],
          },
          {
            heading: "The one thing we store",
            body: [
              "A single sessionStorage flag named kul-intro-seen remembers that our intro animation already played, so it does not replay on every page. It contains no personal data, is never sent anywhere, and clears itself when you close the browser tab.",
            ],
          },
          {
            heading: "How to clear it",
            body: [
              "Close the tab and it is gone. To clear it immediately, use your browser's site-data controls or open a private window.",
            ],
          },
          {
            heading: "If this changes",
            body: [
              `If we ever add measurement tools, this page and our Privacy Policy will say so plainly first. Questions: ${site.email}.`,
            ],
          },
        ]}
      />
      <PageClosing />
    </>
  );
}
