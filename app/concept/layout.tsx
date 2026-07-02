import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Legacy tree: the original Sora/Inter build, preserved for comparison at
 * /concept. Not indexed. Loads its own fonts so main-site visits never
 * download them.
 */
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const metadata: Metadata = {
  title: {
    absolute: "Classic Concept | KUL Enterprises",
    template: "%s | KUL Classic Concept",
  },
  robots: { index: false, follow: false },
};

export default function ConceptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${sora.variable} ${inter.variable} font-sans`}>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
