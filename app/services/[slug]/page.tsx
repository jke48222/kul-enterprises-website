import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/lib/services";
import { fill } from "@/lib/content";
import { client, tinaPage } from "@/lib/tina";
import servicesJson from "@/content/services.json";
import indexPage from "@/content/pages/services-index.json";
import ServiceDetailView from "./service-detail-view";

/**
 * ONE PAGE PER FREIGHT SERVICE, THE SERVER HALF.
 *
 * This single file produces all seven service pages: Power Only, Dry Van,
 * Reefer, Dedicated, Regional, Expedited and Over the Road. Next.js builds one
 * page per entry in content/services.json, and adding an eighth service in
 * /admin gives it a page without anybody touching code.
 *
 * It resolves the address, refuses one that does not name a service, and
 * fetches the Services document. service-detail-view.tsx draws it and keeps it
 * live inside the visual editor.
 *
 * The page runs in this order: name and description over a full width
 * photograph, what the service suits, what KUL commits to, the specification
 * block, and links to the service before and after this one.
 */

const t = indexPage.detail;

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Tells Next.js which seven addresses to build. */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};

  return {
    title: `${service.name} ${fill(t.metaTitleSuffix)}`,
    description: `${service.short} ${service.name} ${fill(t.metaDescriptionTail)}`,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // An address that does not match a service shows the not found page. This
  // stays on the server so an unknown slug never reaches the browser.
  if (!services.some((s) => s.slug === slug)) notFound();

  const page = await tinaPage(
    `Service: ${slug}`,
    () => client.queries.services({ relativePath: "services.json" }),
    // The shape the query would have returned, built from the file on disk.
    { services: servicesJson } as never,
  );

  return <ServiceDetailView slug={slug} {...page} />;
}
