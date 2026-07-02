import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Legacy tree: the original Sora/Inter build, preserved for comparison at
 * /concept. Not indexed.
 */
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
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
