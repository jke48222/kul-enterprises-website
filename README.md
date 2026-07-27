# KUL Enterprises LLC — website

Freight carrier site for KUL Enterprises LLC (Loganville, GA · USDOT 7638788 · MC 66389691).
Next.js 15 App Router, React 19, Tailwind, TinaCMS for content editing.

```bash
npm install
npm run dev          # http://localhost:3000
npm run dev:cms      # same, with the TinaCMS editor at /admin
npm run build
```

## Every version lives in one app

`/` is the version chooser. All design iterations are routes on the same server.

| Route | What it is |
|---|---|
| `/v1` | The original build — editorial concept, GoldGlass era |
| `/v2` | The redesign — cinematic rebuild, quote strip, truck chapters |
| `/v3` | Cinematic Trust — light-forward Apple × Volvo register |
| `/v4` | **DISPATCH** — Mobbin-sourced operations document (+ 7 chapters) |
| `/explore/p1/<style>` | Phase 1 — one signature page per surviving variant |
| `/explore/p2/<style>/<chapter>` | Phase 2 — the full chapter sets |
| `/intro` | The opening film (v6 cut) |

Surviving styles after the Jul 27 2026 cut: **s02** Marquee Editorial, **s06** Industrial Ledger,
**s10** Apple layout family, **s12** Rivian layout family. Everything else is recoverable from
commit `f9395be`.

## Layout

```
app/
  (product)/        v1–v3, the chooser, 404 — Tailwind + fonts + providers
  (studio)/         v4, /explore, /intro — a SECOND root layout, deliberately bare
  api/              contact · driver · quote handlers
  globals.css v1-legacy.css fonts/ robots.ts sitemap.ts
studio/             authored HTML documents for the (studio) routes
public/studio/      their runtime assets (brand, journey photos, films, tweaks panel)
components/  lib/   shared React + helpers
content/            site.json · services.json · faq.json — CMS-editable copy
tina/               TinaCMS schema (edits content/*.json via /admin)
briefs/             design briefs for the surviving styles + the Journey screenplay
project-docs/       engagement record — agreement, scope, research, build plans
assets-inbox/       client source material (gitignored, not in the repo)
```

### Why two root layouts

The `/studio` documents are hand-authored, self-contained HTML: their own reset, type scale and
component CSS, plus inline scripts. `app/globals.css` starts with `@tailwind base`, whose preflight
resets elements globally and fights those designs.

Next supports multiple root layouts via route groups, so `(studio)` ships its own `<html>`/`<body>`
with no Tailwind, no shared fonts and no providers. Moving between `/v1` and `/v4` is a full
document load — correct, because they are different documents rather than pages of one app.

`lib/studio.ts` reads each document at build time and `components/studio/StudioDocument.tsx`
re-emits its head links, CSS, markup and scripts verbatim. Every route prerenders to static HTML.
To add a version, drop `studio/<name>/index.html` in place — the route generates itself.

### Editing a studio document

Edit the HTML under `studio/` directly. Two conventions matter:

- Assets are absolute and served from `public/`: `/studio/assets/…`, `/studio/tweaks.js`.
- Links between documents are absolute route paths (`/v4/journey`), not relative (`../journey/`).

Press <kbd>t</kbd> on any studio page for its live tweaks panel.
