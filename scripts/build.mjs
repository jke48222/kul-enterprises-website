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
} else {
  console.log(
    "[build] No Tina Cloud credentials, so /admin is not built. Set " +
      "NEXT_PUBLIC_TINA_CLIENT_ID and TINA_TOKEN in the hosting environment " +
      "to switch the editor on. The site builds and runs without it.",
  );
}

run("next", ["build"]);
