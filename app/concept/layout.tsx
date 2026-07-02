import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import ConceptNav from "@/components/concept/ConceptNav";
import ConceptFooter from "@/components/concept/ConceptFooter";

/**
 * Concept route: the reference-structure recreation carrying KUL content.
 * Type per client direction: Omnibus Bold for headings (user-supplied file),
 * Montserrat for body and tracked-caps labels (OFL family, 400 + 600).
 * Both are scoped to this subtree; the main site keeps Sora/Inter.
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

export const metadata: Metadata = {
  title: {
    default: "Concept | KUL Enterprises",
    template: "%s | KUL Concept",
  },
  robots: { index: false, follow: false },
};

export default function ConceptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${omnibus.variable} ${montserrat.variable} bg-ink2 font-mont text-[15px] leading-[1.5] text-white antialiased`}
    >
      <ConceptNav />
      <main>{children}</main>
      <ConceptFooter />
    </div>
  );
}
