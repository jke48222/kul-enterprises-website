"use client";

/**
 * ServiceTile — the services grid row-card with Mark's requested
 * micro-interaction (design email §5): on hover/focus the truck icon
 * SLIDES FORWARD slightly and a gold hairline scales in along the tile's
 * base. Transform/opacity only, ≤300ms, motion-reduce safe. The gold
 * hairline is hover-transient; the resting tile is zero-gold.
 */

import Link from "next/link";
import type { Service } from "@/lib/services";
import { SERVICE_ICONS } from "./icons";

const BASE = "/v3";

export type ServiceTileProps = {
  service: Service;
  index: number;
};

export function ServiceTile({ service, index }: ServiceTileProps) {
  const Icon = SERVICE_ICONS[service.slug] ?? SERVICE_ICONS["dry-van"];

  return (
    <Link
      href={`${BASE}/services/${service.slug}`}
      className="group relative grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-2 border-t border-ink/15 py-8 pr-2 transition-colors duration-300 ease-micro sm:grid-cols-[3rem_5rem_1fr_auto] sm:items-center"
    >
      <span
        aria-hidden
        className="hidden text-micro uppercase tabular-nums text-ink/40 sm:block"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      {/* Icon stage — the truck slides forward on hover. */}
      <span aria-hidden className="block w-14 overflow-hidden text-ink/80 sm:w-20">
        <Icon className="h-9 w-14 transition-transform duration-300 ease-micro group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
      </span>
      <span className="min-w-0">
        <span className="block text-t1 text-ink">{service.name}</span>
        <span className="mt-1 block max-w-[52ch] text-body text-graywarm-deep">
          {service.short}
        </span>
      </span>
      <span
        aria-hidden
        className="hidden text-label uppercase text-ink/50 transition-transform duration-300 ease-micro group-hover:translate-x-1 sm:block"
      >
        →
      </span>
      {/* Gold hairline — scales in on hover/focus only. */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold/70 transition-transform duration-300 ease-micro group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />
    </Link>
  );
}

export default ServiceTile;
