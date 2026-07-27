import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StudioDocument from "@/components/studio/StudioDocument";
import { listStudioRoutes, readStudioDoc } from "@/lib/studio";

/**
 * The surviving design exploration.
 *
 *   /explore/p1/<style>            phase 1 — one signature page per variant
 *   /explore/p2/<style>/<chapter>  phase 2 — the full chapter sets
 *
 * Kept after Jalen's Jul 27 cut: Marquee Editorial (s02), Industrial Ledger
 * (s06), and the Apple (s10) and Rivian (s12) layout-family recreations.
 */

type Params = { slug: string[] };

export function generateStaticParams(): Params[] {
  return listStudioRoutes("explore")
    .filter((slug) => slug.length > 0)
    .map((slug) => ({ slug }));
}

function load(slug: string[]) {
  try {
    return readStudioDoc("explore", ...slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = load(slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.description, robots: { index: false } };
}

export default async function ExplorePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = load(slug);
  if (!doc) notFound();
  return <StudioDocument doc={doc} />;
}
