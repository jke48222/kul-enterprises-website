import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import ConceptNav from "@/components/concept/ConceptNav";
import ConceptFooter from "@/components/concept/ConceptFooter";

/**
 * Main site chrome: Omnibus Bold display (user-supplied), Montserrat body,
 * pill navigation and structured footer. Metadata inherits from the root
 * layout (indexed).
 */
const omnibus = localFont({
  src: "../fonts/Omnibus-Bold.ttf",
  weight: "700",
  variable: "--font-omnibus",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mont",
  display: "swap",
});

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${omnibus.variable} ${montserrat.variable} bg-ink2 font-mont text-[15px] leading-[1.5] text-white antialiased`}
    >
      <ConceptNav />
      <main id="main">{children}</main>
      <ConceptFooter />
    </div>
  );
}
