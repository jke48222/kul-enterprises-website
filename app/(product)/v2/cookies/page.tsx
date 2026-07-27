import type { Metadata } from "next";
import LegalPage from "@/components/v2/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Manage Cookies",
  description:
    "What this website stores in your browser, why, and how to control it.",
};

// Draft for client and attorney review before launch.
// v1 body copy reused verbatim (§4.10); headings de-CAPSed to sentence case.
export default function ManageCookies() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Manage Cookies"
      updated="July 2026"
      sections={[
        {
          heading: "Introduction",
          body: (
            <p>
              This page explains what is stored in your browser when you use
              our website, why it is stored, and how you can control it. We
              believe in being transparent about this: our website does not
              use advertising cookies, cross-site trackers, or third-party
              profiling of any kind.
            </p>
          ),
        },
        {
          heading: "What we store",
          body: (
            <p>
              Our website sets a single session flag, named kul-intro-seen,
              which remembers that our opening animation has already played so
              that it does not replay on every page you visit. It contains no
              personal information, is never transmitted to us or to anyone
              else, and is deleted automatically when you close your browser
              tab.
            </p>
          ),
        },
        {
          heading: "How to control it",
          body: (
            <p>
              You do not need to take any action: the flag clears itself when
              your browsing session ends. To remove it immediately, use your
              browser&apos;s site-data or privacy controls, or browse in a
              private window. Blocking storage entirely will not prevent you
              from using any part of our website.
            </p>
          ),
        },
        // Rendered only when GA is actually enabled (same build-time flag
        // that renders the tag), so this page never overstates what runs.
        ...(process.env.NEXT_PUBLIC_GA_ID
          ? [
              {
                heading: "Traffic measurement",
                body: (
                  <p>
                    We use Google Analytics to understand how many people
                    visit our website and which pages they find useful. It
                    sets its own cookies to tell returning visitors apart from
                    new ones. We do not use this information for advertising
                    or sell it to anyone. You can block these cookies in your
                    browser settings or with Google&apos;s opt-out browser
                    add-on without losing any part of our website.
                  </p>
                ),
              },
            ]
          : []),
        {
          heading: "Changes to this page",
          body: (
            <p>
              If what we store or measure changes, this page and our Privacy
              Policy will be updated to say so plainly before the change takes
              effect. Questions about this page can be sent to {site.email}.
            </p>
          ),
        },
      ]}
    />
  );
}
