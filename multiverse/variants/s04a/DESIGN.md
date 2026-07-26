# s04a — Heritage Institute · Design System

Variant of the KUL multiverse (style 04, impeccable build). Scope: this directory only.
Product truth lives in `/briefs/README.md`; style strategy in `/briefs/style-04-heritage-institute.md`.

## World

KUL rendered as an institution's founding documents: engraved nameplate, charter articles,
values cast as plaques, a ledger registry of services, field notes from the founder's camera,
and a growth-rings plan. Hand-drawn line-art landscape bands (rolling hills + winding road,
Mark's horizon motif) are the connective tissue between real photographs — never a replacement
for them. Warm daylight document: a shipper reads it at a desk; a driver reads it in a cab.

## Tokens (CSS custom properties on `:root`)

- `--cream #F5EEDD` page ground · `--cream-deep #EDE3CB` plaque/plate ground
- `--forest #1E3A2B` institutional green (sections, primary CTA) · `--forest-deep #16291F` footer
- `--gold #D4AF37` brand constant — inlay, seals, road centerline; never long body text on cream
- `--ink #262A1F` warm reading ink · secondary text is tinted from ground hue, never gray
- `--gold-mix` (0–100%) blends forest→gold for every rule, frame, and engraved accent
- `--illus-alpha` opacity of all illustration bands · `--grain-alpha` paper grain
- `--plaque-depth` letterpress inset strength · `--divider-extra` shows/hides optional dividers
- `--font-display` headline face (serif default, grotesque alternate via tweaks)

## Type

- Marcellus — inscriptional caps only: lockup, plaque titles, credential numerals, roman article numerals
- Alegreya — headlines (500) and long-form body (400/italic); humane line-height 1.65–1.75
- Archivo — documentary labels, small caps kickers (0.14–0.22em tracking), buttons, ledger notes
- Scale: hero clamp(2.5–4.4rem); section h2 clamp(1.9–2.9rem); body 1.04–1.13rem, measure ≤ 68ch

## Grammar

- Sections are numbered as charter articles (Marcellus roman numeral · Archivo small-caps kicker).
  Article numbering is the document's native grammar, not decoration.
- Photos sit in arch or hairline double-rule frames with engraved caption plates beneath.
- Plaques: cream-deep ground, double rule (gold-mix outer, hairline inner), letterpress inset
  scaled by `--plaque-depth`, Marcellus title over a short gold fleuron rule.
- Ledger rows (services): Marcellus roman numeral, Alegreya name, dotted gold leader, Archivo note.
- Illustration ink is `--accent` (forest⇄gold mix); sun discs and road centerlines are pure gold.
- The lion never appears as an image here (no vector master yet); the mark is the typographic
  lockup. The Doctor Bird never appears anywhere.

## Motion (one authored moment)

The journey line: a hand-drawn road runs from the hero arch photo into the page; a line-art
tractor-trailer eases along it, scroll-linked (lerped rAF, transform-only), shrinking toward the
pictured horizon. Divider road ribbons draw in once on first view (dashoffset). Reveals are
gentle rise/fade, exponential ease-out, applied only when JS + motion are available.
`prefers-reduced-motion`: truck parks, ribbons ship drawn, reveals ship visible, smooth scroll off.

## Truth

USDOT 7638788 · MC 66389691 · Loganville, GA · 678-972-1148 · dispatch@kulenterprises.com.
One truck today, fifty tractors by end of 2029 — always framed honestly. No invented stats,
testimonials, logos, or fleet counts. Verified photo map (actual pixels, Jul 2026): cliffs.jpg
cliffs over water · wave.jpg turquoise river through forest · river.jpg sandstone towers over a
sand cove · tree.jpg broad tree on open land · desert.jpg currently renders the brand board (unused).
