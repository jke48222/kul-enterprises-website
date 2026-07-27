import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StudioDocument from "@/components/studio/StudioDocument";
import { listStudioRoutes, readStudioDoc } from "@/lib/studio";

/**
 * Version 4 — "DISPATCH". The Mobbin-sourced build: home plus the seven
 * chapters, each an authored document under /studio/v4.
 */

type Params = { slug?: string[] };

export function generateStaticParams(): Params[] {
  return listStudioRoutes("v4").map((slug) => ({ slug }));
}

function load(slug: string[]) {
  try {
    return readStudioDoc("v4", ...slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug = [] } = await params;
  const doc = load(slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.description, robots: { index: false } };
}

export default async function V4Page({ params }: { params: Promise<Params> }) {
  const { slug = [] } = await params;
  const doc = load(slug);
  if (!doc) notFound();
  return <StudioDocument doc={doc} />;
}
