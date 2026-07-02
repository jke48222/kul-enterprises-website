/**
 * Single source of truth for KUL business facts, navigation, and the
 * homepage story sections. Feeds the header, footer, JSON-LD, and pages.
 */
export const site = {
  name: "KUL Enterprises",
  legalName: "KUL Enterprises LLC",
  tagline: "Strength in Motion. Built on Integrity. Driven by Safety.",
  taglineLines: ["Strength in Motion.", "Built on Integrity.", "Driven by Safety."],
  usdot: "7638788",
  mc: "66389691",
  email: "dispatch@kulenterprises.com",
  phone: "678-972-1148", // confirmed by Mark, 2026-07-01
  phoneHref: "tel:+16789721148",
  city: "Loganville",
  state: "GA",
  location: "Loganville, GA",
  serviceArea: "Southeast Based · Nationwide Service",
  url: "https://www.kulenterprises.com",
  // Loganville, GA city-center coordinates for LocalBusiness geo.
  geo: { latitude: 33.839, longitude: -83.9002 },
} as const;

export const navItems = [
  { label: "Services", href: "/concept/services" },
  { label: "Safety & Compliance", href: "/concept/safety" },
  { label: "Carrier Packet", href: "/concept/carrier-packet" },
  { label: "Driver Careers", href: "/concept/careers" },
  { label: "About", href: "/concept/about" },
  { label: "Contact", href: "/concept/contact" },
] as const;

/** Trust bar directly below the hero. Compliance and reassurance facts. */
export const trustPoints = [
  `USDOT ${site.usdot}`,
  `MC ${site.mc}`,
  "Licensed & Insured",
  "Southeast Based",
  "Nationwide Service",
  "24/7 Communication",
] as const;

/**
 * REPLACEABLE ASSET: Mark's five photos, upscale when hi-res originals arrive.
 * The five story sections. These are Mark's own photographs, mapped to the
 * brand's themes per the Blueprint. Real places, real miles.
 */
export const stories = [
  {
    slug: "every-mile",
    image: "/images/photos/cliffs-over-water.jpg",
    alt: "Rocky cliffs rising over deep blue water",
    eyebrow: "The Journey",
    title: "Every mile teaches something new.",
    body: "KUL started on the road. Years of long hauls through mountain passes, port towns, and places most maps skim past taught our founder what freight really is: someone's livelihood, on a schedule. That experience rides along on every load we move.",
  },
  {
    slug: "integrity",
    image: "/images/photos/river-through-forest.jpg",
    alt: "A calm turquoise river winding through dense green forest",
    eyebrow: "Integrity",
    title: "Steady on the good days and the hard ones.",
    body: "A river holds its course. So do we. You get straight answers before pickup, honest updates in transit, and a delivery that lands when we said it would. If anything changes, you hear it from us first.",
  },
  {
    slug: "roots",
    image: "/images/photos/tree-open-landscape.jpg",
    alt: "A wide oak tree standing over open green land with mountains behind",
    eyebrow: "Our Story",
    title: "Rooted deep. Built to grow.",
    body: "This company grew out of family, faith, and long days behind the wheel. We grow on purpose, load by load, relationship by relationship, so the service never falls behind the name on the door.",
  },
  {
    slug: "strength-in-motion",
    image: "/images/photos/ocean-waves-rocks.jpg",
    alt: "A wave breaking against a rock cliff at the edge of a sand beach",
    eyebrow: "Strength in Motion",
    title: "Power that keeps its promises.",
    body: "Freight moves around the clock, and so does the discipline behind it. Dispatch answers. Equipment is ready. Deadlines hold. That is what strength in motion means here.",
  },
  {
    slug: "driven-by-safety",
    image: "/images/photos/desert-rock-formation.jpg",
    alt: "Sculpted rock formations standing over quiet sand at dusk",
    eyebrow: "Driven by Safety",
    title: "A foundation that doesn't move.",
    body: "Some things are not up for negotiation. Pre-trip inspections. Legal hours. Weather calls made early and on the side of caution. The most important delivery on any route is the driver coming home.",
  },
] as const;

/** The four beats of the scroll journey section. */
export const journeyBeats = [
  {
    step: "01",
    label: "Quote",
    title: "Send the lane.",
    body: "Origin, destination, freight, date. A person prices it and answers the same business day.",
  },
  {
    step: "02",
    label: "Dispatch",
    title: "We commit.",
    body: "Your load gets a driver, a truck, and a plan before the wheels ever turn.",
  },
  {
    step: "03",
    label: "In Transit",
    title: "You stay informed.",
    body: "Tracked and communicated the whole way. You always know where your freight is.",
  },
  {
    step: "04",
    label: "Delivered",
    title: "Signed and done.",
    body: "On the dock when we said it would be. Proof of delivery in your inbox.",
  },
] as const;
