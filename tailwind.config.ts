import type { Config } from "tailwindcss";

/**
 * KUL Enterprises brand tokens, v2 (design bible §2).
 * Gold is an ACCENT, not a theme: the nav CTA is gold element #1 in every
 * viewport, and at most ONE more gold element joins it (§2.7). The site runs
 * an ink/paper editorial rhythm: `ink` carries the cinematic beats, `paper`
 * carries the paperwork/trust beats.
 *
 * Existing token names (gold, gold-dim, gold-soft, ink, ink2, charcoal,
 * paper, cream, graywarm, font-omnibus, font-mont, tracking-eyebrow) are
 * load-bearing, because pages depend on them. Never rename.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  /**
   * EVERY `hover:` ON THE SITE BECOMES DESKTOP ONLY.
   *
   * This compiles the hover variant to `@media (hover: hover)` instead of a
   * bare `:hover`, and it is one line here rather than an edit to each of the
   * couple of hundred call sites.
   *
   * THE BUG IT FIXES IS THE STUCK STATE. A touch browser fires `:hover` on tap
   * and then leaves it applied until something else is tapped, so on a phone
   * every card, button and link that had been touched stayed lit: the nav CTA
   * held its darkened fill, service cards held their raised border, and the
   * effect read as a selection the visitor could not clear.
   *
   * IT IS SAFE HERE BECAUSE NOTHING IS REACHABLE ONLY BY HOVER. Two components
   * reveal anything on hover, the hairline under the film control and the one
   * on the journey shelf, and both are decoration that also answers to
   * `focus-visible`, so neither keyboard nor touch loses a way in.
   */
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        /**
         * Design system (Paper file 01KYKPT9QPZPS05X9H4PH1FSGT). Values live
         * as CSS variables in app/globals.css so a colour can be traced from
         * an artboard to a rule without translation.
         *
         * The `k-` prefix exists only to coexist with the v2 tokens below
         * while pages are rebuilt one at a time. `paper`, `ink`, `gold` and
         * `charcoal` all collide with v2 at different values. Strip the
         * prefix once nothing references the v2 palette.
         */
        k: {
          paper: "var(--color-paper)",
          surface: "var(--color-surface)",
          warm: "var(--color-warm-panel)",
          blueprint: "var(--color-blueprint)",
          coal: "var(--color-charcoal)",
          void: "var(--color-black)",
          ink: "var(--color-ink)",
          "ink-soft": "var(--color-ink-soft)",
          "ink-faint": "var(--color-ink-faint)",
          "on-dark": "var(--color-on-dark)",
          "on-dark-soft": "var(--color-on-dark-soft)",
          "on-dark-faint": "var(--color-on-dark-faint)",
          rule: "var(--color-rule)",
          "rule-strong": "var(--color-rule-strong)",
          "rule-dark": "var(--color-rule-dark)",
          gold: "var(--color-gold)",
          "gold-lit": "var(--color-gold-lit)",
          success: "var(--color-success)",
          error: "var(--color-error)",
        },
        gold: {
          DEFAULT: "#B59352", // primary accent, rgb(181,147,82)
          dim: "#6F5A2C", // deep gold for text on light backgrounds (AA on paper)
          soft: "#CFB484", // lighter gold for hover states
        },
        ink: "#0B0B0B", // base dark / black
        ink2: "#161616", // concept-route ground (v1 reference pages)
        charcoal: "#1A1A1A", // secondary dark
        paper: "#F7F5F0", // warm light, the editorial counterweight to ink
        cream: "#E3DED0", // display tone on ink
        graywarm: {
          DEFAULT: "#8B857C", // warm neutral for muted text on dark
          light: "#E7E4DF",
          deep: "#5C574F", // muted text on light backgrounds (AA on paper)
        },
      },
      fontFamily: {
        /**
         * Design system faces. Archivo Black 900 matches the wordmark: a
         * squared industrial grotesque; its width axis supplies the
         * condensed caps the lockup's tagline uses. Inter carries text and
         * every numeric (tabular figures on DOT numbers and dimensions).
         * Omnibus was rejected: it is a transitional serif with no relation
         * to the mark. See the Paper file for the specimen.
         */
        display: ["var(--font-archivo)", "Helvetica Neue", "Arial", "sans-serif"],
        text: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        omnibus: ["var(--font-omnibus)", "Georgia", "serif"],
        mont: ["var(--font-mont)", "system-ui", "sans-serif"],
        // v3, single-family Apple/Volvo register (Geist, OFL via Google
        // Fonts; loaded in app/v3/layout.tsx). One family, two optical
        // roles: 600/700 display, 400/500 text.
        geist: [
          "var(--font-geist)",
          "-apple-system",
          "system-ui",
          "sans-serif",
        ],
      },
      /**
       * Type scale (bible §2.1). Omnibus Bold is the ONLY display face and
       * never renders below 20px; Montserrat handles everything ≤20px.
       */
      fontSize: {
        /**
         * Design system scale. Headlines very large, copy very small, and the
         * middle is deliberately empty. Nothing lives between 36px and 20px:
         * anything reaching for 24 or 28 is a heading that should be a
         * display step, or a paragraph that should be body.
         *
         * Each clamp resolves to its exact Paper value at 1440px, the
         * artboard width, so code and design measure the same.
         */
        "k-hero": [
          "clamp(3rem, 1.05rem + 8vw, 8.25rem)", // 48 → 132px
          { lineHeight: "0.91", letterSpacing: "-0.035em" },
        ],
        "k-d1": [
          "clamp(2.25rem, 1.04rem + 4.95vw, 5.5rem)", // 36 → 88px
          { lineHeight: "0.955", letterSpacing: "-0.02em" },
        ],
        "k-d2": [
          "clamp(1.75rem, 1.1rem + 2.67vw, 3.5rem)", // 28 → 56px
          { lineHeight: "1", letterSpacing: "-0.02em" },
        ],
        "k-d3": [
          "clamp(1.5rem, 1.22rem + 1.14vw, 2.25rem)", // 24 → 36px
          { lineHeight: "1.11", letterSpacing: "-0.02em" },
        ],
        "k-lede": [
          "clamp(1.0625rem, 0.99rem + 0.29vw, 1.25rem)", // 17 → 20px
          { lineHeight: "1.5", letterSpacing: "0" },
        ],
        "k-body": ["1rem", { lineHeight: "1.625", letterSpacing: "0" }],
        "k-small": ["0.875rem", { lineHeight: "1.571", letterSpacing: "0" }],
        // Caps only. The tracked-caps register the lockup's tagline establishes.
        "k-label": [
          "0.75rem",
          { lineHeight: "1.333", letterSpacing: "0.14em", fontWeight: "600" },
        ],
        // Blueprint callouts and legal density. Caps only.
        "k-micro": [
          "0.6875rem",
          { lineHeight: "1.455", letterSpacing: "0.1em", fontWeight: "600" },
        ],
        // Omnibus. Home hero H1, CtaBand headline, 404 numeral base (52→152px)
        "display-xl": [
          "clamp(3.25rem, 1.75rem + 7.5vw, 9.5rem)",
          { lineHeight: "0.88", letterSpacing: "-0.01em" },
        ],
        // Omnibus. Interior page H1s, statement bands, NextService (40→104px)
        "display-l": [
          "clamp(2.5rem, 1.5rem + 5vw, 6.5rem)",
          { lineHeight: "0.9", letterSpacing: "-0.01em" },
        ],
        // Omnibus. Section headings (30→60px)
        h2: [
          "clamp(1.875rem, 1.25rem + 2.6vw, 3.75rem)",
          { lineHeight: "0.95", letterSpacing: "-0.005em" },
        ],
        // Omnibus. Card/ledger row titles, big phone numbers (20→30px)
        h3: [
          "clamp(1.25rem, 1.05rem + 0.9vw, 1.875rem)",
          { lineHeight: "1.1", letterSpacing: "0" },
        ],
        // Montserrat 400. Decks, lead paragraphs (17→19px)
        "body-l": [
          "clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)",
          { lineHeight: "1.55", letterSpacing: "0" },
        ],
        // Montserrat 400. Default copy
        body: ["1rem", { lineHeight: "1.6", letterSpacing: "0" }],
        // Montserrat 600 UPPERCASE. Eyebrows, buttons, nav links (12px)
        label: [
          "0.75rem",
          { lineHeight: "1.2", letterSpacing: "0.22em", fontWeight: "600" },
        ],
        // Montserrat 500 UPPERCASE. Frame furniture, credentials, legal rows (11px)
        micro: [
          "0.6875rem",
          { lineHeight: "1.4", letterSpacing: "0.18em", fontWeight: "500" },
        ],
        /**
         * v3 display scale, the Apple/Volvo register measured in
         * project-docs/reference/apple-volvo-tokens.json: SF Pro Display
         * 80px / lh 1.05 / −1.2px; Volvo Novum 700 / −0.48px. Tighter
         * line-height as size grows, slight negative tracking, weight in
         * the token so usage stays one class.
         */
        d1: [
          "clamp(2.75rem, 1.9rem + 4.2vw, 5.5rem)",
          { lineHeight: "1.04", letterSpacing: "-0.015em", fontWeight: "600" },
        ],
        d2: [
          "clamp(2rem, 1.55rem + 2.2vw, 3.5rem)",
          { lineHeight: "1.08", letterSpacing: "-0.012em", fontWeight: "600" },
        ],
        t1: [
          "clamp(1.5rem, 1.32rem + 0.9vw, 2rem)",
          { lineHeight: "1.15", letterSpacing: "-0.008em", fontWeight: "600" },
        ],
      },
      /**
       * Band spacing rhythm (bible §2.2), used as py-band-sm / py-band /
       * py-band-lg section padding.
       */
      spacing: {
        "band-sm": "clamp(4rem, 2.5rem + 6vw, 7.5rem)", // 64→120px
        band: "clamp(5.5rem, 3.5rem + 9vw, 11.25rem)", // 88→180px
        "band-lg": "clamp(7rem, 4rem + 13vw, 15rem)", // 112→240px
      },
      letterSpacing: {
        eyebrow: "0.22em",
        tight: "-0.02em",
      },
      maxWidth: {
        content: "1280px",
        measure: "68ch",
      },
      /**
       * Easing tokens mirroring components/v2/motion.ts EASE (bible §2.3)
       * for CSS-side transitions: ease-out / ease-inout / ease-kul /
       * ease-micro.
       */
      transitionTimingFunction: {
        out: "cubic-bezier(0.165, 0.84, 0.44, 1)", // entrances, reveals, RISE
        inout: "cubic-bezier(0.77, 0, 0.175, 1)", // curtains, veils, clip wipes
        kul: "cubic-bezier(0.4, 0, 0, 1)", // house curve, signature moments only
        micro: "cubic-bezier(0.215, 0.61, 0.355, 1)", // hovers, buttons, accordions
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)", // v1 compat
      },
    },
  },
  plugins: [],
};

export default config;
