# KUL Enterprises Website — Tech Foundation

Locked technical decisions and the architecture plan. Actual scaffolding waits until the deposit clears and the Blueprint lands — but the choices below are final so nothing blocks the first-draft sprint.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Custom-coded, fast, great SEO, the standard for Vercel; grows into portals/APIs later |
| Styling | **Tailwind CSS** | Fast to build the brand system; easy for any future dev to maintain |
| Content editing | **TinaCMS** | No-code visual editing; edits commit to the GitHub repo Client owns; **no subscription** — matches every promise made to Mark |
| Forms → email | **Next.js route handler + Resend** (free tier) | Three forms post to API routes, emailed to Client; no third-party form SaaS / monthly fee |
| Hosting | **Vercel free tier**, Client's account | Promised; SSL + backups + global CDN included |
| Analytics | **Google Analytics + Search Console** | Promised; add GA tag + verify GSC, submit sitemap |
| Future DB/auth | **Supabase (free tier)** — *added later* | Only when a portal/payments/tracking phase is greenlit and paid |

**Why TinaCMS over Sanity/Payload:** Sanity and Payload are both excellent, but Sanity is a hosted third-party and Payload needs an always-on database from day one. TinaCMS keeps v1 truly free and self-owned (content lives in the repo Mark receives), which is exactly what was sold. If a future phase adds Supabase anyway, Payload becomes worth reconsidering then.

## Brand system (locked from Blueprint v1)
- **Colors:** gold `#D4AF37` (primary accent, "excellence not luxury"), black `#0B0B0B`, charcoal, white, soft/warm gray. Lock as Tailwind theme tokens (CSS variables) so the CMS/editor never breaks the palette.
- **Symbols:** lion = primary brand icon (header, logo, footer); Jamaican Doctor Bird = "signature" mark (loading animation, footer watermark, favicon, 404).
- **Direction:** premium, minimal, confident. "Mercedes-Benz, not Monster Energy." Large photography, large type, generous white space, minimal words.
- **Theme that must come through everywhere:** trust. "Does this increase trust?" is the north-star test for every decision.
- **Tagline:** *Strength in Motion. Built on Integrity. Driven by Safety.*
- **Business facts:** USDOT 7638788, MC 66389691, Loganville GA, dispatch@kulenterprises.com. Public phone 678-972-1148 (confirmed by Mark 2026-07-01).
- **Typography:** large, premium; families TBD (see 05-build-spec.md).
- Full page map, photo assignments, and loading-animation spec live in **05-build-spec.md**.

## Page architecture (8 core, expandable to 12)
```
Home  ·  About  ·  Services  ·  Safety & Compliance
Carrier Packet / Documents  ·  Driver Careers
Request a Quote  ·  Contact
```
Services covered: Power Only, Dry Van, Reefer, Dedicated, Regional, OTR, Expedited.
Reserve slots for: Resources, Fleet, News (as static pages now; dynamic later).

## Built-in, future-ready (no extra v1 work, but designed in)
- **Route structure** leaves room for `/portal`, `/track`, `/broker`, `/blog`, `/resources` without restructuring.
- **Component-driven** layout so new pages reuse the header/footer/section system.
- **Data layer abstracted** so swapping content source (repo → Supabase) later is additive, not a rebuild.
- **DOT/MC numbers** placed in a config/CMS field + footer, plus schema.org `LocalBusiness` markup for trust + local SEO.
- **Carrier packet** section as downloadable documents (PDF) managed via the CMS.

## Pre-build checklist (gates)
- [ ] Agreement signed
- [ ] 50% deposit ($375) received
- [ ] Blueprint delivered
- [ ] Assets in hand: logo/lion-trailer art, photos, DOT + MC numbers
- [ ] Reference sites Mark likes
- [ ] Domain purchased (NameCheap, Client's name)

## First scaffold (when greenlit) — commands
```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint
npx @tinacms/cli@latest init
npm i resend
# then: brand tokens → layout/header/footer → page stubs → forms → CMS schemas → SEO/analytics
```
