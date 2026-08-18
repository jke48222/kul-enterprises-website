import Link from "next/link";
import { site } from "@/lib/site";
import { fill, linkHref, type CmsText } from "@/lib/content";

/**
 * A PIECE OF CMS COPY, RENDERED.
 *
 * Every sentence on this site is now stored as plain text in a JSON file that
 * the client edits at /admin. Most of those sentences are only words, but a
 * fair number of them have something live in the middle: a phone number that
 * has to be tappable, or a few words that link to another page.
 *
 * Before the site was made editable, those sentences were written straight
 * into the markup with the anchor sitting inside them. That is fine for a
 * developer and impossible for a client, because the sentence could then only
 * be changed by editing the JSX around the link. This component is what lets
 * the whole sentence be one editable field.
 *
 * ------------------------------------------------------------------
 * WHAT THE CLIENT CAN WRITE IN A COPY FIELD
 * ------------------------------------------------------------------
 *   {phone} {email} {location} ...   a business fact, filled from Business
 *                                    Facts. Full list in lib/content.ts.
 *
 *   [the safety page](/safety)       a link. The part in square brackets is
 *                                    what the reader sees, the part in round
 *                                    brackets is where it goes.
 *
 *   [call dispatch]({phone})         a link whose target is the phone number
 *                                    or {email} for the address. No need to
 *                                    know what tel: or mailto: mean.
 *
 *   **like this**                    bold.
 *
 *   a blank line                     a line break.
 *
 * Anything else is printed exactly as typed. There is no HTML in these
 * fields on purpose: a client pasting formatted text out of Word should get
 * their words on the page, not a broken layout.
 *
 * THE PHONE NUMBER AND EMAIL ADDRESS LINK THEMSELVES wherever they appear in
 * the finished sentence, so "call dispatch on {phone}" gives a working
 * click-to-call without the client marking it up as a link at all.
 *
 * IT MATCHES ONLY THE SITE'S OWN NUMBER AND ADDRESS, never number-shaped text
 * in general. A payload figure like "45,000 lb" or a year in a sentence must
 * never turn into a phone link, and a pattern loose enough to catch the real
 * number in general is loose enough to catch those too.
 */

type Props = {
  /** The sentence as stored in the CMS. Tokens are filled here. */
  text: CmsText;
  className?: string;
  /** Class applied to links, and to the phone and email inside the sentence. */
  linkClassName?: string;
  /** Defaults to a paragraph. Pass "span" to sit inside another block. */
  as?: "p" | "span" | "div";
};

/** Escapes a string for use inside a RegExp, since a phone number has dashes. */
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * One pass over the sentence, in the order the constructs appear.
 *
 * Everything is matched by a single alternating pattern rather than by
 * running four passes, because a second pass over the output of the first
 * would happily find a phone number inside a link label it had already made
 * and try to link it again.
 */
