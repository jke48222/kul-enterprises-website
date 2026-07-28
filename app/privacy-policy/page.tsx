import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/v2/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How KUL Enterprises LLC collects, uses, and protects information submitted through this website.",
};

// Draft for client and attorney review before launch.
//
// Accuracy contract (mirrors app/cookies/page.tsx): every unconditional
// sentence must stay true whether or not NEXT_PUBLIC_GA_ID is set, because
// app/layout.tsx renders <GoogleAnalytics> off that flag. Negative claims
// are therefore scoped to conduct KUL controls — no ad targeting, no
// cross-site tracking, no selling — rather than absolutes about third
// parties that shipping analytics would falsify. Anything specific to
// Google is gated on the same flag.
export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="July 2026"
      sections={[
        {
          heading: "Introduction",
          body: (
            <>
              <p>
                We are committed to protecting your personal information and to
                being transparent about the information we hold about you.
                Using personal information allows us to develop a better
                understanding of the shippers, brokers, and drivers we work
                with, and in turn to respond to you with relevant and timely
                information about KUL Enterprises and our services.
              </p>
              <p>
                The purpose of this policy is to give you a clear explanation
                of how we collect and use the personal information you provide
                through this website, including through our quote, contact,
                and driver inquiry forms.
              </p>
              <p>
                This privacy policy may change from time to time, and the date
                at the top of this page shows when it was last revised. It is
                important that you read this policy so that you are aware of
                how and why we are using your personal information, and we
                encourage you to revisit this page periodically to keep up to
                date.
              </p>
              <p>
                If you have any questions, please contact {site.legalName} at{" "}
                {site.email} or {site.phone}.
              </p>
            </>
          ),
        },
        {
          heading: "About us",
          body: (
            <p>
              {site.legalName} is a for-hire interstate motor carrier based in{" "}
              {site.location}, operating under USDOT {site.usdot} and MC{" "}
              {site.mc}. We provide freight transportation services across the
              United States, directly for shippers and through freight
              brokers, in accordance with federal motor carrier regulations.
            </p>
          ),
        },
        {
          heading: "Information we may collect about you",
          body: (
            <>
              <p>
                Personal information means any information about an individual
                from which that person can be identified. It does not include
                data where the identity has been removed.
              </p>
              <p>
                We may collect, use, and store different kinds of personal
                information about you, which we have grouped together as
                follows:
              </p>
              <dl>
                <dt>Identity Data</dt>
                <dd>includes your first name, last name, and company name.</dd>
                <dt>Contact Data</dt>
                <dd>
                  includes your email address, telephone number, and business
                  address.
                </dd>
                <dt>Freight Data</dt>
                <dd>
                  includes the lane, commodity, equipment, dates, and other
                  shipment details you provide when requesting a quote or
                  setting up KUL as a carrier.
                </dd>
                <dt>Driver Application Data</dt>
                <dd>
                  includes your CDL class, experience, endorsements, and work
                  history when you inquire about driving for KUL.
                </dd>
                <dt>Communications Data</dt>
                <dd>
                  includes the messages you send us through our forms, by
                  email, or by phone, and our notes from those conversations,
                  which help us manage our relationship with you.
                </dd>
              </dl>
            </>
          ),
        },
        {
          heading: "How we collect your data",
          body: (
            <>
              <p>
                Information you give us. When you request a freight quote,
                send a message through our contact form, submit a driver
                inquiry, or correspond with dispatch by email or phone, we
                store the personal information you choose to give us. To make
                sure no inquiry is ever lost, submissions are also recorded in
                our website&apos;s operational logs and may be mirrored to a
                service provider that processes them on our behalf.
              </p>
              {/* The GA paragraph tracks the same build-time flag that renders
                  the tag, so the policy never claims measurement that is off.
                  The paragraph after it must stay true in BOTH states. */}
              {process.env.NEXT_PUBLIC_GA_ID ? (
                <p>
                  Information collected automatically. We use Google Analytics
                  to understand, in aggregate, how visitors find and use our
                  website — for example which pages are read most. It sets
                  cookies on this domain that last about two years, and the
                  measurements are sent to Google, who process them on our
                  behalf. The results do not identify you personally to us,
                  and we do not use them for advertising. The cookies
                  involved, and how to block them, are described on our{" "}
                  <Link href="/cookies">Manage Cookies</Link> page.
                </p>
              ) : null}
              <p>
                We do not require you to create an account, and we do not
                collect payment card details through this website. Nothing we
                collect here is used to advertise to you, to track you across
                other websites, or to build a profile of you for anyone
                else&apos;s purposes, and we do not buy information about you
                from outside sources. Everything this website stores in your
                browser is itemized on our{" "}
                <Link href="/cookies">Manage Cookies</Link> page.
              </p>
            </>
          ),
        },
        {
          heading: "How we may use your information",
          body: (
            <>
              <p>
                We will only use your personal information for the purposes
                for which it was provided, and for directly related purposes.
                Most commonly, we will use it in the following ways:
              </p>
              <ul>
                <li>
                  To respond to your quote request with pricing and capacity,
                  and to arrange and perform the transportation services you
                  ask for.
                </li>
                <li>
                  To complete carrier setup with brokers, including providing
                  our authority, insurance, and reference documents.
                </li>
                <li>
                  To consider and respond to your interest in driving for KUL,
                  and to contact you about lanes, home time, and equipment.
                </li>
                <li>
                  To meet the recordkeeping obligations that apply to
                  interstate motor carriers.
                </li>
                <li>To administer and protect our business and this website.</li>
              </ul>
              <p>
                We do not use your personal information for automated
                profiling, and we will not send you marketing communications
                you have not asked for.
              </p>
            </>
          ),
        },
        {
          heading: "Disclosure of your details to third parties",
          body: (
            <>
              <p>
                There are certain circumstances under which we may disclose
                your personal information to third parties, as follows:
              </p>
              <ul>
                <li>
                  To our service providers who process data on our behalf and
                  on our instructions, such as the providers of our email
                  delivery and website hosting. We require all third parties
                  to respect the security of your personal information and to
                  treat it in accordance with the law, and we only permit them
                  to process it for specified purposes.
                </li>
                <li>
                  Where we are under a duty to disclose your personal
                  information in order to comply with any legal obligation,
                  including to government bodies, law enforcement agencies,
                  and transportation regulators.
                </li>
                <li>
                  Where delivering the service you asked for requires it, for
                  example a certificate of insurance issued with your company
                  named as holder.
                </li>
                {/* Named only when analytics actually ships, on the same
                    build-time flag as the tag in app/layout.tsx. */}
                {process.env.NEXT_PUBLIC_GA_ID ? (
                  <li>
                    To Google, who receive the website measurements described
                    above and process them as our analytics provider. They
                    receive no information from our quote, contact, or driver
                    forms.
                  </li>
                ) : null}
              </ul>
              <p>
                We do not sell personal details to third parties for any
                purpose, and we do not intend to do so in the future.
              </p>
            </>
          ),
        },
        {
          heading: "Security of your personal information",
          body: (
            <p>
              We have put in place appropriate safeguards, in both our
              procedures and the technology we use, to keep your personal
              information as secure as possible. This website is served over
              an encrypted connection, and form submissions are delivered
              directly to our dispatch inbox. Third parties that process data
              for us are subject to a duty of confidentiality.
            </p>
          ),
        },
        {
          heading: "Data retention",
          body: (
            <>
              <p>
                We will only retain your personal information for as long as
                necessary to fulfill the purposes we collected it for,
                including to satisfy the legal, accounting, and reporting
                requirements that apply to interstate motor carriers.
              </p>
              <p>
                To determine the appropriate retention period, we consider the
                amount, nature, and sensitivity of the information, the
                potential risk of harm from unauthorized use or disclosure,
                the purposes for which we process it, and whether we can
                achieve those purposes through other means.
              </p>
            </>
          ),
        },
        {
          heading: "Your rights",
          body: (
            <>
              <p>
                You are entitled to know what personal information we hold
                about you and to control how it is used. Specifically, you
                may:
              </p>
              <ul className="!list-none !pl-0">
                <li>
                  (a) request a copy of the personal information we hold about
                  you;
                </li>
                <li>
                  (b) request that we correct any personal information that is
                  inaccurate or incomplete;
                </li>
                <li>
                  (c) request that we delete personal information where there
                  is no good reason for us to continue holding it, noting that
                  recordkeeping obligations that apply to motor carriers may
                  require us to retain certain records for a period of time;
                  and
                </li>
                <li>(d) ask us to stop contacting you at any time.</li>
              </ul>
              <p>
                You will not have to pay a fee to exercise any of these
                rights. We may need to request specific information from you
                to help us confirm your identity, which is a security measure
                to ensure personal information is not disclosed to a person
                who has no right to receive it.
              </p>
            </>
          ),
        },
        {
          heading: "Contact details and further information",
          body: (
            <>
              <p>
                Please get in touch with us if you have any questions about
                any aspect of this privacy policy, about the information we
                hold about you, or to exercise any of the rights described
                above:
              </p>
              <ul className="!list-none !pl-0">
                <li>
                  Email us:{" "}
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
                <li>
                  Call us: <a href={site.phoneHref}>{site.phone}</a>
                </li>
                <li>
                  Write to us: {site.legalName}, {site.location}.
                </li>
              </ul>
              <p>
                We respond to all legitimate requests the same business day
                where possible, and in any event within thirty days.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
