import localFont from "next/font/local";
import ConceptNav from "@/components/concept/ConceptNav";
import ConceptFooter from "@/components/concept/ConceptFooter";
import PageReveal from "@/components/concept/PageReveal";

/**
 * Main site chrome: Omnibus Bold display (user-supplied), Montserrat body
 * (loaded once in the root layout), pill navigation and structured footer.
 * Metadata inherits from the root layout (indexed).
 */
const omnibus = localFont({
  src: "../fonts/Omnibus-Bold.ttf",
  weight: "700",
  variable: "--font-omnibus",
  display: "swap",
});

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${omnibus.variable} bg-ink2 font-mont text-[15px] leading-[1.5] text-white antialiased`}
    >
      <PageReveal />
      {/* display:contents wrapper: zero layout impact, single inert target
          while the arrival curtain covers the page. */}
      <div style={{ display: "contents" }} data-kul-frame>
        <ConceptNav />
        <main id="main">{children}</main>
        <ConceptFooter />
      </div>
    </div>
  );
}
