import type { Metadata } from "next";
import LegalPage from "@/components/concept/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How KUL Enterprises LLC collects, uses, and protects information submitted through this website.",
};

// Draft for client and attorney review before launch.
export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro={[
        "We are committed to protecting your personal information and to being transparent about the information we hold about you. Using personal information allows us to develop a better understanding of the shippers, brokers, and drivers we work with, and in turn to respond to you with relevant and timely information about KUL Enterprises and our services.",
        "The purpose of this policy is to give you a clear explanation of how we collect and use the personal information you provide through this website, including through our quote, contact, and driver inquiry forms.",
        "This privacy policy may change from time to time, and the date at the top of this page shows when it was last revised. It is important that you read this policy so that you are aware of how and why we are using your personal information, and we encourage you to revisit this page periodically to keep up to date.",
        `If you have any questions, please contact ${site.legalName} at ${site.email} or ${site.phone}.`,
      ]}
      sections={[
        {
          heading: "1. ABOUT US",
          body: [
            `${site.legalName} is a for-hire interstate motor carrier based in ${site.location}, operating under USDOT ${site.usdot} and MC ${site.mc}. We provide freight transportation services across the United States, directly for shippers and through freight brokers, in accordance with federal motor carrier regulations.`,
          ],
        },
        {
          heading: "2. INFORMATION WE MAY COLLECT ABOUT YOU",
          body: [
            "Personal information means any information about an individual from which that person can be identified. It does not include data where the identity has been removed.",
            "We may collect, use, and store different kinds of personal information about you, which we have grouped together as follows:",
            "Identity Data includes your first name, last name, and company name.",
            "Contact Data includes your email address, telephone number, and business address.",
            "Freight Data includes the lane, commodity, equipment, dates, and other shipment details you provide when requesting a quote or setting up KUL as a carrier.",
            "Driver Application Data includes your CDL class, experience, endorsements, and work history when you inquire about driving for KUL.",
            "Communications Data includes the messages you send us through our forms, by email, or by phone, and our notes from those conversations, which help us manage our relationship with you.",
          ],
        },
        {
          heading: "3. HOW WE COLLECT YOUR DATA",
          body: [
            "Information you give us. When you request a freight quote, send a message through our contact form, submit a driver inquiry, or correspond with dispatch by email or phone, we store the personal information you choose to give us. To make sure no inquiry is ever lost, submissions are also recorded in our website's operational logs and may be mirrored to a service provider that processes them on our behalf.",
            // The GA paragraph tracks the same build-time flag that renders
            // the tag, so the policy never claims measurement that is off.
            ...(process.env.NEXT_PUBLIC_GA_ID
              ? [
                  "Information collected automatically. We use Google Analytics to understand, in aggregate, how visitors find and use our website — for example which pages are read most. This data does not identify you personally to us, and we do not use it for advertising. The cookies involved, and how to block them, are described on the Manage Cookies page.",
                ]
              : []),
            "We do not require you to create an account, and we do not collect payment card details through this website. We do not use advertising cookies or cross-site trackers.",
          ],
        },
        {
          heading: "4. HOW WE MAY USE YOUR INFORMATION",
          body: [
            "We will only use your personal information for the purposes for which it was provided, and for directly related purposes. Most commonly, we will use it in the following ways:",
            "To respond to your quote request with pricing and capacity, and to arrange and perform the transportation services you ask for.",
            "To complete carrier setup with brokers, including providing our authority, insurance, and reference documents.",
            "To consider and respond to your interest in driving for KUL, and to contact you about lanes, home time, and equipment.",
            "To meet the recordkeeping obligations that apply to interstate motor carriers.",
            "To administer and protect our business and this website.",
            "We do not use your personal information for automated profiling, and we will not send you marketing communications you have not asked for.",
          ],
        },
        {
          heading: "5. DISCLOSURE OF YOUR DETAILS TO THIRD PARTIES",
          body: [
            "There are certain circumstances under which we may disclose your personal information to third parties, as follows:",
            "To our service providers who process data on our behalf and on our instructions, such as the providers of our email delivery and website hosting. We require all third parties to respect the security of your personal information and to treat it in accordance with the law, and we only permit them to process it for specified purposes.",
            "Where we are under a duty to disclose your personal information in order to comply with any legal obligation, including to government bodies, law enforcement agencies, and transportation regulators.",
            "Where delivering the service you asked for requires it, for example a certificate of insurance issued with your company named as holder.",
            "We do not sell personal details to third parties for any purpose, and we do not intend to do so in the future.",
          ],
        },
        {
          heading: "6. SECURITY OF YOUR PERSONAL INFORMATION",
          body: [
            "We have put in place appropriate safeguards, in both our procedures and the technology we use, to keep your personal information as secure as possible. This website is served over an encrypted connection, and form submissions are delivered directly to our dispatch inbox. Third parties that process data for us are subject to a duty of confidentiality.",
          ],
        },
        {
          heading: "7. DATA RETENTION",
          body: [
            "We will only retain your personal information for as long as necessary to fulfill the purposes we collected it for, including to satisfy the legal, accounting, and reporting requirements that apply to interstate motor carriers.",
            "To determine the appropriate retention period, we consider the amount, nature, and sensitivity of the information, the potential risk of harm from unauthorized use or disclosure, the purposes for which we process it, and whether we can achieve those purposes through other means.",
          ],
        },
        {
          heading: "8. YOUR RIGHTS",
          body: [
            "You are entitled to know what personal information we hold about you and to control how it is used. Specifically, you may:",
            "(a) request a copy of the personal information we hold about you;",
            "(b) request that we correct any personal information that is inaccurate or incomplete;",
            "(c) request that we delete personal information where there is no good reason for us to continue holding it, noting that recordkeeping obligations that apply to motor carriers may require us to retain certain records for a period of time; and",
            "(d) ask us to stop contacting you at any time.",
            "You will not have to pay a fee to exercise any of these rights. We may need to request specific information from you to help us confirm your identity, which is a security measure to ensure personal information is not disclosed to a person who has no right to receive it.",
          ],
        },
        {
          heading: "9. CONTACT DETAILS AND FURTHER INFORMATION",
          body: [
            "Please get in touch with us if you have any questions about any aspect of this privacy policy, about the information we hold about you, or to exercise any of the rights described above:",
            `Email us: ${site.email}`,
            `Call us: ${site.phone}`,
            `Write to us: ${site.legalName}, ${site.location}.`,
            "We respond to all legitimate requests the same business day where possible, and in any event within thirty days.",
          ],
        },
      ]}
    />
  );
}
