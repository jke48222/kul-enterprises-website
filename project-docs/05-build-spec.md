# KUL Enterprises Website Build Spec

Single build reference, derived from Mark's Blueprint v1 (received 2026-06-30). Source of truth for design and content decisions. Gates before production: signed agreement + 50% deposit.

## North star
Every design decision answers one question: "Does this increase trust?" If yes, keep it. If no, refine it.

## Art direction
- Premium, minimal, confident. "Mercedes-Benz, not Monster Energy."
- Large photography, large typography, minimal words, generous white space.
- Not flashy, not loud, not cluttered.
- Should feel like a company that has already earned trust and is building toward being one of the most respected carriers in the country.

## Palette (locked)
| Role | Color | Hex |
|---|---|---|
| Primary accent | Gold ("excellence, not luxury") | #D4AF37 |
| Base dark | Black | #0B0B0B |
| Secondary dark | Charcoal | TBD (~#1A1A1A) |
| Light | White | #FFFFFF |
| Accent neutral | Soft / warm gray | TBD |

Lock as CSS variables / Tailwind tokens so the no-code editor can never break the palette.

## Typography
Large and premium. Specific families TBD, pending Mark's preference (his Blueprint lists Typography but did not specify). Proposed direction (self-hosted, no license fees), two options to show Mark:
- Option A (modern, strong): "Space Grotesk" or "Sora" headlines + "Inter" body.
- Option B (slightly editorial): "Archivo" headlines + "Inter" body.
Confirm with Mark before build.

## Symbols
- **Lion:** primary brand icon (leadership, strength, protection, confidence, responsibility). Header, logo lockup, footer.
- **Jamaican Doctor Bird:** "signature," not the primary logo. Represents freedom, precision, speed, purpose, resilience, and Mark's Jamaican heritage. Uses: loading animation, plus subtle future touches (footer watermark, favicon, 404 page).

## Loading animation
From Mark's concept board.
- Sequence: black screen, soft cinematic cue, Doctor Bird flies left to right leaving a gold-particle trail, particles resolve into the KUL logo, then the tagline appears.
- Duration: ~2 to 3 seconds.
- Colors: gold #D4AF37, black #0B0B0B.
- Uses the provided Doctor Bird vector (Gold or Black/Gold).
- Build rules: lightweight and fast, first-visit only (not on every navigation), skippable, and must not delay content load or hurt SEO. Prefer a pre-rendered/optimized approach (Lottie or optimized SVG/CSS) over a heavy runtime particle simulation.

## Business facts (for site + LocalBusiness schema)
- Legal name: KUL Enterprises LLC
- USDOT: 7638788
- MC: 66389691
- Email: dispatch@kulenterprises.com
- Location: Loganville, GA (Southeast based, nationwide service)
- Public phone: 678-972-1148 (confirmed by Mark 2026-07-01)
- Tagline: Strength in Motion. Built on Integrity. Driven by Safety.

## Services (7)
Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited, Over-the-Road (Nationwide). Each gets a clean icon + short description.

## Page map (up to 12)
Core pages:
1. Home
2. About KUL Enterprises
3. Services
4. Safety & Compliance
5. Carrier Packet / Documents
6. Driver Careers
7. Request a Quote
8. Contact

Reserved slots (within the 12, as static pages if wanted now): Resources, Fleet, News. "Our Vision" is a section on Home, not a separate page.

## Homepage structure
1. **Hero:** cinematic truck photography (see open items), headline "Reliable Freight Transportation Built on Trust," subhead listing the service types, primary button "Request a Freight Quote," secondary button "Become a Driver." Core message readable with no scroll.
2. **Trust bar** (directly below hero): USDOT, MC, Licensed & Insured, Southeast Based, Nationwide Service, 24/7 Communication.
3. **Services** grid (7 services, icon + short copy).
4. **Our Vision:** "build one of the Southeast's most trusted transportation companies by expanding our fleet to 50 tractors by the end of 2029 while maintaining the same commitment to safety, integrity, and dependable service that defines us today."
5. Story / trust-reinforcing sections leading into the footer.

## Photo assignments (all 5 received)
| Photo | Placement | Message |
|---|---|---|
| Rocky Cliffs Over Blue Water | About page hero | "Every mile teaches something new." Exploration, experience, journey. |
| Blue River Through the Forest | Integrity section | Calm, patience, consistency, dependability. |
| Large Tree and Open Landscape | Company Story | Roots, growth, legacy, long-term vision. |
| Ocean Waves Against the Rocks | "Strength in Motion" section | Movement, power, forward progress. |
| Desert Rock Formation | Safety / Reliability section | Strength, foundation, stability, built to last. |

Note: these are the story/emotional images. The homepage hero still needs truck photography (open item).

## About page narrative
Lead with purpose, not trucks. Founder's story: years crossing America before operating under KUL's own authority; the lesson that "freight isn't just freight" (a family waiting, a business depending on delivery, a customer trusting someone to keep their word). KUL was built from those miles, from experience on the road, not from an office.

## SEO & analytics
- Google Analytics + Google Search Console set up at build.
- Sitemap, page titles + meta descriptions, fast load, mobile optimization.
- schema.org LocalBusiness markup including USDOT/MC, location, phone.
- Google Business Profile connected once Mark creates and verifies it.

## Content status
| Page/section | Status |
|---|---|
| Brand, palette, symbols, direction | Locked |
| Home (hero, trust bar, services, vision) | Defined in Blueprint |
| About (story) | Strong narrative provided; polish into copy |
| Photo story sections | Images + intent provided |
| Services detail | Need short copy per service |
| Safety & Compliance | Need content |
| Carrier Packet / Documents | Need documents + content |
| Driver Careers | Need content |
| Contact | Need details (address, hours, form fields) |

## Open items / blockers
- Vector logo (lion + wordmark) and Doctor Bird graphic.
- Hero truck photography: own fleet photos, a shoot, or licensed premium images.
- High-res originals of the 5 photos.
- Public phone confirmed: 678-972-1148 ✓
- Typography choice.
- Per-page content for Services, Safety & Compliance, Carrier Packet, Driver Careers, Contact.
- Inspiration sites (coming).
- Gates: signed agreement + 50% deposit.
