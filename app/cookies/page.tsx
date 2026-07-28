import type { Metadata } from "next";
import LegalPage from "@/components/v2/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Manage Cookies",
  description:
    "What this website stores in your browser, why, and how to control it.",
};

// Draft for client and attorney review before launch.
//
// Accuracy contract for this page (do not regress):
//  1. Every unconditional sentence must stay true whether or not
//     NEXT_PUBLIC_GA_ID is set. Absolute negatives like "no third-party
//     profiling of any kind" are what broke this page before — the layout
//     renders <GoogleAnalytics> off that same flag, so the claim inverted
//     the moment analytics shipped. Promises here are scoped to what KUL
//     chooses to do (no ad targeting, no cross-site following, no selling),
//     which holds in both builds; the mechanics of GA live in the gated
//     section instead.
//  2. kul-intro-seen is localStorage, NOT a session cookie — see
//     components/brand/LoadingOverlay.tsx (SEEN_KEY, "first visit EVER").
//     It does not expire and it survives closing the tab. The old copy
//     claimed both the opposite things.
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
              would rather set it out plainly than leave you guessing, so
              everything the site keeps is listed below. What we will not do
              is use any of it to advertise to you, to follow you onto other
              websites, or to sell to anyone.
            </p>
          ),
        },
        {
          heading: "What we store",
          body: (
            <>
              <p>
                One entry, named kul-intro-seen, which records that our
                opening film has already played so that it does not greet you
                a second time. Its value is the single character 1. It holds
                nothing about you, and it is never transmitted to us or to
                anyone else.
              </p>
              <p>
                It is kept in your browser&apos;s local storage rather than in
                a cookie, and that distinction is worth stating precisely: it
                does not expire on a schedule, and it is not cleared when you
                close the tab. It stays until you clear this site&apos;s data
                — which is what lets the film play once in your life rather
                than on every visit.
              </p>
            </>
          ),
        },
        // Rendered only when GA is actually enabled — the same build-time
        // flag that renders the tag in app/layout.tsx — so this page never
        // describes measurement that is switched off. Note that the sections
        // above and below stay truthful either way; this block adds detail,
        // it does not correct them.
        ...(process.env.NEXT_PUBLIC_GA_ID
          ? [
              {
                heading: "Traffic measurement",
                body: (
                  <>
                    <p>
                      We use Google Analytics to understand how many people
                      reach our website and which pages they actually read.
                      Unlike the flag above, this does set cookies: a pair on
                      this domain, one named _ga and one beginning _ga_, which
                      tell a returning visitor apart from a new one. They last
                      about two years unless you clear them first.
                    </p>
                    <p>
                      Those measurements are sent to Google, who process them
                      on our behalf, and we read them only in aggregate. We do
                      not use them to advertise to you and we do not sell
                      them. You can block these cookies in your browser
                      settings or with Google&apos;s opt-out browser add-on,
                      and nothing on this website will stop working.
                    </p>
                  </>
                ),
              },
            ]
          : []),
        {
          heading: "How to control it",
          body: (
            <p>
              None of it is required for the website to function. You can
              clear everything described above through your browser&apos;s
              site-data or privacy controls for this domain, or avoid it in
              the first place by browsing in a private window. If you block
              storage for this site altogether, the site notices and simply
              skips the opening film; every page, form, and phone number
              behaves exactly as it otherwise would.
            </p>
          ),
        },
        {
          heading: "Changes to this page",
          body: (
            <p>
              If what we store or measure changes, this page and our Privacy
              Policy will be updated to say so plainly before the change takes
              effect. Questions about any of it can be sent to {site.email}.
            </p>
          ),
        },
      ]}
    />
  );
}
