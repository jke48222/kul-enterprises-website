#!/usr/bin/env node
/**
 * THE BUILD.
 *
 * One command that does the right thing before and after the client's editing
 * account exists, so nobody has to remember to change the hosting settings on
 * the day it does.
 *
 * If the two Tina Cloud values are present in the environment, the editor at
 * /admin is compiled first and then the site. If they are absent, the editor
 * is skipped and only the site is built. The site itself never depends on
 * Tina at runtime: every page reads the JSON files in content/ directly, so a
 * build without the editor is a complete, working website that simply has no
 * /admin on it.
 *
 * WHY THIS EXISTS. The two builds used to be separate scripts, `build` and
 * `build:cms`. The hosting was pointed at `build`, which meant that on the day
 * the credentials were added the editor still would not have appeared, because
 * the command that compiles it was never the one being run. That is a failure
 * nobody would have seen until the client tried to edit a page.
 *
 * ==================================================================
 * A BROKEN EDITOR MUST NEVER TAKE THE WEBSITE DOWN WITH IT.
 * ==================================================================
 * The first deployment with real credentials failed the entire build. Tina
 * Cloud answered the editor build with a 403, "not authorized to access
 * branch", and because that step was fatal the site did not deploy at all.
 *
 * That is the wrong trade for this site. A trucking company's website going
 * unshippable because a CMS token is mistyped is a far worse outcome than the
 * same site shipping with no /admin on it for an afternoon, and the whole
 * point of the arrangement above is that the site does not need Tina to run.
 *
 * So the editor build is allowed to fail. When it does, the site is still
 * built and deployed, and the reason is printed as loudly as a build log
 * allows, with the three things actually worth checking. The failure is
 * visible; it just is not contagious.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

/**
 * ==================================================================
 * THE GENERATED CLIENT HAS TO EXIST EVEN WHEN TINA FAILS.
 * ==================================================================
 * lib/tina.ts imports tina/__generated__/client, which `tinacms build`
 * writes. That directory is not committed, because the file it produces holds
 * the API token in plain text and has no business being in git.
 *
 * Which means the resilience above was worth nothing on its own: if the editor
 * build failed, the generated client would be missing, `next build` would stop
 * on an unresolvable import, and the site would fail to deploy exactly as it
 * did before, just one step later and with a more confusing error.
 *
 * So when the editor build has not produced a client, a stub is written that
 * throws the moment anything calls it. lib/tina.ts already runs every query
 * inside a try, so that throw is caught, the page falls back to the JSON in
 * content/, and the site builds. The failure stays loud in the log and stops
 * being able to take the website down.
 */
function ensureGeneratedClient() {
  const dir = "tina/__generated__";
  const file = `${dir}/client.ts`;
  if (existsSync(file)) return;

  mkdirSync(dir, { recursive: true });
  writeFileSync(
    file,
    `// AUTO-GENERATED STAND-IN, written by scripts/build.mjs.
//
// The real file comes from \`tinacms build\`. That did not run or did not
// succeed, so this exists purely so the import in lib/tina.ts resolves and
// the site can still be built. Every call throws, lib/tina.ts catches it, and
// the pages render from content/ instead. Delete it and re-run the build once
// Tina Cloud is reachable.
/* eslint-disable @typescript-eslint/no-explicit-any */
const unavailable = () => {
  throw new Error(
    "Tina client was not generated: the editor build did not succeed.",
  );
};

// Shaped like the real client so the call sites in lib/tina.ts still
// typecheck. Reading any query throws, which lib/tina.ts catches.
export const client = new Proxy(
  {},
  {
    get: () => new Proxy({}, { get: () => unavailable }),
  },
) as { queries: Record<string, (...args: any[]) => Promise<any>> };

export default client;
`,
  );
  console.log(
    "[build] Wrote a stand-in tina/__generated__/client.ts so the site can " +
      "build without the editor. Pages will render from content/ directly.",
  );
}

const hasEditorCredentials = Boolean(
  process.env.NEXT_PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN,
);

/** Run a command. Anything that fails here stops the build. */
function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: true });
  if (result.status !== 0) process.exit(result.status ?? 1);
  return true;
}

/** Run a command, but treat a failure as a warning rather than the end. */
function runAllowingFailure(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: true });
  return result.status === 0;
}

const banner = (lines) => {
  const width = 74;
  console.log("\n" + "=".repeat(width));
  for (const line of lines) console.log(line);
  console.log("=".repeat(width) + "\n");
};

if (hasEditorCredentials) {
  console.log("[build] Tina Cloud credentials found: building the editor.");

  if (!runAllowingFailure("tinacms", ["build"])) {
    banner([
      "[build] THE EDITOR DID NOT BUILD. THE SITE STILL WILL.",
      "",
      "  Tina Cloud rejected the credentials, so /admin will be missing from",
      "  this deployment. Every page on the site is unaffected: they read the",
      "  JSON in content/ directly and never call Tina at runtime.",
      "",
      "  A 403 reading 'not authorized to access branch' is almost always one",
      "  of these three, in this order:",
      "",
      "    1. TINA_TOKEN holds the token's ID rather than the token itself.",
      "       In Tina Cloud the ID is the short string listed beside the",
      "       token; the value you want is the long secret.",
      "",
      "    2. A branch protection rule on the branch being built stops the",
      "       Tina Cloud GitHub App committing to it.",
      "",
      "    3. The Tina Cloud GitHub App was granted access to the account but",
      "       not to this specific repository.",
      "",
      "  Full list: https://tina.io/docs/tinacloud/troubleshooting",
    ]);
  }
  ensureGeneratedClient();
} else {
  console.log(
    "[build] No Tina Cloud credentials, so /admin is not built. Set " +
      "NEXT_PUBLIC_TINA_CLIENT_ID and TINA_TOKEN in the hosting environment " +
      "to switch the editor on. The site builds and runs without it.",
  );
  ensureGeneratedClient();
}

run("next", ["build"]);
