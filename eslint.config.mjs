import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next 16 removed `next lint`, so ESLint runs on its own from here on:
// `npm run lint` calls the ESLint CLI directly with this flat config.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Two rules new to the React-Compiler era of eslint-plugin-react-hooks.
    // They flag long-standing, deliberate idioms here: the hydration mount
    // flag, latest-value refs, and the carousel's pointer-drag refs. Those
    // components carry hard-won behaviour; rewriting them belongs to its own
    // change, not a dependency upgrade. Kept visible as warnings on purpose.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
  globalIgnores([
    ".claude/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Static assets, including the compiled /admin editor that `tinacms
    // build` emits into public/admin: minified bundles, not source.
    "public/**",
    "assets-inbox/**",
    // Written by `tinacms build` (or stubbed by scripts/build.mjs); never
    // hand-edited, so never linted.
    "tina/__generated__/**",
  ]),
]);
