import fs from "node:fs";
import path from "node:path";

/**
 * Loader for the design-exploration documents under /studio.
 *
 * These are hand-authored, self-contained HTML files — inline <style>, inline
 * <script>, no build step. Rather than port ~50 of them to JSX (which would
 * mangle the hand-tuned CSS and the tweaks panel), each is served by a real
 * Next route that re-emits the authored head/body/script parts verbatim inside
 * the isolated (studio) root layout.
 *
 * Files are read at build time, so every route prerenders to static HTML.
 */

const ROOT = path.join(process.cwd(), "studio");

export type StudioScript = { src?: string; code?: string; defer?: boolean };

export type StudioDoc = {
  title: string;
  description?: string;
  /** External stylesheet hrefs (Google Fonts). React 19 hoists these to head. */
  stylesheets: string[];
  /** Every inline <style> block, concatenated in source order. */
  css: string;
  /** <body> inner HTML with all <script> tags stripped out. */
  bodyHtml: string;
  /** Scripts in source order, re-emitted after the body. */
  scripts: StudioScript[];
};

function firstMatch(src: string, re: RegExp): string | undefined {
  const m = src.match(re);
  return m?.[1]?.trim();
}

/** Parse one authored document into its renderable parts. */
export function readStudioDoc(...segments: string[]): StudioDoc {
  const file = path.join(ROOT, ...segments, "index.html");
  const src = fs.readFileSync(file, "utf8");

  const title = firstMatch(src, /<title>([\s\S]*?)<\/title>/i) ?? "KUL Enterprises";
  const description = firstMatch(
    src,
    /<meta\s+name="description"\s+content="([^"]*)"/i,
  );

  const stylesheets = [
    ...src.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/gi),
  ]
    .map((m) => m[0].match(/href="([^"]+)"/i)?.[1])
    .filter((h): h is string => Boolean(h));

  const css = [...src.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((m) => m[1])
    .join("\n");

  // Scripts are collected from the whole document (a couple live in <head>)
  // so they re-emit in the same order the author wrote them.
  const scripts: StudioScript[] = [
    ...src.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi),
  ].map(([, attrs, code]) => {
    const srcAttr = attrs.match(/\bsrc="([^"]+)"/i)?.[1];
    return srcAttr
      ? { src: srcAttr, defer: /\bdefer\b/i.test(attrs) }
      : { code };
  });

  const body = firstMatch(src, /<body\b[^>]*>([\s\S]*)<\/body>/i) ?? "";
  const bodyHtml = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

  return { title, description, stylesheets, css, bodyHtml, scripts };
}

/**
 * Every directory under `base` that holds an index.html, as route segments.
 * `[]` represents the version's own root page.
 */
export function listStudioRoutes(base: string): string[][] {
  const start = path.join(ROOT, base);
  const out: string[][] = [];

  const walk = (dir: string, trail: string[]) => {
    if (fs.existsSync(path.join(dir, "index.html"))) out.push(trail);
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name), [...trail, entry.name]);
    }
  };

  if (fs.existsSync(start)) walk(start, []);
  return out;
}

/** Human label for an exploration route, used by the chooser. */
export function studioTitle(...segments: string[]): string {
  try {
    return readStudioDoc(...segments).title;
  } catch {
    return segments.join(" / ");
  }
}