function renderCopy(text: string, linkClassName?: string) {
  const pattern = new RegExp(
    [
      /\[([^\]]+)\]\(([^)\s]+)\)/.source, // 1 label, 2 href
      /\*\*([^*]+)\*\*/.source, // 3 bold
      `(${escape(site.phone)})`, // 4 the phone number
      `(${escape(site.email)})`, // 5 the email address
      /(\n)/.source, // 6 a line break
    ].join("|"),
    "g",
  );

  const nodes: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    last = pattern.lastIndex;

    const [, label, href, bold, phone, email, br] = match;

    if (label && href) {
      const target = linkHref(href);
      // next/link for an internal route so it prefetches and does not reload
      // the page; a plain anchor for tel:, mailto: and anything outside.
      nodes.push(
        target.startsWith("/") ? (
          <Link key={key++} href={target} className={linkClassName}>
            {label}
          </Link>
        ) : (
          <a
            key={key++}
            href={target}
            className={linkClassName}
            {...(target.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {label}
          </a>
        ),
      );
    } else if (bold) {
      nodes.push(
        <strong key={key++} className="font-semibold">
          {bold}
        </strong>,
      );
    } else if (phone) {
      nodes.push(
        <a
          key={key++}
          href={site.phoneHref}
          className={`tabular-nums ${linkClassName ?? ""}`}
        >
          {phone}
        </a>,
      );
    } else if (email) {
      nodes.push(
        <a key={key++} href={`mailto:${site.email}`} className={linkClassName}>
          {email}
        </a>,
      );
    } else if (br) {
      nodes.push(<br key={key++} />);
    }
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function Copy({
  text,
  className,
  linkClassName,
  as: Tag = "p",
}: Props) {
  return (
    <Tag className={className}>{renderCopy(fill(text), linkClassName)}</Tag>
  );
}

/**
 * The same rendering without a wrapping element, for the places that already
 * have one and only want the inside of it.
 */
export function copyNodes(text: CmsText, linkClassName?: string) {
  return renderCopy(fill(text), linkClassName);
}

/**
 * A RUN OF PROSE, FOR THE PLACES THAT NEED MORE THAN ONE PARAGRAPH.
 *
 * The five legal documents are the reason this exists. Each clause of a
 * privacy policy is several paragraphs and sometimes a bulleted list, and
 * splitting that into a numbered set of separate CMS fields would make editing
 * a policy an exercise in counting boxes. So a clause is one text area, and
 * this turns what is typed into it into a document:
 *
 *   a blank line between paragraphs      starts a new paragraph
 *   a line beginning "- "                becomes a bullet
 *   a line beginning "* "                becomes a list item with no bullet
 *   a line reading "Term :: meaning"     becomes a defined term
 *   everything Copy understands          works inside any of them
 *
 * A run of consecutive bullet lines becomes one list, and a run of consecutive
 * "::" lines becomes one definition list. Anything else is a paragraph.
 *
 * THE DEFINED TERM IS NOT DECORATION. The privacy policy names the five kinds
 * of data KUL holds, and each name is a term with a meaning under it rather
 * than a sentence with a bold opening. Written as ordinary paragraphs, those
 * five ran together into one block of prose that nobody could scan, which is
 * what happened the first time this document was moved into the CMS.
 *
 * There is no heading syntax on purpose: a clause already has a heading of its
 * own, and a document whose clauses grow their own sub-headings has outgrown
 * this shape and wants real sections instead.
 */
export function Prose({
  text,
  className,
  linkClassName,
}: {
  text: CmsText;
  className?: string;
  linkClassName?: string;
}) {
  const filled = fill(text);
  // Blank lines separate blocks. Split first, then decide what each one is.
  const blocks = filled.split(/\n\s*\n/).filter((b) => b.trim().length > 0);

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter((l) => l.trim().length > 0);

        const bulleted = lines.every((l) => l.trimStart().startsWith("- "));
        const plain = lines.every((l) => l.trimStart().startsWith("* "));

        if (bulleted || plain) {
          const items = lines.map((l) => l.trimStart().slice(2));
          // TWO KINDS OF LIST, AND THE DIFFERENCE IS VISIBLE ON THE PAGE.
          // "- " is an ordinary bulleted list. "* " is a stacked list with no
          // markers, which is what the terms use for lettered clauses and the
          // privacy policy uses for its three ways to get in touch: in both,
          // the item already carries its own label and a disc in front of it
          // would be a second marker on one line.
          //
          // A "- " list whose every item opens with its own "(a)" or "1." is
          // treated as unmarked too, so a clause written the obvious way comes
          // out right without the client having to know about "* " at all.
          const selfLabelled =
            plain || items.every((t) => /^\(?[a-z0-9]{1,4}[).]\s/i.test(t));
          return (
            <ul key={i} className={selfLabelled ? "list-none! pl-0!" : undefined}>
              {items.map((item, li) => (
                <li key={li}>{renderCopy(item, linkClassName)}</li>
              ))}
            </ul>
          );
        }

        if (lines.every((l) => l.includes(" :: "))) {
          return (
            <dl key={i}>
              {lines.map((line, li) => {
                // Split on the first separator only, so a definition is free
                // to contain the characters the separator is made of.
                const at = line.indexOf(" :: ");
                return (
                  <div key={li}>
                    <dt>{renderCopy(line.slice(0, at).trim(), linkClassName)}</dt>
                    <dd>{renderCopy(line.slice(at + 4).trim(), linkClassName)}</dd>
                  </div>
                );
              })}
            </dl>
          );
        }
        // A block that is not a list is one paragraph, with any single line
        // breaks inside it kept as breaks rather than silently joined.
        return <p key={i}>{renderCopy(block, linkClassName)}</p>;
      })}
    </div>
  );
}
