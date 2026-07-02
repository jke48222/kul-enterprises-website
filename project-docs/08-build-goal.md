# KUL Enterprises — Build Goal (for Fable 5)

A ready-to-run Claude Code [`/goal`](https://code.claude.com/docs/en/goal) that drives a **from-scratch, award-caliber, fully-finished** build of the KUL site, grounded in the research (`07-design-research.md`), brand/content (`05-build-spec.md`), and stack (`04-tech-foundation.md`).

## How to run it
1. Open this repo in a **Fable 5** Claude Code session.
2. Turn on **Auto mode** so each goal turn runs unattended (goal removes per-*turn* prompts; auto mode removes per-*tool* prompts).
3. Paste the `/goal …` block below. Setting it starts a turn immediately with the condition as the directive.
4. `◎ /goal active` shows runtime; `/goal` (no args) shows turns/tokens/last evaluator reason; `/goal clear` stops it.

## Why the condition is written the way it is
The evaluator is a small fast model that **does not run commands or read files** — it only judges what the builder **surfaces in the transcript**. So every criterion is phrased as something Fable must *prove in its output* (paste build/lint tails, list route files, show grep results). It carries a **60-turn bound** so it can't run away. It also **mandates reading `07-design-research.md` in full** and complying with it — that doc is too long to inline into the 4,000-char condition, so it's referenced as authoritative and the builder must open it.

## Current facts (from Mark, confirmed 2026-07-01/02)
- **Deposit submitted**; signed agreement being returned. Build gate effectively cleared.
- **Public phone: 678-972-1148** (confirmed — no longer TBD).
- **No stock photography.** Real truck/trailer/company photos come later "as available"; Mark is gathering personal story photos for About/brand. Licensing was NOT approved.
- Logo (lion + wordmark) and Doctor Bird vectors are still being obtained.

## Asset strategy (per Jalen: create convincing stand-ins, replace later)
Because real assets aren't in yet, the goal instructs the builder to **create high-craft stand-ins that closely resemble the intended final** so the site looks completely finished — a hand-built **SVG lion mark + wordmark**, an **SVG Doctor Bird** for the loader, a **cinematic hero treatment that reads as premium truck photography**, and tasteful **placeholder imagery for the 5 story themes**. Everything is tagged `// REPLACEABLE ASSET` so real files drop in cleanly. All page copy is written full and polished (approval-ready), never lorem ipsum.

---

## The goal (copy from `/goal` to the end)

```text
/goal Build the COMPLETE, production-quality KUL Enterprises website FROM SCRATCH in this Next.js 15 + TypeScript + Tailwind + Framer Motion repo. STEP 1: delete the existing site implementation (app/page.tsx, app/globals.css, everything in components/ and lib/) and rebuild fresh; keep only tooling (package.json, tsconfig, tailwind.config, postcss, next config, app/layout scaffolding). BEFORE writing code, READ IN FULL and comply with project-docs/07-design-research.md (design/interaction/motion/performance — AUTHORITATIVE), 05-build-spec.md (brand/content/pages), and 04-tech-foundation.md (stack). Do NOT edit anything in project-docs/.

BAR: Awwwards-caliber, high-fidelity, on par with the reference sites (Terminal Industries, J.B. Hunt, ODFL, XPO, Werner, Volvo Trucks, Schneider, Rolls-Royce, Rolex, Patek). Premium, minimal, cinematic, calm — "Mercedes-Benz not Monster Energy." Every design call answers "does this increase trust?" DO NOT BE LAZY: no lorem ipsum, no empty or "coming soon" sections, no TODO stubs — every page fully built with polished approval-ready copy and finished visuals, fully responsive (mobile + desktop), with hover/focus/active/loading/empty/error states handled.

MISSING ASSETS (truck hero photo, vector lion logo, Doctor Bird graphic, hi-res story photos): CREATE high-craft stand-ins that closely resemble the real thing so the site looks completely finished — a hand-built SVG lion mark + wordmark, an SVG Doctor Bird for the loader, a cinematic hero treatment that reads as premium truck photography, and tasteful placeholder imagery for the 5 story themes. Tag each "// REPLACEABLE ASSET". CONFIRMED facts: phone 678-972-1148; USDOT 7638788; MC 66389691; dispatch@kulenterprises.com; Loganville GA; tagline "Strength in Motion. Built on Integrity. Driven by Safety."

The goal is met ONLY when you have surfaced proof in THIS conversation that EVERY item holds (the evaluator cannot run tools — show the evidence):
1. `npm run build` exits 0 with no type errors AND `npm run lint` is clean — paste the tail of both.
2. All routes render with no runtime error: / /about /services /services/[power-only|dry-van|reefer|dedicated|regional|otr|expedited] /safety /carrier-packet /careers /quote /contact — list the page files.
3. Home renders in order: first-visit SVG/CSS Doctor-Bird loader (skippable, sessionStorage-gated, static under prefers-reduced-motion, does NOT block LCP) -> cinematic hero (priority next/image, headline + subhead readable with no scroll and no JS) -> trust bar (USDOT 7638788, MC 66389691, Licensed & Insured, Southeast, Nationwide, 24/7) -> 7-service grid -> Our Vision (50 tractors by end of 2029, animated) -> 5 story sections (per the build-spec photo map) -> closing dual CTA + footer. Include at least ONE signature scroll/pinned moment.
4. Brand holds: Tailwind tokens gold #D4AF37 (SPARSE accent, <=2 gold elements per viewport), ink #0B0B0B, charcoal, white, warm gray; Sora display + Inter body; a light/dark editorial rhythm (NOT wall-to-wall black).
5. Motion uses Framer Motion via LazyMotion + the `m` component (not full `motion`), animates only transform/opacity, and every animation has a prefers-reduced-motion fallback — show a grep confirming LazyMotion/`m` and reduced-motion.
6. Three forms — Freight Quote (<=5 core fields), Contact, Driver Inquiry — post to Next.js route handlers that send via Resend (env-guarded, key stubbed). Show the handlers.
7. LocalBusiness JSON-LD in the root layout (NAP + USDOT/MC + geo); every page has a title + meta description; app has sitemap.ts + robots; all images use next/image with explicit dimensions.
8. Self-review confirms WCAG AA (keyboard-reachable nav, visible focus, alt text, contrast on gold CTAs) AND that mobile + desktop layouts both work.

When done, print a DONE checklist mapping each numbered item to its evidence. Or stop after 60 turns and report exactly what remains.
```
