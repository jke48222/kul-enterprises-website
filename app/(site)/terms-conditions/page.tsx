import type { Metadata } from "next";
import LegalPage from "@/components/concept/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that govern use of the KUL Enterprises LLC website.",
};

// Draft for client and attorney review before launch.
export default function TermsConditions() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro={[
        "You are advised to read these terms and conditions carefully before using this website. By using this website you are deemed to have read and accepted these terms and conditions. Kindly refrain from using this website should you not agree to all or any of them.",
      ]}
      sections={[
        {
          heading: "1. CONTENT",
          body: [
            `1.1 Our website is owned and operated by ${site.legalName} ("KUL"), a limited liability company organized under the laws of the State of Georgia, United States. You can contact us at ${site.email}.`,
            '1.2 The contents of our website are intended for your personal, non-commercial use only. All materials published on this website (including but not limited to text, photographs, images, videos, graphics, and illustrations, together the "content") are protected by copyright, trademarks, or other intellectual property rights, and are owned or controlled by KUL or by the party credited as the provider of the content.',
            "1.3 Subject to clause 1.4 below, you may not reproduce, republish, upload, post, transmit, or distribute in any manner any content from our website without first obtaining prior written consent from us.",
            "1.4 You may however download or copy the content subject to the following conditions:",
            "(a) the material is used exclusively for your personal, non-commercial purposes;",
            "(b) all copies must include the copyright and other intellectual property notices incorporated into the original material; and",
            "(c) no license is granted in respect of intellectual property rights reserved by us or by the providers of the content.",
          ],
        },
        {
          heading: "2. OTHER SITES",
          body: [
            "Our website provides links to other sites, including government resources such as the FMCSA SAFER system, merely for your convenience and information. We are not responsible for the content or availability of sites operated and controlled by third parties, nor for the information, products, or services contained on or accessible through them. Your access and use of such websites remain solely at your own risk, and KUL will not be liable for any direct, indirect, or consequential losses or damages of any kind arising out of your access to such sites.",
          ],
        },
        {
          heading: "3. CHANGES AND MODIFICATIONS",
          body: [
            "3.1 We reserve the right, at our absolute discretion and without liability, to:",
            "(a) change, modify, alter, adapt, add to, or remove any of the terms and conditions contained herein; and",
            "(b) change, suspend, or discontinue any aspect of this website.",
            "3.2 We are not required to give you advance notice before incorporating any of the above changes or modifications into this website.",
          ],
        },
        {
          heading: "4. USE OF YOUR PERSONAL INFORMATION",
          body: [
            "4.1 We will use the personal information you provide through our website only for the purposes for which it was originally requested, and for directly related purposes, unless we are required or authorized under law to disclose it or you give your consent to its disclosure.",
            "4.2 We do not control the use of personal information you may share with linked sites. You are advised to review their terms and privacy practices.",
            "4.3 We do not sell your name or personal data to third parties, and we do not intend to do so in the future.",
          ],
        },
        {
          heading: "5. YOUR SUGGESTIONS, COMMENTS AND FEEDBACK",
          body: [
            "Any communication you send to our website or to us by electronic mail, other than a freight quote request, carrier setup request, or driver application, shall be treated as non-confidential. Comments, suggestions, questions, and feedback regarding the content or our services in general may be used by us for any purpose, including improving and marketing our services, and in such circumstances you are not entitled to any reward or compensation of any nature from us.",
          ],
        },
        {
          heading: "6. NO WARRANTIES",
          body: [
            "We provide no warranty of any kind, whether express or implied, including but not limited to any implied warranties or implied terms of satisfactory quality, fitness for a particular purpose, or non-infringement. All such implied terms and warranties are hereby excluded to the fullest extent permitted by law.",
          ],
        },
        {
          heading: "7. DISCLAIMER",
          body: [
            "We do not warrant that the functions of our website will be uninterrupted or error-free, that defects will be corrected, or that this website or the server that makes it available is free of viruses or other harmful elements. We do not warrant or make any representations regarding the correctness, accuracy, reliability, or otherwise of the content on our website or the results of its use.",
            "Information on this website, including service descriptions, coverage areas, and transit expectations, is general in nature and does not constitute a rate quotation or a commitment of capacity. Freight moves under signed agreements, including rate confirmations and broker-carrier agreements, and those documents govern in the event of any difference.",
          ],
        },
        {
          heading: "8. LIABILITY",
          body: [
            "8.1 By using our website you agree that we will not be liable under any circumstances, including negligence, for any direct, indirect, or consequential loss arising from your use of the information and material contained on our website or from your access to the linked sites described in clause 2 herein. We are also not liable or responsible for material provided by third parties under their own respective copyright, and shall not under any circumstances be liable for any loss, damage, or injury arising from that material. Our total liability, if any, for all damages, losses, costs, and expenses under any cause of action, whether in contract, tort, or otherwise, will not exceed any amount paid by you for accessing our website.",
            "8.2 Nothing on our website constitutes an offer to sell securities, and it cannot under any circumstances be relied upon for investment dealings of any nature.",
          ],
        },
        {
          heading: "9. EXCLUSIONS",
          body: [
            "The exclusions and limitations described herein shall apply only to the extent permitted by law, without prejudice to our rights to seek legal redress in accordance with applicable law.",
          ],
        },
        {
          heading: "10. APPLICABLE LAW AND JURISDICTION",
          body: [
            "These terms and conditions and this website's content shall be governed by and construed in accordance with the laws of the State of Georgia, United States, without regard to its conflict of law principles, and the state and federal courts located in Georgia shall have exclusive jurisdiction to adjudicate any dispute which may arise in relation thereto.",
          ],
        },
        {
          heading: "11. TRADE MARKS",
          body: [
            `The KUL Enterprises name, the lion mark, the Doctor Bird device, and the tagline "Strength in Motion. Built on Integrity. Driven by Safety." are marks of ${site.legalName}, operating as an interstate motor carrier under USDOT ${site.usdot} and MC ${site.mc}.`,
          ],
        },
      ]}
    />
  );
}
