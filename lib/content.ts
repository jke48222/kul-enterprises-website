import { site } from "@/lib/site";

/**
 * THE BRIDGE BETWEEN THE CMS AND THE PAGES.
 *
 * Every page on this site now reads its words out of a JSON file under
 * content/pages, and every one of those files is a TinaCMS collection. This
 * module holds the two things all of them need.
 *
 * ------------------------------------------------------------------
 * 1. TOKENS, so a business fact is written down exactly once.
 * ------------------------------------------------------------------
 * A lot of the copy has a fact sitting inside a sentence. The home page lede
 * is the clearest case:
 *
 *   "Freight services out of Loganville, GA, authorized in 48 states"
 *
 * The city and state are already in content/site.json, and the phone number
 * appears inside sentences on six pages. If those sentences were stored as
 * finished text, changing the phone number would mean the client hunting it
 * down in six places and missing one. If instead the sentence were chopped
 * into "before" and "after" halves around the fact, the client could no
 * longer rewrite the sentence.
 *
 * So the copy is stored whole, with a token where the fact goes:
 *
 *   "Freight services out of {location}, authorized in 48 states"
 *
 * fill() swaps the tokens in at render. The client can rewrite the whole
 * sentence, move the token, or drop it entirely, and the fact still comes
 * from Business Facts. Every field that accepts tokens says so in its CMS
 * description, and TOKEN_HELP below is the line those descriptions use.
 *
 * An unknown token is left alone rather than blanked, so a typo shows up on
 * the page as {locaton} instead of silently deleting itself.
 */

const TOKENS: Record<string, string> = {
  name: site.name,
  legalName: site.legalName,
  location: site.location,
  city: site.city,
  state: site.state,
  phone: site.phone,
  email: site.email,
  usdot: site.usdot,
  mc: site.mc,
  serviceArea: site.serviceArea,
};

/** Pasted into the CMS description of any field that accepts tokens. */
export const TOKEN_HELP =
  "You can drop a business fact into this text with a token: {name}, {location}, {city}, {state}, {phone}, {email}, {usdot}, {mc}. They fill in from Business Facts, so you never have to retype a phone number here.";

/** Replaces {token} with the matching business fact. Unknown tokens survive. */
export function fill(text: string): string;
export function fill(text: string | undefined): string | undefined;
export function fill(text: string | undefined) {
  if (!text) return text;
  return text.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in TOKENS ? TOKENS[key] : whole,
  );
}

/** fill() over a list, for the bullet arrays the CMS stores. */
export function fillAll(items: readonly string[] | undefined): string[] {
  return (items ?? []).map((item) => fill(item));
}

/**
 * ------------------------------------------------------------------
 * 2. LINKS, so a button is one editable thing rather than two fields.
 * ------------------------------------------------------------------
 * Every call to action in the CMS is a {label, href} pair. Giving them one
 * shared type means the Tina schema can reuse one field group for all of
 * them, and a page never has to guess whether a button's target came back
 * as undefined.
 *
 * href accepts three forms, and the CMS description says so:
 *   /quote          an internal page
 *   tel: or mailto: handled by the browser
 *   https://        an outside link
 *
 * PHONE AND EMAIL BUTTONS DO NOT NEED A TYPED-IN href. Set the href to
 * {phone} or {email} and linkHref() below turns it into a proper tel: or
 * mailto: link, so the client never has to know the syntax.
 */
export type CmsLink = { label: string; href: string };

export function linkHref(href: string): string {
  if (href === "{phone}") return site.phoneHref;
  if (href === "{email}") return `mailto:${site.email}`;
  return fill(href);
}

/** A link ready to render: tokens filled on both halves. */
export function link(cta: CmsLink): CmsLink {
  return { label: fill(cta.label), href: linkHref(cta.href) };
}
