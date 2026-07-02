/**
 * The 7 KUL services. One dedicated page per freight type for SEO.
 * Copy is approval-ready. No filler.
 */
export type Service = {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  bestFor: string[];
  commitments: string[];
};

export const services: Service[] = [
  {
    slug: "power-only",
    name: "Power Only",
    short: "We bring the tractor and the driver. Your loaded trailer moves on schedule.",
    tagline: "Your trailer. Our power.",
    description:
      "With Power Only, KUL supplies the tractor and a professional driver to move your preloaded trailers, whether that is dry vans, reefers, or flatbeds. You add dependable capacity without buying trucks, and your docks keep moving on your schedule.",
    bestFor: [
      "Shippers and brokers with trailer pools that need reliable power",
      "Drop-and-hook networks where dwell time eats margin",
      "Seasonal surge capacity without long-term commitments",
    ],
    commitments: [
      "On-time hook and drop, confirmed in writing",
      "Trailer condition documented at pickup and delivery",
      "One dispatch line. One call gets an answer.",
    ],
  },
  {
    slug: "dry-van",
    name: "Dry Van",
    short: "Palletized freight in clean 53-foot vans, sealed and tracked dock to dock.",
    tagline: "The workhorse, run with discipline.",
    description:
      "Dry van is the backbone of American freight, and it shows you everything about how a carrier operates. KUL moves palletized and boxed freight in well-maintained 53-foot dry vans. Sealed, secured, and tracked from your dock to the receiver's signature.",
    bestFor: [
      "Palletized consumer goods, packaging, and non-perishables",
      "Retail and distribution-center deliveries with strict appointments",
      "Full truckload moves, regional or coast to coast",
    ],
    commitments: [
      "Load bars, straps, and seals on every load",
      "Appointment-first scheduling with proactive ETAs",
      "Clean, DOT-compliant equipment on every dispatch",
    ],
  },
  {
    slug: "reefer",
    name: "Reefer",
    short: "Temperature-controlled freight with the cold chain protected door to door.",
    tagline: "Cold chain, unbroken.",
    description:
      "Temperature-sensitive freight leaves no room for guessing. KUL moves produce, food products, and other temp-controlled loads with pre-cooled trailers, continuous temperature monitoring, and drivers trained to protect the cold chain from first pallet to final signature.",
    bestFor: [
      "Fresh and frozen food with tight temperature specs",
      "Produce moving out of Southeast growing regions",
      "Any load where a temperature excursion means a rejection",
    ],
    commitments: [
      "Pre-cool verified before loading, setpoint confirmed in writing",
      "Continuous temperature monitoring in transit",
      "Immediate notification if anything drifts",
    ],
  },
  {
    slug: "dedicated",
    name: "Dedicated",
    short: "Committed trucks and consistent drivers on your recurring lanes.",
    tagline: "Your lane. Our promise. Every week.",
    description:
      "Dedicated service turns freight from a weekly scramble into a standing appointment. KUL commits equipment and drivers to your lanes, so you see the same faces at your docks, budget against rates that hold, and keep capacity in tight markets because it is contractually yours.",
    bestFor: [
      "Recurring lanes with weekly or daily frequency",
      "Shippers tired of spot-market volatility",
      "Facilities that value a consistent, known driver",
    ],
    commitments: [
      "Guaranteed capacity on committed lanes",
      "Consistent drivers who learn your facility and your people",
      "Pricing that holds. No surge surprises.",
    ],
  },
  {
    slug: "regional",
    name: "Regional",
    short: "Fast, flexible coverage across Georgia and the Southeast.",
    tagline: "The Southeast is home turf.",
    description:
      "KUL is based in Loganville, Georgia, and runs the Southeast like a home route because it is one. Regional service means next-day coverage across Georgia and the neighboring states, drivers who know the docks and the traffic, and the responsiveness of a carrier that lives here.",
    bestFor: [
      "Georgia, Alabama, Tennessee, and Carolinas lanes",
      "Next-day and two-day regional distribution",
      "Shippers who want a carrier close enough to show up",
    ],
    commitments: [
      "Same-day quote turnaround on regional lanes",
      "Local knowledge of docks, appointments, and detours",
      "Short-notice capacity when your regular carrier falls through",
    ],
  },
  {
    slug: "expedited",
    name: "Expedited",
    short: "Time-critical freight moved on the fastest compliant path.",
    tagline: "When it cannot wait.",
    description:
      "Some loads carry more than freight. They carry production lines, deadlines, and promises your business made to someone else. KUL expedited puts urgent freight on the fastest compliant path with direct communication at every milestone until it is signed for.",
    bestFor: [
      "Line-down and emergency shipments",
      "High-value freight with fixed delivery windows",
      "Recovering a service failure from another carrier",
    ],
    commitments: [
      "Dispatch response in minutes, not hours",
      "Milestone updates at pickup, in transit, and delivery",
      "Speed inside the rules. Fast, never reckless.",
    ],
  },
  {
    slug: "otr",
    name: "Over-the-Road",
    short: "Nationwide long-haul with a plan you see before the wheels turn.",
    tagline: "Coast to coast, without the silence.",
    description:
      "Long-haul freight usually fails on communication before it fails on distance. KUL over-the-road moves full truckloads nationwide with real route planning, honest transit times, and check-ins that keep you informed instead of wondering. From the Southeast to either coast, your freight travels with a name behind it.",
    bestFor: [
      "Full truckload moves beyond the regional footprint",
      "Cross-country lanes that need honest transit times",
      "Shippers done with carriers who go quiet between pickup and delivery",
    ],
    commitments: [
      "Route and transit plan shared before pickup",
      "Daily check-ins on multi-day hauls",
      "One point of contact from quote to proof of delivery",
    ],
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);
