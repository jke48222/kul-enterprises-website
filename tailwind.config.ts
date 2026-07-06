import type { Config } from "tailwindcss";

/**
 * KUL Enterprises brand tokens — v2 (design bible §2).
 * Gold is an ACCENT, not a theme: the nav CTA is gold element #1 in every
 * viewport, and at most ONE more gold element joins it (§2.7). The site runs
 * an ink/paper editorial rhythm — `ink` carries the cinematic beats, `paper`
 * carries the paperwork/trust beats.
 *
 * Existing token names (gold, gold-dim, gold-soft, ink, ink2, charcoal,
 * paper, cream, graywarm, font-omnibus, font-mont, tracking-eyebrow) are
 * load-bearing — pages depend on them. Never rename.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#B59352", // primary accent — rgb(181,147,82)
          dim: "#6F5A2C", // deep gold for text on light backgrounds (AA on paper)
          soft: "#CFB484", // lighter gold for hover states
        },
        ink: "#0B0B0B", // base dark / black
        ink2: "#161616", // concept-route ground (v1 reference pages)
        charcoal: "#1A1A1A", // secondary dark
        paper: "#F7F5F0", // warm light — the editorial counterweight to ink
        cream: "#E3DED0", // display tone on ink
        graywarm: {
          DEFAULT: "#8B857C", // warm neutral for muted text on dark
          light: "#E7E4DF",
          deep: "#5C574F", // muted text on light backgrounds (AA on paper)
        },
      },
      fontFamily: {
        omnibus: ["var(--font-omnibus)", "Georgia", "serif"],
        mont: ["var(--font-mont)", "system-ui", "sans-serif"],
        // v3 — single-family Apple/Volvo register (Geist, OFL via Google
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
         * v3 display scale — the Apple/Volvo register measured in
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
       * Band spacing rhythm (bible §2.2) — used as py-band-sm / py-band /
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
        kul: "cubic-bezier(0.4, 0, 0, 1)", // house curve — signature moments only
        micro: "cubic-bezier(0.215, 0.61, 0.355, 1)", // hovers, buttons, accordions
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)", // v1 compat
      },
    },
  },
  plugins: [],
};

export default config;
