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
 */
import { spawnSync } from "node:child_process";

const hasEditorCredentials = Boolean(
  process.env.NEXT_PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN,
);

/** Run a command, and stop the whole build if it fails. */
function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: true });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (hasEditorCredentials) {
  console.log("[build] Tina Cloud credentials found: building the editor.");
  run("tinacms", ["build"]);
} else {
  console.log(
    "[build] No Tina Cloud credentials, so /admin is not built. Set " +
      "NEXT_PUBLIC_TINA_CLIENT_ID and TINA_TOKEN in the hosting environment " +
      "to switch the editor on. The site builds and runs without it.",
  );
}

run("next", ["build"]);
