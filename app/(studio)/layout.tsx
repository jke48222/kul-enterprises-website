import type { Metadata } from "next";

/**
 * Second root layout — deliberately bare.
 *
 * The design-exploration versions are self-contained documents: each ships its
 * own reset, type scale and component CSS. Wrapping them in the product layout
 * would pull in Tailwind's preflight (`@tailwind base` in globals.css) and the
 * v1 legacy sheet, whose element-level resets fight the authored design.
 *
 * A route group with its own <html>/<body> gives Next's supported "multiple
 * root layouts" isolation: no Tailwind, no shared fonts, no providers. Moving
 * between /v1 and these routes is a full document load, which is exactly right
 * — they are different documents, not different pages of one app.
 */
export const metadata: Metadata = {
  robots: { index: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
