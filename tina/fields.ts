import type { TinaField } from "tinacms";

/**
 * THE FIELD SHAPES THE SCHEMA USES OVER AND OVER.
 *
 * tina/config.ts describes eighteen collections and most of them need the same
 * handful of things: a search engine title and description, a button with a
 * label and a target, a list of paragraphs, a picture. Written out longhand
 * that file would run to two thousand lines of near-identical objects and
 * nobody would notice when one of them drifted.
 *
 * So the shapes live here and the schema reads as a site map.
 *
 * EVERY DESCRIPTION IN THIS FILE IS READ BY THE CLIENT, not by a developer.
 * They appear as grey helper text under the field in /admin. Write them as
 * instructions to somebody who has never seen the code: say what the thing is
 * and where it shows up, not what it is called in the repository.
 */

/**
 * Pasted under any field that accepts tokens. Kept as a plain string rather
 * than imported from lib/content.ts, because the Tina config is bundled on its
 * own by the tinacms build and must not pull the site's runtime in with it.
 */
export const TOKENS =
  "Tip: type {phone}, {email}, {location}, {city}, {state}, {usdot}, {mc}, {name} or {tagline} and it fills in from Business Facts, so you never retype a phone number here.";

/** The same, plus how to write a link. For anything longer than a line. */
export const TOKENS_AND_LINKS = `${TOKENS} A link is written [the words you see](/the-page), for example [our safety page](/safety).`;

/** A short one-line field. */
export const text = (
  name: string,
  label: string,
  description?: string,
): TinaField => ({ type: "string", name, label, description });

/** A field that gets a box rather than a line, for anything over a sentence. */
export const longText = (
  name: string,
  label: string,
  description?: string,
): TinaField => ({
  type: "string",
  name,
  label,
  description: description ? `${description} ${TOKENS_AND_LINKS}` : TOKENS_AND_LINKS,
  ui: { component: "textarea" },
});

/** A list of paragraphs. Each entry becomes one paragraph on the page. */
export const paragraphs = (
  name: string,
  label: string,
  description?: string,
): TinaField => ({
  type: "string",
  name,
  label,
  description: `${description ?? "One entry per paragraph."} ${TOKENS_AND_LINKS}`,
  list: true,
  ui: { component: "textarea" },
});

/** A picture, chosen from the Media Manager. */
export const image = (
  name: string,
  label: string,
  description?: string,
): TinaField => ({ type: "image", name, label, description });

/**
 * A button or a link: what it says, and where it goes.
 *
 * The target accepts an internal page, an outside address, or the two tokens
 * that turn into a click-to-call and a mailto, so the client never has to know
 * what tel: means.
 */
export const cta = (
  name = "cta",
  label = "Button",
  description?: string,
): TinaField => ({
  type: "object",
  name,
  label,
  description,
  fields: [
    text("label", "Button text"),
    text(
      "href",
      "Where it goes",
      "A page on this site like /quote, a full web address, {phone} to call, or {email} to write.",
    ),
  ],
});

/** A repeating list of links, for menus and footers. */
export const links = (
  name: string,
  label: string,
  description?: string,
): TinaField => ({
  type: "object",
  name,
  label,
  description,
  list: true,
  ui: { itemProps: (item) => ({ label: item?.label || "Link" }) },
  fields: [
    text("label", "Link text"),
    text("href", "Where it goes", "A page on this site like /about, or a full web address."),
  ],
});

/**
 * The search engine title and description for one page.
 *
 * These are what Google prints and what a link preview shows when the page is
 * pasted into an email, so they are worth getting right and are not visible
 * anywhere on the page itself. That surprises people, hence the descriptions.
 */
export const seo = (): TinaField => ({
  type: "object",
  name: "meta",
  label: "Search engine listing",
  description:
    "What Google shows for this page, and what appears when somebody pastes the link into an email or a message. None of this is printed on the page itself.",
  fields: [
    text(
      "title",
      "Search result heading",
      `Around 60 characters. ${TOKENS}`,
    ),
    {
      type: "string",
      name: "description",
      label: "Search result summary",
      description: `Around 155 characters. ${TOKENS}`,
      ui: { component: "textarea" },
    },
  ],
});

/**
 * A whole page collection, wrapped so every one of them behaves the same:
 * it cannot be deleted, and a second copy cannot be created.
 *
 * `route` IS RECORDED BUT NOT YET HANDED TO TINA, and that is deliberate.
 * Setting `ui.router` switches that collection in /admin from the ordinary
 * form to Tina's visual editor, which renders the real page in a panel beside
 * the fields and lets the client click text on the page to edit it. That is
 * the editing experience this site is heading for.
 *
 * It cannot be switched on until each page is wired for it. Visual editing
 * requires the page to fetch its content through Tina's GraphQL client and
 * register it with the useTina hook, and under the Next.js App Router that
 * means splitting every page into a server half that queries and a client half
 * that subscribes. Today the pages import their JSON directly, so a collection
 * with a router set opens the visual editor, finds no page registered, and
 * sits on "Please wait while TinaCMS loads your content" forever. That was
 * tried, it does exactly that, and this is the note so nobody tries it twice
 * without doing the wiring first.
 *
 * Turning it on, per page: query through tina/__generated__/client, wrap the
 * result in useTina, then add `route` to the object below. Production visual
 * editing also needs a Tina Cloud project, which is free for two editors, with
 * NEXT_PUBLIC_TINA_CLIENT_ID and TINA_TOKEN set in the hosting environment.
 */
export const page = (
  name: string,
  label: string,
  file: string,
  fields: TinaField[],
  /**
   * The address this page lives at.
   *
   * Setting it turns that collection's entry in /admin into the visual editor:
   * the real page renders in a panel beside the fields, updates as the client
   * types, and any element carrying a data-tina-field can be clicked to jump
   * straight to the field behind it.
   *
   * ONLY SET IT ONCE THE PAGE IS WIRED. A page is wired when it is split into
   * a server half that queries through tina/__generated__/client and a client
   * half that subscribes with useTina. app/page.tsx and app/home-view.tsx are
   * the worked example. Set it on a page that still imports its JSON directly
   * and /admin opens the editor, finds nothing registered, and sits on "Please
   * wait while TinaCMS loads your content" forever. Leave it off and that
   * collection keeps the ordinary form, which edits the same content just as
   * well without the preview.
   */
  route?: string,
) => ({
  name,
  label,
  path: "content/pages",
  format: "json" as const,
  match: { include: file },
  ui: {
    allowedActions: { create: false, delete: false },
    ...(route ? { router: () => route } : {}),
  },
  fields,
});

/** A section of a page: a labelled group of fields in the sidebar. */
export const group = (
  name: string,
  label: string,
  fields: TinaField[],
  description?: string,
): TinaField => ({
  type: "object",
  name,
  label,
  description,
  fields,
});
