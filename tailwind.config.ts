import type { Config } from "tailwindcss";

/**
 * KUL Enterprises brand tokens — locked from Blueprint v1 + 07-design-research.md.
 * Gold is an ACCENT, not a theme: eyebrows, one hairline per section, active nav,
 * primary CTA, loader mark. Never more than ~2 gold elements per viewport.
 * The site runs a light/dark editorial rhythm — `ink` carries the cinematic
 * beats, `paper` carries the story/trust beats.
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
        ink2: "#161616", // concept-route ground (measured from the reference)
        charcoal: "#1A1A1A", // secondary dark
        paper: "#F7F5F0", // warm light — the editorial counterweight to ink
        cream: "#E3DED0", // concept-route display tone
        graywarm: {
          DEFAULT: "#8B857C", // warm neutral for muted text on dark
          light: "#E7E4DF",
          deep: "#5C574F", // muted text on light backgrounds (AA on paper)
        },
      },
      fontFamily: {
        omnibus: ["var(--font-omnibus)", "Georgia", "serif"],
        mont: ["var(--font-mont)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Fluid display scale per 07-design-research.md §2B
        "display-xl": [
          "clamp(2.75rem, 7vw, 6rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em" },
        ],
        "display-l": [
          "clamp(2rem, 4.5vw, 3.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ],
        h2: [
          "clamp(1.5rem, 3vw, 2.25rem)",
          { lineHeight: "1.15", letterSpacing: "-0.01em" },
        ],
      },
      letterSpacing: {
        eyebrow: "0.22em",
        tight: "-0.02em",
      },
      maxWidth: {
        content: "1280px",
        measure: "68ch",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
