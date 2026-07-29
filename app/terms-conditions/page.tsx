import type { Metadata } from "next";
import { fill } from "@/lib/content";
import { client, tinaPage } from "@/lib/tina";
import docJson from "@/content/legal/terms-conditions.json";
import TermsConditionsView from "./terms-conditions-view";

/**
 * TERMS AND CONDITIONS
 *
 * Every word of this document is in content/legal/terms-conditions.json and is edited at
 * /admin under "Legal documents". The page itself only decides that it is a
 * legal document, which is what LegalPage draws.
 *
 * THE CLAUSES ARE ONE TEXT BOX EACH. Inside a clause, leave a blank line
 * between paragraphs and start a line with "- " for a bullet. A link is
 * written [like this](/where-it-goes). See components/k/Copy.tsx.
 *
 * DRAFT FOR CLIENT AND ATTORNEY REVIEW BEFORE LAUNCH.
 */

export const metadata: Metadata = {
  title: fill(docJson.meta.title),
  description: fill(docJson.meta.description),
};

export default async function TermsConditions() {
  const page = await tinaPage(
    "terms-conditions",
    () => client.queries.legal({ relativePath: "terms-conditions.json" }),
    // The shape the query would have returned, built from the file on disk.
    { legal: docJson } as never,
  );

  return <TermsConditionsView {...page} />;
}
