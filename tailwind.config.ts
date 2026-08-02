import type { Config } from "tailwindcss";

/**
 * KUL Enterprises design tokens. The k- prefixed system is the design of
 * record (values live in app/globals.css as CSS variables); gold is an
 * ACCENT, never a theme, and the two gold values exist because one cannot
 * clear AA on both light and dark grounds.
 *
 * The v1/v2 token strata that used to sit alongside these were deleted on
 * 2 Aug 2026 after a sweep verified nothing referenced them. If a class
 * seems to be missing, it was dead, not lost: check the git history rather
 * than re-adding it.
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
      },
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
      },
      letterSpacing: {
        tight: "-0.02em",
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
      },
    },
  },
  plugins: [],
};

export default config;
